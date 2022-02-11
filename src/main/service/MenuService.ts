import { app, Menu, MenuItem } from "electron";

import { isOsx } from "@/main/utils/env";
import Logger from "@/main/backend/Logger";
import Service, { Inject } from "@/main/service/Service";
import KeybindingService from "@/main/service/KeybindingService";
import LanguageService from "@/main/service/LanguageService";
import { TActionAccessID } from "@/shared/typings/setting";

type TMenuRole =
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

type TSerializableMenuItem =
  | {
      id: TActionAccessID;
      type?: "normal" | "submenu" | "checkbox" | "radio";
      role?: TMenuRole;
      enabled?: boolean;
      visible?: boolean;
      checked?: boolean;
      submenu?: TSerializableMenuItem[];
    }
  | {
      type: "-";
    };

type TSerializableMenuItems = Array<TSerializableMenuItem>;

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
    items: TSerializableMenuItems,
    options?: {
      x?: number;
      y?: number;
      positioningItem?: number;
    }
  ): void {
    const menu = this._createMenu(items);

    menu.popup({
      x: options ? options.x : undefined,
      y: options ? options.y : undefined,
      positioningItem: options ? options.positioningItem : undefined,
      callback: () => {},
    });
  }

  private _createMenu(items: TSerializableMenuItems): Menu {
    const menu = new Menu();

    items.forEach((item) => {
      let menuItem: MenuItem;

      if (item.type === "-") {
        // Separator
        menuItem = new MenuItem({
          type: "separator",
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
          accelerator: this._keybindingService.getKeybinding(item.id as TActionAccessID),
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
        id: "app.system.label",
        role: "appMenu",
        submenu: [
          { id: "app.system.aboutApp", role: "about" },
          { id: "app.system.checkForUpdates" },
          { type: "-" },
          { id: "view.workbench.setting" },
          { id: "view.workbench.dashboard" },
          { id: "view.workbench.graphview" },
          { id: "view.workbench.schedule" },
          { id: "view.workbench.reminder" },
          { type: "-" },
          { id: "app.system.services", role: "services" },
          { type: "-" },
          { id: "app.system.hideWindow", role: "hide" },
          { id: "app.system.hideOthers", role: "hideOthers" },
          { type: "-" },
          { id: "app.system.quitApp", role: "quit" },
        ],
      });
    }

    /* File */
    appMenu.push({
      id: "app.file.label",
      submenu: [
        { id: "app.file.openCabin" },
        { id: "app.file.closeCabin" },
        { type: "-" },
        { id: "app.file.addBookmark" },
        { id: "app.file.deleteBookmark" },
        { type: "-" },
        { id: "app.file.newFile" },
        { id: "app.file.newFolder" },
        { type: "-" },
        { id: "app.file.readFile" },
        { id: "app.file.editFile" },
        { id: "app.file.renameFile" },
        { type: "-" },
        { id: "app.file.saveFile" },
        { id: "app.file.saveFileAs" },
        { type: "-" },
        { id: "app.file.revealFile" },
        { id: "app.file.exportFile" },
        { id: "app.file.transmitCabin" },
      ],
    });

    /* Edit */
    appMenu.push({
      id: "app.edit.label",
      submenu: [
        { id: "app.edit.undo", role: "undo" },
        { id: "app.edit.redo", role: "redo" },
        { type: "-" },
        { id: "app.edit.cut", role: "cut" },
        { id: "app.edit.copy", role: "copy" },
        { id: "app.edit.paste", role: "paste" },
        { id: "app.edit.delete", role: "delete" },
        { id: "app.edit.selectAll", role: "selectAll" },
        { type: "-" },
        { id: "app.edit.find" },
        { id: "app.edit.replace" },
      ],
    });

    /* View */
    appMenu.push({
      id: "app.view.label",
      submenu: [
        { id: "app.view.fullScreen" },
        { id: "app.view.showStatusbar" },
        { id: "app.view.showBrowser" },
        { id: "app.view.showPanel" },
        { id: "app.view.togglePalette" },
        { type: "-" },
        { id: "app.view.togglePreview" },
        { id: "app.view.toggleSource" },
        { type: "-" },
        { id: "app.view.autoWrap" },
        { id: "app.view.showMinimap" },
        { id: "app.view.showSpaces" },
      ],
    });

    /* Format */
    appMenu.push({
      id: "app.format.label",
      submenu: [
        { id: "app.format.setHeadUp" },
        { id: "app.format.setHeadDown" },
        { type: "-" },
        { id: "app.format.insertOrderedList" },
        { id: "app.format.insertUnorderedList" },
        { type: "-" },
        { id: "app.format.insertSup" },
        { id: "app.format.insertSub" },
        { type: "-" },
        { id: "app.format.insertImage" },
        { id: "app.format.insertLink" },
        { id: "app.format.insertTOC" },
        { type: "-" },
        { id: "app.format.toggleBold" },
        { id: "app.format.toggleItalic" },
        { id: "app.format.toggleMark" },
        { id: "app.format.toggleStrikethrough" },
      ],
    });

    /* Window */
    appMenu.push({
      id: "app.window.label",
      role: "windowMenu",
    });

    /* Help */
    appMenu.push({
      id: "app.help.label",
      submenu: [
        { id: "app.help.moreInfo" },
        { id: "app.help.reportBugs" },
        { id: "app.help.toggleDevTools", role: "toggleDevTools" },
      ],
    });

    const menu = this._createMenu(appMenu);
    Menu.setApplicationMenu(menu);
  }

  private _setDockMenu(): void {
    if (isOsx) {
      const menu = this._createMenu([{ id: "dock.newWindow" }, { id: "dock.newNote" }, { id: "dock.newAgenda" }]);
      app.dock.setMenu(menu);
    }
  }

  private _setTrayMenu(): void {}
}
