import { app, ipcMain, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { IPC_BOOTSTRAP } from "@/common/channel/ipc";
import { isDev, isOsx, isWin } from "@/common/env";
import { MenuManager } from "@/main/services/MenuManager";
import { Keybinding } from "@/main/services/Keybinding";
import { Preference } from "@/main/services/Preference";
import { IBootArgs } from "@/typings/main";
import { EI18n, IPreferenceSystem } from "@/typings/schema/preference";

export class UniText {
  private _args: IBootArgs;

  private _sysArgs!: IPreferenceSystem;

  private _window!: BrowserWindow | null;

  private _menuManager!: MenuManager;

  private _keybinding!: Keybinding;

  private _preference!: Preference;

  /**
   * @param args 启动参数
   */
  constructor(args: IBootArgs) {
    this._args = args;
    this._window = null;
    this._menuManager = new MenuManager();
    this._keybinding = new Keybinding();
    this._preference = new Preference(args.notesPath);
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

    ipcMain.once(IPC_BOOTSTRAP.FETCH, (event) => {
      event.reply(IPC_BOOTSTRAP.REPLY, {
        sys: this._sysArgs,
        args: this._args,
      });
    });
  }

  private async _createWindow() {
    this._sysArgs = this._preference.getItem("system");

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

    this._menuManager.updateMenu(EI18n[this._sysArgs.language], this._keybinding);

    if (isDev) {
      await win.loadURL("http://localhost:9091/index.html");
      win.webContents.openDevTools();
    } else {
      await win.loadURL(`file://${__dirname}/index.html`);
    }

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
