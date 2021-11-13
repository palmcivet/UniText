import { ITab } from "./model";
import { IPreference } from "./setting/preference";

export type TNotificationLevel = "INFO" | "WARN" | "ERROR";

export interface INotificationMessage {
  level: TNotificationLevel;
  title: string;
  body?: string;
}

/**
 * @enum { EBrowserType } 浏览类型
 */
export enum EBrowserType {
  FILE = "BrowserFile",
  SEARCH = "BrowserSearch",
  BOOKMARK = "BrowserBookmark",
  TAG = "BrowserTag",
}

/**
 * @enum { EWorkbenchType } 工作台类型
 */
export enum EWorkbenchType {
  VIEW = "View",
  EDITOR = "Editor",
  SETTING = "Setting",
  SCHEDULE = "Schedule",
  REMINDER = "Reminder",
  GRAPHVIEW = "Graphview",
  DASHBOARD = "Dashboard",
}

export interface IBrowserState {
  /**
   * @field 浏览类型
   */
  browserType: EBrowserType;
  /**
   * @field 是否收起 browser
   */
  isShowBrowser: boolean;
}

export interface IGeneralState extends IPreference {}

export interface INotificationState {
  /**
   * @field 数据获取完毕
   */
  hasFetched: boolean;
  /**
   * @field 组件挂载完毕
   */
  hasMounted: boolean;

  /* 以上作为生命周期 */

  /**
   * @fileld 打开消息面板
   */
  showMessage: boolean;
  /**
   * @fileld 消息队列
   */
  messageQueue: Array<INotificationMessage>;
}

export interface IWorkbenchState {
  /**
   * @field 工作台类型
   */
  workbenchType: EWorkbenchType;
  /**
   * @field 标签列表
   */
  tabList: Array<ITab>;
}
