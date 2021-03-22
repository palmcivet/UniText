<template>
  <SplitView
    :showLeft="!isReadMode"
    :showRight="dbColumn || isReadMode"
    :threshold="1 / 4"
    :isVertical="true"
  >
    <template v-slot:left>
      <section id="markdown-editor" />
    </template>
    <template v-slot:right>
      <section id="markdown-preview" class="line-numbers match-braces rainbow-braces" />
    </template>
  </SplitView>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";
import * as MonacoEditor from "monaco-editor";
import { MonacoMarkdownExtension } from "monaco-markdown-extension";
import Prism from "prismjs";

import { BUS_EDITOR } from "@/common/channel/bus";
import { IPC_FILE, IPC_IMAGE } from "@/common/channel/ipc";
import { debounce, $, notEmpty } from "@/common/utils";
import { cleanUrl, getClipboard } from "@/renderer/utils/links";
import SplitView from "@/renderer/components/SplitView.vue";
import { IFile } from "@/typings/vuex/workBench";
import { IGeneralState } from "@/typings/vuex/general";
import { EPanelType } from "@/typings/schema/preference";

import { OneDarkPro } from "./theme";
import { init } from "./option";

const general = namespace("general");
const workBench = namespace("workBench");
const statusPanel = namespace("statusPanel");
const DEFINE_BORDER = 16; // 边框大小

@Component({
  name: "Source",
  components: {
    SplitView,
  },
})
export default class Source extends Vue {
  @statusPanel.State("toc")
  tocTree!: Array<ITocItem>;

  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  @general.State((state: IGeneralState) => state.interface.dbColumn)
  dbColumn!: boolean;

  @general.State((state: IGeneralState) => state.interface.readMode)
  isReadMode!: boolean;

  @general.State((state: IGeneralState) => state.interface.panelType)
  panelType!: EPanelType;

  @general.Mutation("SET_READ_MODE")
  SET_READ_MODE!: (mode: boolean) => void;

  @workBench.State("currentIndex")
  currentIndex!: string;

  @workBench.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  @workBench.Mutation("TOGGLE_MODIFY")
  TOGGLE_MODIFY!: (flag: boolean) => void;

  @workBench.Action("SAVE_FILE")
  SAVE_FILE!: (content: string) => void;

  editor!: MonacoEditor.editor.IStandaloneCodeEditor;

  modelStack: { [key: string]: MonacoEditor.editor.IModel } = {};

  refPreview!: HTMLElement;

  refEditor!: HTMLElement;

  syncDelay = 400;

  @Watch("currentFile", { deep: true })
  syncModel(newValue: { order: string; value: IFile }) {
    this.SET_READ_MODE(newValue.value.readMode);

    let mod = this.modelStack[newValue.order];

    if (!mod) {
      mod = MonacoEditor.editor.createModel(newValue.value.content, "markdown-math");
      this.modelStack[newValue.order] = mod;
    }

    this.editor.setModel(mod);
    this.syncPreOrToc(this);
    Prism.highlightAll();
  }

  syncPreOrToc = debounce((that: this) => {
    /* 二选一即可，后者只更新 TOC */
    if (that.dbColumn || that.isReadMode) {
      that.refPreview.innerHTML = that.$markdown.render(that.editor.getValue());
      Prism.highlightAll();
    } else if (that.panelType === EPanelType.TOC) {
      that.$markdown.render(that.editor.getValue());
    }
  }, this.syncDelay);

  handleSaveFile() {
    this.SAVE_FILE(this.editor.getValue());
  }

  handleCloseFile(index: string) {
    this.modelStack[index].dispose();
    delete this.modelStack[index];
  }

  handleSyncView() {
    this.refPreview.innerHTML = this.$markdown.render(this.editor.getValue());
  }

  handleRevealSection(value: Array<number>) {
    this.editor.revealLineInCenter(value[1], MonacoEditor.editor.ScrollType.Smooth);
    this.editor.setPosition({ column: 1, lineNumber: value[1] });
  }

  handlePaste() {
    // FEAT 清洗 URL
    const isFilter = true;

    const selection = this.editor.getSelection() as MonacoEditor.Range;

    let [isImg, isUrl, text] = getClipboard((url, data) => {
      ipcRenderer.send(IPC_IMAGE.SET_IMAGE, url, data);
    });

    if (
      isUrl &&
      (selection.startColumn !== selection.endColumn ||
        selection.startLineNumber !== selection.endLineNumber)
    ) {
      const alt = this.editor.getModel()?.getValueInRange(selection);
      text = isImg
        ? `![${alt}](${isFilter && cleanUrl(text)} '${alt}')`
        : `[${alt}](${text} '${alt}')`;
    }

    this.editor.executeEdits("", [
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
    const {
      endLineNumber,
      endColumn,
    } = this.editor.getSelection() as MonacoEditor.Selection;

    this.editor.setPosition({ lineNumber: endLineNumber, column: endColumn });
  }

  created() {
    this.$bus.on(BUS_EDITOR.SYNC_VIEW, this.handleSyncView);
    this.$bus.on(BUS_EDITOR.CLOSE_FILE, this.handleCloseFile);
    this.$bus.on(BUS_EDITOR.REVEAL_SECTION, this.handleRevealSection);
    ipcRenderer.on(IPC_FILE.SAVE, this.handleSaveFile);
  }

  mounted() {
    this.refEditor = $("#markdown-editor");
    this.refPreview = $("#markdown-preview");

    MonacoEditor.editor.defineTheme("OneDarkPro", OneDarkPro);
    init.theme = "OneDarkPro";
    this.editor = MonacoEditor.editor.create(this.refEditor, init);

    this.modelStack[this.currentIndex] = MonacoEditor.editor.createModel(
      this.currentFile.value.content,
      "markdown-math"
    );

    const extension = new MonacoMarkdownExtension();
    extension.activate(this.editor);

    this.$nextTick(() => {
      /* 切换标签触发函数 */
      this.editor.onDidChangeModelContent(() => {
        !this.currentFile.value.needSave && this.TOGGLE_MODIFY(true);
        this.syncPreOrToc(this);
      });

      /* 以下为实时渲染 */

      let lock = false; // 锁
      let timeout: NodeJS.Timeout | null; // 定时器
      let flushDataFlag = false; // 刷新数据标识位，true 刷新数据
      let topPosition = 0; // 当前页面最顶端位置
      let currentTitle = 0; // 当前标题的数组下标
      let currentHeadLine = 0; // 当前整个标题都在页面内的最上方的标题所在行
      let currentHeadPosition = 0; // currentHead 所在坐标
      let firstHeadPosition = 0; // 第一个元素离界面 Y 轴的位置
      let nextHeadPosition = 0; // currentHead 上一个标题坐标
      let nextHeadLine = 0; // currentHead 上一个标题所在行
      let diffEditor = 0; // 编辑区两标题之间的距离
      let diffRePreview = 0; // 预览区两标题之间的距离
      let diff = 0; // 预览区和编辑区单次差值
      let multiple = 1; // 移动倍数
      let editorHeight = 0; // 编辑区计算比例时高度
      let totalDiff = DEFINE_BORDER; // 编辑区和预览区总差值（初始值为边框）
      let firstHead: HTMLElement | null = null; // 预览区第一个 Head 元素
      let nextHeadElement: HTMLElement | null = null; // currentHeadElement 的上一个标题元素
      let currentHeadElement: HTMLElement | null = null; // 当前预览区最高的完整标题元素

      /* 编辑区滚动条变化触发函数 */
      this.editor.onDidScrollChange((e: MonacoEditor.IScrollEvent) => {
        if (!this.dbColumn) return;

        topPosition = this.editor.getScrollTop();

        // 当编辑区有标题时执行代码
        if (notEmpty(this.tocTree)) {
          if (topPosition === 0) {
            // 初始化数据
            currentTitle = 0;
            totalDiff = DEFINE_BORDER;
            multiple = 1;
          } else {
            if (currentTitle === 0) {
              // 初始化下列值
              currentHeadLine = (this.tocTree[currentTitle].line as [number, number])[1];
              currentHeadPosition = this.editor.getTopForLineNumber(currentHeadLine);
              currentHeadElement = $(`#${this.tocTree[currentTitle].anchor}`);

              nextHeadLine = (this.tocTree[currentTitle + 1].line as [number, number])[1];
              nextHeadPosition = this.editor.getTopForLineNumber(nextHeadLine);
              nextHeadElement = $(`#${this.tocTree[currentTitle + 1].anchor}`);
            }

            if (
              topPosition >= nextHeadPosition &&
              currentTitle < this.tocTree.length - 1
            ) {
              /**
               * 当滚轮超越前一个标题的最上方坐标时，下一个标题为对齐标题且不会越界
               * lastHeadElementPosition <= 0 保证左边超越行号之后 currentTitle 不会持续增加的
               */
              currentTitle = currentTitle + 1; // 更新 currentTitle
              flushDataFlag = true;
              diff = diffRePreview - diffEditor;
            } else if (topPosition < currentHeadLine) {
              if (currentTitle > 0) {
                currentTitle = currentTitle - 1; // 更新 currentTitle
                flushDataFlag = true;
                diff = diffEditor - diffRePreview;
              }
            }

            if (flushDataFlag) {
              flushDataFlag = false; // 刷新数据标志位重新置 0
              if (currentTitle < this.tocTree.length - 2) {
                // 当 currentTitle 不为最后一个标题下标时，刷新数据，确保 currentTitle + 1 不会溢出

                // 更新当前标题和上一标题及其坐标和元素
                currentHeadLine = (this.tocTree[currentTitle].line as [
                  number,
                  number
                ])[1];
                currentHeadPosition = this.editor.getTopForLineNumber(currentHeadLine);
                currentHeadElement = $(`#${this.tocTree[currentTitle].anchor}`);

                nextHeadLine = (this.tocTree[currentTitle + 1].line as [
                  number,
                  number
                ])[1];
                nextHeadPosition = this.editor.getTopForLineNumber(nextHeadLine);
                nextHeadElement = $(`#${this.tocTree[currentTitle + 1].anchor}`);

                // 计算出编辑区的差值
                diffEditor = this.editor.getTopForLineNumber(
                  nextHeadLine - currentHeadLine
                );

                // 计算预览区的差值
                diffRePreview =
                  nextHeadElement.getBoundingClientRect().top -
                  currentHeadElement.getBoundingClientRect().top;

                // 计算两边差值
                totalDiff = totalDiff + diff;
                editorHeight = this.editor.getTopForLineNumber(nextHeadLine);
                multiple = (editorHeight + totalDiff) / editorHeight;
              } else {
                // 当滚动到最后一个标题时，无法计算之后的倍数，multiple 为 1
                multiple = 1;
              }
            }
          }
        }

        if (!lock) {
          lock = true;
          this.refPreview.scroll(
            this.editor.getScrollLeft(),
            topPosition * multiple + DEFINE_BORDER
          );
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            timeout = null;
            lock = false;
          }, 20);
        }
      });

      /* 预览区滚动条变化触发函数 */
      this.refPreview.addEventListener("scroll", (e: Event) => {
        firstHead = $(`#${this.tocTree[0].anchor}`);
        firstHeadPosition = firstHead.getBoundingClientRect().top;
        if (!lock) {
          lock = true;
          this.editor.setScrollTop((DEFINE_BORDER - firstHeadPosition) / multiple);
          lock = false;
        }
      });

      this.editor.addCommand(
        MonacoEditor.KeyMod.CtrlCmd | MonacoEditor.KeyCode.KEY_V,
        this.handlePaste
      );
    });
  }

  beforeDestroy() {
    this.modelStack = {};
    this.editor.dispose();
    this.$bus.off(BUS_EDITOR.SYNC_VIEW, this.handleSyncView);
    this.$bus.off(BUS_EDITOR.CLOSE_FILE, this.handleCloseFile);
    this.$bus.off(BUS_EDITOR.REVEAL_SECTION, this.handleRevealSection);
    ipcRenderer.off(IPC_FILE.SAVE, this.handleSaveFile);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

#markdown-editor {
  height: 100%;

  /deep/ .monaco-editor {
    .scrollbar .slider {
      background: var(--scrollBar-Bg);
    }

    .scroll-decoration {
      box-shadow: var(--tabBarShadow-Color) 0 2px 2px -2px inset;
    }

    .rename-box .rename-input {
      padding: 2px;
    }
  }

  /deep/ .context-view .monaco-scrollable-element {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 4px;
  }

  /deep/ .monaco-menu .monaco-action-bar.vertical {
    .action-item {
      border: none;
    }

    .action-label.separator {
      border-bottom-color: #e2e8f0 !important;
    }
  }

  /deep/ .action-menu-item {
    color: #718096 !important;
    &:hover {
      color: #744210 !important;
      background: #fffff0 !important;
    }
  }

  /deep/ .decorationsOverviewRuler {
    display: none !important;
  }
}

#markdown-preview {
  height: 100%;
  overflow: auto;
}
</style>
