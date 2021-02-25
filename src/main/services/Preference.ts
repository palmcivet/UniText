import { ipcMain } from "electron";
import Store from "electron-store";

import schema from "@/common/schema/sPreference";
import { IPC_OTHER, IPC_PREFERENCE } from "@/common/channel/ipc";
import { IPreference } from "@/typings/schema/preference";

/**
 * 有以下功能：
 * - load：加载/刷新配置文件
 * - get：Vuex 获得属性，运行时的修改不反映到本结构
 * - set：施加的修改操作是直接保存
 * @class 管理用户 preference 的数据结构
 */
export default class Preference {
  protected _dataSet!: Store<IPreference>;

  constructor(filePath: string) {
    this.setBasePath(filePath);
    this._listenForIpcMain();
  }

  setBasePath(filePath: string): void {
    this._dataSet = new Store({
      cwd: filePath,
      name: "preference",
      schema: schema as Store.Schema<IPreference>,
    });
  }

  getItem(key: string): any {
    return this._dataSet.get(key);
  }

  getWindowStyle(): any {
    // FEAT 平台兼容性
    const titleBarStyle: string = this._dataSet.get("window.titleBarStyle");

    return {
      width: this._dataSet.get("window.width"),
      height: this._dataSet.get("window.height"),
      titleBarStyle,
    };
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.SET_PATH_AGENT, (event, base: string) => {
      this.setBasePath(base);
    });

    ipcMain.on(IPC_PREFERENCE.SET_ITEM, (event, key: string, val: any) => {
      this._dataSet.set(key, val);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ITEM, (event, ...keys: Array<string>) => {
      const res: { [key: string]: any } = {};
      keys.forEach((k) => {
        res[k] = this._dataSet.get(k);
      });
      event.reply(IPC_PREFERENCE.GET_ITEM_REPLY, res);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ALL, (event) => {
      event.reply(IPC_PREFERENCE.GET_ALL_REPLY, this._dataSet.store);
    });
  }
}
