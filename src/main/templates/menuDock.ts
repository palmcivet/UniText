import { Keybinding } from "@/main/services/Keybinding";
import { localesMenu } from "@/main/i18n/iMenu";
import { EI18n } from "@/typings/service/preference";
import { TMenuTemplate } from "@/typings/service/menu";

export const dock = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.dock.newwindow[locale],
    accelerator: keybinding.getItem("dock.newwindow"),
  },
  {
    label: localesMenu.dock.newnote[locale],
    accelerator: keybinding.getItem("dock.newnote"),
    click: () => {},
  },
  {
    label: localesMenu.dock.newagenda[locale],
    accelerator: keybinding.getItem("dock.newagenda"),
    click: () => {},
  },
];
