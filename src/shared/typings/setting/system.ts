import { TLocale } from ".";

/**
 * @enum { ETitleBar } 标题栏样式
 */
export enum ETitleBar {
  DEFAULT = "default",
  HIDDEN = "hidden",
  INSET = "hiddenInset",
  CUSTOM = "customButtonsOnHover",
}

export interface ISystemLaunch {
  /**
   * @field 界面语言
   */
  language: TLocale;
  /**
   * @field 显示系统托盘
   */
  showTray: boolean;
  /**
   * @field 最后一个窗口关闭时退出
   */
  exitWhenClosed: boolean;
  /**
   * @field 登录时自动启动软件
   */
  autoOpen: boolean;
  /**
   * @field 自动更新
   */
  autoUpdate: boolean;
  /**
   * @field 笔记库位置
   */
  cabinPath: string;
}

/**
 * @interface 窗口样式
 */
export interface ISystemWindow {
  /**
   * @field 宽度
   */
  width: number;
  /**
   * @field 高度
   */
  height: number;
  /**
   * @field 标题栏样式
   */
  titleBarStyle: ETitleBar;
}

export interface ISystemCli {}

export interface ISystem {
  launch: ISystemLaunch;
  window: ISystemWindow;
}
