<template>
  <div style="height: 100%">
    <tabs
      :openedFile="currentFileIndex"
      :tabGroup="currentTabs"
      @newFile="NEW_FILE($event)"
      @switchTabs="SWITCH_TABS($event)"
      @selectTab="SELECT_TAB($event)"
      @closeTab="CLOSE_TAB($event)"
    />

    <section class="editor">
      <blank v-if="currentFile === undefined" @newFile="NEW_FILE()"></blank>
      <markdown-editor
        v-else
        ref="refEditor"
        :content="file"
        @sync="syncContent($event)"
      />
    </section>

    <!-- 预览 -->
    <section class="preview" ref="refPreview"></section>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { mapState, mapActions } from "vuex";
import * as fse from "fs-extra";
import * as monaco from "monaco-editor";
import Prism from "prismjs";

import MarkdownEditor from "@/components/MarkdownEditor/Index.vue";
import EmojiCard from "@/components/EmojiCard/Index.vue";
import Blank from "@/views/containers/Editor/Blank.vue";
import Tabs from "@/views/containers/Editor/Tabs.vue";
import { IEditor, IFile } from "@/store/modules/editor";
import { IDocument } from "@/interfaces/document";
import { wordCount, timeCalc } from "@/helpers/words-count";
import markdown from "@/helpers/markdown";

const name = namespace("editor");

@Component({
  name: "Editor",
  components: {
    MarkdownEditor,
    EmojiCard,
    Blank,
    Tabs,
  },
})
export default class Editor extends Vue {
  @name.State("currentFileIndex")
  currentFileIndex!: number;

  @name.State("currentTabs")
  currentTabs!: Array<{ order: number; value: string }>;

  @name.Getter("currentFile")
  currentFile!: IFile;

  get file() {
    return this.currentFile.content;
  }

  @name.Mutation("TOGGLE_MODIFY")
  TOGGLE_MODIFY!: () => void;

  @name.Mutation("SYNC_CONTENT")
  SYNC_CONTENT!: (value: string) => void;

  @name.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: IDocument[]) => void;

  @name.Mutation("SELECT_TAB")
  SELECT_TAB!: (id: number) => void;

  @name.Action("CLOSE_TAB")
  CLOSE_TAB!: (id: number) => void;

  @name.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  $refs!: {
    refEditor: HTMLElement;
    refPreview: HTMLElement;
  };

  syncContent(value: string) {
    this.SYNC_CONTENT(value);
  }

  get postStats() {
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
      formatTime: formatTime,
      wordsNumber: Array.isArray(wordsNumber) ? 0 : wordsNumber,
    };
  }

  previewPost() {
    this.$refs.refPreview.innerHTML = markdown.render(this.currentFile.content);
    Prism.highlightAll();
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/var.less";

.editor {
  height: calc(100% - @tab-height - @tab-boxshadow);
  width: 100%;
}

.preview {
  width: 100%;
  font-family: "Droid Serif", "PingFang SC", "Hiragino Sans GB", "Droid Sans Fallback",
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

.preview-title {
  font-size: 24px;
  font-weight: bold;
  font-family: "Droid Serif", "PingFang SC", "Hiragino Sans GB", "Droid Sans Fallback",
    "Microsoft YaHei", sans-serif;
}

.preview-date {
  font-size: 13px;
  color: #718096;
  margin-bottom: 16px;
}

.preview-tags {
  font-size: 12px;
  margin-bottom: 16px;
  .tag {
    display: inline-block;
    margin: 0 8px 8px 0;
    padding: 4px 8px;
    background: #f7fafc;
    color: #4a5568;
    border-radius: 20px;
  }
}

.preview-feature-image {
  max-width: 100%;
  margin-bottom: 16px;
  border-radius: 2px;
}
</style>
