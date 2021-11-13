import { THEME_PRESET, THEME_CSS, PUBLIC, CONFIG_FILE, CONFIG_FOLDER } from "@/common/env";
import { $id } from "@/shared/utils";

export default class ThemeEngine {
  constructor(base: string) {}

  setBasePath(filePath: string) {}

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
          `${URL_PROTOCOL}${join(this._filePath, preset, data[key as keyof IThemeColorCustom])}`
        );
      });
    } else if (THEME_PRESET.includes(preset)) {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", join(PUBLIC.themes, preset, `${key}.css`));
      });
    } else {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute(
          "href",
          `${URL_PROTOCOL}${join(this._filePath, ...CONFIG_FOLDER.THEMES, preset, key)}.css`
        );
      });
    }
  }
}
