/**
 * @type 描述文件路径的数组
 */
export type TFileRoute = Array<string>;

export interface IMark {
  /**
   * @field 路径
   */
  path: TFileRoute;
  /**
   * @field 添加时间
   */
  time: string;
  /**
   * @field 行号
   */
  line: number;
}

export interface ITag {}

/**
 * @enum { EBrowserType } 浏览类型
 */
export enum EBrowserType {
  FILE = "BrowserFile",
  SEARCH = "BrowserSearch",
  BOOKMARK = "BrowserBookmark",
  TAG = "BrowserTag",
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

  /**
   * @deprecated
   * @field 描述运行时文件路径的字符串。平台无关
   */
  activeItem: string;
  /**
   * @deprecated
   * @field 顶层文件树
   */
  fileTree: ITree;
  /**
   * @field 书签列表
   */
  markList: Array<IMark>;
  /**
   * @field 标签列表
   */
  tagList: Array<ITag>;
}
