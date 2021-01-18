import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";
import { EI18n, TMenuTemplate } from "@/typings/bootstrap";

export const toc = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.toc.titleup[locale],
    accelerator: keybinding.getItem("toc.titleup"),
    click: () => {},
  },
  {
    label: localesMenu.toc.titledown[locale],
    accelerator: keybinding.getItem("toc.titledown"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.toc.retitle[locale],
    accelerator: keybinding.getItem("toc.retitle"),
    click: () => {},
  },
];