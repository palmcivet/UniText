import { localesCommon } from "./iCommon";

export const localesMenu = {
  system: {
    about: ["关于 UniText"],
    check: ["检查更新"],
    preference: localesCommon.preference,
    theme: localesCommon.theme,
    themeappearence: localesCommon.appearence,
    themeeditor: localesCommon.editor,
    themeview: localesCommon.view,
    themeicon: localesCommon.icon,
    keybinding: localesCommon.keybinding,
    keybindingdefault: ["默认设置"],
    keybindinguser: ["用户设置"],
    snippet: localesCommon.snippet,
    snippetview: ["查看"],
    snippetcreate: ["新建"],
    services: ["服务"],
    hide: ["隐藏"],
    hideothers: ["隐藏其他"],
    close: ["关闭"],
    quit: ["退出"],
  },

  file: {
    label: localesCommon.files,
    read: ["阅读"],
    edit: ["编辑"],
    save: ["保存"],
    open: ["打开"],
    new_file: ["新建文件"],
    new_folder: ["新建文件夹"],
    open_project: localesCommon.open_project,
    close_project: ["关闭笔记文件夹"],
    reveal: ["显示在文件管理器"],
  },

  edit: {
    label: ["编辑"],
    undo: ["撤销"],
    redo: ["重做"],
    cut: ["剪切"],
    copy: ["复制"],
    paste: ["粘贴"],
    delete: ["删除"],
    selectall: ["全选"],
    rename: ["重命名"],
    reicon: ["更改图标"],
  },

  view: {
    label: ["查看"],
    status: ["状态栏"],
  },

  window: {
    label: ["窗口"],
  },

  help: {
    label: ["帮助"],
    report: ["报告错误"],
    learnmore: ["更多信息"],
    toggledevtools: ["开发者工具"],
  },

  toc: {
    retitle: ["更改标题"],
    titleup: ["提升一级"],
    titledown: ["降低一级"],
  },

  tab: {
    closecurrent: ["关闭当前标签"],
    closesaved: ["关闭已保存标签"],
    closeall: ["关闭所有标签"],
    saveall: ["保存所有标签"],
    preview: ["预览"],
    pin: ["固定标签"],
  },

  dock: {
    newwindow: ["新建窗口"],
    newagenda: ["新建日程"],
    newnote: ["新建笔记"],
  },

  tray: {},
};
