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

  private _cachePath!: string;

  private _imagePath!: string;

  constructor(filePath: string) {
    this.setBasePath(filePath);
    this._listenForIpcMain();
  }

  async setBasePath(filePath: string) {
    // FEAT 优化路径
    const path = join(filePath, CONFIG_FILE.IMAGE);
    this._cachePath = join(filePath, ...CONFIG_FOLDER.CACHE);
    this._imagePath = join(filePath, ...CONFIG_FOLDER.IMAGES);

    await fse.ensureFile(join(filePath, CONFIG_FILE.IMAGE));
    try {
      const res = await fse.readJSON(path);
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

  getImage(url: string) {
    const key = url.slice(URL_PATH.IMG.length);

    return join(this._imagePath, key);
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_OTHER.SET_PATH_AGENT, (event, base: string) => {
      this.setBasePath(base);
    });

    ipcMain.on(IPC_IMAGE.SET_IMAGE, (event, url: string, data: Buffer) => {
      this.setImage(url, data);
    });
  }
}
