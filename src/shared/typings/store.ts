import { ITocItem } from "@/library/markdown-it-toc-and-anchor";
import { IMDFrontMatter, ITXTComputable, ITXTFormat } from "./document";
import { ITab } from "./renderer";
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
   * @field markdown 文件的 front matter
   */
  frontmatter: IMDFrontMatter;
  /**
   * @field 当前文本文件的计算属性
   */
  computable: ITXTComputable;
  /**
   * @field 文本的格式
   */
  format: ITXTFormat;
  /**
   * @field 标签列表
   */
  tabList: Array<ITab>;
  /**
   * @field TOC 列表
   */
  tocList: Array<ITocItem>;
  /**
   * @field TOC 列表（HTML）
   */
  tocHTML: string;
}
