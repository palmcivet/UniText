import { shell, BrowserWindow, Menu, app } from "electron";
import { localesMenuTop } from "@/app/i18n/menuTop";

export const getTopMenu = (win: BrowserWindow, locale: string) => {
  const menuLabels = localesMenuTop[locale];

  return Menu.buildFromTemplate([
    {
      label: app.getName(),
      submenu: [
        { label: menuLabels.about, role: "about" },
        { label: menuLabels.check },
        { type: "separator" },
        {
          label: menuLabels.preference,
          submenu: [
            { label: menuLabels.setting },
            { label: menuLabels.keybinding },
            { label: menuLabels.snippet },
          ],
        },
        { type: "separator" },
        { label: menuLabels.toggledevtools, role: "toggleDevTools" },
        { type: "separator" },
        { label: menuLabels.services, role: "services" },
        { type: "separator" },
        { label: menuLabels.close, role: "close" },
        { label: menuLabels.quit, role: "quit" },
      ],
    },
    {
      label: menuLabels.file,
      submenu: [
        {
          label: menuLabels.save,
          click: () => win.webContents.send("click-menu-save"),
          accelerator: "CmdOrCtrl+S",
        },
      ],
    },
    {
      label: menuLabels.edit,
      submenu: [
        { type: "separator" },
        { label: menuLabels.undo, role: "undo" },
        { label: menuLabels.redo, role: "redo" },
        { type: "separator" },
        { label: menuLabels.cut, role: "cut" },
        { label: menuLabels.copy, role: "copy" },
        { label: menuLabels.paste, role: "paste" },
        { label: menuLabels.delete, role: "delete" },
        { label: menuLabels.selectall, role: "selectAll" },
      ],
    },
    {
      label: menuLabels.window,
      role: "windowMenu",
    },
    {
      label: menuLabels.help,
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click() {
            shell.openExternal("https://github.com/Palmcivet/UniText");
          },
        },
      ],
    },
  ]);
};
