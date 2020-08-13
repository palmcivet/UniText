import { IDocumentFormat, IDocumentConfig } from "../document";

/**
 * @enum {EPanelShow} 右侧面板的展示形式
 */
export enum EPanelShow {
  side = "side",
  hide = "hide",
  float = "float",
}

/**
 * @enum {EPanelType} 右侧面板展示的信息类型
 */
export enum EPanelType {
  toc = "toc",
  export = "export",
  info = "info",
}

/**
 * @enum {ETypingMode} 编辑模式
 */
export enum ETypingMode {
  source = "source",
  contrast = "contrast",
  richText = "richText",
  typeWrite = "typeWrite",
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
  };
  appearance: {
    /**
     * @field 显示语言
     */
    language: string; // TODO 完善语言的接口
    /**
     * @field 是否显示左侧边栏
     */
    showSideBar: boolean;
    /**
     * @field 是否显示预览
     */
    showPreview: boolean;
    showPanel: EPanelShow;
    panelType: EPanelType;
    typingMode: ETypingMode;
    /**
     * @field 是否启用禅模式
     */
    zenMode: boolean;
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
