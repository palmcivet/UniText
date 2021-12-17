import { IDocumentFrontMatter } from "./document";
import { ITab } from "./model";
import { ITocItem } from "./renderer";
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
  /**
   * @deprecated 更改为 DOCUMENT，并且判断文件类型
   */
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

export interface IEnvironmentState {
  platform: NodeJS.Platform;
  isDev: boolean;
}

export interface INotificationState {
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
   * @field 当前文档的 front matter
   */
  frontMatter: IDocumentFrontMatter;
  /**
   * @field 标签列表
   */
  tabList: Array<ITab>;
  /**
   * @field TOC 列表
   */
  tocList: Array<ITocItem>;
}
