import { app, Menu } from "electron";

import dock from "@/main/menu/templates/dock";
import top from "@/main/menu/templates/top";
import { toc, tab, file, folder } from "@/main/menu/templates/context";
import { isOsx } from "@/main/utils/env";
import { EI18n } from "@/shared/typings/setting/preference";
import KeybindingService from "./KeybindingService";
import Service, { Inject } from "./Service";

export enum EMenuContextKey {
  SIDEBAR_FOLDER = "SIDEBAR_FOLDER",
  SIDEBAR_FILE = "SIDEBAR_FILE",
  PANEL_TOC = "PANEL_TOC",
  TAB_BAR = "TAB_BAR",
}

export default class MenuService extends Service {
  @Inject("KeybindingService")
  private readonly _keybindingService!: KeybindingService;

  private _topBarMenu: any;

  private _dockBarMenu: any;

  private _contextMenu: any;

  private _trayMenu: any;

  bootstrap(lang: EI18n) {
    const { _keybindingService: keybinding } = this;

    this._contextMenu = {
      SIDEBAR_FOLDER: Menu.buildFromTemplate(folder(keybinding)),
      SIDEBAR_FILE: Menu.buildFromTemplate(file(keybinding)),
      PANEL_TOC: Menu.buildFromTemplate(toc(keybinding)),
      TAB_BAR: Menu.buildFromTemplate(tab(keybinding)),
    };

    this._dockBarMenu = Menu.buildFromTemplate(dock(keybinding));
    this._topBarMenu = Menu.buildFromTemplate(top(keybinding));

    Menu.setApplicationMenu(this._topBarMenu);

    if (isOsx) {
      app.dock.setMenu(this._dockBarMenu);
    }
  }

  useMenu() {}

  popContext(key: EMenuContextKey, value: any) {
    this._contextMenu[key].popup();
    Bus.value = value;
  }
}
