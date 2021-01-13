import { Console } from "console";
import * as fse from "fs-extra";
import * as fs from "fs";

import { isDev } from "@/common/env";
import { formatDate } from "@/common/utils";
import { UNITEXT_SYSTEM } from "@/app/config";

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

    fse.ensureFileSync(infoPath);
    fse.ensureFileSync(errorPath);

    // FEAT 切分

    return {
      info: fs.createWriteStream(infoPath),
      error: fs.createWriteStream(errorPath),
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
