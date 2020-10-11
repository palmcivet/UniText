import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { IBootArgs, EWindow, TStore } from "@/typings/bootstrap";
import { isDev, isOsx, isWin } from "@/common/env";
import { IPC_BOOTSTRAP } from "@/common/channel";
import { loadSetting } from "@/app/main/preference";
import { getDockMenu } from "@/app/main/menu/dock";
import { getTopMenu } from "@/app/main/menu/top";

export class App {
  /**
   * @member 启动参数
   */
  private args: IBootArgs;

  /**
   * @member 语言，用于菜单
   */
  private locale!: string;

  /**
   * @member 窗口管理
   */
  private windowManager: Array<BrowserWindow | null>;

  /**
   * @param args 启动参数
   */
  constructor(args: IBootArgs) {
    this.args = args;
    this.windowManager = [];
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

    ipcMain.on(IPC_BOOTSTRAP.DATA_FETCH, (event) => {
      event.reply(IPC_BOOTSTRAP.DATA_REPLY, {
        locale: this.locale,
        args: this.args,
      });
    });
  }

  private async createWindow(mode: EWindow = EWindow.NORMAL) {
    let setting: TStore;

    /* 获取初始设置 */
    switch (mode) {
      case EWindow.NEW:
        setting = loadSetting();
        break;
      case EWindow.VIEW:
        // FEAT 预览窗口
        setting = loadSetting(this.args.notesPath);
        break;
      case EWindow.NORMAL:
        setting = loadSetting(this.args.notesPath);
        break;
    }

    this.locale = setting.get("system.locale");

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
      if (this.windowManager.length === 0) {
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
