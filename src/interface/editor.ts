import { IDocument, IDocumentFormat, IDocumentConfig } from "./document";

/**
 * @type 标识打开的标签
 * @member order 索引，标题的哈希字符串
 * @member value 标题名称
 */
export type TTab = { order: string; value: string };

/**
 * @interface 打开的文件除自身属性外需附加在编辑器中的状态
 */
export interface IFile extends IDocument {
  title: string; // 文件名
  needSave: boolean; // 是否改动
}

/**
 * @interface 编辑器的 state
 */
export interface IEditorState {
  /* 以下为编辑器状态 */
  historyFileIndex: string;
  currentFileIndex: string;
  currentFileGroup: { [index: string]: IFile };
  currentTabs: Array<TTab>;
  /* 以下继承自系统设置，作为文档设置的默认 */
  defaultDoc: {
    tag: string; // 默认标签
    category: string; // 默认分类
    format: IDocumentFormat;
    config: IDocumentConfig;
  };
}
