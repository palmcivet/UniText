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
  POPUP_CONTEXT = "IPC::POP_CONTEXT",
  CLOSE_CONTEXT = "ipc::CLOSE_CONTEXT",
}

export enum IPC_FILE {
  OPEN_FOR_EDIT = "IPC::OPEN_FOR_EDIT",
  OPEN_FOR_VIEW = "IPC::OPEN_FOR_VIEW",
  SAVE = "IPC::SAVE",
}