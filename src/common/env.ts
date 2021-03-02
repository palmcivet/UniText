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

export const SYSTEM_PATH = {
  DEFAULT_DIR: (sys: string) => joinPath(sys, "System"),
  BOOT_FILE: (sys: string) => joinPath(sys, "System", "boot.json"),
  INFO_LOG: (sys: string) => joinPath(sys, "Log", "info.log"),
  ERROR_LOG: (sys: string) => joinPath(sys, "Log", "error.log"),
};

export const CONFIG_FOLDER = {
  IMAGE: joinPath(".CONFIG", "Image"),
  THEMES: joinPath(".CONFIG", "Themes"),
  SETTINGS: joinPath(".CONFIG", "Settings"),
  PICTURES: joinPath(".CONFIG", "Pictures"),
  UNCATEGORY: joinPath(".CONFIG", "Uncategory"),
};

// TODO 未使用
export const CONFIG_FILE = {
  TAG: joinPath(".CONFIG", "tag.json"),
  ICON: joinPath(".CONFIG", "icon.json"),
  MARK: joinPath(".CONFIG", "mark.json"), // Marks.vue 使用
  THEME: joinPath(".CONFIG", "Settings", "theme.json"),
  SNIPPET: joinPath(".CONFIG", "Settings", "snippet.json"),
  MARKDOWN: joinPath(".CONFIG", "Settings", "markdown.json"),
  PREFERENCE: joinPath(".CONFIG", "Settings", "preference.json"),
  KEYBINDING: joinPath(".CONFIG", "Settings", "keybinding.json"),
};
