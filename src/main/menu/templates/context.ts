import { BrowserWindow } from "electron";

import { IPC_FILE } from "@/shared/channel/ipc";
import Keybinding from "@/main/service/KeybindingService";
import { lang } from "@/main/backend/Locale";
import { Bus } from "@/renderer/plugins/VueBus";

export const file = (keybinding: Keybinding): TMenuTemplate => [
  {
    label: lang("file.read-file"),
    accelerator: keybinding.get("file.read-file"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.OPEN_FOR_VIEW, Bus.value);
    },
  },
  {
    label: lang("file.edit-file"),
    accelerator: keybinding.get("file.edit-file"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.OPEN_FOR_EDIT, Bus.value);
    },
  },
  { type: "separator" },
  {
    label: lang("edit.copy"),
    accelerator: keybinding.get("edit.copy"),
    click: () => {},
  },
  {
    label: lang("edit.cut"),
    accelerator: keybinding.get("edit.cut"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("edit.rename"),
    accelerator: keybinding.get("edit.rename"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.RENAME, Bus.value);
    },
  },
  {
    label: lang("edit.reicon"),
    accelerator: keybinding.get("edit.reicon"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("file.reveal"),
    accelerator: keybinding.get("file.reveal"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.REVEAL, Bus.value);
    },
  },
  { type: "separator" },
  {
    label: lang("edit.delete"),
    accelerator: keybinding.get("edit.delete"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.DELETE, Bus.value);
    },
  },
];

export const folder = (keybinding: Keybinding): TMenuTemplate => [
  {
    label: lang("file.new-file"),
    accelerator: keybinding.get("file.new-file"),
    click: () => {},
  },
  {
    label: lang("file.new-folder"),
    accelerator: keybinding.get("file.new-folder"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("edit.copy"),
    accelerator: keybinding.get("edit.copy"),
    click: () => {},
  },
  {
    label: lang("edit.cut"),
    accelerator: keybinding.get("edit.cut"),
    click: () => {},
  },
  {
    label: lang("edit.paste"),
    accelerator: keybinding.get("edit.paste"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("edit.rename"),
    accelerator: keybinding.get("edit.rename"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.RENAME, Bus.value);
    },
  },
  {
    label: lang("edit.reicon"),
    accelerator: keybinding.get("edit.reicon"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("file.reveal"),
    accelerator: keybinding.get("file.reveal"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.REVEAL, Bus.value);
    },
  },
  { type: "separator" },
  {
    label: lang("edit.delete"),
    accelerator: keybinding.get("edit.delete"),
    click: (menu, win) => {
      (win as BrowserWindow).webContents.send(IPC_FILE.DELETE, Bus.value);
    },
  },
];

export const tab = (keybinding: Keybinding): TMenuTemplate => [
  {
    label: lang("tab.close-current"),
    accelerator: keybinding.get("tab.close-current"),
    click: () => {},
  },
  {
    label: lang("tab.close-saved"),
    accelerator: keybinding.get("tab.close-saved"),
    click: () => {},
  },
  {
    label: lang("tab.close-all"),
    accelerator: keybinding.get("tab.close-all"),
    click: () => {},
  },
  {
    label: lang("tab.save-all"),
    accelerator: keybinding.get("tab.save-all"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("tab.pin"),
    accelerator: keybinding.get("tab.pin"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("tab.preview"),
    accelerator: keybinding.get("tab.preview"),
    click: () => {},
  },
];

export const toc = (keybinding: Keybinding): TMenuTemplate => [
  {
    label: lang("toc.title-down"),
    accelerator: keybinding.get("toc.title-up"),
    click: () => {},
  },
  {
    label: lang("toc.title-down"),
    accelerator: keybinding.get("toc.title-down"),
    click: () => {},
  },
  { type: "separator" },
  {
    label: lang("toc.title-down"),
    accelerator: keybinding.get("toc.retitle"),
    click: () => {},
  },
];
