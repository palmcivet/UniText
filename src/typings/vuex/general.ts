import { IDocumentFormat, IDocumentConfig } from "@/typings/document";

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

export interface IGeneralStateAppearance {
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
  readMode: boolean;
  /**
   * @field 是否查看编辑状态
   * - 对于源码模式，查看预览
   * - 对于 WYSIWYG，查看源码
   * - 对于富文本，无效果
   */
  dbColumn: boolean;
  /**
   * @field 控制面板是否悬浮
   */
  panelFloat: boolean;
  /**
   * @field 右侧面板展示的信息类型
   */
  panelType: EPanelType;
  /**
   * @field 编辑模式
   */
  editMode: EEditMode;
  /**
   * @field 编辑模式
   */
  typeMode: ETypeMode;
}

export interface IGeneralStateEditor {
  /**
   * @field 默认标签
   */
  tag: string;
  /**
   * @field 默认分类
   */
  category: string;
  /**
   * @field 编辑模式
   */
  format: IDocumentFormat;
  /**
   * @field 编辑模式
   */
  config: IDocumentConfig;
  /**
   * @field 是否换行
   */
  wordWrap: boolean;
  /**
   * @field 迷你地图
   */
  showMiniMap: boolean;
  /**
   * @field 显示行号
   */
  showLineNumber: boolean;
  /**
   * @field 高亮当前行
   */
  highlightLine: boolean;
}

/**
 * @interface 通用设置的 state
 */
export interface IGeneralState {
  appearance: IGeneralStateAppearance;
  editor: IGeneralStateEditor;
}
