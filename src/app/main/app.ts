import { app, protocol, BrowserWindow, Menu, shell, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import { IPC_PREFERENCE } from "@/common/ipcChannel";
import { localesMenu } from "../config/locales-menu";

export class App {
  private config: any;

  private args: any;

  private openFilesCache: any;

  private locale: string;

  private windowManager: Array<BrowserWindow | null>;

  private isDev: boolean = process.env.NODE_ENV !== "production";

  private isOsx: boolean = process.platform === "darwin";

  private isWin: boolean = process.platform === "win32";

  constructor(argConfig: any, argArgs: any, argCache: any) {
    const { locale, ...config } = argConfig;
    this.locale = locale;
    this.config = config;
    this.args = argArgs;
    this.openFilesCache = argCache;
    this.windowManager = [];
  }

  private async createWindow() {
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

    // 图标
    if (this.isOsx) {
      winOption.icon = `${__dirname}/app-icons/gridea.png`;
    }

    let win: BrowserWindow | null = new BrowserWindow(winOption);
    win.setTitle("UniText");

    const menu = this.generateMenu(win);
    Menu.setApplicationMenu(menu);

    // 开发工具
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
    });

    ipcMain.on(IPC_PREFERENCE.FETCH, (event) => {
      event.reply(IPC_PREFERENCE.SEND, this.locale, this.config);
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

  private generateMenu(win: BrowserWindow) {
    const menuLabels = localesMenu[this.locale] || localesMenu["zh-CN"];
    const template: any = [
      {
        label: menuLabels.edit,
        submenu: [
          {
            label: menuLabels.save,
            accelerator: "CmdOrCtrl+S",
            click: () => {
              win.webContents.send("click-menu-save");
            },
          },
          { type: "separator" },
          { role: "undo", label: menuLabels.undo },
          { role: "redo", label: menuLabels.redo },
          { type: "separator" },
          { role: "cut", label: menuLabels.cut },
          { role: "copy", label: menuLabels.copy },
          { role: "paste", label: menuLabels.paste },
          { role: "delete", label: menuLabels.delete },
          { role: "selectall", label: menuLabels.selectall },
          { role: "toggledevtools", label: menuLabels.toggledevtools },
          { type: "separator" },
          { role: "close", label: menuLabels.close },
          { role: "quit", label: menuLabels.quit },
        ],
      },
      {
        role: "windowMenu",
      },
      {
        role: menuLabels.help,
        submenu: [
          {
            label: "Learn More",
            click() {
              shell.openExternal("https://github.com/getgridea/gridea");
            },
          },
        ],
      },
    ];

    return Menu.buildFromTemplate(template);
  }

  public init() {
    // Standard scheme must be registered before the app is ready
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
      if (this.windowManager.filter((win) => !win).length) {
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

    // Exit cleanly on request from parent process in development mode.
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
