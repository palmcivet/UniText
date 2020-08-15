import { IDocumentFormat, IDocumentConfig } from "../document";

/**
 * @enum {EPanelShow} 右侧面板的展示形式
 */
export enum EPanelShow {
  SIDE = "SIDE",
  HIDE = "HIDE",
  FLOAT = "FLOAT",
}

/**
 * @enum {EPanelType} 右侧面板展示的信息类型
 */
export enum EPanelType {
  TOC = "TOC",
  INFO = "INFO",
  EXPORT = "EXPORT",
}

/**
 * @enum {EViewMode} 视图模式
 */
export enum EViewMode {
  SOURCE = "SOURCE",
  WYSIWYG = "WYSIWYG",
  CONTRAST = "CONTRAST",
}

/**
 * @enum {ETypeMode} 编辑模式
 */
export enum ETypeMode {
  ZEN = "ZEN",
  FOCUS = "FOCUS",
  TYPER = "TYPER",
  NORMAL = "NORMAL",
}

/**
 * @interface 通用设置的 state
 */
export interface IGeneralState {
  system: {
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
     * @field 笔记文件夹的位置，该字段作为文章的根
     */
    notesPath: string;
    /**
     * @field 显示语言
     */
    language: string; // TODO 完善语言的接口
  };
  appearance: {
    /**
     * @field 是否显示左侧边栏
     */
    showSideBar: boolean;
    /**
     * @field 是否显示状态栏
     */
    showStatusBar: boolean;
    showPanel: EPanelShow;
    panelType: EPanelType;
    viewMode: EViewMode;
    typeMode: ETypeMode;
  };
  editor: {
    /**
     * @field 默认标签
     */
    tag: string;
    /**
     * @field 默认分类
     */
    category: string;
    format: IDocumentFormat;
    config: IDocumentConfig;
    /**
     * @field 是否换行
     */
    wordWrap: boolean;
    /**
     * @field 迷你地图
     */
    miniMap: boolean;
    /**
     * @field 显示行号
     */
    lineNumber: boolean;
    /**
     * @field 高亮当前行
     */
    highlightLine: boolean;
  };
}
