import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";
import { EI18n } from "@/typings/preference";
import { TMenuTemplate } from "@/typings/bootstrap";

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
