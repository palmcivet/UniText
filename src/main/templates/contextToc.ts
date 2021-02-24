import { Keybinding } from "@/main/services/Keybinding";
import { localesMenu } from "@/main/i18n/iMenu";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

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
