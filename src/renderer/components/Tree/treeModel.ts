export type IList = Array<TreeNodeFile | TreeNodeFolder>;

export type IModel = TreeNodeFolder | null;

/**
 * @interface 基本信息
 */
interface ITreeNodeBase {
  name: string;

  icon?: string;

  collapsible: boolean;
}

/**
 * @interface 节点
 */
interface ITreeNode extends ITreeNodeBase {
  collapsed: boolean;

  files: ITreeNodeBase[];

  folders: ITreeNode[];
}

export class TreeNodeFile implements ITreeNodeBase {
  name: string;

  collapsible: boolean;

  parent: IModel;

  constructor(data: ITreeNodeBase, parent: IModel) {
    this.name = data.name;
    this.collapsible = data.collapsible;
    this.parent = parent;
  }

  getIndent(level: number): number {
    return this.parent ? this.parent.getIndent(level + 1) : level;
  }

  getParentNode(): IModel {
    if (this.parent) {
      return this.parent.getParentNode();
    } else {
      return this.parent;
    }
  }

  getParentName(): string {
    if (this.parent) {
      return `${this.parent.getParentName()}/${this.name}`;
    } else {
      return this.name;
    }
  }

  rename(val: string) {
    this.name = val;
  }

  reveal() {}
}

export class TreeNodeFolder extends TreeNodeFile implements ITreeNode {
  collapsed!: boolean;

  readonly files: TreeNodeFile[] = [];

  readonly folders: TreeNodeFolder[] = [];

  constructor(data: ITreeNode, parent: IModel) {
    super(data, parent);

    this.collapsed = data.collapsed;

    data.folders.forEach((item) => {
      this.folders.push(new TreeNodeFolder(item, this));
    });

    data.files.forEach((item) => {
      this.files.push(new TreeNodeFile(item, this));
    });
  }

  /**
   *
   * @param mode 折叠状态。`true` 折叠；`false` 展开
   */
  toggle(mode: boolean) {
    this.collapsed = mode;
  }
}
