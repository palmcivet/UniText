import {
  app,
  shell,
  ipcMain,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { isDev, isOsx, isWin, SYSTEM_PATH } from "@/common/env";
import { buildUrl } from "@/common/url";
import Logger from "@/main/services/Logger";
import EnvPath from "@/main/services/EnvPath";
import Preference from "@/main/services/Preference";
import { Keybinding } from "@/main/services/Keybinding";
import MenuManager from "@/main/services/MenuManager";
import { EWindowType } from "@/typings/main";
import { EI18n, IPreferenceSystem } from "@/typings/schema/preference";

export default class UniText {
  private _logger!: Logger;

  private _envPath!: EnvPath;

  private _preference!: Preference;

  private _keybinding!: Keybinding;

  private _menuManager!: MenuManager;

  private _window!: BrowserWindow | null;

  private _sysData!: IPreferenceSystem;

  constructor() {
    const sysPath = app.getPath("userData");

    this._logger = new Logger(
      SYSTEM_PATH.ERROR_LOG(sysPath),
      SYSTEM_PATH.INFO_LOG(sysPath)
    );
    this._envPath = new EnvPath(sysPath, this._logger);

    const path = this._envPath.getItem("settings");

    this._keybinding = new Keybinding();
    this._preference = new Preference(path);
    this._menuManager = new MenuManager();
    this._window = null;
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

  private async _createWindow() {
    this._sysData = this._preference.getItem("system");

    const winOption: BrowserWindowConstructorOptions = {
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
      ...this._preference.getWindowStyle(),
    };

    let win: BrowserWindow | null = new BrowserWindow(winOption);

    win.setTitle("UniText");

    const lang = EI18n[this._sysData.language];

    this._menuManager.updateMenu(lang, this._keybinding);

    await win.loadURL(
      buildUrl({
        wid: win.id.toString(),
        lang: lang.toString(),
        type: EWindowType.NORMAL.toString(),
        conf: this._envPath.getItem("settings"),
        proj: this._envPath.getItem("project"),
      })
    );

    if (isDev) win.webContents.toggleDevTools();

    win.on("closed", () => {
      win = null;
    });

    this._window = win;
  }

  public init() {
    this._listenForIpcMain();

    app.on("window-all-closed", () => {
      if (isOsx) app.quit();
    });

    app.on("web-contents-created", (e, webContents) => {
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
      if (!this._window) this._createWindow();
    });

    app.whenReady().then(() => {
      this._createWindow();

      if (isDev) {
        installExtension(VUEJS_DEVTOOLS);
      } else {
        autoUpdater.on("update-downloaded", () => {
          autoUpdater.quitAndInstall();
        });
        autoUpdater.checkForUpdatesAndNotify();
      }
    });

    if (isWin) {
      process.on("message", (data) => {
        if (data === "graceful-exit") app.quit();
      });
    } else {
      process.on("SIGTERM", () => app.quit());
    }
  }
}
