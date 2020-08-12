/**
 * @interface 文件树的其中一项，其中 `file` 不存在则表明是文件，否则为目录
 */
export interface ITreeItem {
  name: string;
  path: string;
  file?: Array<ITreeItem>;
}

/**
 * @interface 侧边栏的 state
 */
export interface ISideBarState {
  files: {
    folderTree: Array<ITreeItem>;
    ignoreFile: Array<string>;
  };
  marks: {};
  search: {};
  tags: {};
}
