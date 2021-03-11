import { BrowserWindow } from "electron";

import { IPC_FILE } from "@/common/channel/ipc";
import { localesMenu } from "@/common/i18n/iMenu";
import Keybinding from "@/common/userData/Keybinding";
import { Bus } from "@/renderer/plugins/VueBus";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

export const folder = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.file.new_file[locale],
    accelerator: keybinding.getItem("file.new_file"),
    click: () => {},
  },
  {
    label: localesMenu.file.new_folder[locale],
    accelerator: keybinding.getItem("file.new_folder"),
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
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.RENAME, Bus.value);
    },
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
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.REVEAL, Bus.value);
    },
  },
  { type: "separator" },
  {
    label: localesMenu.edit.delete[locale],
    accelerator: keybinding.getItem("edit.delete"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.DELETE, Bus.value);
    },
  },
];
