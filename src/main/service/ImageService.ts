import * as fse from "fs-extra";
import * as https from "https";
import { join } from "path";
import crypto from "crypto";
// import level, { LevelDB } from "level";

import { URL_PATH } from "@/shared/constant";
import Logger from "@/main/backend/Logger";
import Service, { Inject } from "./Service";
import EnvService from "./EnvService";

const getHash = (content: string) => {
  return crypto.createHash("md5").update(content, "utf-8").digest("hex");
};

const httpGet = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const file = fse.createWriteStream(dest);

        res.on("end", () => {
          resolve();
        });

        res.on("error", (err) => {
          fse.unlink(dest);
          reject(err);
        });

        res.pipe(file);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default class ImageService extends Service {
  // private readonly _db: LevelDB<string, number>;

  /**
   * @deprecated
   */
  private readonly _dataSet!: Map<string, number>;

  @Inject("EnvService")
  private readonly _envService!: EnvService;

  constructor(logger: Logger, dbPath: string) {
    super(logger);

    // this._db = level(dbPath);

    /**
     * @deprecated
     */
    try {
      fse.ensureFileSync(dbPath);
      const res = fse.readJSONSync(dbPath);
      this._dataSet = new Map<string, number>(res);
    } catch (error) {
      this._dataSet = new Map<string, number>([]);
    }
  }

  /**
   * @deprecated
   */
  private async _store() {
    try {
      await fse.writeJSON(this._envService.resolveCabinFile("IMAGE"), [...this._dataSet]);
    } catch (error) {
      this.error(error);
    }
  }

  /**
   * @description 索引加一
   */
  private _insertImage(key: string): void {
    const cnt = this._dataSet.get(key) as number;
    this._dataSet.set(key, cnt + 1);
  }

  /**
   * @description 索引减一
   */
  private _deleteImage(key: string): void {
    const cnt = this._dataSet.get(key) as number;
    if (cnt !== 0) {
      this._dataSet.set(key, cnt - 1);
    }
  }

  async setImage(url: string, data: Buffer) {
    const name = url.replace(URL_PATH.IMG, "");
    const imagePath = join(this._envService.resolveCabinFolder("IMAGES"), name);

    try {
      await fse.writeFile(imagePath, data);
    } catch (error) {
      this.error(`${url} 写入失败`);
    }

    this._dataSet.set(name, 0);
  }

  getImage(url: string) {
    const key = url.replace(URL_PATH.IMG, "");
    return join(this._envService.resolveCabinFolder("IMAGES"), key);
  }

  async getCache(url: string) {
    const key = getHash(url);
    /* 缓存没有后缀 */
    const redirPath = join(this._envService.resolveCabinFolder("CACHE"), key);

    if (!this._dataSet.has(key)) {
      try {
        await httpGet(url, redirPath);
        this._dataSet.set(key, 0);
      } catch (error) {
        this.error(`${url} 缓存建立失败`);
      }
    }

    return redirPath;
  }

  /**
   * 更新索引
   * @param del
   * @param add
   */
  updateIndice(del: Array<string>, add: Array<string>) {
    del.forEach((item) => this._deleteImage(item));
    add.forEach((item) => this._insertImage(item));
    this._store();
    this.cleanCache();
  }

  cleanCache() {
    this._dataSet.forEach(async (value, key) => {
      if (value !== 0) {
        return;
      }
      if (/\.png/.test(key)) {
        await fse.unlink(join(this._envService.resolveCabinFolder("IMAGES"), key));
      } else {
        await fse.unlink(join(this._envService.resolveCabinFolder("CACHE"), key));
      }
      this._dataSet.delete(key);
    });
  }
}
