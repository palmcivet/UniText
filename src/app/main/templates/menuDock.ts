import { TI18n, TMenuTemplate } from "@/typings/bootstrap";
import { Keybinding } from "@/app/main/Keybinding";
import { localesMenu } from "@/app/i18n/menu";

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
