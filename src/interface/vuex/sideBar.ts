/**
 * @interface 文件树的一项
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

/**
 * @interface 侧边栏的 state
 */
export interface ISideBarState {
  folderTree: ITree;
  files: {
    folderDir: string;
    ignoreFile: Array<string>;
    hideIgnore: boolean;
    showIndent: boolean;
    defaultFold: boolean;
  };
  marks: {};
  search: {};
  tags: {};
}
