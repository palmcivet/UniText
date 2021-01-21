import { app, ipcMain, Menu } from "electron";

import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import { folder } from "@/main/templates/contextFolder";
import { file } from "@/main/templates/contextFile";
import { toc } from "@/main/templates/contextToc";
import { tab } from "@/main/templates/contextTab";
import { dock } from "@/main/templates/menuDock";
import { top } from "@/main/templates/menuTop";
import { Bus } from "@/renderer/plugins/VueBus";
import { Keybinding } from "./Keybinding";
import { EMenuContextKey, IMenuSet, EI18n } from "@/typings/bootstrap";

export class MenuManager {
  private _menuSet!: IMenuSet;

  constructor() {
    this._listenForIpcMain();
  }

  private _buildMenuSet(lang: EI18n, key: Keybinding) {
    this._menuSet = {
      SIDEBAR_FOLDER: Menu.buildFromTemplate(folder(lang, key)),
      SIDEBAR_FILE: Menu.buildFromTemplate(file(lang, key)),
      PANEL_TOC: Menu.buildFromTemplate(toc(lang, key)),
      WORKBENCH_TAB: Menu.buildFromTemplate(tab(lang, key)),
      DOCK_BAR: Menu.buildFromTemplate(dock(lang, key)),
      MENU_BAR: Menu.buildFromTemplate(top(lang, key)),
    };
  }

  updateMenu(lang: EI18n, key: Keybinding) {
    this._buildMenuSet(lang, key);
    Menu.setApplicationMenu(this._menuSet.MENU_BAR);
    app.dock.setMenu(this._menuSet.DOCK_BAR);
  }

  getContextMenu(key: keyof IMenuSet) {
    return this._menuSet[key];
  }

  private _listenForIpcMain() {
    ipcMain.on(
      IPC_MENUMANAGER.POPUP_CONTEXT,
      (event, key: EMenuContextKey, value: any) => {
        Bus.value = value;
        this._menuSet[key].popup();
      }
    );
  }
}
