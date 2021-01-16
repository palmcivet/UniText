import { app } from "electron";

import { joinPath } from "@/common/fileSystem";

export const UNITEXT_SYSTEM = {
  DEFAULT_DIR: joinPath(app.getPath("userData"), "System"),
  BOOT_FILE: joinPath(app.getPath("userData"), "System", "boot.json"),
  INFO_LOG: joinPath(app.getPath("userData"), "Log", "info.log"),
  ERROR_LOG: joinPath(app.getPath("userData"), "Log", "error.log"),
};
