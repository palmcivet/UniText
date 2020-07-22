<template>
  <div style="height: 100%">
    <div class="editor-container">
      <!-- tab 栏 -->
      <tabs
        :openedFile="currentFileIndex"
        :tabGroup="currentTabs"
        @newFile="NEW_FILE()"
        @switchTabs="SWITCH_TABS($event)"
        @selectTab="SELECT_TAB($event)"
        @closeTab="CLOSE_TAB($event)"
      />

      <monaco-markdown-editor
        class="post-editor"
        ref="monacoMarkdownEditor"
        v-model="form.content"
        :isPostPage="true"
      />

      <div class="right-tool-container">
        <a-popover placement="left" trigger="click">
          <template slot="content">
            <div class="post-stats">
              <div class="item">
                <h4>{{ $t("words") }}</h4>
                <div class="number">{{ postStats.wordsNumber }}</div>
              </div>
              <div class="item">
                <h4>{{ $t("readingTime") }}</h4>
                <div class="number">{{ postStats.formatTime }}</div>
              </div>
            </div>
          </template>
          <div class="op-btn" @click="handleInfoClick">
            <i class="zwicon-info-circle"></i>
          </div>
        </a-popover>
        <a-popover placement="left" trigger="click">
          <template slot="content">
            <EmojiCard @select="handleEmojiSelect" />
          </template>
          <div class="op-btn" @click="handleEmojiClick">
            <i class="zwicon-smile"></i>
          </div>
        </a-popover>
        <a-tooltip placement="left" :title="$t('insertImage')">
          <div class="op-btn" @click="insertImage">
            <i class="zwicon-image"></i>
          </div>
        </a-tooltip>
        <a-tooltip placement="left" :title="$t('insertMore')">
          <div class="op-btn" @click="insertMore">
            <i class="zwicon-more-v"></i>
          </div>
        </a-tooltip>
        <a-tooltip placement="left" :title="$t('postSettings')">
          <div class="op-btn" @click="handlePostSettingClick">
            <i class="zwicon-cog"></i>
          </div>
        </a-tooltip>
        <a-tooltip placement="left" :title="`${$t('preview')} [Ctrl + P]`">
          <div
            class="op-btn"
            v-shortkey="['ctrl', 'p']"
            @shortkey="shortPreviewPost"
            @click="previewPost"
          >
            <i class="zwicon-eye"></i>
          </div>
        </a-tooltip>
      </div>
      <div class="right-bottom-tool-container">
        <a-popover placement="leftBottom" trigger="click">
          <template slot="content">
            <div class="keyboard-container">
              <div class="item" v-for="(item, index) in shortcutKeys" :key="index">
                <a-divider class="keyboard-group-title" orientation="left">
                  {{ item.name }}
                </a-divider>
                <div class="list">
                  <div
                    class="list-item"
                    v-for="(listItem, listIndex) in item.list"
                    :key="listIndex"
                  >
                    <div class="list-item-title">{{ listItem.title }}</div>
                    <div>
                      <span
                        v-for="(keyCode, keyIndex) in listItem.keyboard"
                        :key="keyIndex"
                      >
                        <code>{{ keyCode }}</code>
                        <span v-if="keyIndex !== listItem.keyboard.length - 1">
                          +
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="op-btn">
            <i class="zwicon-keyboard"></i>
          </div>
        </a-popover>
      </div>
    </div>

    <!-- 预览 -->
    <div class="preview-container" ref="previewContainer"></div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell, clipboard, remote } from "electron";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { mapState, mapActions } from "vuex";
import shortid from "shortid";
import * as fse from "fs-extra";
import * as monaco from "monaco-editor";
import Prism from "prismjs";

import MonacoMarkdownEditor from "@/components/MonacoMarkdownEditor/Index.vue";
import EmojiCard from "@/components/EmojiCard/Index.vue";
import Tabs from "@/views/containers/Editor/tabs.vue";
import { IEditor } from "@/store/modules/editor";
import { IDocument } from "@/interfaces/document";
import { wordCount, timeCalc } from "@/helpers/words-count";
import markdown from "@/helpers/markdown";
import shortcutKeys from "@/helpers/shortcut-keys";

const name = namespace("editor");

@Component({
  name: "Editor",
  components: {
    MonacoMarkdownEditor,
    EmojiCard,
    Tabs,
  },
})
export default class Editor extends Vue {
  @name.State("currentFileIndex")
  currentFileIndex!: number;

  @name.State("currentTabs")
  currentTabs!: Array<{ order: number; value: string }>;

  @name.Getter("currentFile")
  currentFile!: IDocument;

  @name.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (state: IEditor, value: IDocument[]) => void;

  @name.Mutation("SELECT_TAB")
  SELECT_TAB!: (state: IEditor, id: number) => void;

  @name.Action("CLOSE_TAB")
  CLOSE_TAB!: (state: IEditor, id: number) => void;

  @name.Action("NEW_FILE")
  NEW_FILE!: (state: IEditor, title: string) => void;

  postSettingsVisible = false;

  previewVisible = false;

  previewPostHTML = "";

  changedAfterLastSave = false;

  shortcutKeys = shortcutKeys;

  $refs!: {
    uploadInput: any;
    image: any;
    articlePage: HTMLElement;
    monacoMarkdownEditor: any;
    previewContainer: HTMLElement;
    pageTitle: HTMLElement;
  };

  form = {
    title: "",
    fileName: "",
    tags: [] as string[],
    content: "",
    published: false,
    hideInList: false,
    isTop: false,
    featureImage: {
      path: "",
      name: "",
      type: "",
    },
    featureImagePath: "",
    deleteFileName: "",
  };

  featureType: "DEFAULT" | "EXTERNAL" = "DEFAULT";

  activeKey = ["1"];

  get dateLocale() {
    return this.$root.$i18n.locale === "zhHans" ? "zh-cn" : "en-us";
  }

  // 编辑文章时，当前文章的索引
  currentPostIndex = -1;

  originalFileName = "";

  fileNameChanged = false;

  get canSubmit() {
    return this.form.title && this.form.content;
  }

  get postStats() {
    const reading = timeCalc(this.form.content);
    const second = Number((reading.second - (reading.minius - 1) * 60).toFixed(2));
    const formatTime = `${Math.floor(reading.second / 60)}m ${second < 60 ? second : ""}${
      second < 60 ? "s" : ""
    }`;

    let wordsNumber = 0;
    wordCount(this.form.content, (count: number) => {
      wordsNumber = count;
    });

    return {
      formatTime: formatTime,
      wordsNumber: Array.isArray(wordsNumber) ? 0 : wordsNumber,
    };
  }

  mounted() {
    ipcRenderer.removeAllListeners("click-menu-save");
    ipcRenderer.on("click-menu-save", (event: IpcRendererEvent, data: any) => {
      this.normalSavePost();
    });

    this.$watch(
      "form",
      () => {
        this.changedAfterLastSave = true;
      },
      { deep: true }
    );
  }

  beforeFeatureUpload(file: any) {
    if (!file) {
      return;
    }
    const isImage = file.type.indexOf("image") !== -1;
    if (!isImage) {
      return;
    }
    if (file && isImage) {
      this.form.featureImage = {
        name: file.name,
        path: file.path,
        type: file.type,
      };
    }

    return false;
  }

  close() {
    if (this.changedAfterLastSave) {
      this.$confirm({
        title: `${this.$t("warning")}`,
        content: `${this.$t("unsavedWarning")}`,
        okText: `${this.$t("noSaveAndBack")}`,
        okType: "danger",
        cancelText: `${this.$t("cancel")}`,
        zIndex: 2000,
        onOk: () => {
          this.$emit("close");
        },
      });
      return;
    }
    this.$emit("close");
  }

  handleFileNameChange(val: string) {
    this.fileNameChanged = !!val;
  }

  preventDefault(e: any) {
    if (e.target.tagName === "A") {
      const href = e.target.getAttribute("href");
      if (href && !href.startsWith("#")) {
        // ignore anchor link.
        e.preventDefault();
        shell.openExternal(href);
      }
    }
  }

  formatForm(published?: boolean) {
    if (this.form.fileName.includes("/")) {
      this.$message.error(`${this.$t("postUrlIncludeTip")}`);
      return;
    }

    // 文件名改变之后，删除原来文件
    if (this.form.fileName.toLowerCase() !== this.originalFileName.toLowerCase()) {
      this.form.deleteFileName = this.originalFileName;
    }

    const form = { ...this.form };
    if (this.featureType !== "EXTERNAL") {
      form.featureImagePath = "";
    }
    if (this.featureType !== "DEFAULT") {
      form.featureImage = {
        path: "",
        name: "",
        type: "",
      };
    }
    form.published = typeof published === "boolean" ? published : form.published;

    return form;
  }

  // 保存草稿
  saveDraft() {
    if (!this.canSubmit) return;
    const form = this.formatForm(false);

    ipcRenderer.send("app-post-create", form);
    ipcRenderer.once("app-post-created", (event: IpcRendererEvent, data: any) => {
      this.$message.success(`🎉  ${this.$t("draftSuccess")}`);
      this.$emit("fetchData");
    });
  }

  savePost() {
    if (!this.canSubmit) return;
    const form = this.formatForm(true);

    ipcRenderer.send("app-post-create", form);
    ipcRenderer.once("app-post-created", (event: IpcRendererEvent, data: any) => {
      this.$message.success(`🎉  ${this.$t("saveSuccess")}`);
      this.$emit("fetchData");
    });
  }

  normalSavePost() {
    if (!this.canSubmit) return;
    const form = this.formatForm();

    ipcRenderer.send("app-post-create", form);
    ipcRenderer.once("app-post-created", (event: IpcRendererEvent, data: any) => {
      this.$emit("fetchData");
    });
  }

  insertImage() {
    this.$refs.uploadInput.click();
  }

  handlePostSettingClick() {
    this.postSettingsVisible = true;
  }

  handleInfoClick() {}

  handleEmojiClick() {}

  uploadImageFiles(files: any[]) {
    ipcRenderer.send("image-upload", files);
    ipcRenderer.once("image-uploaded", (event: IpcRendererEvent, data: any) => {
      for (const path of data) {
        let url = `![](file://${path})`;
        url = url.replace(/\\/g, "/");

        this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
          {
            range: monaco.Range.fromPositions(
              this.$refs.monacoMarkdownEditor.editor.getPosition()
            ),
            text: url,
          },
        ]);
      }
    });
  }

  insertMore() {
    this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
      {
        range: monaco.Range.fromPositions(
          this.$refs.monacoMarkdownEditor.editor.getPosition()
        ),
        text: "\n<!-- more -->\n",
      },
    ]);
  }

  handleEmojiSelect(emoji: any) {
    this.$refs.monacoMarkdownEditor.editor.getModel().applyEdits([
      {
        range: monaco.Range.fromPositions(
          this.$refs.monacoMarkdownEditor.editor.getPosition()
        ),
        text: emoji,
      },
    ]);
  }

  previewPost() {
    this.previewVisible = true;
    setTimeout(() => {
      this.$refs.previewContainer.innerHTML = markdown.render(this.form.content);
      Prism.highlightAll();
    }, 1);
  }

  shortPreviewPost(event: any) {
    if (this.previewVisible) {
      this.previewVisible = false;
      return;
    }
    this.previewPost();
  }

  /**
   * 单张图片上传
   */
  fileChangeHandler(e: any) {
    const file = (e.target.files || e.dataTransfer)[0];
    if (!file) {
      return;
    }
    const isImage = file.type.indexOf("image") !== -1;
    if (!isImage) {
      return;
    }
    if (file && isImage) {
      this.uploadImageFiles([
        {
          name: file.name,
          path: file.path,
          type: file.type,
        },
      ]);
    }
  }

  openPage(url: string) {
    shell.openExternal(url);
  }
}
</script>

<style lang="less" scoped>
.upload-input {
  display: none;
}

.btn {
  margin-left: 16px;
}

.feature-image-container {
  text-align: center;
  padding: 16px;
}

.feature-image {
  max-width: 100%;
}

/deep/ .ant-upload.ant-upload-select-picture-card {
  width: 100%;
}

/deep/ .ant-modal-content {
  height: 100%;
}

/deep/ .ant-collapse {
  background: #f7f6f3;
}

.tip-text {
  margin: 8px 0;
}

#markdown-editor {
  /deep/ .editor-toolbar {
    position: fixed;
    top: 0px;
    z-index: 3000;
    &:before {
      margin-bottom: 7px;
    }
  }
}

.editor-container {
  background: #ffffff;
}

.ant-drawer {
  z-index: 1025;
}

.upload-img {
  width: 80px;
}
.upload-icon {
  font-size: 18px;
  margin-top: 8px;
  display: block;
}

.post-settings {
  /deep/ .ant-collapse-item {
    border-bottom: 1px solid #e8e8e88a;

    > .ant-collapse-header {
      padding-left: 16px;
      background: #fbfbfb;
      .arrow {
        left: auto;
        right: 16px;
      }
    }

    &.ant-collapse-item-active {
      > .ant-collapse-header {
        background: #fff;
      }
    }
  }
}

.editor-container {
  background: #fff;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .post-title {
    font-weight: 400;
    background: #eff3e5;
    padding: 5px;
    font-size: 24px;
    color: #000;
    border: none;
    display: block;
    width: 728px;
    margin: 10px auto 10px;
    &:focus {
      box-shadow: none;
    }
  }

  .post-editor {
    flex: 1;
    padding: 0 5px;

    /deep/ .monaco-markdown-editor {
      width: 728px;
    }

    /deep/ .monaco-editor {
      .scrollbar {
        position: fixed !important;
        top: 110px !important;
      }
    }
  }
}

.right-tool-container,
.right-bottom-tool-container {
  position: absolute;
  right: 5px;
  display: flex;
  flex-direction: column;
  color: #a0aec0;
  transition: color 0.3s ease;
  transition: opacity 700ms ease;
  &:hover {
    color: #4a5568;
  }
  .op-btn {
    font-size: 18px;
    margin-top: 8px;
    padding: 4px;
    border-radius: 4px;
    line-height: 1;
    transition: all 0.3s;
    &:hover {
      background: #efefef;
      color: #515457;
    }
  }
}

.right-tool-container {
  bottom: 50%;
  transform: translateY(50%);
}

.right-bottom-tool-container {
  bottom: 2px;
}

.post-title-container {
  margin-left: 65px;
}

.save-tip {
  padding: 4px 10px;
  line-height: 22px;
  font-size: 12px;
  color: #b7b7b7;
  position: fixed;
  left: 0;
  bottom: 0;
}

.preview-container {
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

.keyboard-container {
  width: 200px;
  .keyboard-group-title {
    margin: 8px 0;
    font-size: 12px;
  }
  .list {
    .list-item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      padding: 4px;
      border-radius: 2px;
      &:not(:last-child) {
        border-bottom: 1px solid #fafafa;
      }
      &:hover {
        background: #fffff0;
        color: #b7791f;
      }

      code {
        padding: 0px 4px;
        border-radius: 2px;
        background: #edf2f7;
      }
    }
  }
}

.post-stats {
  display: flex;
  .item {
    width: 50%;
    min-width: 80px;
    h4 {
      color: #718096;
      font-size: 12px;
      font-weight: normal;
    }
    .number {
      font-size: 18px;
      font-family: "Droid Serif";
    }
  }
}

.keyboard-tip {
  font-size: 12px;
  color: #909090;
}
</style>
