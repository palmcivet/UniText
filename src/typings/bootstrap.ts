import Store from "electron-store";

import { IGeneralStateAppearance, IGeneralStateEditor } from "./modules/general";
import { ISideBarStateFiles } from "./modules/sideBar";

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
  locale: string; // TODO 完善语言的接口
}

/**
 * @interface preference 文件
 */
export interface IPreference {
  system: IBootConfig;
  appearance: IGeneralStateAppearance;
  files: ISideBarStateFiles;
  editor: IGeneralStateEditor;
  markdown: {};
}

/**
 * @type electron-store 的存储结构
 */
export type TStore = Store<IPreference>;
