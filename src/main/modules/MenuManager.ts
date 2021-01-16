import { app, ipcMain, Menu } from "electron";

import { folder } from "../templates/contextFolder";
import { file } from "../templates/contextFile";
import { toc } from "../templates/contextToc";
import { tab } from "../templates/contextTab";
import { dock } from "../templates/menuDock";
import { top } from "../templates/menuTop";
import { Keybinding } from "./Keybinding";
import { EMenuContextKey, IMenuSet, TI18n } from "@/typings/bootstrap";
import { IPC_MENUMANAGER } from "@/common/channel";

export class MenuManager {
  private _menuSet!: IMenuSet;

  constructor() {
    this._listenForIpcMain();
  }

  buildMenuSet(lang: TI18n, key: Keybinding) {
    this._menuSet = {
      SIDEBAR_FOLDER: Menu.buildFromTemplate(folder(lang, key)),
      SIDEBAR_FILE: Menu.buildFromTemplate(file(lang, key)),
      PANEL_TOC: Menu.buildFromTemplate(toc(lang, key)),
      WORKBENCH_TAB: Menu.buildFromTemplate(tab(lang, key)),
      DOCK_BAR: Menu.buildFromTemplate(dock(lang, key)),
      MENU_BAR: Menu.buildFromTemplate(top(lang, key)),
    };
  }

  updateMenu(lang: TI18n, key: Keybinding) {
    this.buildMenuSet(lang, key);
    Menu.setApplicationMenu(this._menuSet.MENU_BAR);
    app.dock.setMenu(this._menuSet.DOCK_BAR);
  }

  getContextMenu(key: keyof IMenuSet) {
    return this._menuSet[key];
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_MENUMANAGER.POPUP_CONTEXT, (event, key: EMenuContextKey) => {
      this._menuSet[key].popup();
    });
  }
}
