import { ipcMain } from "electron";
import Store from "electron-store";
import * as fse from "fs-extra";

import { TStore } from "@/typings/bootstrap";
import { joinPath } from "@/common/files";
import { IPC_PREFERENCE } from "@/common/channel";
import { UNITEXT_SYSTEM, CONFIG_FOLDER, CONFIG_FILE } from "@/common/env";
import schema from "@/app/config/preference.json";

/**
 * 有以下功能：
 * - load：加载/刷新配置文件
 * - get：Vuex 获得属性，运行时的修改不反映到本结构
 * - set：施加的修改操作是直接保存
 * @class 管理用户 preference 的数据结构
 */
export class Preference {
  private store!: TStore;

  errReg!: Error;

  constructor() {
    this.store = new Store({
      cwd: joinPath(...UNITEXT_SYSTEM.DEFAULT_DIR),
      name: "preference",
      schema: schema,
    });

    this.listenIpc();
  }

  /**
   * 加载 `path` 下的 `preference.json` 配置文件
   * - 存在，加载、校验
   * - 不存在、内容为空、不为空但找不到配置文件，加载默认配置
   * @param path 目标文件夹的绝对路径
   */
  load(path?: string) {
    this.store = new Store({
      cwd: joinPath(path!, CONFIG_FOLDER.CONFIG_DIR),
      name: "preference",
      schema: schema,
    });

    if (path && fse.pathExistsSync(path)) {
      const res = fse.readJSONSync(joinPath(path, CONFIG_FILE.PREFERENCE));
      this.store.set(res);
    }
  }

  getItem(key: string): any {
    return this.store.get(key);
  }

  listenIpc() {
    ipcMain.on(IPC_PREFERENCE.LOAD, () => {});

    ipcMain.on(IPC_PREFERENCE.GET_ALL, (event) => {
      event.reply(IPC_PREFERENCE.REPLY_GET_ALL, this.store.store);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this.store.get(k);
      });
      event.reply(IPC_PREFERENCE.REPLY_GET_ITEM, res);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM_SYNC, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this.store.get(k);
      });
      event.returnValue = res;
    });

    ipcMain.on(IPC_PREFERENCE.SET_ITEM, (event, key: string, val: any) => {
      this.store.set(key, val);
    });
  }
}
