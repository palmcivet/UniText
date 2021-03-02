/**
 * @type 描述文件路径的数组
 */
export type TFileRoute = Array<string>;

/**
 * @interface 文件或文件树的一项
 */
export interface ITreeNode {
  /**
   * @field 图标
   */
  icon: string;
  /**
   * @field 手动指定的顺序
   */
  order: number;
  /**
   * @field 子项或是否拥有子项。取值：`(对象实体)` | `{}` | `false`
   */
  children: ITree | false;
  /**
   * @field 描述文件夹的折叠状态。`true` 关闭；`false` 打开
   */
  collapse: boolean;
}

/**
 * @interface 多级文件树的一级
 */
export interface ITree {
  [index: string]: ITreeNode;
}

export interface IMark {
  /**
   * @field 路径
   */
  path: TFileRoute;
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
 * @enum { EActivityType } 侧边栏类型
 */
export enum EActivityType {
  TAGS = "Tags",
  FILES = "Files",
  MARKS = "Marks",
  SEARCH = "Search",
  SETTINGS = "Settings",
  SCHEDULE = "Schedule",
}

export interface ISideBarState {
  /**
   * @field 活动类型
   */
  activity: EActivityType;
  /**
   * @field 描述运行时文件路径的字符串。平台无关
   */
  activeItem: string;
  /**
   * @field 顶层文件树
   */
  fileTree: ITree;
  /**
   * @field 书签列表
   */
  markList: Array<IMark>;
}
