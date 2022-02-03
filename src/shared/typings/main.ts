import { ISystemLaunch } from "./setting/system";

/**
 * @interface 启动软件需要携带的参数
 */
export interface IBootArgs extends Pick<ISystemLaunch, "cabinPath"> {
  /**
   * @field 笔记库历史记录
   */
  historyPath: Array<string>;
  /**
   * @field 是否默认启动
   */
  isFallBack: boolean;
}

/**
 * @enum { EWindowType } 打开的窗口类型
 */
export enum EWindowType {
  NORMAL = "normal",
  VIEW = "view",
  SETTING = "setting",
}
