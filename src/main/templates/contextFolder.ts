import { localesMenu } from "@/main/i18n/menu";
import { Keybinding } from "@/main/modules/Keybinding";
import { EI18n, TMenuTemplate } from "@/typings/bootstrap";

export const folder = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.file.newfile[locale],
    accelerator: keybinding.getItem("file.newfile"),
    click: () => {},
  },
  {
    label: localesMenu.file.newfolder[locale],
    accelerator: keybinding.getItem("file.newfolder"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.edit.copy[locale],
    accelerator: keybinding.getItem("edit.copy"),
    click: () => {},
  },
  {
    label: localesMenu.edit.cut[locale],
    accelerator: keybinding.getItem("edit.cut"),
    click: () => {},
  },
  {
    label: localesMenu.edit.paste[locale],
    accelerator: keybinding.getItem("edit.paste"),
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
