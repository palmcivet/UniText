import { app, protocol, BrowserWindow, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { generateMenu } from "./menu";
import { IBootArgs, EWindow, IBootSetting } from "@/interface/bootstrap";
import { isDev, isOsx, isWin } from "@/common/env";
import { IPC_PREFERENCE } from "@/common/ipc-channel";
import { loadSetting } from "@/common/initialize";

export class App {
  /**
   * @member 启动参数
   */
  private args: IBootArgs;

  /**
   * @member 窗口管理
   */
  private windowManager: Array<BrowserWindow | null>;

  /**
   * @param bootArgs 启动参数
   */
  constructor(bootArgs: IBootArgs) {
    this.args = bootArgs;
    this.windowManager = [];
  }

  private async createWindow(mode: EWindow = EWindow.NORMAL) {
    /* 获取初始设置 */
    let preference!: IBootSetting;
    switch (mode) {
      case EWindow.NEW:
        [preference, this.args.error] = await loadSetting();
        break;
      case EWindow.VIEW:
        // FEAT 预览窗口
        break;
      case EWindow.NORMAL:
        [preference, this.args.error] = await loadSetting(this.args.notesPath);
        break;
    }
    const { system, ...setting } = preference;

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
      },
      titleBarStyle: "hidden" as
        | "hidden"
        | "default"
        | "hiddenInset"
        | "customButtonsOnHover",
    };

    /* 设置图标 */
    if (isOsx) {
      winOption.icon = `${__dirname}/app-icons/gridea.png`;
    }

    /* 创建窗口 */
    let win: BrowserWindow | null = new BrowserWindow(winOption);
    win.setTitle("UniText");

    /* 生成菜单 */
    const menu = generateMenu(win, system.locale);
    Menu.setApplicationMenu(menu);

    /* 加载开发工具 */
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      if (!process.env.IS_TEST) {
        win.webContents.openDevTools();
      }
    } else {
      createProtocol("app");
      win.loadURL("app://./index.html");
    }

    win.on("closed", () => {
      win = null;
      this.windowManager = this.windowManager.filter((win) => win !== null);
    });

    ipcMain.on(IPC_PREFERENCE.FETCH, (event) => {
      event.reply(IPC_PREFERENCE.SEND, {
        locale: system.locale,
        setting,
        error: this.args.error,
      });
    });

    this.windowManager.push(win);

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
  }

  public init() {
    protocol.registerSchemesAsPrivileged([
      { scheme: "app", privileges: { secure: true, standard: true } },
    ]);

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

    app.on("ready", async () => {
      /**
       * Auto Updater
       *
       * Uncomment the following code below and install `electron-updater` to
       * support auto updating. Code Signing with a valid certificate is required.
       * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
       */
      if (isDev && !process.env.IS_TEST) {
        await installExtension(VUEJS_DEVTOOLS);
      } else {
        autoUpdater.on("update-downloaded", () => {
          autoUpdater.quitAndInstall();
        });
        autoUpdater.checkForUpdatesAndNotify();
      }

      this.createWindow();
    });

    if (isDev) {
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
}
