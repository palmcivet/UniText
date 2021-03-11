import Store from "electron-store";
import { join } from "path";

import { $id } from "@/common/utils";
import schema from "@/common/schema/sTheme";
import { THEME_PRESET, THEME_CSS, PUBLIC, CONFIG_FILE } from "@/common/env";
import { ITheme, IThemeColorCustom } from "@/typings/schema/theme";

export default class Theme {
  private _dataSet!: Store<ITheme>;

  private _filePath!: string;

  constructor(base: string) {
    this.setBasePath(base);
  }

  setBasePath(filePath: string) {
    this._filePath = filePath;
    this._dataSet = new Store({
      cwd: join(filePath, ...CONFIG_FILE.SYSTEM),
      name: "theme",
      schema: schema as Store.Schema<ITheme>,
    });
  }

  getAll() {
    return this._dataSet.store;
  }

  setItem(key: MapGet<ITheme> | string, val: any) {
    this._dataSet.set(key, val);
  }

  loadTheme() {
    const color = this._dataSet.get("color");
    const { dynamic, preset, ...data } = color;

    // TODO 更新 monacoEditor.js

    if (preset === "Custom") {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute(
          "href",
          join(this._filePath, data[key as keyof IThemeColorCustom])
        );
      });
    } else if (THEME_PRESET.includes(preset)) {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", join(PUBLIC.themes, preset, `${key}.css`));
      });
    } else {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", join(this._filePath, preset, `${key}.css`));
      });
    }
  }
}
