import { Menu } from "electron";
import Store from "electron-store";

import { IGeneralStateAppearance, IGeneralStateEditor } from "./vuex/general";
import { ISideBarStateFiles } from "./vuex/sideBar";

/**
 * @enum 窗口的打开方式
 */
export enum EWindow {
  NEW,
  VIEW,
  NORMAL,
}

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
 * @interface preference 文件中的 `system` 字段。用于启动时设置
 */
export interface IBootConfig {
  /**
   * @field 显示托盘
   */
  showTray: boolean;
  /**
   * @field 最后一个窗口关闭时退出
   */
  exitWhenClosed: boolean;
  /**
   * @field 记录最近打开
   */
  saveRecent: boolean;
  /**
   * @field 自动打开上一次的文件
   */
  autoOpen: boolean;
  /**
   * @field 自动更新
   */
  autoUpdate: boolean;
  /**
   * @field 显示语言
   */
  language: TI18n;
  /**
   * @file 启动后呈现的内容
   */
  startup: EStartupType;
}

/**
 * @interface preference 文件，除 `IBootConfig` 字段外，都是支持即时修改的 State
 */
interface IPreference {
  system: IBootConfig;
  appearance: IGeneralStateAppearance;
  files: ISideBarStateFiles;
  editor: IGeneralStateEditor;
  markdown: {};
}

/**
 * @type preference 的存储结构，使用 electron-store
 */
export type TPreferenceSet = Store<IPreference>;

/**
 * @interface keybinding 的存储结构
 */
export type IKeybindingSet = Map<string, string>;

/**
 * @enum context menu 的访问键
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

/**
 * @enum i18n 类型
 */
export enum EI18n {
  ZH_CN,
  EN_US,
}

/**
 * @type i18n 字符串，出现于文件中，以易于读写
 */
export type TI18n = "ZH_CN" | "EN_US";

/**
 * @enum 启动后呈现的内容
 */
export enum EStartupType {
  BLANK = "BLANK",
  CREATE = "CREATE",
  SCHEDULE = "SCHEDULE",
}
