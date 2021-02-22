import { joinPath } from "./fileSystem";

export const isOsx = process.platform === "darwin";
export const isWin = process.platform === "win32";
export const isLinux = process.platform === "linux";
export const isDev = process.env.NODE_ENV !== "production";

export const THEME_CSS = ["appearance", "renderView", "renderCode"];
export const THEME_JS = ["monacoEditor"];

export const THEME_PRESET = ["OneDarkPro", "OneDarkCyber", "Custom"];

export const PUBLIC = {
  lib: "lib",
  themes: "themes",
};

export const CONFIG_FOLDER = {
  THEMES: joinPath(".CONFIG", "Themes"),
  SETTINGS: joinPath(".CONFIG", "Settings"),
  PICTURES: joinPath(".CONFIG", "Pictures"),
  CACHE_IMAGE: joinPath(".CONFIG", "Cache", "Image"),
  CACHE_UNCATEGORY: joinPath(".CONFIG", "Cache", "Uncategory"),
};

export const CONFIG_FILE = {
  TAG: joinPath(".CONFIG", "tag.json"),
  ICON: joinPath(".CONFIG", "icon.json"),
  THEME: joinPath(".CONFIG", "Settings", "theme.json"),
  SNIPPET: joinPath(".CONFIG", "Settings", "snippet.json"),
  MARKDOWN: joinPath(".CONFIG", "Settings", "markdown.json"),
  PREFERENCE: joinPath(".CONFIG", "Settings", "preference.json"),
  KEYBINDING: joinPath(".CONFIG", "Settings", "keybinding.json"),
};
