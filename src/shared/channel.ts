export const BUS_CHANNEL = {
  /* editor */
  EDITOR_SYNC_IMG: "editor::sync-img",
  EDITOR_SYNC_DOC: "editor::sync-toc",
  EDITOR_SYNC_VIEW: "editor::sync-view",
  EDITOR_REVEAL_SECTION: "editor::reveal-section",

  /* global */
  UPDATE_SETTING: "global::update-setting",

  /* markdown */
  BROWSER_VIEW_MD: "browser::view-md",
  BROWSER_OPEN_MD: "browser::open-md",
  BROWSER_SAVE_MD: "browser::save-md",
  BROWSER_CLOSE_MD: "browser::close-md",

  /* PDF */
  BROWSER_VIEW_PDF: "browser::view-pdf",
  BROWSER_CLOSE_PDF: "browser::close-pdf",

  /* image */
  BROWSER_OPEN_IMG: "browser::open-img",
  BROWSER_CLOSE_IMG: "browser::close-img",
};

export const IPC_CHANNEL = {
  /* service */
  SERVICE_CALL: "service:call",
  PRINTER_CALL: "printer:call",

  /* dialog */
  DIALOG_SHOW_CERTIFICATE_TRUST_DIALOG: "dialog:show-certificate-trust-dialog",
  DIALOG_SHOW_ERROR_BOX: "dialog:show-error-box",
  DIALOG_SHOW_MESSAGE_BOX: "dialog:show-message-box",
  DIALOG_SHOW_OPEN_DIALOG: "dialog:show-open-dialog",
  DIALOG_SHOW_SAVE_DIALOG: "dialog:show-save-dialog",

  /* disk */
  DISK_READ_DIRECTORY: "disk:read-directory",
  DISK_READ_TEXT_FILE: "disk:read-text-file",
  DISK_READ_BINARY_FILE: "disk:read-binary-file",
  DISK_WRITE_FILE: "disk:write-file",
  DISK_DELETE: "disk:delete",
  DISK_CREATE_FILE: "disk:create-file",
  DISK_CREATE_DIRECTORY: "disk:create-directory",
  DISK_MOVE: "disk:move",
  DISK_COPY: "disk:copy",
  DISK_STAT: "disk:stat",

  /* external */
  EXTERNAL_PANDOC: "external:pandoc",
  EXTERNAL_RIPGREP: "external:ripgrep",
  EXTERNAL_PRINT_PDF: "external:print-pdf",
};
