/**
 * @type i18n 字符串，出现于文件中，以易于读写
 */
export type TI18n = "ZH_CN" | "EN_US";

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
  language: TI18n;
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
  openWhenLogged: boolean;
  /**
   * @field 自动更新
   */
  autoUpdate: boolean;
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
