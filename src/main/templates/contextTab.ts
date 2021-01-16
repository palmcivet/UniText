import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";
import { TI18n, TMenuTemplate } from "@/typings/bootstrap";

export const tab = (locale: TI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu[locale].tab.closeCur,
    accelerator: keybinding.getItem("tab.close-current"),
    click: () => {},
  },
  {
    label: localesMenu[locale].tab.closeSave,
    accelerator: keybinding.getItem("tab.close-save"),
    click: () => {},
  },
  {
    label: localesMenu[locale].tab.closeAll,
    accelerator: keybinding.getItem("tab.close-all"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].tab.pin,
    accelerator: keybinding.getItem("tab.pin-tab"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].tab.preview,
    accelerator: keybinding.getItem("tab.preview"),
    click: () => {},
  },
];
