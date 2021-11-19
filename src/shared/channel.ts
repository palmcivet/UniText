export enum BUS_EDITOR {
  SYNC_TOC = "EDITOR::SYNC_TOC",
  SYNC_IMGLIST = "EDITOR::SYNC_IMGLIST",
  SYNC_VIEW = "EDITOR::SYNC_VIEW",
  CLOSE_FILE = "EDITOR::CLOSE_FILE",
  REVEAL_SECTION = "EDITOR::REVEAL_SECTION",
  SWITCH_SECTION = "EDITOR::SWITCH_SECTION",
}

export enum BUS_CHANNEL {
  SYNC_VIEW = "EDITOR::SYNC_VIEW",
  REVEAL_SECTION = "EDITOR::REVEAL_SECTION",
  SWITCH_SECTION = "EDITOR::SWITCH_SECTION",

  /* editor */
  EDITOR_SYNC_TOC = "editor::sync-toc",
  EDITOR_SYNC_IMG = "editor::sync-img",

  /* global */
  UPDATE_SETTING = "global::update-setting",

  /* markdown */
  BROWSER_VIEW_MD = "browser::view-md",
  BROWSER_OPEN_MD = "browser::open-md",
  BROWSER_SAVE_MD = "browser::save-md",
  BROWSER_CLOSE_MD = "browser::close-md",

  /* PDF */
  BROWSER_VIEW_PDF = "browser::view-pdf",
  BROWSER_CLOSE_PDF = "browser::close-pdf",

  /* image */
  BROWSER_OPEN_IMG = "browser::open-img",
  BROWSER_CLOSE_IMG = "browser::close-img",
}
