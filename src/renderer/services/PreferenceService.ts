import Store from "electron-store";
import { join } from "path";

import schema from "@/shared/setting/preference";
import { CABIN_FILE } from "@/shared/env";
import { IPreference } from "@/typings/setting/preference";

export default class Preference {
  private _dataSet!: Store<IPreference>;

  constructor(filePath: string) {
    this.setBasePath(filePath);
  }

  setBasePath(filePath: string): void {
    this._dataSet = new Store({
      cwd: join(filePath, ...CABIN_FILE.SYSTEM),
      name: "preference",
      schema: schema as Store.Schema<IPreference>,
    });
  }

  getItem(key: MapGet<IPreference>): any {
    return this._dataSet.get(key);
  }

  setItem(key: MapGet<IPreference>, val: any) {
    this._dataSet.set(key, val);
  }

  getAll() {
    return this._dataSet.store;
  }
}
