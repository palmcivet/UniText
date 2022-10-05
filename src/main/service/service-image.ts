import * as fse from "fs-extra";
import * as https from "https";
import { join } from "path";
import { clipboard } from "electron";
import level, { LevelDB } from "level";

import { URL_PATH } from "@/shared/pattern";
import { hashBinary } from "@/shared/utils";
import { hashString } from "@/shared/utils";
import Logger from "@/main/utils/logger";
import Service, { Inject } from "@/main/service/_";
import EnvService from "./service-env";

function httpGet(url: string, dest: string): Promise<void> {
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
}

function forEachLevelDB<K, V>(
  db: LevelDB,
  callback: (err: Error | undefined, key: K, value: V) => void,
  options?: any
): void {
  const iterator = db.iterator(options);

  const loop = () => {
    iterator.next((error, key, value) => {
      if (error) {
        return iterator.end((_error) => {
          (callback as any)(error || _error);
        });
      }

      if (key === undefined && value === undefined) {
        return iterator.end(() => {});
      }

      callback(undefined, key, value);

      loop();
    });
  };

  return loop();
}

export default class ImageService extends Service {
  private readonly _db: LevelDB<string, number>;

  @Inject("EnvService")
  private readonly _envService!: EnvService;

  constructor(logger: Logger, path: string) {
    super(logger);
    this._db = level(path, { valueEncoding: "ascii" });
  }

  /**
   * @description 索引加一
   */
  private async _insertImage(key: string): Promise<void> {
    const count = await this._db.get(key);
    this._db.put(key, count + 1);
  }

  /**
   * @description 索引减一
   */
  private async _deleteImage(key: string): Promise<void> {
    const count = await this._db.get(key);
    if (count !== 0) {
      this._db.put(key, count - 1);
    }
  }

  /**
   * @description 保存图片到本地
   * @param url 以 `unitext://img/` 开头的图片路径
   * @param data 二进制数据
   */
  public async setImage(url: string, data: Buffer): Promise<void> {
    const name = url.replace(URL_PATH.IMG, "");
    const imagePath = join(this._envService.resolveCabinFolder("IMAGES"), name);

    try {
      await fse.writeFile(imagePath, data);
      await this._db.put(name, 0);
    } catch (error) {
      this.error(`${url} 写入失败`);
    }
  }

  /**
   * @description 获取本地图片路径
   * @param url 以 `unitext://img/` 开头的图片路径
   */
  public async getLocalImage(url: string): Promise<string> {
    const key = url.replace(URL_PATH.IMG, "");
    return join(this._envService.resolveCabinFolder("IMAGES"), key);
  }

  /**
   * @description 获取远程图片，同时缓存
   * @param url 标准 URL
   */
  public async getRemoteImage(url: string): Promise<string> {
    const key = hashString(url);
    /* 缓存没有后缀 */
    const redirectPath = join(this._envService.resolveCabinFolder("CACHE"), key);

    if (!(await this._db.get(key))) {
      try {
        await httpGet(url, redirectPath);
        await this._db.put(key, 0);
      } catch (error) {
        this.error(`${url} 缓存建立失败`);
      }
    }

    return redirectPath;
  }

  /**
   * @description 获取剪切板的图片并保存，返回 URL
   */
  public async getClipedImage(): Promise<string> {
    const data = clipboard.readImage("clipboard").toPNG();
    const text = URL_PATH.IMG + hashBinary(data).concat(".png");
    await this.setImage(text, data);
    return text;
  }

  /**
   * @description 清理已失效缓存
   */
  public async cleanCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      forEachLevelDB<string, number>(this._db, async (error, key, value) => {
        if (error) {
          this.error(error);
          reject(error);
        }
        if (value !== 0) {
          reject(error);
        }

        if (/\.png/.test(key)) {
          await fse.unlink(join(this._envService.resolveCabinFolder("IMAGES"), key));
        } else {
          await fse.unlink(join(this._envService.resolveCabinFolder("CACHE"), key));
        }

        await this._db.del(key);
        resolve();
      });
    });
  }

  /**
   * @description 更新索引
   * @param del
   * @param add
   */
  public updateIndice(del: Array<string>, add: Array<string>): void {
    del.forEach((item) => this._deleteImage(item));
    add.forEach((item) => this._insertImage(item));
  }
}
