import { IList, IModel, TreeNodeFile, TreeNodeFolder } from "./treeModel";
import { TreeView } from "./treeView";

import data from "./tree.pre.json";

interface IOptions {
  indent: boolean;
  onOpen: Function;
  onMove: Function;
  onDelete: Function;
  onContext: Function;
}

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

  /**
   * @field 当前选中的文件
   */
  activeItem!: TreeNodeFile | TreeNodeFolder;

  options!: IOptions;

  constructor(el: HTMLElement, opt: IOptions) {
    this.options = opt;
    // TODO 数据输入
    this.model = new TreeNodeFolder(data as any, null);
    this.list = this.getList(this.model as TreeNodeFolder);
    this.view = new TreeView(el, {
      click: this.onClick,
      keydown: this.onKeydown,
      context: this.onContext,
    });

    this.render();
  }

  private onClick = (idx: number) => {
    if (!this.list[idx].collapsible) this.options.onOpen();

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

  private onContext = (idx: number) => {
    this.options.onContext(this.list[idx].getParentName());
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

  private setExpend(idx: number): void {
    const target = this.list[idx] as TreeNodeFolder;
    target.toggle(false);
    this.list.splice(idx + 1, 0, ...this.getList(target));
  }

  private setCollpase(idx: number): void {
    const target = this.list[idx] as TreeNodeFolder;
    target.toggle(true);
    this.list.splice(idx + 1, this.getList(target).length);
  }

  private render() {
    this.view.render(this.list);
  }

  updateOptions() {}

  resizeHeight() {
    this.view.onResize();
  }

  toggleAll() {}
}
