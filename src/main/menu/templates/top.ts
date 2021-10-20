import { app, shell, BrowserWindow, MenuItemConstructorOptions } from "electron";

import { IPC_FILE, IPC_OTHER } from "@/shared/channel/ipc";
import Keybinding from "@/main/service/KeybindingService";
import { lang } from "@/main/backend/Locale";

type F = (keybinding: Keybinding) => MenuItemConstructorOptions;

export const Unitext: F = (keybinding) => ({
  label: app.name,
  submenu: [
    {
      label: lang("system.about-unitext"),
      role: "about",
      // TODO 添加信息
    },
    {
      label: lang("system.check-for-updates"),
      accelerator: keybinding.get("system.check-for-updates"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_OTHER.CHECK_UPDATE);
      },
    },

    { type: "separator" },

    {
      label: lang("system.setting"),
      submenu: [
        {
          label: lang("system.setting.system"),
          accelerator: keybinding.get("system.setting.system"),
          click: (menu, win) => {},
        },
        {
          label: lang("system.setting.preference"),
          accelerator: keybinding.get("system.setting.preference"),
          click: (menu, win) => {},
        },
        {
          label: lang("system.setting.keybinding"),
          accelerator: keybinding.get("system.setting.keybinding"),
          click: (menu, win) => {},
        },
        {
          label: lang("system.setting.markdown"),
          accelerator: keybinding.get("system.setting.markdown"),
          click: (menu, win) => {},
        },
        {
          label: lang("system.setting.snippet"),
          accelerator: keybinding.get("system.setting.snippet"),
          click: (menu, win) => {},
        },
      ],
    },

    {
      label: lang("system.theme"),
      submenu: [
        {
          label: lang("system.theme.appearance"),
          accelerator: keybinding.get("system.theme.appearance"),
          click: () => {},
        },
        {
          label: lang("system.theme.editor"),
          accelerator: keybinding.get("system.theme.editor"),
          click: () => {},
        },
        {
          label: lang("system.theme.view"),
          accelerator: keybinding.get("system.theme.view"),
          click: () => {},
        },
        {
          label: lang("system.theme.icon"),
          accelerator: keybinding.get("system.theme.icon"),
          click: () => {},
        },
      ],
    },

    { type: "separator" },

    {
      label: lang("system.services"),
      role: "services",
      accelerator: keybinding.get("system.services"),
    },
    { type: "separator" },
    {
      label: lang("system.hide"),
      role: "hide",
    },
    {
      label: lang("system.hide-others"),
      role: "hideOthers",
    },
    { type: "separator" },
    {
      label: lang("system.quit"),
      role: "quit",
      accelerator: keybinding.get("system.quit"),
    },
  ],
});

export const FileGroup: F = (keybinding) => ({
  label: lang("file.label"),
  submenu: [
    {
      label: lang("file.open-project"),
      accelerator: keybinding.get("file.open-project"),
      click: () => {},
    },
    {
      label: lang("file.close-project"),
      accelerator: keybinding.get("file.close-project"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("file.add-mark"),
      accelerator: keybinding.get("file.add-mark"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.MARK_ADD);
      },
    },
    {
      label: lang("file.del-mark"),
      accelerator: keybinding.get("file.del-mark"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.MARK_DEL);
      },
    },
    { type: "separator" },
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
      label: lang("file.read-file"),
      accelerator: keybinding.get("file.read-file"),
      click: () => {},
    },
    {
      label: lang("file.edit-file"),
      accelerator: keybinding.get("file.edit-file"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("file.save"),
      accelerator: keybinding.get("file.save"),
      click: (menu, win) => {
        (win as BrowserWindow).webContents.send(IPC_FILE.SAVE);
      },
    },
    {
      label: lang("file.save-as"),
      accelerator: keybinding.get("file.save-as"),
      click: (menu, win) => {},
    },
    { type: "separator" },
    {
      label: lang("file.reveal"),
      accelerator: keybinding.get("file.reveal"),
      click: (menu, win) => {},
    },
    {
      label: lang("file.export"),
      accelerator: keybinding.get("file.export"),
      click: (menu, win) => {},
    },
    {
      label: lang("file.transmit"),
      accelerator: keybinding.get("file.transmit"),
      click: (menu, win) => {},
    },
  ],
});

export const EditGroup: F = (keybinding) => ({
  label: lang("edit.label"),
  submenu: [
    {
      label: lang("edit.undo"),
      role: "undo",
      accelerator: keybinding.get("edit.undo"),
      click: () => {},
    },
    {
      label: lang("edit.redo"),
      role: "redo",
      accelerator: keybinding.get("edit.redo"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("edit.cut"),
      role: "cut",
      accelerator: keybinding.get("edit.cut"),
      click: () => {},
    },
    {
      label: lang("edit.copy"),
      role: "copy",
      accelerator: keybinding.get("edit.copy"),
      click: () => {},
    },
    {
      label: lang("edit.paste"),
      role: "paste",
      accelerator: keybinding.get("edit.paste"),
      click: () => {},
    },
    {
      label: lang("edit.delete"),
      role: "delete",
      accelerator: keybinding.get("edit.delete"),
      click: () => {},
    },
    {
      label: lang("edit.select-all"),
      role: "selectAll",
      accelerator: keybinding.get("edit.select-all"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("edit.find"),
      role: "selectAll",
      accelerator: keybinding.get("edit.find"),
      click: () => {},
    },
    {
      label: lang("edit.find-next"),
      role: "selectAll",
      accelerator: keybinding.get("edit.find-next"),
      click: () => {},
    },
    {
      label: lang("edit.find-previous"),
      role: "selectAll",
      accelerator: keybinding.get("edit.find-previous"),
      click: () => {},
    },
    {
      label: lang("edit.replace"),
      role: "selectAll",
      accelerator: keybinding.get("edit.replace"),
      click: () => {},
    },
  ],
});

export const ViewGroup: F = (keybinding) => ({
  label: lang("view.label"),
  submenu: [
    {
      label: lang("view.statusbar"),
      accelerator: keybinding.get("view.statusbar"),
      click: () => {},
    },
    {
      label: lang("view.sidebar"),
      accelerator: keybinding.get("view.sidebar"),
      click: () => {},
    },
    {
      label: lang("view.sidepanel"),
      accelerator: keybinding.get("view.sidepanel"),
      click: () => {},
    },
    {
      label: lang("view.command-palette"),
      accelerator: keybinding.get("view.command-palette"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("view.preview"),
      accelerator: keybinding.get("view.preview"),
      click: () => {},
    },
    {
      label: lang("view.source"),
      accelerator: keybinding.get("view.source"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("view.auto-wrap"),
      accelerator: keybinding.get("view.auto-wrap"),
      click: () => {},
    },
    {
      label: lang("view.show-minimap"),
      accelerator: keybinding.get("view.show-minimap"),
      click: () => {},
    },
    {
      label: lang("view.show-space"),
      accelerator: keybinding.get("view.show-space"),
      click: () => {},
    },
  ],
});

export const FormatGroup: F = (keybinding) => ({
  label: lang("format.label"),
  submenu: [
    {
      label: lang("format.head-up"),
      accelerator: keybinding.get("format.head-up"),
      click: () => {},
    },
    {
      label: lang("format.head-down"),
      accelerator: keybinding.get("format.head-down"),
      click: () => {},
    },
    {
      label: lang("format.order-list"),
      accelerator: keybinding.get("format.order-list"),
      click: () => {},
    },
    {
      label: lang("format.unorder-list"),
      accelerator: keybinding.get("format.unorder-list"),
      click: () => {},
    },
    { type: "separator" },
    {
      label: lang("format.bold"),
      accelerator: keybinding.get("format.bold"),
      click: () => {},
    },
    {
      label: lang("format.italic"),
      accelerator: keybinding.get("format.italic"),
      click: () => {},
    },
    {
      label: lang("format.sup"),
      accelerator: keybinding.get("format.sup"),
      click: () => {},
    },
    {
      label: lang("format.sub"),
      accelerator: keybinding.get("format.sub"),
      click: () => {},
    },
    {
      label: lang("format.mark"),
      accelerator: keybinding.get("format.mark"),
      click: () => {},
    },
    {
      label: lang("format.delete"),
      accelerator: keybinding.get("format.delete"),
      click: () => {},
    },
    {
      label: lang("format.img"),
      accelerator: keybinding.get("format.img"),
      click: () => {},
    },
  ],
});

export const WindowGroup: F = (keybinding) => ({
  label: lang("window.label"),
  role: "windowMenu",
});

export const HelpGroup: F = (keybinding) => ({
  label: lang("help.label"),
  role: "help",
  submenu: [
    {
      label: lang("help.learn-more"),
      click: () => shell.openExternal("https://github.com/palmcivet/UniText"),
    },
    {
      label: lang("help.report"),
      click: () => shell.openExternal("https://github.com/palmcivet/UniText/issues"),
    },
    {
      label: lang("help.toggle-devtools"),
      role: "toggleDevTools",
      accelerator: keybinding.get("help.toggle-devtools"),
    },
  ],
});

export default (keybinding: Keybinding): TMenuTemplate => {
  return [
    Unitext(keybinding),
    FileGroup(keybinding),
    EditGroup(keybinding),
    ViewGroup(keybinding),
    FormatGroup(keybinding),
    WindowGroup(keybinding),
    HelpGroup(keybinding),
  ];
};
