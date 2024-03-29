import { TreeView, ITreeNodeFolder, EventBus } from "@palmcivet/unitext-tree-view";
import { TreeNodeFile } from "@palmcivet/unitext-tree-view/dist/TreeView/treemodel";
import { useDisk, useDialog, useService } from "@/renderer/composables";
import { BUS_CHANNEL } from "@/shared/channel";
import { arrayHasElements } from "@/shared/utils";
import { ISystemLaunch } from "@/shared/typings/setting/system";
import { IPreferenceBrowser } from "@/shared/typings/setting/preference";
import { IDisposable, IMark, IPathRoute } from "@/shared/typings/renderer";

interface IOptionsType extends IPreferenceBrowser, Pick<ISystemLaunch, "cabinPath"> {}

export default class Browser implements IDisposable {
  /**
   * @description Event Bus 实例
   */
  private readonly bus: EventBus;

  /**
   * @description 设置
   */
  private options: IOptionsType | null = null;

  /**
   * @description 文件夹模型
   */
  private treeview: TreeView | null = null;

  private markList!: Array<IMark>;

  /**
   * @description 描述运行时文件路径的字符串。平台无关
   */
  private activeItem!: string;

  /**
   * @description 标识位
   */
  private hasToggled: boolean = false;

  private hasOpened: boolean = false;

  constructor(bus: EventBus) {
    this.bus = bus;
  }

  public update(options: IOptionsType): void {
    this.options = options;

    if (this.treeview !== null) {
      // TODO 实时更新设置
      this.treeview.updateOptions();
    } else {
      this._openProject();
    }
  }

  public invoke(root: HTMLElement): void {
    this.treeview = new TreeView(root, {
      fetchHandler: this.onFetch.bind(this),
    });

    this.treeview.on("u-open", this.onOpenFile.bind(this));
    this.treeview.on("u-move", this.onMoveFile.bind(this));
    this.treeview.on("contextmenu", this.onContextMenu.bind(this));
    this.treeview.invoke();
    this._openProject();
  }

  public dispose(): void {
    this.treeview?.dispose();
    this.treeview = null;
  }

  public async doOpenProject(): Promise<void> {
    const result = await useDialog().showOpenDialog({
      // FEAT i18n
      title: "打开项目文件夹",
      properties: ["openDirectory", "createDirectory", "showHiddenFiles"],
    });

    if (arrayHasElements(result.filePaths)) {
      // FEAT 提示是否初始化、作为默认文件夹
      // FEAT 加载设置文件
    } else {
      // 通知
    }
  }

  public doToggleAll(): void {
    this.treeview?.toggleCollpaseAll(this.hasToggled);
    this.hasToggled = !this.hasToggled;
  }

  private async _openProject(): Promise<void> {
    const { cabinPath, ignoreFile } = this.options!;
    const model = await useDisk().readDirectory([cabinPath], ignoreFile);
    this.treeview?.updateData(model);
  }

  private _closeProject(): void {}

  private _watchProject(): void {}

  private async onOpenFile(route: IPathRoute): Promise<void> {
    const { cabinPath } = this.options!;
    // TODO 简单判断文件类型，文本类需要读取内容
    if (true) {
      const rawString = await useDisk().readTextFile([cabinPath, ...route]);
      const statInfo = await useDisk().stat([cabinPath, ...route]);
      this.bus.emit(BUS_CHANNEL.BROWSER_OPEN_MD, { rawString, statInfo, route });
    } else {
    }
  }

  private onMoveFile(): void {}

  private onContextMenu(event: TreeNodeFile): void {
    console.log(event.getNodePath());

    useService("MenuService").popupContextMenu([
      { id: "app.file.readFile" },
      { id: "app.file.editFile" },
      { type: "-" },
      { id: "app.edit.copy" },
      { id: "app.edit.cut" },
      { type: "-" },
      { id: "app.file.renameFile" },
      { type: "-" },
      { id: "app.file.revealInOs" },
      { type: "-" },
      { id: "app.edit.delete" },
    ]);
  }

  private onSelectItem(): void {}

  private async onFetch(route: IPathRoute): Promise<ITreeNodeFolder> {
    const { cabinPath, ignoreFile } = this.options!;
    return useDisk().readDirectory([cabinPath, ...route], ignoreFile);
  }
}
