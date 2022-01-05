import { editor } from "monaco-editor";

const init: editor.IStandaloneEditorConstructionOptions = {
  language: "markdown-math",
  fontSize: 16,
  lineNumbers: "on",
  minimap: {
    enabled: false,
  },
  wordWrap: "off",
  cursorWidth: 2,
  cursorSmoothCaretAnimation: true,
  cursorBlinking: "smooth",
  colorDecorators: true,
  folding: true,
  renderLineHighlight: "all",
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  lineHeight: 26,
  scrollBeyondLastLine: true,
  smoothScrolling: true,
  wordBasedSuggestions: true,
  snippetSuggestions: "bottom",
  lineDecorationsWidth: 0,
  occurrencesHighlight: true,
  automaticLayout: true,
  fontFamily:
    "Source Code Pro, STZhongSong, PingFang SC, SF UI Text, STheiti, Microsoft YaHei, sans-serif",
};

init["semanticHighlighting.enabled"] = true;

export { init };
