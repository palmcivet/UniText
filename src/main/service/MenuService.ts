import { app, BrowserWindow, IpcMainEvent, Menu, MenuItem } from "electron";

import { isOsx } from "@/main/utils/env";
import KeybindingService from "./KeybindingService";
import LanguageService from "./LanguageService";
import Service, { Inject } from "./Service";
import Logger from "../backend/Logger";

type TSerializableMenuItem = {
  id: string;
  type?: "normal" | "separator" | "submenu" | "checkbox" | "radio";
  role?:
    | "undo"
    | "redo"
    | "cut"
    | "copy"
    | "paste"
    | "pasteAndMatchStyle"
    | "delete"
    | "selectAll"
    | "reload"
    | "forceReload"
    | "toggleDevTools"
    | "resetZoom"
    | "zoomIn"
    | "zoomOut"
    | "toggleSpellChecker"
    | "togglefullscreen"
    | "window"
    | "minimize"
    | "close"
    | "help"
    | "about"
    | "services"
    | "hide"
    | "hideOthers"
    | "unhide"
    | "quit"
    | "startSpeaking"
    | "stopSpeaking"
    | "zoom"
    | "front"
    | "appMenu"
    | "fileMenu"
    | "editMenu"
    | "viewMenu"
    | "shareMenu"
    | "recentDocuments"
    | "toggleTabBar"
    | "selectNextTab"
    | "selectPreviousTab"
    | "mergeAllWindows"
    | "clearRecentDocuments"
    | "moveTabToNewWindow"
    | "windowMenu";
  enabled?: boolean;
  visible?: boolean;
  checked?: boolean;
  submenu?: TSerializableMenuItem[];
};

type TSerializableMenuItems = Array<TSerializableMenuItem>;

const counter = (() => {
  let id = 0;
  return () => (id += 1).toString();
})();

export default class MenuService extends Service {
  @Inject("KeybindingService")
  private readonly _keybindingService!: KeybindingService;

  @Inject("LanguageService")
  private readonly _languageservice!: LanguageService;

  constructor(logger: Logger) {
    super(logger);
  }

  public bootstrap(): void {
    this._setAppMenu();
    this._setDockMenu();
    this._setTrayMenu();
  }

  public popupContextMenu(
    event: IpcMainEvent,
    contextMenuId: number,
    items: TSerializableMenuItems,
    options?: {
      x?: number;
      y?: number;
      positioningItem?: number;
    }
  ): void {
    const menu = this._createMenu(items);

    menu.popup({
      window: BrowserWindow.fromWebContents(event.sender)!,
      x: options ? options.x : undefined,
      y: options ? options.y : undefined,
      positioningItem: options ? options.positioningItem : undefined,
      callback: () => {
        event.sender.send("menu-close", contextMenuId);
      },
    });
  }

  private _createMenu(items: TSerializableMenuItems): Menu {
    const menu = new Menu();

    items.forEach((item) => {
      let menuItem: MenuItem;

      if (item.type === "separator") {
        // Separator
        menuItem = new MenuItem({
          type: item.type,
        });
      } else if (Array.isArray(item.submenu)) {
        // Sub Menu
        menuItem = new MenuItem({
          submenu: this._createMenu(item.submenu),
          label: this._languageservice.translate(item.id),
        });
      } else {
        // Normal Menu Item
        menuItem = new MenuItem({
          label: this._languageservice.translate(item.id),
          type: item.type,
          role: item.role,
          accelerator: this._keybindingService.getKeybinding(item.id as any),
          checked: item.checked,
          enabled: item.enabled,
          visible: item.visible,
          click: (menu, win, event) => win?.webContents.send(item.id),
        });
      }

      menu.append(menuItem);
    });

    return menu;
  }

  private _setAppMenu(): void {
    const appMenu: TSerializableMenuItems = [];

    if (isOsx) {
      /* UniText */
      appMenu.push({
        id: "unitext.label",
        role: "appMenu",
        submenu: [
          { id: "system.about-unitext", role: "about" },
          { id: "system.check-for-updates" },
          { id: counter(), type: "separator" },
          {
            id: "system.setting",
            submenu: [
              { id: "system.setting.system" },
              { id: "system.setting.preference" },
              { id: "system.setting.keybinding" },
              { id: "system.setting.markdown" },
              { id: "system.setting.snippet" },
            ],
          },
          {
            id: "system.theme",
            submenu: [
              { id: "system.theme.appearance" },
              { id: "system.theme.editor" },
              { id: "system.theme.view" },
              { id: "system.theme.icon" },
            ],
          },
          { id: counter(), type: "separator" },
          { id: "system.services", role: "services" },
          { id: counter(), type: "separator" },
          { id: "system.hide", role: "hide" },
          { id: "system.hide-others", role: "hideOthers" },
          { id: counter(), type: "separator" },
          { id: "system.quit", role: "quit" },
        ],
      });
    }

    /* File */
    appMenu.push({
      id: "file.label",
      submenu: [
        { id: "file.open-project" },
        { id: "file.close-project" },
        { id: counter(), type: "separator" },
        { id: "file.add-mark" },
        { id: "file.del-mark" },
        { id: counter(), type: "separator" },
        { id: "file.new-file" },
        { id: "file.new-folder" },
        { id: counter(), type: "separator" },
        { id: "file.read-file" },
        { id: "file.edit-file" },
        { id: counter(), type: "separator" },
        { id: "file.save" },
        { id: "file.save-as" },
        { id: counter(), type: "separator" },
        { id: "file.reveal" },
        { id: "file.export" },
        { id: "file.transmit" },
      ],
    });

    /* Edit */
    appMenu.push({
      id: "edit.label",
      submenu: [
        { id: "edit.undo", role: "undo" },
        { id: "edit.redo", role: "redo" },
        { id: counter(), type: "separator" },
        { id: "edit.cut", role: "cut" },
        { id: "edit.copy", role: "copy" },
        { id: "edit.paste", role: "paste" },
        { id: "edit.delete", role: "delete" },
        { id: "edit.select-all", role: "selectAll" },
        { id: counter(), type: "separator" },
        { id: "edit.find", role: "selectAll" },
        { id: "edit.find-next", role: "selectAll" },
        { id: "edit.find-previous", role: "selectAll" },
        { id: "edit.replace", role: "selectAll" },
      ],
    });

    /* View */
    appMenu.push({
      id: "view.label",
      submenu: [
        { id: "view.statusbar" },
        { id: "view.sidebar" },
        { id: "view.sidepanel" },
        { id: "view.command-palette" },
        { id: counter(), type: "separator" },
        { id: "view.preview" },
        { id: "view.source" },
        { id: counter(), type: "separator" },
        { id: "view.auto-wrap" },
        { id: "view.show-minimap" },
        { id: "view.show-space" },
      ],
    });

    /* Format */
    appMenu.push({
      id: "format.label",
      submenu: [
        { id: "format.head-up" },
        { id: "format.head-down" },
        { id: "format.order-list" },
        { id: "format.unorder-list" },
        { id: counter(), type: "separator" },
        { id: "format.bold" },
        { id: "format.italic" },
        { id: "format.sup" },
        { id: "format.sub" },
        { id: "format.mark" },
        { id: "format.delete" },
        { id: "format.img" },
      ],
    });

    /* Window */
    appMenu.push({
      id: "window.label",
      role: "windowMenu",
    });

    /* Help */
    appMenu.push({
      id: "help.label",
      submenu: [
        { id: "help.learn-more" },
        { id: "help.report" },
        { id: "help.toggle-devtools", role: "toggleDevTools" },
      ],
    });

    const menu = this._createMenu(appMenu);
    Menu.setApplicationMenu(menu);
  }

  private _setDockMenu(): void {
    if (isOsx) {
      const menu = this._createMenu([{ id: "dock.new-window" }, { id: "dock.new-note" }, { id: "dock.new-agenda" }]);
      app.dock.setMenu(menu);
    }
  }

  private _setTrayMenu(): void {}
}
