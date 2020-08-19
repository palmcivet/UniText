import { IDocumentFormat, IDocumentConfig } from "../document";

/**
 * @enum {EPanelType} 右侧面板展示的信息类型
 */
export enum EPanelType {
  TOC = "TOC",
  INFO = "INFO",
  EXPORT = "EXPORT",
}

/**
 * @enum {EEditMode} 编辑模式
 */
export enum EEditMode {
  SOURCE = "SOURCE",
  WYSIWYG = "WYSIWYG",
  RICHTEXT = "RICHTEXT",
}

/**
 * @enum {ETypeMode} 打字模式
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
    /**
     * @field 是否显示右侧面板
     */
    showPanel: boolean;
    /**
     * @field 是否预览
     */
    checkPresent: boolean;
    /**
     * @field 是否查看编辑状态
     * - 对于源码模式，查看预览
     * - 对于 WYSIWYG，查看源码
     * - 对于富文本，无效果
     */
    checkEdit: boolean;
    /**
     * @field 控制面板是否悬浮
     */
    panelFloat: boolean;
    panelType: EPanelType;
    editMode: EEditMode;
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
