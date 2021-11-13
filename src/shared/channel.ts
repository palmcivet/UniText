export enum BUS_EDITOR {
  SYNC_TOC = "EDITOR::SYNC_TOC",
  SYNC_IMGLIST = "EDITOR::SYNC_IMGLIST",
  SYNC_VIEW = "EDITOR::SYNC_VIEW",
  CLOSE_FILE = "EDITOR::CLOSE_FILE",
  REVEAL_SECTION = "EDITOR::REVEAL_SECTION",
  SWITCH_SECTION = "EDITOR::SWITCH_SECTION",
}

export enum BUS_CHANNEL {
  UPDATE_SETTING = "global::update-setting",

  /* 打开 Markdown 编辑器 */
  EDIT_MARKDOWN = "browser::edit-markdown",
  SAVE_MARKDOWN = "browser::save-markdown",
  CLOSE_MARKDOWN = "browser::close-markdown",

  /* 阅读视图 */
  VIEW_MARKDOWN = "browser::view-markdown",
  VIEW_PDF = "browser::view-pdf",
}
