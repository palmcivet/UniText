import { VueConstructor } from "vue/types/umd";

/* -------------------------- types ------------------------------- */

interface IPluginOptions {
  base: string;
}

export interface IVueTheme {
  readonly $theme: Theme;
}

/* -------------------------- class ------------------------------- */

import Store from "electron-store";

import { $id } from "@/common/utils";
import schema from "@/common/schema/sTheme";
import { joinPath } from "@/common/fileSystem";
import { THEME_PRESET, THEME_CSS, PUBLIC } from "@/common/env";
import { ITheme, IThemeColorCustom } from "@/typings/schema/theme";

export class Theme {
  private _dataSet!: Store<ITheme>;

  private _filePath!: string;

  constructor(opt: IPluginOptions) {
    this.setBasePath(opt.base);
  }

  setBasePath(filePath: string) {
    this._filePath = filePath;
    this._dataSet = new Store({
      cwd: filePath,
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
          joinPath(this._filePath, data[key as keyof IThemeColorCustom])
        );
      });
    } else if (THEME_PRESET.includes(preset)) {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(PUBLIC.themes, preset, `${key}.css`));
      });
    } else {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(this._filePath, preset, `${key}.css`));
      });
    }
  }
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, options: IPluginOptions) => {
  const proto = Vue.prototype;
  proto.$theme = proto.$theme || new Theme(options);
};

export default {
  install,
};
