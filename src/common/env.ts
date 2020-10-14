import { joinPath } from "./files";

export const isOsx = process.platform === "darwin";
export const isWin = process.platform === "win32";
export const isLinux = process.platform === "linux";
export const isDev = process.env.NODE_ENV !== "production";

export const UNITEXT_SYSTEM = {
  BOOT_FILE: ["System", "boot.json"],
  DEFAULT_DIR: ["System"],
};

export const CONFIG_FOLDER = {
  CONFIG_DIR: joinPath(".CONFIG", "sync", "settings"),
  PICTURE_DIR: joinPath(".CONFIG", "sync", "pictures"),
  CACHE_IMAGE: joinPath(".CONFIG", "cache", "image"),
  CACHE_UNCATEGORY: joinPath(".CONFIG", "cache", "uncategory"),
};

export const CONFIG_FILE = {
  TAG: joinPath(".CONFIG", "sync", "tag.json"),
  TREE: joinPath(".CONFIG", "sync", "tree.json"),
  SNIPPET: joinPath(".CONFIG", "sync", "settings", "snippet.json"),
  PREFERENCE: joinPath(".CONFIG", "sync", "settings", "preference.json"),
  KEYBINDING: joinPath(".CONFIG", "sync", "settings", "keybinding.json"),
};
