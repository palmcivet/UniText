export const devConfig = {
  general: {
    showTray: true,
    exitWhenClosed: false,
    recordHistory: true,
    openRecent: true,
    defaultTag: "Untaged",
    autoSave: false,
    autoSync: false,
    autoUpdate: true,
    language: "zh-CN",
  },
  editor: {
    newFile: {
      autoSave: false,
      autoSync: false,
      defaultTag: "Untaged",
    },
    layout: {
      showSideBar: true,
      showRender: false,
      showToc: true,
      showPanel: "show",
    },
  },
  markdown: {
    image: {
      cachePath: "./.CONFIG/_cache",
    },
  },
  theme: {},
  keybinding: {},
};
