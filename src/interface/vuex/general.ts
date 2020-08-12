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
  toc,
  export,
  info,
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
  showTray: boolean; // 显示托盘
  exitWhenClosed: boolean; // 最后一个窗口关闭时退出
  saveRecent: boolean; // 记录最近打开
  autoOpen: boolean; // 自动打开上一次的文件
  autoUpdate: boolean; // 自动更新
  // TODO 完善语言的接口
  language: string; // 显示语言
  /**
   * @field 笔记文件夹的位置，该字段作为文章的根
   */
  notesPath: string;
  /**
   * @field 用户界面设置
   */
  interface: {
    /**
     * @field 是否显示左侧边栏
     */
    showSideBar: boolean;
    /**
     * @field 是否显示侧边预览
     */
    showRender: boolean;
    panelShow: EPanelShow;
    panelType: EPanelType;
    typingMode: ETypingMode;
    /**
     * @field 是否启用禅模式
     */
    zenMode: boolean;
  };
  /**
   * @field 编辑器设置
   */
  editor: {
    /* 以下继承自系统设置，作为文档设置的默认 */
    defaultDoc: {
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
    };
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
