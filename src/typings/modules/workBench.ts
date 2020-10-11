import { IDocument } from "@/typings/document";

/**
 * @type 标识打开的标签
 */
export type TTab = {
  /**
   * @field 索引，标题的哈希字符串
   */
  order: string;
  /**
   * @field 标题名称
   */
  value: string;
};

/**
 * @interface 打开的文件除自身属性外需附加在编辑器中的状态
 */
export interface IFile extends IDocument {
  /**
   * @field 文件名
   */
  title: string;
  /**
   * @field 是否改动
   */
  needSave: boolean;
}

/**
 * @interface 工作台的 state
 */
export interface IWorkBenchState {
  historyFileIndex: string;
  currentFileIndex: string;
  currentFileGroup: { [index: string]: IFile };
  currentTabs: Array<TTab>;
}
