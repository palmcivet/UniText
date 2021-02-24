import { Keybinding } from "@/main/services/Keybinding";
import { localesMenu } from "@/main/i18n/iMenu";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

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
