import { localesMenu } from "@/main/i18n/menu";
import { Keybinding } from "@/main/modules/Keybinding";
import { EI18n, TMenuTemplate } from "@/typings/bootstrap";

export const file = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.file.read[locale],
    accelerator: keybinding.getItem("file.read"),
    click: () => {},
  },
  {
    label: localesMenu.file.edit[locale],
    accelerator: keybinding.getItem("file.edit"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.edit.copy[locale],
    accelerator: keybinding.getItem("file.copy"),
    click: () => {},
  },
  {
    label: localesMenu.edit.cut[locale],
    accelerator: keybinding.getItem("edit.cut"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.edit.rename[locale],
    accelerator: keybinding.getItem("edit.rename"),
    click: () => {},
  },
  {
    label: localesMenu.edit.reicon[locale],
    accelerator: keybinding.getItem("edit.reicon"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.file.reveal[locale],
    accelerator: keybinding.getItem("file.reveal"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.edit.delete[locale],
    accelerator: keybinding.getItem("edit.delete"),
    click: () => {},
  },
];
