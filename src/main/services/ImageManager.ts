import { ipcMain } from "electron";
import * as fse from "fs-extra";
import { join } from "path";

import { getHash } from "@/common/utils";
import { URL_PATH } from "@/common/url";
import { CONFIG_FILE, CONFIG_FOLDER } from "@/common/env";
import { IPC_IMAGE, IPC_NOTIFY, IPC_OTHER } from "@/common/channel/ipc";
import { fetchHttpFile } from "@/common/fileSystem/fileState";

export default class ImageManager {
  private _dataSet!: Map<string, number>;

  private _dataPath!: string;

  private _cachePath!: string;

  private _imagePath!: string;

  constructor() {
    this._listenForIpcMain();
  }

  private async _setBasePath(filePath: string) {
    // FEAT 优化路径
    this._dataPath = join(filePath, ...CONFIG_FILE.IMAGE);
    this._cachePath = join(filePath, ...CONFIG_FOLDER.CACHE);
    this._imagePath = join(filePath, ...CONFIG_FOLDER.IMAGES);

    await fse.ensureFile(join(filePath, ...CONFIG_FILE.IMAGE));

    try {
      const res = await fse.readJSON(this._dataPath);
      this._dataSet = new Map<string, number>(res);
    } catch (err) {
      this._dataSet = new Map<string, number>([]);
    }
  }

  private async _store() {
    try {
      await fse.writeJSON(this._dataPath, [...this._dataSet]);
    } catch (err) {
      ipcMain.emit(IPC_NOTIFY.LOG, {
        level: "ERROR",
        title: `写入 ${this._dataPath} 失败`,
        body: err,
      });
    }
  }

  private _cleanCache() {
    this._dataSet.forEach(async (v, k) => {
      if (v === 0) {
        if (/\.png/.test(k)) {
          await fse.unlink(join(this._imagePath, k));
        } else {
          await fse.unlink(join(this._cachePath, k));
        }
      }
    });
  }

  async getCache(url: string) {
    const key = getHash(url);
    const redirPath = join(this._cachePath, key); /* 缓存没有后缀 */

    if (!this._dataSet.has(key)) {
      try {
        await fetchHttpFile(url, redirPath);
        this._dataSet.set(key, 0);
      } catch (err) {
        ipcMain.emit(IPC_NOTIFY.LOG, {
          level: "ERROR",
          title: `${url} 缓存建立失败`,
          body: err,
        });
      }
    }

    return redirPath;
  }

  getImage(url: string) {
    const key = url.replace(URL_PATH.IMG, "");

    return join(this._imagePath, key);
  }

  async setImage(url: string, data: Buffer) {
    const name = url.replace(URL_PATH.IMG, "");

    try {
      await fse.writeFile(join(this._imagePath, name), data);
    } catch (err) {
      ipcMain.emit(IPC_NOTIFY.LOG, {
        level: "ERROR",
        title: `${url} 写入失败`,
        body: err,
      });
    }

    this._dataSet.set(name, 0);
  }

  private _delImage(key: string) {
    const cnt = this._dataSet.get(key) as number;
    if (cnt !== 0) this._dataSet.set(key, cnt - 1);
  }

  private _addImage(key: string) {
    this._dataSet.set(key, (this._dataSet.get(key) as number) + 1);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.SET_PATH_AGENT, (event, base: string) => {
      this._setBasePath(base);
    });

    ipcMain.on(IPC_IMAGE.SET_IMAGE, (event, url: string, data: Buffer) => {
      this.setImage(url, data);
    });

    ipcMain.on(IPC_IMAGE.REG_IMAGE, (event, del: Array<string>, add: Array<string>) => {
      del.forEach((item) => this._delImage(item));
      add.forEach((item) => this._addImage(item));
      this._store();
      this._cleanCache();
    });

    ipcMain.on(IPC_IMAGE.CLEAN_CACHE, (event) => {
      this._cleanCache();
    });
  }
}
