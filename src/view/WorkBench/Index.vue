<template>
  <div style="height: 100%">
    <tabs
      :openedFile="currentFileIndex"
      :tabGroup="currentTabs"
      @newFile="NEW_FILE()"
      @switchTabs="SWITCH_TABS($event)"
      @selectTab="SELECT_TAB({ cur: $event })"
      @closeTab="handleClose($event)"
    />

    <blank v-show="currentTabs.length === 0" class="workbench" @newFile="NEW_FILE()" />

    <article v-show="currentTabs.length !== 0" class="workbench">
      <section
        id="markdown-editor"
        :style="{ width: finalWidth ? `calc(100% - ${finalWidth}px` : '50%' }"
      />
      <span v-show="isPreview" ref="resize" />
      <section
        id="markdown-preview"
        v-show="isPreview"
        :style="{ width: finalWidth ? `${finalWidth}px` : '50%' }"
      />
    </article>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import Prism from "prismjs";
import * as monacoMarkdown from "monaco-markdown";
import * as monaco from "monaco-editor";

import EmojiCard from "@/common/widgets/EmojiCard/Index.vue";
import Blank from "@/view/WorkBench/Blank/Index.vue";
import Tabs from "@/view/WorkBench/Tabs/Index.vue";
import { IEditor, IFile, TTab } from "@/store/modules/editor";
import { IDocument } from "@/interface/document";
import { wordCount, timeCalc } from "@/common/helpers/words-count";
import markdown from "@/common/helpers/markdown";
import theme from "./theme";

const name = namespace("editor");

@Component({
  name: "WorkBench",
  components: {
    EmojiCard,
    Blank,
    Tabs,
  },
})
export default class WorkBench extends Vue {
  @name.State("currentFileIndex")
  currentFileIndex!: string;

  @name.State("currentTabs")
  currentTabs!: Array<TTab>;

  @name.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  @name.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: IDocument[]) => void;

  @name.Mutation("SELECT_TAB")
  SELECT_TAB!: (index: string) => void;

  @name.Action("CLOSE_FILE")
  CLOSE_FILE!: (index: string) => void;

  @name.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  @name.Mutation("TOGGLE_MODIFY")
  TOGGLE_MODIFY!: () => void;

  initOption: monaco.editor.IEditorConstructionOptions = {
    language: "markdown-math",
    fontSize: 16,
    theme: "GrideaLight",
    lineNumbers: "on",
    minimap: {
      enabled: false,
    },
    wordWrap: "on",
    cursorWidth: 2,
    cursorSmoothCaretAnimation: true,
    cursorBlinking: "smooth",
    colorDecorators: true,
    folding: true,
    highlightActiveIndentGuide: false,
    renderIndentGuides: false,
    renderLineHighlight: "none",
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      verticalScrollbarSize: 4,
    },
    lineHeight: 26.25,
    scrollBeyondLastLine: true,
    wordBasedSuggestions: false,
    snippetSuggestions: "none",
    lineDecorationsWidth: 0,
    occurrencesHighlight: true,
    automaticLayout: true,
    fontFamily:
      "Source Code Pro, STZhongSong, PingFang SC, SF UI Text, STheiti, Microsoft YaHei, sans-serif",
  };

  editor!: monaco.editor.IStandaloneCodeEditor;

  modelStack: { [key: string]: monaco.editor.IModel } = {};

  isPreview = true;

  editWidth = 0;

  get finalWidth() {
    return this.editWidth;
  }

  set finalWidth(value: number) {
    this.editWidth = value;
  }

  getStatus() {
    const reading = timeCalc("");
    const second = Number((reading.second - (reading.minius - 1) * 60).toFixed(2));
    const formatTime = `${Math.floor(reading.second / 60)}m ${second < 60 ? second : ""}${
      second < 60 ? "s" : ""
    }`;

    let wordsNumber = 0;
    wordCount("", (count: number) => {
      wordsNumber = count;
    });

    return {
      formatTime,
      wordsNumber: Array.isArray(wordsNumber) ? 0 : wordsNumber,
    };
  }

  handleClose(index: string) {
    this.CLOSE_FILE(index);
    (this.modelStack[index] as monaco.editor.ITextModel).dispose();
    delete this.modelStack[index];
  }

  @Watch("currentFile", { deep: true })
  syncModel(newValue: { order: string; value: IFile }) {
    let mod = this.modelStack[newValue.order];

    if (!mod) {
      mod = monaco.editor.createModel(newValue.value.content, "markdown-math");
      this.modelStack[newValue.order] = mod;
    }

    this.editor.setModel(mod);
    this.isPreview && this.syncPreview(this.editor.getValue());
  }

  syncContent(value: string) {}

  syncPreview(value: string) {
    (document.querySelector(
      "#markdown-preview"
    ) as HTMLElement).innerHTML = markdown.render(value);
    Prism.highlightAll();
  }

  created() {
    this.NEW_FILE();
  }

  mounted() {
    monaco.editor.defineTheme("GrideaLight", theme as monaco.editor.IStandaloneThemeData);

    this.editor = monaco.editor.create(
      document.querySelector("#markdown-editor") as HTMLElement,
      this.initOption
    );

    this.modelStack[this.currentFileIndex] = monaco.editor.createModel(
      this.currentFile.value.content,
      "markdown-math"
    );

    const extension = new monacoMarkdown.MonacoMarkdownExtension();
    extension.activate(this.editor);

    this.$nextTick(() => {
      /* 实时渲染 */
      // FEAT 内容分块，细粒度刷新
      this.editor.onDidChangeModelContent(async () => {
        this.syncPreview(this.editor.getValue());
      });

      // FEAT 监听快捷键
      this.editor.onKeyDown(() => {});

      /* 获取容器宽度，编辑区初始值为容器的 50% */
      const parent = this.$el as HTMLElement;
      let containerWidth = parent.offsetWidth;
      this.editWidth = parent.offsetWidth / 2;

      let startX = 0;
      let leftSide = this.editWidth;
      let startWidth = leftSide;

      const mouseMoveHandler = (e: MouseEvent) => {
        const offset = e.clientX - startX;
        leftSide = startWidth - offset;
        if (leftSide < containerWidth / 4) {
          this.editWidth = containerWidth / 4;
        } else if (leftSide > (containerWidth * 3) / 4) {
          this.editWidth = (containerWidth * 3) / 4;
        } else {
          this.editWidth = leftSide;
        }
      };

      const mouseUpHandler = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandler, false);
        if (
          containerWidth - leftSide >= containerWidth / 4 &&
          containerWidth - leftSide <= (containerWidth / 4) * 3
        ) {
          this.editWidth = leftSide;
        }
      };

      const mouseDownHandler = (e: MouseEvent) => {
        startX = e.clientX;
        containerWidth = parent.offsetWidth;
        startWidth = this.editWidth;

        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("mouseup", mouseUpHandler, false);
      };

      (this.$refs.resize as HTMLElement).addEventListener(
        "mousedown",
        mouseDownHandler,
        false
      );
    });
  }

  beforeDestroy() {
    this.modelStack = {};
    this.editor.dispose();
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

.workbench {
  height: calc(100% - @tab-height - @tab-boxshadow);
  width: 100%;
  display: flex;

  & > span {
    width: 2px;
    height: 100%;
    cursor: col-resize;
    background-color: rgba(255, 255, 255, 0.6);

    &:hover {
      border-right: 1px solid rgba(230, 230, 230, 0.4); // DEV
    }
  }
}

#markdown-editor {
  height: 100%;
  width: 100%;

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
    .scrollbar {
      .slider {
        background: #eee;
      }
    }

    .scroll-decoration {
      box-shadow: #efefef 0 2px 2px -2px inset;
    }
  }
}

#markdown-preview {
  overflow: auto;
  padding: 1em;
  background-color: #fafafa;

  font-family: "Source Code Pro", "STZhongSong", "PingFang SC", "Droid Sans Fallback",
    "Microsoft YaHei", sans-serif;
  font-size: 15px;

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
    font-size: 15px;
    letter-spacing: 0.05em;
    hyphens: auto;
  }

  /deep/ p,
  /deep/ li {
    line-height: 1.62;
    code {
      font-family: "Source Code Pro", Consolas, Menlo, Monaco, "Courier New", monospace;
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
      font-family: "Source Code Pro", Consolas, Menlo, Monaco, "Courier New", monospace;
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
    font-size: 1.42em;
  }
  /deep/ h3 {
    font-size: 1.17em;
  }
  /deep/ h4 {
    font-size: 1em;
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
    padding: 1.5rem;
    border-radius: 0.5rem;
    color: #4a5568;
  }

  /deep/ .markdownIt-TOC ul {
    list-style: none;
    padding-left: 16px;
  }

  /deep/ mark {
    background: #faf089;
    color: #744210;
  }
}
</style>
