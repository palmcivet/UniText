import Store from "electron-store";
import { basename, dirname } from "path";

import Service from "@/main/service/_";
import Logger from "@/main/utils/logger";
import schema from "@/shared/schemas";
import { ISetting } from "@/shared/typings/setting";

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
  public getSetting<K extends keyof ISetting, T extends ISetting>(module: K, key: ChainedAccessUnion<T[K]>): any {
    return this._dataSet.get(`${module}.${key}` as string) as any;
  }

  /**
   * 修改值
   * @param module 模块名
   * @param key 键名，用 . 分隔
   * @param value 新值
   */
  public setSetting<K extends keyof ISetting, T extends ISetting>(
    module: K,
    key: ChainedAccessUnion<T[K]>,
    value: any
  ): void {
    this._dataSet.set(`${module}.${key}`, value);
  }

  public getAll(): ISetting {
    return this._dataSet.store;
  }
}
