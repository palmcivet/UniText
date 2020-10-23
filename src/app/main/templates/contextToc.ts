import { Keybinding } from "@/app/main/Keybinding";
import { localesMenu } from "@/app/i18n/menu";
import { TI18n, TMenuTemplate } from "@/typings/bootstrap";

export const toc = (locale: TI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu[locale].toc.titleUp,
    accelerator: keybinding.getItem("toc.titleUp"),
    click: () => {},
  },
  {
    label: localesMenu[locale].toc.titleDown,
    accelerator: keybinding.getItem("toc.titleDown"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].toc.retitle,
    accelerator: keybinding.getItem("toc.retitle"),
    click: () => {},
  },
];
