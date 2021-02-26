import { ipcMain } from "electron";
import * as fse from "fs-extra";

import { CONFIG_FOLDER, SYSTEM_PATH } from "@/common/env";
import { checkStringExist, joinPath } from "@/common/fileSystem";
import { IPC_OTHER } from "@/common/channel/ipc";
import Logger from "@/main/services/Logger";
import { IBootArgs } from "@/typings/main";

interface IPath {
  unitext: string;
  project: string;
  settings: string;
}

export default class EnvPath {
  private _logger!: Logger;

  private _cache!: IBootArgs;

  private _error!: Array<any>;

  private _dataSet: Map<keyof IPath, IPath[keyof IPath]> = new Map([
    ["unitext", ""],
    ["project", ""],
    ["settings", ""],
  ]);

  constructor(sysPath: string, logger: Logger) {
    this._logger = logger;
    this._initCache(sysPath);
    this._listenForIpcMain();
  }

  private _initCache(sysPath: string) {
    this._cache = {
      notesPath: "",
      isFallBack: true,
    };

    const sysFolder = SYSTEM_PATH.DEFAULT_DIR(sysPath);

    this._dataSet.set("unitext", sysPath);
    this._dataSet.set("settings", sysFolder);

    fse.ensureDirSync(sysFolder);
    const bootFile = SYSTEM_PATH.BOOT_FILE(sysPath);

    if (fse.pathExistsSync(bootFile)) {
      try {
        let res = fse.readJSONSync(bootFile);
        if (
          checkStringExist("notesPath", Object.keys(res)) &&
          fse.existsSync(res.notesPath)
        ) {
          this._cache = res;
          this._setBasePath(res.notesPath);
        }
      } catch (err) {
        this._logger.error(err);
        this._error.push(err);
      }
    }
  }

  getItem(key: keyof IPath) {
    return this._dataSet.get(key) as string;
  }

  private _setBasePath(sysPath: string) {
    this._cache.notesPath = sysPath;
    this._dataSet.set("project", sysPath);
    this._dataSet.set("settings", joinPath(sysPath, CONFIG_FOLDER.SETTINGS));
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.SET_PATH_PRINCIPAL, async (e, newPath: string) => {
      ipcMain.emit(IPC_OTHER.SET_PATH_AGENT, newPath);

      this._setBasePath(newPath);

      try {
        await fse.writeJSON(SYSTEM_PATH.BOOT_FILE(newPath), this._cache);
      } catch (err) {
        this._logger.error(err);
        this._error.push(err);
      }
    });
  }
}
