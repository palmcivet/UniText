import { ipcMain } from "electron";
import Store from "electron-store";
import { pathExistsSync } from "fs-extra";

import { joinPath } from "@/common/fileSystem";
import { IPC_OTHER, IPC_PREFERENCE } from "@/common/channel/ipc";
import { CONFIG_FOLDER, CONFIG_FILE } from "@/common/env";
import schema from "@/common/schema/sPreference";
import logger from "@/main/services/Logger";
import { UNITEXT_SYSTEM } from "@/main/utils/config";
import { IPreference } from "@/typings/schema/preference";

/**
 * 有以下功能：
 * - load：加载/刷新配置文件
 * - get：Vuex 获得属性，运行时的修改不反映到本结构
 * - set：施加的修改操作是直接保存
 * @class 管理用户 preference 的数据结构
 */
export class Preference {
  private _preferenceSet!: Store<IPreference>;

  constructor(base: string) {
    this.setProject(base);
    this._listenForIpcMain();
  }

  setProject(base: string) {
    let cwd = joinPath(base, CONFIG_FOLDER.SETTINGS);
    const filePath = joinPath(base, CONFIG_FILE.PREFERENCE);

    if (!pathExistsSync(filePath)) {
      cwd = UNITEXT_SYSTEM.DEFAULT_DIR;
      logger.error(`Can't find ${filePath}`);
    }

    this._preferenceSet = new Store({
      cwd,
      name: "preference",
      schema: schema as Store.Schema<IPreference>,
    });

    // 放入 system 组
    this._preferenceSet.set("fileManager.folderDir", base);
  }

  getWindowStyle(): any {
    // FEAT 平台兼容性
    const titleBar: string = this._preferenceSet.get("window.titleBarStyle");

    return {
      width: this._preferenceSet.get("window.width"),
      height: this._preferenceSet.get("window.height"),
      titleBarStyle: titleBar,
    };
  }

  getItem(key: string): any {
    return this._preferenceSet.get(key);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.CHANGE_PROJECT, (event, base: string) => {
      this.setProject(base);
    });

    ipcMain.on(IPC_PREFERENCE.SET_ITEM, (event, key: string, val: any) => {
      this._preferenceSet.set(key, val);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this._preferenceSet.get(k);
      });
      event.reply(IPC_PREFERENCE.GET_ITEM_REPLY, res);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ALL_SYNC, (event) => {
      event.returnValue = this._preferenceSet.store;
    });
  }
}
