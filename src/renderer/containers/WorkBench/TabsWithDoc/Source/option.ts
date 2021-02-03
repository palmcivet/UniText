import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export const init: editor.IEditorConstructionOptions = {
  language: "markdown-math",
  fontSize: 16,
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
  highlightActiveIndentGuide: true,
  renderIndentGuides: false,
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
  wordBasedSuggestions: false,
  snippetSuggestions: "none",
  lineDecorationsWidth: 0,
  occurrencesHighlight: true,
  automaticLayout: true,
  fontFamily:
    "Source Code Pro, STZhongSong, PingFang SC, SF UI Text, STheiti, Microsoft YaHei, sans-serif",
};
