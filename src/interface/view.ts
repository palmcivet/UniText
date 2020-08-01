export interface ITreeItem {
  name: string;
  path: string;
  file?: Array<ITreeItem>;
}
