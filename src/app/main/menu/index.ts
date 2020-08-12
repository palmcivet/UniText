import { shell, BrowserWindow, Menu } from "electron";
import { localesMenu } from "@/app/config/locales-menu";

export const generateMenu = (win: BrowserWindow, locale: string) => {
  const menuLabels = localesMenu[locale] || localesMenu["zh-CN"];

  const template: any = [
    {
      label: menuLabels.edit,
      submenu: [
        {
          label: menuLabels.save,
          accelerator: "CmdOrCtrl+S",
          click: () => {
            win.webContents.send("click-menu-save");
          },
        },
        { type: "separator" },
        { role: "undo", label: menuLabels.undo },
        { role: "redo", label: menuLabels.redo },
        { type: "separator" },
        { role: "cut", label: menuLabels.cut },
        { role: "copy", label: menuLabels.copy },
        { role: "paste", label: menuLabels.paste },
        { role: "delete", label: menuLabels.delete },
        { role: "selectall", label: menuLabels.selectall },
        { role: "toggledevtools", label: menuLabels.toggledevtools },
        { type: "separator" },
        { role: "close", label: menuLabels.close },
        { role: "quit", label: menuLabels.quit },
      ],
    },
    {
      role: "windowMenu",
    },
    {
      role: menuLabels.help,
      submenu: [
        {
          label: "Learn More",
          click() {
            shell.openExternal("https://github.com/Palmcviet/UniText");
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
};
