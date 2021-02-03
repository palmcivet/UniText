import { joinPath } from "./fileSystem";

export const isOsx = process.platform === "darwin";
export const isWin = process.platform === "win32";
export const isLinux = process.platform === "linux";
export const isDev = process.env.NODE_ENV !== "production";

export const THEME_ID_APPEARANCE = "appearance";
export const THEME_ID_EDITOR = "editor";
export const THEME_ID_VIEW = "view";

export const CONFIG_FOLDER = {
  THEME: joinPath(".CONFIG", "Theme"),
  CONFIG: joinPath(".CONFIG", "Settings"),
  PICTURE: joinPath(".CONFIG", "Pictures"),
  CACHE_IMAGE: joinPath(".CONFIG", "Cache", "Image"),
  CACHE_UNCATEGORY: joinPath(".CONFIG", "Cache", "Uncategory"),
};

export const CONFIG_FILE = {
  TAG: joinPath(".CONFIG", "tag.json"),
  ICON: joinPath(".CONFIG", "icon.json"),
  SNIPPET: joinPath(".CONFIG", "Settings", "snippet.json"),
  PREFERENCE: joinPath(".CONFIG", "Settings", "preference.json"),
  KEYBINDING: joinPath(".CONFIG", "Settings", "keybinding.json"),
};
