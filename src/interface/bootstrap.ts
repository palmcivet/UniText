import Store from "electron-store";

import { IGeneralStateAppearance, IGeneralStateEditor } from "./vuex/modules/general";
import { ISideBarStateFiles } from "./vuex/modules/sideBar";

/**
 * @type electron-store 的存储结构
 */
export type TStore = Store<ISetting>;

/**
 * @interface 系统设置
 */
export interface ISystemSetting {
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
 * @interface 其他设置
 */
export interface ISetting {
  appearance: IGeneralStateAppearance;
  editor: IGeneralStateEditor;
  files: ISideBarStateFiles;
  markdown: {};
  theme: {};
}

/**
 * @interface 设置文件
 */
export interface IBootSetting extends ISetting {
  system: ISystemSetting;
}

/**
 * @interface 启动参数
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

export enum EWindow {
  NEW,
  VIEW,
  NORMAL,
}
