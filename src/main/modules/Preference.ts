import { ipcMain } from "electron";
import Store from "electron-store";
import * as fse from "fs-extra";

import { joinPath } from "@/common/fileSystem";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { CONFIG_FOLDER, CONFIG_FILE } from "@/common/env";
import { UNITEXT_SYSTEM } from "@/main/config";
import schema from "@/main/config/schemaPreference";
import { IPreference, TPreferenceSet } from "@/typings/bootstrap";
import logger from "./Logger";

/**
 * 有以下功能：
 * - load：加载/刷新配置文件
 * - get：Vuex 获得属性，运行时的修改不反映到本结构
 * - set：施加的修改操作是直接保存
 * @class 管理用户 preference 的数据结构
 */
export class Preference {
  private _preferenceSet!: TPreferenceSet;

  constructor(base: string) {
    let cwd = joinPath(base, CONFIG_FOLDER.CONFIG);
    const filePath = joinPath(base, CONFIG_FILE.PREFERENCE);

    if (!fse.pathExistsSync(filePath)) {
      cwd = UNITEXT_SYSTEM.DEFAULT_DIR;
      logger.error(`Can't find ${filePath}`);
    }

    this._preferenceSet = new Store({
      cwd,
      name: "preference",
      schema: schema as Store.Schema<IPreference>,
    });

    this._preferenceSet.set("files.folderDir", base);

    this._listenForIpcMain();
  }

  getItem(key: string): any {
    return this._preferenceSet.get(key);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_PREFERENCE.LOAD, () => {});

    ipcMain.on(IPC_PREFERENCE.GET_ALL, (event) => {
      event.reply(IPC_PREFERENCE.REPLY_GET_ALL, this._preferenceSet.store);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this._preferenceSet.get(k);
      });
      event.reply(IPC_PREFERENCE.REPLY_GET_ITEM, res);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM_SYNC, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this._preferenceSet.get(k);
      });
      event.returnValue = res;
    });

    ipcMain.on(IPC_PREFERENCE.SET_ITEM, (event, key: string, val: any) => {
      this._preferenceSet.set(key, val);
    });
  }
}
