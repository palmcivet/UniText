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
    mark_add: ["添加书签"],
    mark_del: ["取消书签"],
    read: ["阅读"],
    edit: ["编辑"],
    save: ["保存"],
    open: ["打开"],
    new_file: ["新建文件"],
    new_folder: ["新建文件夹"],
    project_open: localesCommon.open_project,
    project_close: ["关闭笔记库"],
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
    sidebar: ["侧边栏"],
    sidepanel: ["侧边面板"],
    statusbar: ["状态栏"],
    preview: ["预览模式"],
    source: ["编辑模式"],
    autowrap: ["折行"],
    minimap: ["地图"],
    space: ["显示空格"],
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
