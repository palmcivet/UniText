import { Menu } from "electron";

/**
 * @interface 启动软件需要携带的参数
 */
export interface IBootArgs {
  /**
   * @field 笔记文件夹的位置
   */
  notesPath: string;
  /**
   * @field 错误信息堆栈
   */
  error: Array<any>;
}

/**
 * @enum { EMenuContextKey } context menu 的访问键
 */
export enum EMenuContextKey {
  SIDEBAR_FOLDER = "SIDEBAR_FOLDER",
  SIDEBAR_FILE = "SIDEBAR_FILE",
  PANEL_TOC = "PANEL_TOC",
  WORKBENCH_TAB = "WORKBENCH_TAB",
}

/**
 * @interface menu 的存储结构
 */
export interface IMenuSet {
  SIDEBAR_FOLDER: Menu;
  SIDEBAR_FILE: Menu;
  PANEL_TOC: Menu;
  WORKBENCH_TAB: Menu;
  DOCK_BAR: Menu;
  MENU_BAR: Menu;
}

/**
 * @type 菜单模板
 */
export type TMenuTemplate = Array<
  Electron.MenuItemConstructorOptions | Electron.MenuItem
>;
