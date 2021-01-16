import { localesMenu } from "@/main/i18n/menu";
import { Keybinding } from "@/main/modules/Keybinding";
import { TI18n, TMenuTemplate } from "@/typings/bootstrap";

export const folder = (locale: TI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu[locale].file.newFile,
    accelerator: keybinding.getItem("file.new-file"),
    click: () => {},
  },
  {
    label: localesMenu[locale].file.newFolder,
    accelerator: keybinding.getItem("file.new-folder"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].edit.copy,
    accelerator: keybinding.getItem("edit.copy"),
    click: () => {},
  },
  {
    label: localesMenu[locale].edit.cut,
    accelerator: keybinding.getItem("edit.cut"),
    click: () => {},
  },
  {
    label: localesMenu[locale].edit.paste,
    accelerator: keybinding.getItem("edit.paste"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].edit.rename,
    accelerator: keybinding.getItem("edit.rename"),
    click: () => {},
  },
  {
    label: localesMenu[locale].edit.reicon,
    accelerator: keybinding.getItem("edit.reicon"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].file.reveal,
    accelerator: keybinding.getItem("file.reveal"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu[locale].edit.delete,
    accelerator: keybinding.getItem("edit.delete"),
    click: () => {},
  },
];
