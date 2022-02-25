import { StatsBase } from "fs";
import * as MonacoEditor from "monaco-editor";
import { MonacoMarkdownExtension } from "@/library/markdown-extension";
import { EventBus } from "@palmcivet/unitext-tree-view";

import { i18n } from "@/renderer/i18n";
import useGeneral from "@/renderer/stores/general";
import useWorkbench from "@/renderer/stores/workbench";
import useEnvironment from "@/renderer/stores/environment";
import { useClipboard, useDialog, useDisk, useService } from "@/renderer/composables";
import { charCount, timeCalc, wordCount } from "@/renderer/utils/statistics";
import { exportFrontMatter, importFrontMatter } from "@/renderer/utils/front-matter";
import { IMG_IN_URL_PATTERN, PATH_SEPARATE, URL_PATH, URL_PROTOCOL } from "@/shared/pattern";
import { cleanURL, validateURL } from "@/shared/utils/links";
import { debounce, difference, hashString, intersect } from "@/shared/utils";
import { BUS_CHANNEL } from "@/shared/channel";
import { IEditorState, IViewState, IWorkbenchState } from "@/shared/typings/model";
import { EWorkbenchType } from "@/shared/typings/store";
import { IDisposable, IPathRoute, ITab } from "@/shared/typings/renderer";
import { ISnippetMonaco } from "@/shared/typings/setting/snippet";
import { IMDConfig, IMDFrontMatter, ITXTComputable, ITXTFormat } from "@/shared/typings/document";

import { OneDarkPro } from "../containers/Workbench/Document/Editor/Monaco/theme";
import { init } from "../containers/Workbench/Document/Editor/Monaco/option";

function FrontMatterFactory(data?: IMDFrontMatter, stat?: StatsBase<number>): IMDFrontMatter {
  return {
    meta: {
      cTime: (stat?.birthtime ?? new Date()).getTime(),
      mTime: (stat?.mtime ?? new Date()).getTime(),
      editTime: 0,
    },
    config: {
      remark: "",
      complete: false,
      tags: useGeneral().$state.document.tags,
      picture: useGeneral().$state.document.picture,
    },
    images: [],
    ...data,
  };
}

function ComputableFactory(raw: string): ITXTComputable {
  return {
    wordCount: wordCount(raw),
    charCount: charCount(raw),
    readTime: timeCalc(raw),
  };
}

async function DiffImageList(newList: Array<string>, oldList: Array<string>): Promise<Array<string>> {
  const _oldList = new Set(oldList);
  const _newList = new Set<string>();

  newList.forEach((item) => {
    if (item.startsWith(URL_PATH.IMG)) {
      _newList.add(item.replace(URL_PATH.IMG, ""));
    } else if (/http(s)?:\/\//.test(item)) {
      _newList.add(hashString(item));
    }
  });
  const intList = intersect(_oldList, _newList);
  const delList = difference(_oldList, intList);
  const addList = difference(_newList, intList);

  await useService("ImageService").updateIndice([...delList], [...addList]);

  return [..._newList];
}

async function getClipboard(): Promise<{
  text: string;
  format: string;
  isImg: boolean;
  isUrl: boolean;
}> {
  const readResult = {
    text: "",
    isImg: false,
    isUrl: false,
    format: "",
  };

  const clipboard = useClipboard();
  const available = clipboard.availableFormats();

  if (available.includes("text/plain")) {
    /* [ 'text/plain' ] */
    readResult.text = clipboard.readText();
    const { text } = readResult;
    if (readResult.text !== "") {
      readResult.isUrl = validateURL(text);
      readResult.isImg = IMG_IN_URL_PATTERN.test(text);
    }

    /* [ 'text/plain', 'text/html', 'text/rtf' ] */
    // FEAT
  } else {
    /* binary file or local file */
    readResult.text = useEnvironment().isWin
      ? clipboard.read("FileNameW").replace(new RegExp(String.fromCharCode(0), "g"), "")
      : clipboard.read("public.file-url");

    if (readResult.text === "") {
      /* binary image */
      readResult.isImg = true;
      readResult.isUrl = true;
      readResult.text = await useService("ImageService").getClipedImage();
    } else {
      /* local file */
    }
  }

  return readResult;
}

type TState = IEditorState | IViewState | IWorkbenchState;

let counter = 0;
const SYNC_DELAY = 700;
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
   * @description 活跃 IEditorState 的 uri，用于获取 monaco model
   */
  private activatedStateUri: MonacoEditor.Uri | null;

  /**
   * @description 活跃 IEditorState 的下标，用于更改属性
   */
  private activatedStateIndex: number;

  constructor(bus: EventBus) {
    this.bus = bus;
    this.cachedStateList = [];
    this.activatedStateUri = null;
    this.activatedStateIndex = 0;
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

      this.editorInstance.onDidChangeModelContent(this.onMonacoModelContent);
      this.editorInstance.addCommand(MonacoEditor.KeyMod.CtrlCmd | MonacoEditor.KeyCode.KeyV, this.onMonacoPaste);
      this.editorInstance.addCommand(MonacoEditor.KeyMod.Alt | MonacoEditor.KeyCode.KeyZ, this.onMonacoChangeWordWrap);

      this.bus.on(BUS_CHANNEL.BROWSER_OPEN_MD, this.onOpenMarkdown.bind(this));
      this.bus.on(BUS_CHANNEL.BROWSER_SAVE_MD, this.onSaveMarkdown.bind(this));
      this.bus.on(BUS_CHANNEL.EDITOR_SYNC_IMG, () => {});
      this.bus.on(BUS_CHANNEL.EDITOR_REVEAL_SECTION, this.onMonacoRevealSection);

      // TODO 读取配置：新建文件/打开历史
      // this.onCreateMarkdown();
    };
  })();

  public dispose(): void {
    this.editorInstance.dispose();
    this.bus.off(BUS_CHANNEL.BROWSER_OPEN_MD, this.onOpenMarkdown);
    this.bus.off(BUS_CHANNEL.BROWSER_SAVE_MD, this.onSaveMarkdown);
    this.bus.off(BUS_CHANNEL.EDITOR_REVEAL_SECTION, this.onMonacoRevealSection);
  }

  public update(): void {
    const snippets: Array<ISnippetMonaco> = [];

    MonacoEditor.languages.registerCompletionItemProvider("markdown-math", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: MonacoEditor.languages.CompletionItem[] = [
          ...snippets.map(({ command, ...item }) => {
            return {
              ...item,
              range,
              kind: MonacoEditor.languages.CompletionItemKind.Snippet,
              insertTextRules: MonacoEditor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            };
          }),
        ];

        return {
          suggestions,
        };
      },
    });
  }

  /* Tab operation begin */

  public doActivateTab(index: number): void {
    this.activatedStateIndex = index;
    const targetTab = this.cachedStateList[index];
    const { type } = targetTab;

    if (type === EWorkbenchType.EDITOR) {
      const { uri, frontmatter, format } = targetTab as IEditorState;
      const model = MonacoEditor.editor.getModel(uri);
      this.activatedStateUri = uri;
      this.editorInstance.setModel(model);
      const content = model?.getValue() ?? "";
      this.bus.emit(BUS_CHANNEL.EDITOR_SYNC_DOC, content);
      useWorkbench().SYNC_FORMAT(format);
      useWorkbench().SYNC_FRONTMATTER(frontmatter);
      useWorkbench().SYNC_COMPUTABLE(ComputableFactory(content));
    }

    useWorkbench().SWITCH_WORKBENCH(type);
    useWorkbench().SYNC_TAB(this._getTabList());
  }

  public async doCloseTab(index: number): Promise<void> {
    const targetState = this.cachedStateList[index];

    /* 处理关闭的 Editor Model */
    if (targetState.type === EWorkbenchType.EDITOR) {
      const { uri, isModified } = targetState as IEditorState;

      if (isModified) {
        const result = await useDialog().showMessageBox({
          type: "warning",
          message: "是否保存",
          detail: "",
          buttons: ["保存", "取消", "不保存"],
          defaultId: 0,
          cancelId: 1,
        });

        switch (result.response) {
          case 0:
            /* 保存 */
            const hasSaved = await this.onSaveMarkdown();

            if (!hasSaved) {
              return;
            }

            // FEAT 保存状态
            // this.editorInstance.saveViewState();

            break;
          case 1:
            /* 取消 */
            return;
          case 2:
            break;
        }
      }

      const model = MonacoEditor.editor.getModel(uri)!;
      model.dispose();

      if (!model.isDisposed()) {
        return;
      }
    }

    this.cachedStateList.splice(index, 1);
    const { length } = this.cachedStateList;

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

  public doContextTab(index: number): void {
    useService("MenuService").popupContextMenu([
      { id: "context.tab.closeCurrentTab" },
      { id: "context.tab.closeSavedTab" },
      { id: "context.tab.closeAllTab" },
      { id: "context.tab.saveAllTab" },
      { type: "-" },
      { id: "context.tab.preview" },
      { type: "-" },
      { id: "context.tab.pinCurrentTab" },
    ]);
  }

  /* Tab operation end */

  public doChangeMarkdown({ config, format }: { config: IMDConfig; format: ITXTFormat }): void {
    // TODO 更改编辑器设置
    const currentState = this.cachedStateList[this.activatedStateIndex] as IEditorState;
    const _frontmatter = { ...currentState.frontmatter, config: { ...currentState.frontmatter.config, ...config } };
    const _format = { ...currentState.format, ...format };

    currentState.frontmatter = _frontmatter;
    currentState.format = _format;

    const { SYNC_FORMAT, SYNC_FRONTMATTER, SET_TAB_STATE } = useWorkbench();
    SYNC_FORMAT(_format);
    SYNC_FRONTMATTER(_frontmatter);

    if (!currentState.isModified) {
      currentState.isModified = true;
      SET_TAB_STATE(this.activatedStateIndex, currentState);
    }
  }

  public doCreateMarkdown(): void {
    this.onCreateMarkdown();
  }

  public doOpenWorkbench(type: EWorkbenchType): void {
    const index = this.cachedStateList.findIndex((state) => state.type === type);

    if (index === -1) {
      this._addTab({
        type,
        title: i18n.global.t(`view.workbench.${type.toLowerCase()}`),
        isModified: false,
        isActivated: true,
      });
    } else {
      this.doActivateTab(index);
    }
  }

  /* utils begin */

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
        isModified: _state.isModified,
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

  /* utils end */

  // TODO 将参数类型写入 `typings/model`
  private onOpenMarkdown(payload: { rawString: string; statInfo: StatsBase<number>; route: IPathRoute }): void {
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
          frontmatter: FrontMatterFactory(data, statInfo),
          format: {
            // TODO 检测格式
            indent: useGeneral().$state.document.indent,
            encoding: useGeneral().$state.document.encoding,
            endOfLine: useGeneral().$state.document.endOfLine,
          },
        } as IEditorState
      );
    } else {
      const index = this.cachedStateList.findIndex((state) => {
        return state.type === EWorkbenchType.EDITOR && (state as IEditorState).uri.toString() === uri.toString();
      });

      this.doActivateTab(index);
    }
  }

  private onCreateMarkdown(): void {
    const title = `Untitled-${counter++}.md`;
    const uri = MonacoEditor.Uri.parse(`${URL_PROTOCOL}Markdown-${title}`);

    MonacoEditor.editor.createModel("", "markdown-math", uri);

    this._addTab({
      type: EWorkbenchType.EDITOR,
      title,
      uri,
      route: [],
      isTemp: true,
      isModified: false,
      isReadMode: false,
      isActivated: true,
      frontmatter: FrontMatterFactory(),
      format: {
        indent: useGeneral().$state.document.indent,
        encoding: useGeneral().$state.document.encoding,
        endOfLine: useGeneral().$state.document.endOfLine,
      },
    } as IEditorState);
  }

  private async onSaveMarkdown(): Promise<boolean> {
    const targetState = this.cachedStateList[this.activatedStateIndex] as IEditorState;
    const { isTemp, isModified, title, frontmatter } = targetState;

    /* 未修改，则直接跳过 */
    if (!isModified) {
      return true;
    }

    /* 临时文件，需要获取地址 */
    let savePath = await useService("EnvService").normalizePath([title]);

    if (isTemp) {
      const result = await useDialog().showSaveDialog({
        // FEAT i18n
        title: "保存到",
        message: "",
        properties: ["createDirectory", "showOverwriteConfirmation"],
        defaultPath: savePath,
      });

      if (result.canceled) {
        return false;
      } else if (result.filePath) {
        savePath = result.filePath;
      }
    }

    // TODO 更新图片;
    const images = await DiffImageList(frontmatter.images, frontmatter.images);

    const markdown = exportFrontMatter({
      sep: "---",
      data: {
        ...frontmatter,
        images,
        // TODO 更新其他属性
      },
      prefix: true,
      content: this.editorInstance.getValue(),
    });

    await useDisk().writeFile([savePath], markdown);
    return true;
  }

  /* Monaco events */

  private onMonacoRevealSection = (value: Array<number>): void => {
    this.editorInstance.revealLineInCenter(value[1], MonacoEditor.editor.ScrollType.Smooth);
    this.editorInstance.setPosition({ column: 1, lineNumber: value[1] });
  };

  private onMonacoModelContent = debounce((event: MonacoEditor.editor.IModelContentChangedEvent): void => {
    // FEAT 增量更新 `event.changes`
    const content = this.editorInstance.getValue() ?? "";
    this.bus.emit(BUS_CHANNEL.EDITOR_SYNC_DOC, content);
    useWorkbench().SYNC_COMPUTABLE(ComputableFactory(content));

    const state = this.cachedStateList[this.activatedStateIndex] as IEditorState;

    if (!state.isModified) {
      state.isModified = true;
      useWorkbench().SET_TAB_STATE(this.activatedStateIndex, state);
    }
  }, SYNC_DELAY);

  private onMonacoPaste = async (): Promise<void> => {
    // FEAT 清洗 URL
    const isFilter = true;
    const selection = this.editorInstance.getSelection() as MonacoEditor.Range;

    let { isImg, isUrl, text } = await getClipboard();

    if (
      isUrl &&
      (selection.startColumn !== selection.endColumn || selection.startLineNumber !== selection.endLineNumber)
    ) {
      const alt = this.editorInstance.getModel()?.getValueInRange(selection);
      text = isImg ? `![${alt}](${isFilter && cleanURL(text)} '${alt}')` : `[${alt}](${text} '${alt}')`;
    }

    this.editorInstance.executeEdits("", [
      {
        range: new MonacoEditor.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        ),
        text,
      },
    ]);

    // FEAT 改成 snippet
    const { endLineNumber, endColumn } = this.editorInstance.getSelection() as MonacoEditor.Selection;

    this.editorInstance.setPosition({ lineNumber: endLineNumber, column: endColumn });
  };

  private onMonacoChangeWordWrap = (): void => {
    const oldValue = this.editorInstance.getOption(MonacoEditor.editor.EditorOption.wordWrap);

    this.editorInstance.updateOptions({
      wordWrap: oldValue === "on" ? "off" : "on",
    });
  };
}
