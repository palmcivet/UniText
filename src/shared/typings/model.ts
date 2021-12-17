import { Uri } from "monaco-editor";

import { IDocumentFrontMatter } from "./document";
import { EWorkbenchType } from "./store";

export type { ITreeNodeFile, ITreeNodeFolder } from "@palmcivet/unitext-tree-view";

export interface IMark {
  /**
   * @field 路径
   */
  path: Array<string>;
  /**
   * @field 添加时间
   */
  time: string;
  /**
   * @field 行号
   */
  line: number;
}

/**
 * @description 可打开文件的接口
 */
export interface IOpenable {
  /**
   * @description 标题
   */
  title: string;
  /**
   * @description Tab 类型
   */
  type: EWorkbenchType;
}

/**
 * @interface 打开的标签
 */
export interface ITab {
  /**
   * @field 类型
   */
  type: EWorkbenchType;
  /**
   * @field 标题
   */
  title: string;
  /**
   * @field 描述
   */
  description?: string;
  /**
   * @field 是否活跃
   */
  isActivated: boolean;
  /**
   * @field 是否改动
   */
  isModified: boolean;
}

/**
 * @interface 打开的 Markdown 文件
 */
export interface IEditorState extends IDocumentFrontMatter, ITab {
  /**
   * @field Monaco Editor 编辑模型
   */
  uri: Uri;
  /**
   * @field 路径
   */
  route: Array<string>;
  /**
   * @field 是否临时文件
   */
  isTemp: boolean;
  /**
   * @field 是否是阅读模式
   */
  isReadMode: boolean;
}

export interface IViewState extends ITab {}

export interface IWorkbenchState extends ITab {}
