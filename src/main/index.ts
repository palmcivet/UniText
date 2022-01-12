import { app, BrowserWindow, ipcMain, protocol, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";

import Logger from "./backend/Logger";
import Container from "./service";
import EnvService from "./service/EnvService";
// import MenuService from "./service/MenuService";
import ImageService from "./service/ImageService";
import WindowService from "./service/WindowService";
import SettingService from "./service/SettingService";
import KeybindingService from "./service/KeybindingService";
import { isOsx, isWin, isDev } from "@/main/utils/env";
import { URL_PATH, URL_PROTOCOL } from "@/shared/pattern";
import { EI18n } from "@/shared/typings/setting/preference";
import { EWindowType } from "@/shared/typings/main";

import "./backend/Dialog";
import "./backend/Disk";

const _container = new Container();

/* TODO 窗口管理器 */
async function createMainWindow(): Promise<BrowserWindow> {
  // const menuService = _container.getService("MenuService");
  const settingService = _container.getService("SettingService");

  const mainWindow = new BrowserWindow({
    minWidth: 647,
    minHeight: 400,
    webPreferences: {
      preload: join(__static, "lib/preload.js"),
      spellcheck: false,
      nativeWindowOpen: true,
    },
    // icon: logoUrl,
    vibrancy: "titlebar",
    backgroundColor: "#00000000",
    transparent: true,
    width: settingService.getSetting("system", "window.width"),
    height: settingService.getSetting("system", "window.height"),
    titleBarStyle: settingService.getSetting("system", "window.titleBarStyle"),
  });

  mainWindow.setTitle("UniText");
  mainWindow.setSheetOffset(24); /* @layout-titlebar-height */

  const lang = EI18n[settingService.getSetting("system", "launch.language")] as unknown as number;
  // menuService.bootstrap(lang);

  const URL_HOST = isDev ? `http://localhost:${process.env.PORT_RENDERER}` : `file://${__dirname}`;
  await mainWindow.loadURL(`${URL_HOST}/?${EWindowType.NORMAL}`);

  return mainWindow;
}

function registerProtocol(): void {
  const imageService = _container.getService("ImageService");

  const handleHttp = async (
    request: Electron.ProtocolRequest,
    callback: (response: Electron.ProtocolResponse) => void
  ) => {
    const path = await imageService.getRemoteImage(request.url);
    callback({ path });
  };

  // TODO dev-tool & loadURL
  !isDev && protocol.interceptFileProtocol("http", handleHttp);
  protocol.interceptFileProtocol("https", handleHttp);

  protocol.registerFileProtocol(URL_PROTOCOL.replace("://", ""), async (request, callback) => {
    let path = request.url;
    if (path.startsWith(URL_PATH.IMG)) {
      path = await imageService.getLocalImage(path);
    }
    // FEAT 相对路径
    callback({ path });
  });
}

function handleClosed(window: BrowserWindow | null): void {
  ipcMain.on("min-window", () => {
    if (window) {
      window.minimize();
    }
  });

  ipcMain.on("max-window", () => {
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.on("close-window", () => {
    if (window) {
      window.close();
    }
  });
}

function main(): void {
  const envService = new EnvService();
  const { logPath } = envService.initBoot();

  const logger = new Logger();
  logger.initialize(logPath);

  _container.setService("EnvService", envService);
  _container.setService("SettingService", new SettingService(logger, envService.resolveCabinFile("SETTING")));
  _container.setService("KeybindingService", new KeybindingService(logger));
  // _container.setService("MenuService", new MenuService(logger));
  _container.setService("ImageService", new ImageService(logger, envService.resolveCabinFile("IMAGE")));
  _container.setService("WindowService", new WindowService(logger));

  _container.initService();

  /* 更新 cabinPath */
  _container.getService("SettingService").setSetting("system", "launch.cabinPath", envService.getCabinPath());

  app.whenReady().then(async () => {
    let mainWindow: BrowserWindow | null = null;

    mainWindow = await createMainWindow();

    mainWindow.on("closed", () => {
      mainWindow = null;
    });

    handleClosed(mainWindow);
    registerProtocol();

    /**
     * macOS only
     */
    app.on("activate", async () => {
      if (!mainWindow) {
        mainWindow = await createMainWindow();
      }
    });

    _container.getService("WindowService").createPrinterWindow();

    autoUpdater.on("update-downloaded", () => {
      autoUpdater.quitAndInstall();
    });
    autoUpdater.checkForUpdatesAndNotify();
  });
}

if (isWin) {
  process.on("message", (data) => {
    if (data === "graceful-exit") {
      app.quit();
    }
  });
} else {
  process.on("SIGTERM", () => app.quit());
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("web-contents-created", (e, webContents) => {
  if (isDev) {
    return;
  }

  const handleURL = (e: Electron.NewWindowWebContentsEvent, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  webContents.on("new-window", handleURL);
  webContents.on("will-navigate", handleURL);
});

app.on("window-all-closed", () => {
  if (isOsx || isDev) {
    app.quit();
  }
});

process.on("uncaughtException", (error) => {
  console.error(error);
});

process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

process.nextTick(main);
