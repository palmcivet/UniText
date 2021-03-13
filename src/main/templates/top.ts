import { app, shell, BrowserWindow, MenuItemConstructorOptions } from "electron";

import { isOsx } from "@/common/env";
import { IPC_FILE, IPC_OTHER } from "@/common/channel/ipc";
import Keybinding from "@/common/userData/Keybinding";
import { localesMenu } from "@/common/i18n/iMenu";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

type F = (locale: EI18n, keybinding: Keybinding) => MenuItemConstructorOptions;

export const unitext: F = (locale, keybinding) => ({
  label: app.name,
  submenu: [
    {
      label: localesMenu.system.about[locale],
      role: "about",
      // TODO 添加信息
    },
    {
      label: localesMenu.system.check[locale],
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_OTHER.CHECK_UPDATE);
      },
    },
    { type: "separator" },
    {
      label: localesMenu.system.system[locale],
      accelerator: keybinding.getItem("system.system"),
      click: (menu, win) => {},
    },
    {
      label: localesMenu.system.preference[locale],
      accelerator: keybinding.getItem("system.preference"),
      click: (menu, win) => {},
    },
    {
      label: localesMenu.system.theme[locale],
      submenu: [
        {
          label: localesMenu.system.themeappearence[locale],
          accelerator: keybinding.getItem("system.themeappearence"),
          click: () => {},
        },
        {
          label: localesMenu.system.themeeditor[locale],
          accelerator: keybinding.getItem("system.themeeditor"),
          click: () => {},
        },
        {
          label: localesMenu.system.themeview[locale],
          accelerator: keybinding.getItem("system.themeview"),
          click: () => {},
        },
        {
          label: localesMenu.system.themeicon[locale],
          accelerator: keybinding.getItem("system.themeicon"),
          click: () => {},
        },
      ],
    },
    {
      label: localesMenu.system.keybinding[locale],
      accelerator: keybinding.getItem("system.keybinding"),
      submenu: [
        {
          label: localesMenu.system.keybindingdefault[locale],
          accelerator: keybinding.getItem("system.keybindingdefault"),
          click: (menu, win) => {},
        },
        {
          label: localesMenu.system.keybindinguser[locale],
          accelerator: keybinding.getItem("system.keybindinguser"),
          click: (menu, win) => {},
        },
      ],
    },
    {
      label: localesMenu.system.snippet[locale],
      accelerator: keybinding.getItem("system.snippet"),
      submenu: [
        {
          label: localesMenu.system.snippetview[locale],
          accelerator: keybinding.getItem("system.snippetview"),
          click: (menu, win) => {},
        },
        {
          label: localesMenu.system.snippetcreate[locale],
          accelerator: keybinding.getItem("system.snippetcreate"),
          click: (menu, win) => {},
        },
      ],
    },
    { type: "separator" },
    {
      label: localesMenu.system.services[locale],
      role: "services",
      accelerator: keybinding.getItem("system.services"),
    },
    { type: "separator" },
    {
      label: localesMenu.system.hide[locale],
      role: "hide",
    },
    {
      label: localesMenu.system.hideothers[locale],
      role: "hideOthers",
    },
    { type: "separator" },
    {
      label: localesMenu.system.quit[locale],
      role: "quit",
      accelerator: keybinding.getItem("system.quit"),
    },
  ],
});

export const file: F = (locale, keybinding) => ({
  label: localesMenu.file.label[locale],
  submenu: [
    {
      label: localesMenu.file.project_open[locale],
      accelerator: keybinding.getItem("file.project_open"),
      click: () => {},
    },
    {
      label: localesMenu.file.project_close[locale],
      accelerator: keybinding.getItem("file.project_close"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.file.mark_add[locale],
      accelerator: keybinding.getItem("file.mark_add"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.MARK_ADD);
      },
    },
    {
      label: localesMenu.file.mark_del[locale],
      accelerator: keybinding.getItem("file.mark_del"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.MARK_DEL);
      },
    },
    { type: "separator" },
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
      label: localesMenu.file.save[locale],
      accelerator: keybinding.getItem("file.save"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.SAVE);
      },
    },
    {
      label: localesMenu.file.saveas[locale],
      accelerator: keybinding.getItem("file.saveas"),
      click: (menu, win) => {},
    },
    { type: "separator" },
    {
      label: localesMenu.file.reveal[locale],
      accelerator: keybinding.getItem("file.reveal"),
      click: (menu, win) => {},
    },
    {
      label: localesMenu.file.export[locale],
      accelerator: keybinding.getItem("file.export"),
      click: (menu, win) => {},
    },
    {
      label: localesMenu.file.transmit[locale],
      accelerator: keybinding.getItem("file.transmit"),
      click: (menu, win) => {},
    },
  ],
});

export const edit: F = (locale, keybinding) => ({
  label: localesMenu.edit.label[locale],
  submenu: [
    {
      label: localesMenu.edit.undo[locale],
      role: "undo",
      accelerator: keybinding.getItem("edit.undo"),
      click: () => {},
    },
    {
      label: localesMenu.edit.redo[locale],
      role: "redo",
      accelerator: keybinding.getItem("edit.redo"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.edit.cut[locale],
      role: "cut",
      accelerator: keybinding.getItem("edit.cut"),
      click: () => {},
    },
    {
      label: localesMenu.edit.copy[locale],
      role: "copy",
      accelerator: keybinding.getItem("edit.copy"),
      click: () => {},
    },
    {
      label: localesMenu.edit.paste[locale],
      role: "paste",
      accelerator: keybinding.getItem("edit.paste"),
      click: () => {},
    },
    {
      label: localesMenu.edit.delete[locale],
      role: "delete",
      accelerator: keybinding.getItem("edit.delete"),
      click: () => {},
    },
    {
      label: localesMenu.edit.selectall[locale],
      role: "selectAll",
      accelerator: keybinding.getItem("edit.selectall"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.edit.find[locale],
      role: "selectAll",
      accelerator: keybinding.getItem("edit.find"),
      click: () => {},
    },
    {
      label: localesMenu.edit.findNext[locale],
      role: "selectAll",
      accelerator: keybinding.getItem("edit.findNext"),
      click: () => {},
    },
    {
      label: localesMenu.edit.findPrevious[locale],
      role: "selectAll",
      accelerator: keybinding.getItem("edit.findPrevious"),
      click: () => {},
    },
    {
      label: localesMenu.edit.replace[locale],
      role: "selectAll",
      accelerator: keybinding.getItem("edit.replace"),
      click: () => {},
    },
  ],
});

export const view: F = (locale, keybinding) => ({
  label: localesMenu.view.label[locale],
  submenu: [
    {
      label: localesMenu.view.statusbar[locale],
      accelerator: keybinding.getItem("view.statusbar"),
      click: () => {},
    },
    {
      label: localesMenu.view.sidebar[locale],
      accelerator: keybinding.getItem("view.sidebar"),
      click: () => {},
    },
    {
      label: localesMenu.view.sidepanel[locale],
      accelerator: keybinding.getItem("view.sidepanel"),
      click: () => {},
    },
    {
      label: localesMenu.view.command[locale],
      accelerator: keybinding.getItem("view.command"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.view.preview[locale],
      accelerator: keybinding.getItem("view.preview"),
      click: () => {},
    },
    {
      label: localesMenu.view.source[locale],
      accelerator: keybinding.getItem("view.source"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.view.autowrap[locale],
      accelerator: keybinding.getItem("view.autowrap"),
      click: () => {},
    },
    {
      label: localesMenu.view.minimap[locale],
      accelerator: keybinding.getItem("view.minimap"),
      click: () => {},
    },
    {
      label: localesMenu.view.space[locale],
      accelerator: keybinding.getItem("view.space"),
      click: () => {},
    },
  ],
});

export const format: F = (locale, keybinding) => ({
  label: localesMenu.format.label[locale],
  submenu: [
    {
      label: localesMenu.format.headUp[locale],
      accelerator: keybinding.getItem("format.headUp"),
      click: () => {},
    },
    {
      label: localesMenu.format.headDown[locale],
      accelerator: keybinding.getItem("format.headDown"),
      click: () => {},
    },
    {
      label: localesMenu.format.orderList[locale],
      accelerator: keybinding.getItem("format.orderList"),
      click: () => {},
    },
    {
      label: localesMenu.format.unOrderList[locale],
      accelerator: keybinding.getItem("format.unOrderList"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: localesMenu.format.bold[locale],
      accelerator: keybinding.getItem("format.bold"),
      click: () => {},
    },
    {
      label: localesMenu.format.italic[locale],
      accelerator: keybinding.getItem("format.italic"),
      click: () => {},
    },
    {
      label: localesMenu.format.sup[locale],
      accelerator: keybinding.getItem("format.sup"),
      click: () => {},
    },
    {
      label: localesMenu.format.sub[locale],
      accelerator: keybinding.getItem("format.sub"),
      click: () => {},
    },
    {
      label: localesMenu.format.mark[locale],
      accelerator: keybinding.getItem("format.mark"),
      click: () => {},
    },
    {
      label: localesMenu.format.delete[locale],
      accelerator: keybinding.getItem("format.delete"),
      click: () => {},
    },
    {
      label: localesMenu.format.img[locale],
      accelerator: keybinding.getItem("format.img"),
      click: () => {},
    },
  ],
});

export const window: F = (locale, keybinding) => ({
  label: localesMenu.window.label[locale],
  role: "windowMenu",
});

export const help: F = (locale, keybinding) => ({
  label: localesMenu.help.label[locale],
  role: "help",
  submenu: [
    {
      label: localesMenu.help.learnmore[locale],
      click: () => shell.openExternal("https://github.com/Palmcivet/UniText"),
    },
    {
      label: localesMenu.help.report[locale],
      click: () => shell.openExternal("https://github.com/Palmcivet/UniText/issues"),
    },
    {
      label: localesMenu.help.toggledevtools[locale],
      role: "toggleDevTools",
      accelerator: keybinding.getItem("help.toggledevtools"),
    },
  ],
});

export default (locale: EI18n, keybinding: Keybinding): TMenuTemplate => {
  const menu: TMenuTemplate = [];

  if (isOsx) {
    menu.push(unitext(locale, keybinding));
  }

  return [
    ...menu,
    file(locale, keybinding),
    edit(locale, keybinding),
    view(locale, keybinding),
    format(locale, keybinding),
    window(locale, keybinding),
    help(locale, keybinding),
  ];
};
