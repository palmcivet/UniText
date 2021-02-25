import { Console } from "console";
import * as fse from "fs-extra";

import { isDev } from "@/common/env";
import { formatDate } from "@/common/utils";

export default class Logger {
  private _logger!: Console;

  constructor(errorPath: string, infoPath: string) {
    const { info, error } = this._register(errorPath, infoPath);

    this._logger = new Console({
      stdout: info,
      stderr: error,
    });
  }

  private _register(errorPath: string, infoPath: string) {
    fse.ensureFileSync(infoPath);
    fse.ensureFileSync(errorPath);

    // FEAT 切分

    return {
      info: fse.createWriteStream(infoPath),
      error: fse.createWriteStream(errorPath),
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
