import { TI18n, TMenuTemplate } from "@/typings/bootstrap";
import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";

export const dock = (locale: TI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu[locale].dock.newWindow,
    accelerator: keybinding.getItem("dock.newWindow"),
  },
  {
    label: localesMenu[locale].dock.newNote,
    accelerator: keybinding.getItem("dock.newNote"),
    click: () => {},
  },
  {
    label: localesMenu[locale].dock.newAgenda,
    accelerator: keybinding.getItem("dock.newAgenda"),
    click: () => {},
  },
];
