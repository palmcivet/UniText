import { IDocument } from "../document";

/**
 * @type 标识打开的标签
 */
export type TTab = {
  order: string; // 索引，标题的哈希字符串
  value: string; // 标题名称
};

/**
 * @interface 打开的文件除自身属性外需附加在编辑器中的状态
 */
export interface IFile extends IDocument {
  title: string; // 文件名
  needSave: boolean; // 是否改动
}

/**
 * @interface 工作台的 state
 */
export interface IWorkBenchState {
  /* 以下为编辑器状态 */
  historyFileIndex: string;
  currentFileIndex: string;
  currentFileGroup: { [index: string]: IFile };
  currentTabs: Array<TTab>;
}
