import { ipcMain } from "electron";
import { Console } from "console";
import * as fse from "fs-extra";

import { formatDate } from "@/common/utils";
import { IPC_NOTIFY } from "@/common/channel/ipc";
import { INotificationMessage } from "@/typings/vuex/notification";

export default class Logger {
  private _logger!: Console;

  constructor(errorPath: string, infoPath: string) {
    const { info, error } = this._register(errorPath, infoPath);

    this._logger = new Console({
      stdout: info,
      stderr: error,
    });

    this._listenForIpcMain();
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

  private _listenForIpcMain() {
    ipcMain.on(IPC_NOTIFY.LOG, (e, msg: INotificationMessage) => {
      if (msg.level === "INFO") {
        this.info(msg.title);
      } else {
        this.error(msg.title);
      }
    });
  }
}
