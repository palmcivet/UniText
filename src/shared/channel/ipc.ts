export enum IPC_FILE {
  OPEN = "IPC::OPEN",
  SAVE = "IPC::SAVE",
  OPEN_FOR_EDIT = "IPC::OPEN_FOR_EDIT",
  OPEN_FOR_VIEW = "IPC::OPEN_FOR_VIEW",
  REVEAL = "IPC::REVEAL",
  RENAME = "IPC::RENAME",
  DELETE = "IPC::DELETE",
  MARK_ADD = "IPC::MARK_ADD",
  MARK_DEL = "IPC::MARK_DEL",
}

export enum IPC_EXPORT {
  AS_HTML_PURE = "IPC::EXPORT_AS_HTML_PURE",
  AS_HTML = "IPC::EXPORT_AS_HTML",
  AS_PDF = "IPC::EXPORT_AS_PDF",
  AS_PNG = "IPC::EXPORT_AS_PNG",
}

export enum IPC_OTHER {
  SET_PATH_PRINCIPAL = "IPC::SET_PATH_PRINCIPAL",
  SET_PATH_AGENT = "IPC::SET_PATH_AGENT",
  SET_READ_MODE = "IPC::SET_READ_MODE",
  CHECK_UPDATE = "IPC::CHECK_UPDATE",
}
