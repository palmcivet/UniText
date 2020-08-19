<template>
  <layout-box :totalWidth="containerWidth" :showMinor="isPreview" :threWidth="1 / 4">
    <section id="markdown-editor" slot="left" />
    <section id="markdown-preview" slot="right" />
  </layout-box>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as monacoMarkdown from "monaco-markdown";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Prism from "prismjs";

import LayoutBox from "@/component/widgets/LayoutBox/Index.vue";
import { debounce } from "@/common/editor/utils";
import { ITocList } from "@/common/editor/create-toc";
import { markdownEngine } from "@/common/editor/markdown";
import { BUS_TOC, BUS_FILE } from "@/common/bus-channel";
import { IGeneralState, EEditMode } from "@/interface/vuex/general";
import { IFile, TTab } from "@/interface/vuex/workBench";
import { theme } from "./theme";
import { init } from "./option";

const panel = namespace("panel");
const general = namespace("general");
const workBench = namespace("workBench");

@Component({
  name: "MarkdownSource",
  components: {
    LayoutBox,
  },
})
export default class MarkdownSource extends Vue {
  @panel.State("toc")
  tocTree!: Array<ITocList>;

  @general.State((state: IGeneralState) => state.appearance.checkEdit)
  isPreview!: boolean;

  @workBench.State("currentFileIndex")
  currentFileIndex!: string;

  @workBench.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  editor!: monaco.editor.IStandaloneCodeEditor;

  modelStack: { [key: string]: monaco.editor.IModel } = {};

  refPreview!: HTMLElement;

  refEditor!: HTMLElement;

  syncDelay = 400;

  containerWidth = 0;

  @Watch("currentFile", { deep: true })
  syncModel(newValue: { order: string; value: IFile }) {
    let mod = this.modelStack[newValue.order];

    if (!mod) {
      mod = monaco.editor.createModel(newValue.value.content, "markdown-math");
      this.modelStack[newValue.order] = mod;
    }

    this.editor.setModel(mod);

    this.isPreview &&
      (this.refPreview.innerHTML = markdownEngine.render(this.editor.getValue())) &&
      Prism.highlightAll();
  }

  syncPreOrToc: Function = debounce((that: any) => {
    /* 二选一即可，后者只更新 TOC */
    if (that.isPreview) {
      that.refPreview.innerHTML = markdownEngine.render(that.editor.getValue());
    } else if (that.isToc) {
      markdownEngine.render(that.editor.getValue());
    }
  }, this.syncDelay);

  mounted() {
    setTimeout(() => {
      this.containerWidth = (this.$el as HTMLElement).offsetWidth;
    });

    this.refPreview = document.querySelector("#markdown-preview") as HTMLElement;
    this.refEditor = document.querySelector("#markdown-editor") as HTMLElement;

    monaco.editor.defineTheme("GrideaLight", theme);

    this.editor = monaco.editor.create(this.refEditor, init);

    this.modelStack[this.currentFileIndex] = monaco.editor.createModel(
      this.currentFile.value.content,
      "markdown-math"
    );

    const extension = new monacoMarkdown.MonacoMarkdownExtension();
    extension.activate(this.editor);

    this.$nextTick(() => {
      /* 以下为实时渲染 */

      // FEAT 内容分块，细粒度刷新
      this.editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) =>
        this.syncPreOrToc(this)
      );

      /* 以下为监听 */

      // FEAT 监听快捷键
      this.editor.onKeyDown(() => {});

      this.editor.onDidScrollChange((e: monaco.IScrollEvent) => {
        // 取 `scrollLeft` 和 `scrollTop` 为最左和最顶的高度
      });

      this.$bus.$on(BUS_TOC.REVEAL_SECTION, (value: Array<number>) => {
        this.editor.revealLineInCenter(value[1], monaco.editor.ScrollType.Smooth);
        this.editor.setPosition({ column: 1, lineNumber: value[1] });
      });

      this.$bus.$on(BUS_FILE.CLOSE_FILE, (index: string) => {
        this.modelStack[index].dispose();
        delete this.modelStack[index];
      });
    });
  }

  beforeDestroy() {
    this.modelStack = {};
    this.editor.dispose();
    this.$bus.$off(BUS_TOC.REVEAL_SECTION);
    this.$bus.$off(BUS_FILE.CLOSE_FILE);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

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
  padding: 14px 1em;
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
