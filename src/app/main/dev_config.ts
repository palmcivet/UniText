/**
 * 用于开发时跳过读磁盘而直接加载配置文件
 */

export const devConfig = {
  /* 通用 */
  general: {
    showTray: true,
    exitWhenClosed: false,
    saveRecent: true,
    autoOpen: true,
    autoUpdate: true,
    language: "zh-CN",
    notesPath: "~/.unitext",
    interface: {
      showPanel: "side",
      panelType: "toc",
      showSideBar: true,
      showRender: false,
    },
  },
  /* 编辑器相关 */
  editor: {
    /* 缺省文档设置 */
    defaultDoc: {
      tag: "Untaged",
      category: "Uncategory",
      format: {
        indent: 4,
        encoding: "UTF-8",
        endOfLine: "LF",
      },
      config: {
        picStorage: "",
        autoSave: false,
        autoSync: false,
      },
    },
    lineNumber: true,
    highlightLine: true,
  },
  /* Markdown 语法设置 */
  markdown: {
    scheme: "GFM", // standard/GFM/rich-text
    image: {
      cachePath: "./.CONFIG/_cache", // 图片缓存
    },
  },
  theme: {},
  snippet: {},
  keybinding: {},
};
