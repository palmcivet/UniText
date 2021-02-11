import { localesCommon } from "./iCommon";
export const localesView = {
  sidebar: {
    files: localesCommon.files,
    files_title: ["文件管理"],
    files_empty: ["无打开的文件夹"],
    files_toggle: ["收起"],
    files_button: ["打开文件夹"],
    search: ["搜索"],
    bookmarks: ["书签"],
    tags: ["标签"],
    notes: ["便签"],
    schedule: ["日程"],
    settings: ["设置"],
    settings_preference: localesCommon.preference,
    settings_markdown: localesCommon.markdown,
    settings_keybinding: localesCommon.keybinding,
    settings_snippet: localesCommon.snippet,
    settings_theme: localesCommon.theme,
    settings_theme_appearence: localesCommon.appearence,
    settings_theme_editor: localesCommon.editor,
    settings_theme_view: localesCommon.view,
    settings_theme_icon: localesCommon.icon,
  },

  panel: {
    created: ["创建时间"],
    modified: ["更改时间"],
    word_count: ["词数"],
    char_count: ["字数"],
    read_time: ["阅读时长"],
    edit_time: ["编辑时长"],
  },

  status: {
    tag_add: ["增加标签"],
    source_edit: ["编辑"],
    source_preview: ["预览"],
    wysiwyg_write: ["书写"],
    wysiwyg_source: ["源码"],
    present_preview: ["浏览模式", "View Mode"],
    present_edit: ["编辑模式", "Edit Mode"],
    TOC: ["大纲"],
    INFO: ["信息"],
    EXPORT: ["导出"],
  },

  ui: {
    drag: ["拖拽", "Drag"],
    resize: ["缩放", "Resize"],
  },
};
