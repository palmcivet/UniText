import { app, BrowserWindow, shell } from "electron";

import { isOsx } from "@/common/env";
import { Keybinding } from "@/main/modules/Keybinding";
import { localesMenu } from "@/main/i18n/menu";
import { EI18n, TMenuTemplate } from "@/typings/bootstrap";
import { IPC_FILE } from "@/common/channel/ipc";

export const top = (locale: EI18n, keybinding: Keybinding): TMenuTemplate => {
  const menu: TMenuTemplate = [];

  if (isOsx) {
    menu.push({
      label: app.name,
      submenu: [
        {
          label: localesMenu.system.about[locale],
          role: "about",
        },
        {
          label: localesMenu.system.check[locale],
          click: () => {},
        },
        { type: "separator" },
        {
          label: localesMenu.system.setting[locale],
          submenu: [
            {
              label: localesMenu.system.preference[locale],
              accelerator: keybinding.getItem("system.preference"),
              click: () => {},
            },
            {
              label: localesMenu.system.keybinding[locale],
              accelerator: keybinding.getItem("system.keybinding"),
              click: () => {},
            },
            {
              label: localesMenu.system.snippet[locale],
              accelerator: keybinding.getItem("system.snippet"),
              click: () => {},
            },
          ],
        },
        { type: "separator" },
        {
          label: localesMenu.system.toggledevtools[locale],
          role: "toggleDevTools",
          accelerator: keybinding.getItem("system.toggledevtools"),
        },
        { type: "separator" },
        {
          label: localesMenu.system.services[locale],
          role: "services",
          accelerator: keybinding.getItem("system.services"),
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
          label: localesMenu.view.status[locale],
          accelerator: keybinding.getItem("view.status"),
          click: () => {},
        },
        { type: "separator" },
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
          label: "Learn More",
          click: () => shell.openExternal("https://github.com/Palmcivet/UniText"),
        },
      ],
    },
  ];
};
