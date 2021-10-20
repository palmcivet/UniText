import Store from "electron-store";

import Logger from "../backend/Logger";
import Service from "./Service";
import schema from "@/shared/setting";
import { ISetting } from "@/typings/setting";

export default class SettingService extends Service {
  private readonly _dataSet: Store<ISetting>;

  constructor(logger: Logger, path: string) {
    super(logger);

    this._dataSet = new Store({
      cwd: path,
      name: "preference",
      schema: schema as Store.Schema<ISetting>,
    });
  }

  /**
   * 获取 Setting 各模块，返回一组存取器
   * @param module 模块名
   * @returns
   */
  useSetting<K extends keyof ISetting, T extends ISetting>(module: K) {
    return {
      get: (key: MapGet<T[K]>) => this._dataSet.get(`${module}.${key}` as string) as any,
      set: (key: MapGet<T[K]>, value: any) => this._dataSet.set(`${module}.${key}`, value),
    };
  }

  getAll(): ISetting {
    return this._dataSet.store;
  }
}
