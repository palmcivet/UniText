import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";
import { EI18n, TMenuTemplate } from "@/typings/bootstrap";

export const tab = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.tab.closecurrent[locale],
    accelerator: keybinding.getItem("tab.closecurrent"),
    click: () => {},
  },
  {
    label: localesMenu.tab.closesaved[locale],
    accelerator: keybinding.getItem("tab.closesave"),
    click: () => {},
  },
  {
    label: localesMenu.tab.closeall[locale],
    accelerator: keybinding.getItem("tab.closeall"),
    click: () => {},
  },
  {
    label: localesMenu.tab.saveall[locale],
    accelerator: keybinding.getItem("tab.saveall"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.tab.pin[locale],
    accelerator: keybinding.getItem("tab.pintab"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.tab.preview[locale],
    accelerator: keybinding.getItem("tab.preview"),
    click: () => {},
  },
];
