import { BrowserWindow, Menu } from "electron";
import { localesMenuDock } from "@/app/i18n/menuDock";

export const getDockMenu = (win: BrowserWindow, locale: string) => {
  const menuLabels = localesMenuDock[locale];
  return Menu.buildFromTemplate([
    { label: menuLabels.newWindow },
    { label: menuLabels.newNote },
    { label: menuLabels.newAgenda },
  ]);
};
