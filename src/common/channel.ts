export enum BUS_FILE {
  OPEN_FILE = "BUS::OPEN_FILE",
  CLOSE_FILE = "BUS::CLOSE_FILE",
}

export enum BUS_TOC {
  SYNC_TOC = "BUS::SYNC_TOC",
  REVEAL_SECTION = "BUS::REVEAL_SECTION",
  SWITCH_SECTION = "BUS::SWITCH_SECTION",
}

export enum BUS_UI {
  SYNC_RESIZE = "BUS::SYNC_RESIZE",
  SAVE_RESIZE = "BUS::SAVE_RESIZE",
}

export enum IPC_BOOTSTRAP {
  FETCH = "IPC::BOOTSTRAP_FETCH",
  REPLY = "IPC::BOOTSTRAP_REPLY",
}

export enum IPC_PREFERENCE {
  LOAD = "IPC::PREFERENCE_LOAD",
  GET_ALL = "IPC::PREFERENCE_GET_ALL",
  GET_ITEM = "IPC::PREFERENCE_GET_ITEM",
  GET_ITEM_SYNC = "IPC::PREFERENCE_GET_ITEM_SYNC",
  REPLY_GET_ALL = "IPC::PREFERENCE_REPLY_GET_ALL",
  REPLY_GET_ITEM = "IPC::PREFERENCE_REPLY_GET_ITEM",
  SET_ITEM = "IPC::PREFERENCE_SET_ITEM",
}

export enum IPC_MENUMANAGER {
  POPUP_CONTEXT = "POP_CONTEXT",
  CLOSE_CONTEXT = "CLOSE_CONTEXT",
}

export enum IPC_EVENT {
  FILE_SAVE = "IPC::FILE_SAVE",
}
