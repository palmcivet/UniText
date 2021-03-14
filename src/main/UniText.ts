import { app, shell, ipcMain, protocol, BrowserWindow } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import { join } from "path";

import { isDev, isOsx, isWin, SYSTEM_PATH } from "@/common/env";
import { buildUrl, URL_PATH, URL_PROTOCOL } from "@/common/url";
import System from "@/common/userData/System";
import Keybinding from "@/common/userData/Keybinding";
import Logger from "@/main/services/Logger";
import Printer from "@/main/services/Printer";
import MenuManager from "@/main/services/MenuManager";
import ImageManager from "@/main/services/ImageManager";
import { EWindowType } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

export default class UniText {
  private _system!: System;

  private _logger!: Logger;

  private _printer!: Printer;

  private _keybinding!: Keybinding;

  private _menuManager!: MenuManager;

  private _imageManager!: ImageManager;

  private _window!: BrowserWindow | null;

  constructor() {
    const sysPath = app.getPath("userData");

    this._logger = new Logger(
      SYSTEM_PATH.ERROR_LOG(sysPath),
      SYSTEM_PATH.INFO_LOG(sysPath)
    );
    this._printer = new Printer();
    this._system = new System(sysPath, this._logger);
    this._keybinding = new Keybinding();
    this._menuManager = new MenuManager();
    this._imageManager = new ImageManager();
    this._window = null;
  }

  private async _openMain() {
    let win: BrowserWindow | null = new BrowserWindow({
      minWidth: 647,
      minHeight: 400,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
        worldSafeExecuteJavaScript: true,
      },
      vibrancy: "titlebar",
      backgroundColor: "#00000000",
      transparent: true,
      width: this._system.getItem("window.width"),
      height: this._system.getItem("window.height"),
      titleBarStyle: this._system.getItem("window.titleBarStyle"),
    });

    win.setTitle("UniText");

    const lang = (EI18n[this._system.getItem("launch.language")] as unknown) as number;

    this._menuManager.updateMenu(lang, this._keybinding);

    await win.loadURL(
      buildUrl({
        wid: win.id.toString(),
        lang: lang.toString(),
        type: EWindowType.NORMAL.toString(),
        proj: this._system.getDefaultPath(),
      })
    );

    if (isDev) win.webContents.toggleDevTools();

    win.on("closed", () => {
      win = null;
    });

    this._printer.getReady();

    this._window = win;
  }

  private async _openView() {}

  private async _openSetting() {}

  private _registerProtocol() {
    protocol.registerFileProtocol(
      URL_PROTOCOL.replace("://", ""),
      (request, callback) => {
        let path = request.url;
        if (path.startsWith(URL_PATH.IMG)) {
          path = this._imageManager.getImage(path);
        } else {
          path = path.replace(URL_PROTOCOL, "");
        }

        // FEAT 相对路径

        callback({ path });
      }
    );

    const handleHttp = async (
      request: Electron.ProtocolRequest,
      callback: (response: Electron.ProtocolResponse) => void
    ) => {
      const path = await this._imageManager.getCache(request.url);
      callback({ path });
    };

    // TODO dev-tool & loadURL
    !isDev && protocol.interceptHttpProtocol("http", handleHttp);
    protocol.interceptFileProtocol("https", handleHttp);
  }

  private _listenForIpcMain() {
    ipcMain.on("min-window", () => {
      if (this._window) {
        this._window.minimize();
      }
    });

    ipcMain.on("max-window", () => {
      if (this._window) {
        if (this._window.isMaximized()) {
          this._window.unmaximize();
        } else {
          this._window.maximize();
        }
      }
    });

    ipcMain.on("close-window", () => {
      if (this._window) {
        this._window.close();
      }
    });
  }

  public init() {
    if (!app.requestSingleInstanceLock()) app.quit();

    process.on("uncaughtException", (e) => {
      this._logger.error(`${e.name}: ${e.message}`);
      // TODO 细化崩溃处理
    });

    if (isWin) {
      process.on("message", (data) => {
        if (data === "graceful-exit") app.quit();
      });
    } else {
      process.on("SIGTERM", () => app.quit());
    }

    app.whenReady().then(() => {
      // TODO 读取设置
      if (isDev) {
        installExtension(VUEJS_DEVTOOLS);
      } else {
        autoUpdater.on("update-downloaded", () => {
          autoUpdater.quitAndInstall();
        });
        autoUpdater.checkForUpdatesAndNotify();
      }

      this._openMain();
      this._registerProtocol();
      this._listenForIpcMain();
    });

    app.on("window-all-closed", () => {
      if (isOsx) app.quit();
    });

    app.on("web-contents-created", (e, webContents) => {
      if (isDev) return;

      const handleUrl = (e: Electron.NewWindowWebContentsEvent, url: string) => {
        e.preventDefault();
        shell.openExternal(url);
      };

      webContents.on("new-window", handleUrl);
      webContents.on("will-navigate", handleUrl);
    });

    /**
     * macOS only
     */
    app.on("activate", () => {
      if (!this._window) this._openMain();
    });
  }
}
