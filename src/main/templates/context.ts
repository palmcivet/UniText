import { BrowserWindow } from "electron";

import { IPC_FILE } from "@/common/channel/ipc";
import { localesMenu } from "@/common/i18n/iMenu";
import Keybinding from "@/common/userData/Keybinding";
import { Bus } from "@/renderer/plugins/VueBus";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

export const file = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.file.read[locale],
    accelerator: keybinding.getItem("file.read"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.OPEN_FOR_VIEW, Bus.value);
    },
  },
  {
    label: localesMenu.file.edit[locale],
    accelerator: keybinding.getItem("file.edit"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.OPEN_FOR_EDIT, Bus.value);
    },
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

export const tab = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.tab.closecurrent[locale],
    accelerator: keybinding.getItem("tab.closecurrent"),
    click: () => {},
  },
  {
    label: localesMenu.tab.closesaved[locale],
    accelerator: keybinding.getItem("tab.closesaved"),
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
    accelerator: keybinding.getItem("tab.pin"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: localesMenu.tab.preview[locale],
    accelerator: keybinding.getItem("tab.preview"),
    click: () => {},
  },
];

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
