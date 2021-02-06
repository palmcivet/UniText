import { TFileRoute } from "./sideBar";
import { IDocument } from "../document";

/**
 * @interface 打开的标签
 */
export interface ITab {
  /**
   * @field 索引，标题的哈希字符串
   */
  order: string;
  /**
   * @field 标题
   */
  title: string;
}

/**
 * @interface 打开的文件除自身属性外需附加在编辑器中的状态
 */
export interface IFile extends IDocument {
  /**
   * @field 文件路径
   */
  fileName: TFileRoute;
  /**
   * @field 是否改动
   */
  needSave: boolean;
  /**
   * @field 是否临时文件
   */
  tempFile: boolean;
  /**
   * @field 打开文档的模式
   */
  readMode: boolean;
}

/**
 * @enum { EWorkBenchType } 工作台类型
 */
export enum EWorkBenchType {
  EDITOR,
  STARTUP,
  SETTING,
}

/**
 * @enum { ESettingType } 设置的类型
 */
export enum ESettingType {
  PREFERENCE,
  KEYBINDING,
  SNIPPET,
  THEME,
}

export interface IWorkBenchState {
  /**
   * @field 上一个标签
   */
  historyIndex: string;
  /**
   * @field 当前标签
   */
  currentIndex: string;
  /**
   * @field 打开的文档内容对象
   */
  currentGroup: { [index: string]: IFile };
  /**
   * @field 打开的文档标签
   */
  currentTabs: Array<ITab>;
  /**
   * @field 工作台类型
   */
  workBenchType: EWorkBenchType;
  /**
   * @field 设置的类型
   */
  settingType: ESettingType;
}
