import { Menu } from "electron";
import Store from "electron-store";

import {
  IPreferenceSystem,
  IPreferenceAppearance,
  IPreferenceFileManager,
  IPreferenceEditor,
  IPreferenceDocument,
  IPreferenceMarkdown,
} from "@/typings/preference";

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
 * @interface preference.json 的类型
 */
export interface IPreference {
  system: IPreferenceSystem;
  appearance: IPreferenceAppearance;
  fileManager: IPreferenceFileManager;
  editor: IPreferenceEditor;
  document: IPreferenceDocument;
  markdown: IPreferenceMarkdown;
}

/**
 * @type preference 的存储结构

 * - 使用 electron-store
 * - 除 `IBootConfig` 字段外，都将存入 Vuex
 * - 支持即时修改
 */
export type TPreferenceSet = Store<IPreference>;

/**
 * @interface keybinding 的存储结构
 */
export type TKeybindingSet = Map<string, string>;

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
