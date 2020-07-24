<template>
  <div id="markdown-editor"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model, Emit } from "vue-property-decorator";
import * as monaco from "monaco-editor";
import * as monacoMarkdown from "monaco-markdown";
import theme from "./theme";

@Component
export default class MarkdownEditor extends Vue {
  @Prop({ type: String, required: true })
  content!: string;

  editor!: monaco.editor.IStandaloneCodeEditor;

  mounted() {
    monaco.editor.defineTheme("GrideaLight", theme as monaco.editor.IStandaloneThemeData);

    this.editor = monaco.editor.create(
      document.getElementById("markdown-editor") as HTMLElement,
      {
        language: "markdown-math",
        value: this.content,
        fontSize: 15,
        theme: "GrideaLight",
        lineNumbers: "on",
        lineNumbersMinChars: 5,
        minimap: {
          enabled: true,
        },
        wordWrap: "on",
        cursorWidth: 2,
        cursorSmoothCaretAnimation: true,
        cursorBlinking: "blink",
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
        occurrencesHighlight: false,
        automaticLayout: true,
        fontFamily:
          "Source Code Pro, STZhongSong, PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif",
      }
    );

    const extension = new monacoMarkdown.MonacoMarkdownExtension();
    extension.activate(this.editor);

    this.editor.onKeyDown(() => {
      // FEAT 监听快捷键
    });

    this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getValue();
      this.$emit("sync", value);
    });
  }
}
</script>

<style lang="less" scoped>
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
</style>
