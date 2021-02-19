import { ipcMain } from "electron";
import Store from "electron-store";
import * as fse from "fs-extra";

import { CONFIG_FOLDER, CONFIG_FILE } from "@/common/env";
import { joinPath } from "@/common/fileSystem";
import { IPC_OTHER, IPC_THEME } from "@/common/channel/ipc";
import schema from "@/main/schema/sTheme";
import logger from "@/main/services/Logger";
import { UNITEXT_SYSTEM } from "@/main/config";
import { ITheme, TThemeSet } from "@/typings/bootstrap";

export class Theme {
  private _themeSet!: TThemeSet;

  constructor(base: string) {
    this.changeProject(base);
    this._listenForIpcMain();
  }

  changeProject(base: string) {
    let cwd = joinPath(base, CONFIG_FOLDER.SETTINGS);
    const filePath = joinPath(base, CONFIG_FILE.THEME);

    if (!fse.pathExistsSync(filePath)) {
      cwd = UNITEXT_SYSTEM.DEFAULT_DIR;
      logger.error(`Can't find ${filePath}`);
    }

    this._themeSet = new Store({
      cwd,
      name: "theme",
      schema: schema as Store.Schema<ITheme>,
    });
  }

  getWindowStyle(): any {
    // FEAT 平台兼容性
    const titleBar: string = this._themeSet.get("window.titleBarStyle");

    return {
      width: this._themeSet.get("window.width"),
      height: this._themeSet.get("window.height"),
      titleBarStyle: titleBar,
    };
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.CHANGE_PROJECT, (event, base: string) => {
      this.changeProject(base);
    });

    ipcMain.on(IPC_THEME.SET_ITEM, (event, key: string, val: any) => {
      this._themeSet.set(key, val);
    });

    ipcMain.on(IPC_THEME.GET_ALL_SYNC, (event) => {
      event.returnValue = this._themeSet.store;
    });
  }
}
