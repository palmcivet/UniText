import Store from "electron-store";

import {
  IPreferenceSystem,
  IPreferenceUserInterface,
  IPreferenceFileManager,
  IPreferenceEditor,
  IPreferenceDocument,
  IPreferenceMarkdown,
} from "@/typings/service/preference";
import {
  IThemeWindow,
  IThemeAppearance,
  IThemeEditor,
  IThemeView,
  IThemeIcon,
} from "./service/theme";

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
  userInterface: IPreferenceUserInterface;
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
 * @interface theme.json 的类型
 */
export interface ITheme {
  window: IThemeWindow;
  appearance: IThemeAppearance;
  editor: IThemeEditor;
  view: IThemeView;
  icon: IThemeIcon;
}

/**
 * @type preference 的存储结构

 * - 使用 electron-store
 */
export type TThemeSet = Store<ITheme>;

/**
 * @interface keybinding 的存储结构
 */
export type TKeybindingSet = Map<string, string>;
