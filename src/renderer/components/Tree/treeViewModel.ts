import { IList, IModel, TreeNodeFolder } from "./treeModel";
import { TreeView } from "./treeView";

import data from "./tree.pre.json";

export class TreeViewModel {
  /**
   * @field 列表
   */
  list!: IList;

  /**
   * @field 数据模型
   */
  model!: IModel;

  /**
   * @field 渲染呈现
   */
  view!: TreeView;

  constructor(el: HTMLElement) {
    // TODO 数据输入
    this.model = new TreeNodeFolder(data as any, null);

    this.list = this.getList(this.model as TreeNodeFolder);

    // 初始化虚拟列表
    this.view = new TreeView(
      el,
      // TODO
      {
        click: this.onClick,
        keydown: this.onKeydown,
      }
    );
  }

  private onClick = (idx: number) => {
    if (!this.list[idx].collapsible) {
      // 选中
      return;
    }

    if ((this.list[idx] as TreeNodeFolder).collapsed) {
      this.setExpend(idx);
    } else {
      this.setCollpase(idx);
    }

    this.render();
  };

  private onKeydown = (idx: number) => {
    // rename
  };

  private getList(node: TreeNodeFolder): IList {
    const list: IList = [];

    // TODO 顺序

    node.folders.forEach((item) => {
      list.push(item);
      if (!item.collapsed) list.push(...this.getList(item));
    });

    node.files.forEach((item) => {
      list.push(item);
    });

    return list;
  }

  /**
   * 展开
   * @param idx 下标
   */
  private setExpend(idx: number): void {
    const target = this.list[idx] as TreeNodeFolder;
    target.toggle(false);
    this.list.splice(idx + 1, 0, ...this.getList(target));
  }

  /**
   * 折叠
   * @param idx 下标
   */
  private setCollpase(idx: number): void {
    const target = this.list[idx] as TreeNodeFolder;
    target.toggle(true);
    this.list.splice(idx + 1, this.getList(target).length);
  }

  private selectItem(idx: number): void {}

  render() {
    this.view.render(this.list);
  }
}
