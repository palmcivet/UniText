/**
 * UniText 以磁盘文件为基础，方便迁移，但软件外整理文件将丢失信息
 *
 * @interface 文件项的信息
 */
export interface ITreeItem {
  order: number;
  icon: string;
  fold: boolean;
  path: string;
  file: ITree;
}

/**
 * @interface 文件树
 */
export interface ITree {
  [index: string]: ITreeItem;
}

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
  folderTree: ITree;
  activeItem: string;
  files: ISideBarStateFiles;
  marks: {};
  search: {};
  tags: {};
}
