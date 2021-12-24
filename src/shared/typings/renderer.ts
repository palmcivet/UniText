import { EWorkbenchType } from "./store";

export type { ITreeNodeFile, ITreeNodeFolder } from "@palmcivet/unitext-tree-view";

export type IPathRoute = Array<string>;

/**
 * @description 可打开内容的接口
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
 * @description 生命周期接口
 */
export interface IDisposable {
  invoke(...args: Array<any>): void;
  dispose(): void;
}

export interface ITag extends IOpenable {}

export interface IMark extends IOpenable {
  /**
   * @field 路径
   */
  path: IPathRoute;
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
 * @interface 打开的标签
 */
export interface ITab extends IOpenable {
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
