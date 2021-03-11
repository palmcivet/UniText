import { app, ipcMain, Menu } from "electron";

import { isOsx } from "@/common/env";
import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import Keybinding from "@/common/userData/Keybinding";
import { folder } from "@/main/templates/contextFolder";
import { file } from "@/main/templates/contextFile";
import { toc } from "@/main/templates/contextToc";
import { tab } from "@/main/templates/contextTab";
import { dock } from "@/main/templates/menuDock";
import { top } from "@/main/templates/menuTop";
import { Bus } from "@/renderer/plugins/VueBus";
import { EI18n } from "@/typings/schema/preference";
import { EMenuContextKey, IMenuSet } from "@/typings/main";

export default class MenuManager {
  private _dataSet!: IMenuSet;

  constructor() {
    this._listenForIpcMain();
  }

  private _buildMenuSet(lang: EI18n, key: Keybinding) {
    this._dataSet = {
      SIDEBAR_FOLDER: Menu.buildFromTemplate(folder(lang, key)),
      SIDEBAR_FILE: Menu.buildFromTemplate(file(lang, key)),
      PANEL_TOC: Menu.buildFromTemplate(toc(lang, key)),
      TAB_BAR: Menu.buildFromTemplate(tab(lang, key)),
      DOCK: Menu.buildFromTemplate(dock(lang, key)),
      MENU: Menu.buildFromTemplate(top(lang, key)),
    };
  }

  updateMenu(lang: EI18n, key: Keybinding) {
    this._buildMenuSet(lang, key);
    Menu.setApplicationMenu(this._dataSet.MENU);
    if (isOsx) app.dock.setMenu(this._dataSet.DOCK);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_MENUMANAGER.POPUP_CONTEXT, (e, key: EMenuContextKey, value: any) => {
      Bus.value = value;
      this._dataSet[key].popup();
    });
  }
}
