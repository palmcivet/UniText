export enum BUS_CHANNEL {
  /* editor */
  EDITOR_SYNC_IMG = "editor::sync-img",
  EDITOR_SYNC_DOC = "editor::sync-toc",
  EDITOR_SYNC_VIEW = "editor::sync-view",
  EDITOR_REVEAL_SECTION = "editor::reveal-section",

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

export enum IPC_CHANNEL {
  /* service */
  SERVICE_CALL = "service:call",
  PRINTER_CALL = "printer::call",

  /* external */
  EXTERNAL_PANDOC = "external::pandoc",
  EXTERNAL_RIPGREP = "external::ripgrep",
  EXTERNAL_PRINT_PDF = "external::print-pdf",
}
