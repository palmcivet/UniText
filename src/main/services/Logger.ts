import { Console } from "console";
import { ensureFileSync } from "fs-extra";
import { createWriteStream } from "fs";

import { isDev } from "@/common/env";
import { formatDate } from "@/common/utils";
import { UNITEXT_SYSTEM } from "@/main/config";

class Logger {
  private _logger!: Console;

  constructor() {
    const { info, error } = this._register();

    this._logger = new Console({
      stdout: info,
      stderr: error,
    });
  }

  private _register() {
    const infoPath = UNITEXT_SYSTEM.INFO_LOG;
    const errorPath = UNITEXT_SYSTEM.ERROR_LOG;

    ensureFileSync(infoPath);
    ensureFileSync(errorPath);

    // FEAT 切分

    return {
      info: createWriteStream(infoPath),
      error: createWriteStream(errorPath),
    };
  }

  info(msg: string) {
    this._logger.info("[%s]-[INFO]-%s", formatDate(new Date()), msg);
  }

  error(msg: string) {
    this._logger.error("[%s]-[ERROR]-%s", formatDate(new Date()), msg);
  }

  debug(msg: string) {
    isDev && this._logger.info("[%s]-[DEBUG]-%s", formatDate(new Date()), msg);
  }
}

export default new Logger();
