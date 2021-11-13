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
   * @field
   */
  isActivated: boolean;
}
