import { ipcMain } from "electron";
import * as fse from "fs-extra";
import { join } from "path";

import { getHash } from "@/common/utils";
import { URL_PATH } from "@/common/url";
import { CONFIG_FILE, CONFIG_FOLDER } from "@/common/env";
import { IPC_IMAGE, IPC_OTHER } from "@/common/channel/ipc";
import { fetchHttpFile } from "@/common/fileSystem/fileState";

export class ImageManager {
  private _dataSet!: Map<string, number>;

  private _fileePath!: string;

  private _cachePath!: string;

  private _imagePath!: string;

  constructor(filePath: string) {
    this.setBasePath(filePath);
    this._listenForIpcMain();
  }

  async setBasePath(filePath: string) {
    // FEAT 优化路径
    this._fileePath = join(filePath, CONFIG_FILE.IMAGE);
    this._cachePath = join(filePath, ...CONFIG_FOLDER.CACHE);
    this._imagePath = join(filePath, ...CONFIG_FOLDER.IMAGES);

    await fse.ensureFile(join(filePath, CONFIG_FILE.IMAGE));
    try {
      const res = await fse.readJSON(this._fileePath);
      this._dataSet = new Map<string, number>(res);
    } catch (err) {
      this._dataSet = new Map<string, number>([]);
    }
  }

  async getCache(url: string) {
    const key = getHash(url);
    const redirPath = join(this._cachePath, key); /* 缓存没有后缀 */

    if (!this._dataSet.has(key)) {
      try {
        await fetchHttpFile(url, redirPath);
        this._dataSet.set(key, 0);
      } catch (err) {
        // NOTE 处理
      }
    }

    return redirPath;
  }

  async setImage(url: string, data: Buffer) {
    const name = url.slice(URL_PATH.IMG.length);

    try {
      await fse.writeFile(join(this._imagePath, name), data);
    } catch (err) {
      // NOTE
    }

    this._dataSet.set(name.replace(".png", ""), 0);
  }

  async store() {
    try {
      await fse.writeJSON(this._fileePath, [...this._dataSet]);
    } catch (err) {
      // NOTE
    }
  }

  getImage(url: string) {
    const key = url.slice(URL_PATH.IMG.length);

    return join(this._imagePath, key);
  }

  delImage(key: string) {
    const cnt = this._dataSet.get(key) as number;
    if (cnt !== 0) this._dataSet.set(key, cnt - 1);
  }

  addImage(key: string) {
    this._dataSet.set(key, (this._dataSet.get(key) as number) + 1);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.SET_PATH_AGENT, (event, base: string) => {
      this.setBasePath(base);
    });

    ipcMain.on(IPC_IMAGE.SET_IMAGE, (event, url: string, data: Buffer) => {
      this.setImage(url, data);
    });

    ipcMain.on(IPC_IMAGE.REG_IMAGE, (event, del: Array<string>, add: Array<string>) => {
      del.forEach((item) => this.delImage(item));
      add.forEach((item) => this.addImage(item));
      this.store();
    });

    ipcMain.on(IPC_IMAGE.CLEAN_CACHE, (event) => {});
  }
}
