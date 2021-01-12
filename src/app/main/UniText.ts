import { app, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { IPC_BOOTSTRAP } from "@/common/channel";
import { isDev, isOsx, isWin } from "@/common/env";
import { IBootArgs, TI18n } from "@/typings/bootstrap";
import { Preference } from "./Preference";
import { Keybinding } from "./Keybinding";
import { MenuManager } from "./MenuManager";

export class UniText {
  private _args: IBootArgs;

  private _language!: TI18n;

  private _window!: BrowserWindow | null;

  private _menuManager!: MenuManager;

  private _keybinding!: Keybinding;

  private _preference!: Preference;

  private _snippet!: any;

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
    // ipcMain.on("min-window", () => {
    //   if (win) {
    //     win.minimize();
    //   }
    // });

    // ipcMain.on("max-window", () => {
    //   if (win) {
    //     if (win.isMaximized()) {
    //       win.unmaximize();
    //     } else {
    //       win.maximize();
    //     }
    //   }
    // });

    // ipcMain.on("close-window", () => {
    //   if (win) {
    //     win.close();
    //   }
    // });

    ipcMain.once(IPC_BOOTSTRAP.FETCH, (event) => {
      event.reply(IPC_BOOTSTRAP.REPLY, {
        lang: this._language,
        args: this._args,
      });
    });
  }

  private async _createWindow() {
    this._language = this._preference.getItem("system.language");

    // FEAT 读取工作区设置文件

    // FEAT 提取部分设置

    const winOption: any = {
      width: 1294,
      height: 800,
      minWidth: 1000,
      minHeight: 618,
      webPreferences: {
        webSecurity: true,
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      titleBarStyle: "hidden" as
        | "hidden"
        | "default"
        | "hiddenInset"
        | "customButtonsOnHover",
    };

    let win: BrowserWindow | null = new BrowserWindow(winOption);

    win.setTitle("UniText");

    this._menuManager.updateMenu(this._language, this._keybinding);

    /**
     * 加载开发者工具
     */
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
      createProtocol("unitext");
      await win.loadURL("unitext://./index.html");
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
