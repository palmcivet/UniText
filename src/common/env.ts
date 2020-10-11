import { app, remote } from "electron";
import { joinPath } from "./fileSystem/files";

export const isOsx = process.platform === "darwin";
export const isWin = process.platform === "win32";
export const isLinux = process.platform === "linux";
export const isDev = process.env.NODE_ENV !== "production";

export const UNITEXT_SYSTEM = {
  BOOT: joinPath(remote.app.getPath("userData"), "System", "boot.json"),
};

export const CONFIG_FOLDER = {
  CACHE_IMAGE: joinPath(".CONFIG", "cache", "image"),
  CACHE_UNCATEGORY: joinPath(".CONFIG", "cache", "uncategory"),
  SYNC_PICTURE: joinPath(".CONFIG", "sync", "picture"),
};

export const CONFIG_FILE = {
  TAG: joinPath(".CONFIG", "sync", "tag.json"),
  TREE: joinPath(".CONFIG", "sync", "tree.json"),
  SETTING: joinPath(".CONFIG", "sync", "config", "setting.json"),
  SNIPPET: joinPath(".CONFIG", "sync", "config", "snippet.json"),
  KEYBINDING: joinPath(".CONFIG", "sync", "config", "keybinding.json"),
  CONFIG_DIR: joinPath(".CONFIG", "sync", "config"),
};
