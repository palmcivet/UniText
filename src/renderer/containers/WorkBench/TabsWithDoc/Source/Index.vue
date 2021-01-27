<template>
  <LayoutBox
    :totalWidth="containerWidth"
    :showMain="!isReadMode"
    :showMinor="dbColumn || isReadMode"
    :threWidth="1 / 2"
  >
    <template v-slot:left>
      <section id="markdown-editor" v-show="!isReadMode" />
    </template>
    <template v-slot:right>
      <section id="markdown-preview" />
    </template>
  </LayoutBox>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";
import * as monacoMarkdown from "monaco-markdown";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Prism from "prismjs";

import { debounce, $, notEmpty } from "@/common/utils";
import { ITocList } from "@/common/editor/create-toc";
import { markdownEngine } from "@/common/editor/markdown";
import { IPC_FILE } from "@/common/channel/ipc";
import { BUS_UI, BUS_EDITOR } from "@/common/channel/bus";
import LayoutBox from "@/renderer/components/LayoutBox.vue";
import { IFile } from "@/typings/vuex/workBench";
import { IGeneralState, EPanelType } from "@/typings/vuex/general";
import { theme } from "./theme";
import { init } from "./option";

const general = namespace("general");
const workBench = namespace("workBench");
const statusPanel = namespace("statusPanel");
const DEFINE_BORDER = 16; // 边框大小

@Component({
  name: "Source",
  components: {
    LayoutBox,
  },
})
export default class Source extends Vue {
  @statusPanel.State("toc")
  tocTree!: Array<ITocList>;

  @general.State((state: IGeneralState) => state.appearance.dbColumn)
  dbColumn!: boolean;

  @general.State((state: IGeneralState) => state.appearance.readMode)
  isReadMode!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelType)
  panelType!: EPanelType;

  @general.Mutation("SET_READ_MODE")
  SET_READ_MODE!: (mode: boolean) => void;

  @workBench.State("currentIndex")
  currentIndex!: string;

  @workBench.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  @workBench.Action("SAVE_FILE")
  SAVE_FILE!: (content: string) => void;

  editor!: monaco.editor.IStandaloneCodeEditor;

  modelStack: { [key: string]: monaco.editor.IModel } = {};

  refPreview!: HTMLElement;

  refEditor!: HTMLElement;

  syncDelay = 400;

  containerWidth = 0;

  @Watch("currentFile", { deep: true })
  syncModel(newValue: { order: string; value: IFile }) {
    this.SET_READ_MODE(newValue.value.readMode);

    let mod = this.modelStack[newValue.order];

    if (!mod) {
      mod = monaco.editor.createModel(newValue.value.content, "markdown-math");
      this.modelStack[newValue.order] = mod;
    }

    this.editor.setModel(mod);
    this.syncPreOrToc(this);
    Prism.highlightAll();
  }

  syncPreOrToc = debounce((that: this) => {
    /* 二选一即可，后者只更新 TOC */
    if (that.dbColumn || that.isReadMode) {
      that.refPreview.innerHTML = markdownEngine.render(that.editor.getValue());
      Prism.highlightAll();
    } else if (this.panelType === EPanelType.TOC) {
      markdownEngine.render(that.editor.getValue());
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
    this.refPreview.innerHTML = markdownEngine.render(this.editor.getValue());
  }

  handleRevealSection(value: Array<number>) {
    this.editor.revealLineInCenter(value[1], monaco.editor.ScrollType.Smooth);
    this.editor.setPosition({ column: 1, lineNumber: value[1] });
  }

  handleSyncResize() {
    this.containerWidth = (this.$el as HTMLElement).offsetWidth;
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

    monaco.editor.defineTheme("CyanLight", theme);

    this.editor = monaco.editor.create(this.refEditor, init);

    this.modelStack[this.currentIndex] = monaco.editor.createModel(
      this.currentFile.value.content,
      "markdown-math"
    );

    const extension = new monacoMarkdown.MonacoMarkdownExtension();
    extension.activate(this.editor);

    this.$nextTick(() => {
      /* 切换标签触发函数 */
      this.editor.onDidChangeModelContent(() => this.syncPreOrToc(this));

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
      this.editor.onDidScrollChange((e: monaco.IScrollEvent) => {
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

      // FEAT 监听快捷键
      this.editor.onKeyDown(() => {});

      this.containerWidth = (this.$el as HTMLElement).offsetWidth;

      this.$bus.on(BUS_UI.SYNC_RESIZE, this.handleSyncResize);
    });
  }

  beforeDestroy() {
    this.modelStack = {};
    this.editor.dispose();
    this.$bus.off(BUS_UI.SYNC_RESIZE, this.handleSyncResize);
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

  /deep/ .context-view .monaco-scrollable-element {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 4px;
  }

  /deep/ .monaco-menu .monaco-action-bar.vertical .action-item {
    border: none;
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

  /deep/ .monaco-menu .monaco-action-bar.vertical .action-label.separator {
    border-bottom-color: #e2e8f0 !important;
  }

  /deep/ .monaco-editor {
    .scrollbar .slider {
      background: #eee;
    }

    .scroll-decoration {
      box-shadow: #efefef 0 2px 2px -2px inset;
    }
  }
}

#markdown-preview {
  height: 100%;
  overflow: auto;
  padding-left: 1em;
  background-color: #fafafa;
  font-family: @normal-font-family;
  font-size: @preview-font-size;

  /deep/ a {
    color: rgba(0, 0, 0, 0.98);
    word-wrap: break-word;
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.26);
    &:hover {
      color: #000;
      border-bottom: 1px solid #000;
    }
  }
  /deep/ img {
    display: block;
    max-width: 100%;
    border-radius: 2px;
    margin: 24px auto;
  }

  /deep/ p {
    line-height: 1.62;
    margin-bottom: 1.12em;
    font-size: @preview-font-size;
    letter-spacing: 0.05em;
    hyphens: auto;
  }

  /deep/ p,
  /deep/ li {
    line-height: 1.62;

    code {
      font-family: @code-font-family;
      line-height: initial;
      word-wrap: break-word;
      border-radius: 0;
      background-color: #fff5f5;
      color: #c53030;
      padding: 0.2em 0.33333333em;
      font-size: 0.875rem;
      margin-left: 0.125em;
      margin-right: 0.125em;
    }
  }

  /deep/ pre {
    background: #f7f6f3;
    padding: 16px;
    border-radius: 2px;

    code {
      color: #000;
      font-family: @code-font-family;
      background-color: unset;

      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        background: unset;
      }
    }
  }

  /deep/ blockquote {
    color: #9a9a9a;
    position: relative;
    padding: 0.4em 0 0 2.2em;
    font-size: 0.96em;

    &:before {
      position: absolute;
      top: -4px;
      left: 0;
      content: "\201c";
      font: 700 62px/1 serif;
      color: rgba(0, 0, 0, 0.1);
    }
  }

  /deep/ table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;

    tr {
      border-top: 1px solid #dfe2e5;
      &:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }

    td,
    th {
      border: 1px solid #dfe2e5;
      padding: 0.6em 1em;
    }
  }

  /deep/ ul,
  /deep/ ol {
    padding-left: 35px;
    line-height: 1.62;
    margin-bottom: 16px;
  }

  /deep/ ol {
    list-style: decimal !important;
  }

  /deep/ ul {
    list-style-type: square !important;
  }

  /deep/ h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 16px 0;
    font-weight: 700;
    padding-top: 16px;
  }

  /deep/ h1 {
    font-size: 1.8em;
  }

  /deep/ h2 {
    font-size: 1.52em;
  }

  /deep/ h3 {
    font-size: 1.27em;
  }

  /deep/ h4 {
    font-size: 1.05em;
  }

  /deep/ h5 {
    font-size: 1em;
  }

  /deep/ h6 {
    font-size: 1em;
    font-weight: 500;
  }

  /deep/ hr {
    display: block;
    border: 0;
    margin: 2.24em auto 2.86em;

    &:before {
      color: rgba(0, 0, 0, 0.2);
      font-size: 1.1em;
      display: block;
      content: "* * *";
      text-align: center;
    }
  }

  /deep/ .footnotes {
    margin-left: auto;
    margin-right: auto;
    max-width: 760px;
    padding-left: 18px;
    padding-right: 18px;

    &:before {
      content: "";
      display: block;
      border-top: 4px solid rgba(0, 0, 0, 0.1);
      width: 50%;
      max-width: 100px;
      margin: 40px 0 20px;
    }
  }

  /deep/ .contains-task-list {
    list-style-type: none;
    padding-left: 30px;
  }

  /deep/ .task-list-item {
    position: relative;
  }

  /deep/ .task-list-item-checkbox {
    position: absolute;
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin: 4px 0 0;
    top: -1px;
    left: -22px;
    transform-origin: center;
    transform: rotate(-90deg);
    transition: all 0.2s ease;

    &:checked {
      transform: rotate(0);

      &:before {
        border: transparent;
        background-color: #9ae6b4;
      }

      &:after {
        transform: rotate(-45deg) scale(1);
      }

      + .task-list-item-label {
        color: #999;
        text-decoration: line-through;
      }
    }

    &:before {
      content: "";
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      display: inline-block;
      border: 1px solid #9ae6b4;
      border-radius: 2px;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.2s ease;
    }

    &:after {
      content: "";
      transform: rotate(-45deg) scale(0);
      width: 9px;
      height: 5px;
      border: 1px solid #22543d;
      border-top: none;
      border-right: none;
      position: absolute;
      display: inline-block;
      top: 4px;
      left: 4px;
      transition: all 0.2s ease;
    }
  }

  /deep/ .markdownIt-TOC {
    list-style: none;
    background: #f7fafc;
    border-radius: 0.5rem;
    color: #4a5568;
  }

  /deep/ .markdownIt-TOC ul {
    padding-left: 16px;
    margin: 0;
  }

  /deep/ mark {
    background: #faf089;
    color: #744210;
  }
}
</style>
