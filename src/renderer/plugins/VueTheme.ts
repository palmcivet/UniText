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
import * as fse from "fs-extra";

import {
  CONFIG_FILE,
  CONFIG_FOLDER,
  THEME_PRESET,
  THEME_CSS,
  PUBLIC,
} from "@/common/env";
import { $id } from "@/common/utils";
import schema from "@/common/schema/sTheme";
import { joinPath, checkStringExist } from "@/common/fileSystem";
import { ITheme, IThemeColorCustom } from "@/typings/schema/theme";

export class Theme {
  private _dataSet!: Store<ITheme>;

  private _base!: string;

  constructor(opt: IPluginOptions) {
    this._base = opt.base;
    this.setBasePath(opt.base);
  }

  setBasePath(base: string) {
    let cwd = joinPath(base, CONFIG_FOLDER.SETTINGS);

    this._dataSet = new Store({
      cwd,
      name: "theme",
      schema: schema as Store.Schema<ITheme>,
    });
  }

  getItem(key: string): any {
    return this._dataSet.get(key);
  }

  async loadTheme() {
    const color = this._dataSet.get("color");
    const { dynamic, preset, ...data } = color;

    // TODO 更新 monacoEditor.js

    if (preset === "Custom") {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute(
          "href",
          joinPath(this._base, data[key as keyof IThemeColorCustom])
        );
      });
    } else if (checkStringExist(preset, THEME_PRESET)) {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(PUBLIC.themes, preset, `${key}.css`));
      });
    } else {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(this._base, preset, `${key}.css`));
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
