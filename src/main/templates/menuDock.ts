import { EI18n, TMenuTemplate } from "@/typings/bootstrap";
import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";

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
