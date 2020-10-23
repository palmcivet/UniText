import { app, shell } from "electron";

import { isOsx } from "@/common/env";
import { Keybinding } from "@/app/main/Keybinding";
import { localesMenu } from "@/app/i18n/menu";
import { TI18n, TMenuTemplate } from "@/typings/bootstrap";

export const top = (locale: TI18n, keybinding: Keybinding): TMenuTemplate => {
  const menu: TMenuTemplate = [];

  if (isOsx) {
    menu.push({
      label: app.name,
      submenu: [
        {
          label: localesMenu[locale].system.about,
          role: "about",
        },
        {
          label: localesMenu[locale].system.check,
          click: () => {},
        },
        { type: "separator" },
        {
          label: localesMenu[locale].system.setting,
          submenu: [
            {
              label: localesMenu[locale].system.settingGroup.preference,
              accelerator: keybinding.getItem("system.preference"),
              click: () => {},
            },
            {
              label: localesMenu[locale].system.settingGroup.keybinding,
              accelerator: keybinding.getItem("system.keybinding"),
              click: () => {},
            },
            {
              label: localesMenu[locale].system.settingGroup.snippet,
              accelerator: keybinding.getItem("system.snippet"),
              click: () => {},
            },
          ],
        },
        { type: "separator" },
        {
          label: localesMenu[locale].system.toggleDevTools,
          role: "toggleDevTools",
          accelerator: keybinding.getItem("system.toggledevtools"),
        },
        { type: "separator" },
        {
          label: localesMenu[locale].system.services,
          role: "services",
          accelerator: keybinding.getItem("system.services"),
        },
        { type: "separator" },
        {
          label: localesMenu[locale].system.close,
          role: "close",
          accelerator: keybinding.getItem("system.close"),
        },
        {
          label: localesMenu[locale].system.quit,
          role: "quit",
          accelerator: keybinding.getItem("system.quit"),
        },
      ],
    });
  }

  return [
    ...menu,
    {
      label: localesMenu[locale].title.file,
      submenu: [
        {
          label: localesMenu[locale].file.read,
          accelerator: keybinding.getItem("file.read"),
          click: () => {},
        },
        {
          label: localesMenu[locale].file.edit,
          accelerator: keybinding.getItem("file.edit"),
          click: () => {},
        },
        { type: "separator" },
        {
          label: localesMenu[locale].edit.copy,
          accelerator: keybinding.getItem("file.copy"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.cut,
          accelerator: keybinding.getItem("edit.cut"),
          click: () => {},
        },
        { type: "separator" },
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
          label: localesMenu[locale].file.save,
          accelerator: keybinding.getItem("file.save"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.delete,
          accelerator: keybinding.getItem("edit.delete"),
          click: () => {},
        },
      ],
    },
    {
      label: localesMenu[locale].title.edit,
      submenu: [
        { type: "separator" },
        {
          label: localesMenu[locale].edit.undo,
          role: "undo",
          accelerator: keybinding.getItem("edit.undo"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.redo,
          role: "redo",
          accelerator: keybinding.getItem("edit.redo"),
          click: () => {},
        },
        { type: "separator" },
        {
          label: localesMenu[locale].edit.cut,
          role: "cut",
          accelerator: keybinding.getItem("edit.cut"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.copy,
          role: "copy",
          accelerator: keybinding.getItem("edit.copy"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.paste,
          role: "paste",
          accelerator: keybinding.getItem("edit.paste"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.delete,
          role: "delete",
          accelerator: keybinding.getItem("edit.delete"),
          click: () => {},
        },
        {
          label: localesMenu[locale].edit.selectall,
          role: "selectAll",
          accelerator: keybinding.getItem("edit.selectall"),
          click: () => {},
        },
      ],
    },
    {
      label: localesMenu[locale].title.window,
      role: "windowMenu",
    },
    {
      label: localesMenu[locale].title.help,
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
