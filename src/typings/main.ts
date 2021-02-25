import { Menu } from "electron";

import { EI18n } from "@/typings/schema/preference";

/**
 * @interface 启动软件需要携带的参数
 */
export interface IBootArgs {
  /**
   * @field 笔记文件夹的位置
   */
  notesPath: string;
  /**
   * @field 是否默认启动
   */
  isFallBack: boolean;
}

/**
 * @interface 初始化窗口需要传递的参数
 */
export interface IWindowArgs {
  /**
   * @field 窗口 ID
   */
  wid: number;
  /**
   * @field 语言
   */
  lang: EI18n;
  /**
   * @field 打开的窗口类型
   */
  type: EWindowType;
  /**
   * @field 项目文件夹路径
   */
  proj: string;
  /**
   * @field 设置文件夹路径
   */
  conf: string;
}

/**
 * @enum { EWindowType } 打开的窗口类型
 */
export enum EWindowType {
  NORMAL,
  VIEW,
  SETTING,
}

/**
 * @enum { EMenuContextKey } context menu 的访问键
 */
export enum EMenuContextKey {
  SIDEBAR_FOLDER = "SIDEBAR_FOLDER",
  SIDEBAR_FILE = "SIDEBAR_FILE",
  PANEL_TOC = "PANEL_TOC",
  TAB_BAR = "TAB_BAR",
}

/**
 * @interface menu 的存储结构
 */
export interface IMenuSet {
  SIDEBAR_FOLDER: Menu;
  SIDEBAR_FILE: Menu;
  PANEL_TOC: Menu;
  TAB_BAR: Menu;
  DOCK: Menu;
  MENU: Menu;
}

/**
 * @type 菜单模板
 */
export type TMenuTemplate = Array<
  Electron.MenuItemConstructorOptions | Electron.MenuItem
>;
