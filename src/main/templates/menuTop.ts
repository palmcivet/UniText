import { app, BrowserWindow, shell } from "electron";

import { isOsx } from "@/common/env";
import { IPC_FILE, IPC_OTHER } from "@/common/channel/ipc";
import Keybinding from "@/common/userData/Keybinding";
import { localesMenu } from "@/common/i18n/iMenu";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

export const top = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => {
  const menu: TMenuTemplate = [];

  if (isOsx) {
    menu.push({
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
  }

  return [
    ...menu,
    {
      label: localesMenu.file.label[locale],
      submenu: [
        {
          label: localesMenu.file.project_open[locale],
          accelerator: keybinding.getItem("file.project_open"),
          click: () => {},
        },
        {
          label: localesMenu.file.project_close[locale],
          accelerator: keybinding.getItem("file.project_open"),
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
          label: localesMenu.file.save[locale],
          accelerator: keybinding.getItem("file.save"),
          click: (menu, win) => {
            (win as BrowserWindow).webContents.send(IPC_FILE.SAVE);
          },
        },
        {
          label: localesMenu.edit.delete[locale],
          accelerator: keybinding.getItem("edit.delete"),
          click: () => {},
        },
      ],
    },
    {
      label: localesMenu.edit.label[locale],
      submenu: [
        { type: "separator" },
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
      ],
    },
    {
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
    },
    {
      label: localesMenu.window.label[locale],
      role: "windowMenu",
    },
    {
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
    },
  ];
};
