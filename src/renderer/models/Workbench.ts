import { StatsBase } from "fs";
import * as MonacoEditor from "monaco-editor";
import { MonacoMarkdownExtension } from "monaco-markdown-extension";
import { EventBus } from "@palmcivet/unitext-tree-view";

import useGeneral from "@/renderer/stores/general";
import useWorkbench from "@/renderer/stores/workbench";
import { PATH_SEPARATE } from "@/renderer/utils";
import { importFrontMatter } from "@/renderer/utils/frontMatter";
import { formatDate } from "@/shared/utils";
import { URL_PROTOCOL } from "@/shared/constant";
import { BUS_CHANNEL } from "@/shared/channel";
import { ITab } from "@/shared/typings/model";
import { EWorkbenchType } from "@/shared/typings/store";
import { IDisposable, ITocItem } from "@/shared/typings/renderer";
import { IDocumentFrontMatter } from "@/shared/typings/document";

import { OneDarkPro } from "../containers/Workbench/Editor/theme";
import { init } from "../containers/Workbench/Editor/option";

/* type definition begins */

/**
 * @interface 打开的 Markdown 文件
 */
interface IEditorState extends IDocumentFrontMatter, ITab {
  /**
   * @field Monaco Editor 编辑模型
   */
  uri: MonacoEditor.Uri;
  /**
   * @field 路径
   */
  route: Array<string>;
  /**
   * @field 是否临时文件
   */
  isTemp: boolean;
  /**
   * @field 是否改动
   */
  isModified: boolean;
  /**
   * @field 是否是阅读模式
   */
  isReadMode: boolean;
}

interface IViewState extends ITab {}

interface IWorkbenchState extends ITab {}

/* type definition end */

function DocumentFactory(data?: IDocumentFrontMatter, stat?: StatsBase<number>): IDocumentFrontMatter {
  return {
    meta: {
      cTime: formatDate(stat?.birthtime || new Date()),
      mTime: formatDate(stat?.mtime || new Date()),
      editTime: 0,
    },
    format: {
      indent: useGeneral().$state.document.indent,
      encoding: useGeneral().$state.document.encoding,
      endOfLine: useGeneral().$state.document.endOfLine,
    },
    config: {
      remark: "",
      complete: false,
      tag: useGeneral().$state.document.tag,
      picture: useGeneral().$state.document.picture,
    },
    images: [],
    ...data,
  };
}

type TState = IEditorState | IViewState | IWorkbenchState;

let counter = 0;
const CLOSE_NEXT_RIGHT = true; // 关闭后，打开右侧|打开左侧
const OPEN_NEXT_RIGHT = true; // 打开出现在右侧|最后

export default class Workbench implements IDisposable {
  /**
   * @description Event Bus 实例
   */
  private readonly bus: EventBus;

  /**
   * @description Monaco Editor 实例
   */
  private editorInstance!: MonacoEditor.editor.IStandaloneCodeEditor;

  /**
   * @description Workbench 标签页 State
   */
  private readonly cachedStateList: Array<TState>;

  /**
   * @description 活跃 IEditorState 的 uri
   */
  private activatedStateUri: MonacoEditor.Uri | null;

  /**
   * @description 图片列表
   */
  private imageList: Array<string>;

  /**
   * @description 目录列表
   */
  private tocList: Array<ITocItem>;

  constructor(bus: EventBus) {
    this.bus = bus;
    this.cachedStateList = [];
    this.activatedStateUri = null;
    this.imageList = [];
    this.tocList = [];
  }

  public invoke = (() => {
    let singleLock = false;

    return (root: HTMLElement): void => {
      if (singleLock) {
        return;
      }
      singleLock = true;

      // TODO 读取配置
      MonacoEditor.editor.defineTheme("OneDarkPro", OneDarkPro);

      this.editorInstance = MonacoEditor.editor.create(root, {
        ...init,
        theme: "OneDarkPro",
      });

      const extension = new MonacoMarkdownExtension();
      extension.activate(this.editorInstance);

      this.bus.on(BUS_CHANNEL.BROWSER_OPEN_MD, this.onOpenMarkdown.bind(this));
      this.bus.on(BUS_CHANNEL.BROWSER_SAVE_MD, this.onSaveMarkdown.bind(this));

      // TODO 读取配置：新建文件/打开历史
      // this.onCreateMarkdown();
    };
  })();

  public dispose(): void {
    this.editorInstance.dispose();
    this.bus.off(BUS_CHANNEL.BROWSER_OPEN_MD, this.onOpenMarkdown);
    this.bus.off(BUS_CHANNEL.BROWSER_SAVE_MD, this.onSaveMarkdown);
  }

  /* Tab operation begin */

  public doActivateTab(index: number): void {
    const targetTab = this.cachedStateList[index];
    const { type } = targetTab;

    if (type === EWorkbenchType.EDITOR) {
      const { uri } = targetTab as IEditorState;
      const model = MonacoEditor.editor.getModel(uri);
      this.activatedStateUri = uri;
      this.editorInstance.setModel(model);
    }

    useWorkbench().SWITCH_WORKBENCH(type);
    useWorkbench().SYNC_TAB(this._getTabList());
  }

  public doCloseTab(index: number): void {
    const [closedState] = this.cachedStateList.splice(index, 1);
    const { length } = this.cachedStateList;

    /* 处理关闭的 Editor Model */
    if (closedState.type === EWorkbenchType.EDITOR) {
      const { uri } = closedState as IEditorState;
      const model = MonacoEditor.editor.getModel(uri);
      this.onCloseMarkdown(model!.getValue());
      model?.dispose();
    }

    if (length === 0) {
      useWorkbench().SYNC_TAB(this._getTabList());
      return;
    }

    /* 激活下一个 Tab */
    const rightIndex = CLOSE_NEXT_RIGHT ? index : Math.max(index, index - 1);
    const nextIndex = Math.min(length - 1, rightIndex);

    this.doActivateTab(nextIndex);
  }

  public doMoveTab(src: number, dst: number): void {}

  /* Tab operation end */

  public doCreateMarkdown(): void {
    this.onCreateMarkdown();
  }

  public doOpenWorkbench(type: EWorkbenchType): void {
    const index = this.cachedStateList.findIndex((state) => state.type === type);

    if (index === -1) {
      this._addTab({
        type,
        title: type,
        isActivated: true,
      });
    } else {
      this.doActivateTab(index);
    }
  }

  private _getTabList(): Array<ITab> {
    const { workbenchType } = useWorkbench();

    const list = this.cachedStateList.map((_state) => {
      const isActivated =
        _state.type === workbenchType
          ? _state.type === EWorkbenchType.EDITOR
            ? this.activatedStateUri !== null &&
              this.activatedStateUri.toString() === (_state as IEditorState).uri.toString()
            : true
          : false;

      return {
        type: _state.type,
        title: _state.title,
        isActivated,
      };
    });

    return list;
  }

  private _addTab(state: TState): void {
    const { workbenchType } = useWorkbench();
    let activatedIndex = 0;

    if (state.type === EWorkbenchType.EDITOR) {
      activatedIndex = this.cachedStateList.findIndex((_state) => {
        return (
          this.activatedStateUri !== null &&
          _state.type === EWorkbenchType.EDITOR &&
          this.activatedStateUri.toString() === (_state as IEditorState).uri.toString()
        );
      });
      this.activatedStateUri = (state as IEditorState).uri;
    } else {
      activatedIndex = this.cachedStateList.findIndex((_state) => {
        return workbenchType === _state.type;
      });
    }

    const nextIndex = OPEN_NEXT_RIGHT ? activatedIndex + 1 : this.cachedStateList.length;
    this.cachedStateList.splice(nextIndex, 0, state);
    this.doActivateTab(nextIndex);
  }

  private onCreateMarkdown(): void {
    const title = `Untitled-${counter++}`;
    const uri = MonacoEditor.Uri.parse(`${URL_PROTOCOL}Markdown-${title}`);

    MonacoEditor.editor.createModel("", "markdown-math", uri);

    this._addTab({
      type: EWorkbenchType.EDITOR,
      title,
      uri,
      route: [],
      isTemp: false,
      isModified: false,
      isReadMode: false,
      isActivated: true,
      ...DocumentFactory(),
    } as IEditorState);
  }

  private onOpenMarkdown(payload: { rawString: string; statInfo: StatsBase<number>; route: Array<string> }): void {
    const { rawString, statInfo, route } = payload;
    const { data, content } = importFrontMatter(rawString);
    const uri = MonacoEditor.Uri.parse(route.join(PATH_SEPARATE));

    if (MonacoEditor.editor.getModel(uri) === null) {
      MonacoEditor.editor.createModel(content, "markdown-math", uri);

      this._addTab(
        // FEAT 校验字段
        {
          type: EWorkbenchType.EDITOR,
          title: route.at(-1),
          uri,
          route,
          isTemp: false,
          isModified: false,
          isReadMode: false,
          ...DocumentFactory(data, statInfo),
        } as IEditorState
      );
    } else {
      const index = this.cachedStateList.findIndex((state) => {
        return state.type === EWorkbenchType.EDITOR && (state as IEditorState).uri.toString() === uri.toString();
      });

      this.doActivateTab(index);
    }
  }

  private onSaveMarkdown(): void {}

  private onCloseMarkdown(value: string): void {
    // 保存状态
    // this.editorInstance.saveViewState();
  }
}
