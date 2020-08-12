import { app, protocol, BrowserWindow, Menu, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";

import { generateMenu } from "./menu";
import { IBootArgs, IBootCache } from "@/interface/boot";
import { IPC_PREFERENCE } from "@/common/ipcChannel";
import { loadSetting } from "@/common/main/utils";

export class App {
  /**
   * @member 启动参数
   */
  private args: IBootArgs;

  private cache: IBootCache;

  /**
   * @member 默认语言，在启动时获取，用于设置菜单
   */
  private locale: string; // TODO i18n 接口

  private setting: any;

  private windowManager: Array<BrowserWindow | null>;

  private isDev: boolean = process.env.NODE_ENV !== "production";

  private isOsx: boolean = process.platform === "darwin";

  private isWin: boolean = process.platform === "win32";

  constructor(bootData: { initArgs: IBootArgs; initCache: IBootCache }) {
    this.args = bootData.initArgs;
    this.cache = bootData.initCache;
    this.locale = bootData.initArgs.locale;
    this.windowManager = [];
  }

  private async createWindow() {
    /* 获取初始设置 */
    [this.setting, this.args.error] = await loadSetting(this.args.notesPath);

    /* 提取部分设置，用于创建窗口 */
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
    if (this.isOsx) {
      winOption.icon = `${__dirname}/app-icons/gridea.png`;
    }

    /* 创建窗口 */
    let win: BrowserWindow | null = new BrowserWindow(winOption);
    win.setTitle("UniText");

    /* 生成菜单 */
    const menu = generateMenu(win, this.locale);
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
        setting: this.setting,
        locale: this.locale,
        cache: this.cache,
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
      if (this.isOsx) {
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
      if (this.isDev && !process.env.IS_TEST) {
        await installExtension(VUEJS_DEVTOOLS);
      } else {
        autoUpdater.on("update-downloaded", () => {
          autoUpdater.quitAndInstall();
        });
        autoUpdater.checkForUpdatesAndNotify();
      }

      this.createWindow();
    });

    if (this.isDev) {
      if (this.isWin) {
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
