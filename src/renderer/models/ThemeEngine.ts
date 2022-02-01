import { EventBus } from "@palmcivet/unitext-tree-view";

import { $id } from "@/shared/utils";
import { PATH_SEPARATE, URL_PROTOCOL } from "@/shared/pattern";
import { THEME_PRESET, THEME_CSS, PUBLIC } from "@/shared/constant";
import { IDisposable } from "@/shared/typings/renderer";
import { ITheme, IThemeCustom } from "@/shared/typings/setting/theme";
import { useService } from "../composables";

export default class ThemeEngine implements IDisposable {
  /**
   * @description Event Bus 实例
   */
  private readonly bus: EventBus;

  constructor(bus: EventBus) {
    this.bus = bus;
  }

  public invoke(): void {}

  public update(data: ITheme): void {
    const { overview, custom } = data;
    const { preset } = overview;
    const { resolveCabinFolder } = useService("EnvService");

    // TODO 更新 monacoEditor.js

    if (preset === "Custom") {
      THEME_CSS.forEach(async (key) => {
        $id(key).setAttribute("href", `${URL_PROTOCOL}${custom[key as keyof IThemeCustom]}`);
      });
    } else if (THEME_PRESET.includes(preset)) {
      THEME_CSS.forEach(async (key) => {
        $id(key).setAttribute("href", [PUBLIC.THEME, preset, `${key}.css`].join(PATH_SEPARATE));
      });
    } else {
      THEME_CSS.forEach(async (key) => {
        $id(key).setAttribute("href", `${URL_PROTOCOL}${await resolveCabinFolder("THEMES", [preset, `${key}.css`])}`);
      });
    }
  }

  public dispose(): void {}

  public startDebug(): void {}

  public stopDebug(): void {}

  public async getSelectedTheme() {
    return (await useService("EnvService").resolveThemeList()).concat(...THEME_PRESET);
  }
}
