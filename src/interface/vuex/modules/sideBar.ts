import { FileManager } from "@/common/files/FileManager";

/**
 * UniText 以磁盘文件为基础，方便迁移，但软件外整理文件将丢失信息
 * @interface 缓存文件树的子项
 */
export interface ICacheTreeItem {
  /**
   * @field 子文件
   */
  child: ICacheTree;
  /**
   * @field 该值在每一次折叠时赋值，在每一次展开时取值
   */
  cache: Array<ILogicTreeItem>;
  /**
   * @field 手动指定顺序
   */
  order: number;
  /**
   * @field 描述文件夹的折叠状态.`true` 关闭；`false` 打开
   */
  isFold: boolean;
  /**
   * @field 描述子项类型。`true` 文件；`false` 文件夹
   */
  isFile: boolean;
}

/**
 * @interface 缓存文件树
 */
export interface ICacheTree {
  [index: string]: ICacheTreeItem;
}

/**
 * @interface 逻辑文件树的子项
 */
export interface ILogicTreeItem {
  /**
   * @field 图标
   */
  icon: string;
  /**
   * 根据上下级构建。移动 `cacheTree` 的某一根节点，子节点都将修改，而遍历列表成本相对较低
   * @field 基于根的路径
   */
  path: string;
  /**
   * @field 子项的嵌套信息，顶级为 `0`
   */
  tier: number;
  /**
   * @field 描述文件夹的折叠状态。`true` 关闭；`false` 打开
   */
  isFold: boolean; // TODO collapse、folded
  /**
   * @field 描述子项类型。`true` 文件；`false` 文件夹
   */
  isFile: boolean; // TODO 是否为文件
}

/**
 * @type 根据缓存文件树平铺得到文件列表
 */
export type ILogicTree = Array<ILogicTreeItem>;

/**
 * @interface 关于文件的设置项
 */
export interface ISideBarStateFiles {
  folderDir: string;
  ignoreFile: Array<string>;
  hideIgnore: boolean;
  showIndent: boolean;
  defaultFold: boolean;
}

/**
 * @interface 侧边栏的 state
 */
export interface ISideBarState {
  fileManager: FileManager;
  activeItem: string;
  files: ISideBarStateFiles;
  marks: {};
  search: {};
  tags: {};
}
