import Store from "electron-store";
import { basename, dirname } from "path";

import Logger from "@/main/backend/Logger";
import schema from "@/shared/schema";
import { ISetting } from "@/shared/typings/setting";
import Service from "./Service";

export default class SettingService extends Service {
  private readonly _dataSet: Store<ISetting>;

  constructor(logger: Logger, path: string) {
    super(logger);

    this._dataSet = new Store({
      cwd: dirname(path),
      name: basename(path).replace(".json", ""),
      schema: schema as Store.Schema<ISetting>,
    });
  }

  /**
   * 获取值
   * @param module 模块名
   * @param key 键名，用 . 分隔
   */
  public getSetting<K extends keyof ISetting, T extends ISetting>(module: K, key: MapGet<T[K]>): any {
    return this._dataSet.get(`${module}.${key}` as string) as any;
  }

  /**
   * 修改值
   * @param module 模块名
   * @param key 键名，用 . 分隔
   * @param value 新值
   */
  public setSetting<K extends keyof ISetting, T extends ISetting>(module: K, key: MapGet<T[K]>, value: any): void {
    this._dataSet.set(`${module}.${key}`, value);
  }

  public getAll(): ISetting {
    return this._dataSet.store;
  }
}
