export const isOsx = process.platform === "darwin";
export const isWin = process.platform === "win32";
export const isLinux = process.platform === "linux";

export const isDev = process.env.NODE_ENV !== "production";

export const THEME_CSS = ["appearance", "renderView", "renderCode"];
export const THEME_JS = ["monacoEditor"];

export const THEME_PRESET = ["OneDarkPro", "OneDarkCyber", "Custom"];

export const PUBLIC = {
  LIB: "lib",
  THEME: "themes",
};

export const SYSTEM_PATH = {
  BOOT_FILE: "boot.json",
  DEFAULT_DIR: "Default",
  LOG_DIR: "Log",
};

export const CABIN_NAME = ".unitext-cabin";

export const CABIN_FOLDER = {
  CACHE: "Cache",
  TRASH: "Trash",
  IMAGES: "Images",
  THEMES: "Themes",
  SCRIPTS: "Scripts",
  UNCATEGORY: "Uncategory",
};

export const CABIN_FILE = {
  /* 以下为设置文件 */
  SETTING: "setting.json",
  SNIPPET: "snippet.json",
  KEYBINDING: "keybinding.json",

  /* 以下为数据文件 */
  MARK: "mark.json",
  ICON: "icon.json",
  IMAGE: "image.db",
  SCHEDULE: "schedule.json",
};
