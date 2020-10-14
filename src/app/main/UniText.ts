import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

// TODO
import { getDockMenu } from "@/app/main/menu/dock";
import { Preference } from "@/app/main/Preference";

import { getTopMenu } from "@/app/main/menu/top";
import { notEmpty } from "@/common/utils";
import { IPC_BOOTSTRAP } from "@/common/channel";
import { isDev, isOsx, isWin } from "@/common/env";
import { IBootArgs, EWindow } from "@/typings/bootstrap";

export class UniText {
  private args: IBootArgs;

  private locale!: string;

  private windowManager!: Array<BrowserWindow | null>;

  private menuManager!: any;

  private snippet!: any;

  private keybinding!: any;

  private preference!: Preference;

  /**
   * @param args 启动参数
   */
  constructor(args: IBootArgs) {
    this.args = args;
    this.windowManager = [];
    this.preference = new Preference();
  }

  private listenIpc() {
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
        locale: this.locale,
        args: this.args,
      });
    });
  }

  private async createWindow(mode: EWindow = EWindow.NORMAL) {
    /* 获取初始设置 */
    if (mode === EWindow.NEW) {
      this.preference.load();
    } else if (mode === EWindow.VIEW) {
      this.preference.load(this.args.notesPath); // FEAT 预览窗口
    } else if (mode === EWindow.NORMAL) {
      this.preference.load(this.args.notesPath);
    }

    this.locale = this.preference.getItem("system.locale");

    // FEAT 读取工作区设置文件

    // FEAT 提取部分设置
    /* 创建窗口 */
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

    /* 创建窗口 */
    let win: BrowserWindow | null = new BrowserWindow(winOption);
    win.setTitle("UniText");

    /* 添加菜单，上下文菜单在 IPC */
    const topMenu = getTopMenu(win, this.locale);
    const dockMenu = getDockMenu(win, this.locale);
    Menu.setApplicationMenu(topMenu);
    app.dock.setMenu(dockMenu);

    /* 加载开发工具 */
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) {
        win.webContents.openDevTools();
      }
    } else {
      createProtocol("app");
      await win.loadURL("app://./index.html");
    }

    win.on("closed", () => {
      win = null;
      this.windowManager = this.windowManager.filter((win) => win !== null);
    });

    this.windowManager.push(win);
  }

  public init() {
    this.listenIpc();

    app.on("window-all-closed", () => {
      if (isOsx) {
        app.quit();
      }
    });

    // macOS
    app.on("activate", () => {
      if (!notEmpty(this.windowManager)) {
        this.createWindow();
      }
    });

    app.whenReady().then(() => {
      this.createWindow();

      if (isDev) {
        installExtension(VUEJS_DEVTOOLS);
      }

      autoUpdater.on("update-downloaded", () => {
        autoUpdater.quitAndInstall();
      });
      autoUpdater.checkForUpdatesAndNotify();
    });

    if (isWin) {
      process.on("message", (data) => {
        if (data === "graceful-exit") {
          app.quit();
        }
      });
    } else {
      process.on("SIGTERM", () => {
        app.quit();
      });
    }
  }
}