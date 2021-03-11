import { join } from "path";

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
  DEFAULT_DIR: (sys: string) => join(sys, "System"),
  BOOT_FILE: (sys: string) => join(sys, "System", "boot.json"),
  INFO_LOG: (sys: string) => join(sys, "Log", "info.log"),
  ERROR_LOG: (sys: string) => join(sys, "Log", "error.log"),
};

export const CONFIG_FOLDER = {
  CACHE: [".CONFIG", "Cache"],
  TRASH: [".CONFIG", "Trash"],
  IMAGES: [".CONFIG", "Images"],
  THEMES: [".CONFIG", "Themes"],
  UNCATEGORY: [".CONFIG", "Uncategory"],
};

export const CONFIG_FILE = {
  /**
   * @deprecated
   */
  MARK: [".CONFIG", "mark.json"], // Marks.vue 使用
  ICON: [".CONFIG", "icon.json"],
  IMAGE: [".CONFIG", "image.json"],
  THEME: [".CONFIG", "Settings", "theme.json"],
  SYSTEM: [".CONFIG", "Settings"], // [".CONFIG", "Settings", "system.json"],
  SNIPPET: [".CONFIG", "Settings", "snippet.json"],
  MARKDOWN: [".CONFIG", "Settings", "markdown.json"],
  PREFERENCE: [".CONFIG", "Settings", "preference.json"],
  KEYBINDING: [".CONFIG", "Settings", "keybinding.json"],
};
