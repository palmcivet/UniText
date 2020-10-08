import { BrowserWindow, Menu, remote } from "electron";
import { localesMenuContext } from "@/app/i18n/menuContext";

type TOption = Array<Electron.MenuItemConstructorOptions | Electron.MenuItem>;

export type TContext = {
  file: Menu;
  folder: Menu;
  toc: Menu;
  tab: Menu;
};

export const getContextMenu = (win: BrowserWindow, locale: string) => {
  const menuLabels = localesMenuContext[locale];

  const file: TOption = [
    { label: menuLabels.read },
    { label: menuLabels.edit },
    { type: "separator" },
    { label: menuLabels.copy },
    { label: menuLabels.cut },
    { type: "separator" },
    { label: menuLabels.rename },
    { label: menuLabels.reicon },
    { type: "separator" },
    { label: menuLabels.reveal },
    { type: "separator" },
    { label: menuLabels.delete },
  ];
  const folder: TOption = [
    { label: menuLabels.newFile },
    { label: menuLabels.newFolder },
    { type: "separator" },
    { label: menuLabels.copy },
    { label: menuLabels.cut },
    { label: menuLabels.paste },
    { type: "separator" },
    { label: menuLabels.rename },
    { label: menuLabels.reicon },
    { type: "separator" },
    { label: menuLabels.reveal },
    { type: "separator" },
    { label: menuLabels.delete },
  ];
  const toc: TOption = [
    { label: menuLabels.titleUp },
    { label: menuLabels.titleDown },
    { type: "separator" },
    { label: menuLabels.retitle },
  ];
  const tab: TOption = [
    { label: menuLabels.closeCur },
    { label: menuLabels.closeSave },
    { label: menuLabels.closeAll },
    { type: "separator" },
    { label: menuLabels.pin },
    { type: "separator" },
    { label: menuLabels.preview },
  ];

  return {
    file: remote.Menu.buildFromTemplate(file),
    folder: remote.Menu.buildFromTemplate(folder),
    toc: remote.Menu.buildFromTemplate(toc),
    tab: remote.Menu.buildFromTemplate(tab),
  };
};
