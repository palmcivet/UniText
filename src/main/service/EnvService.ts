/**
 * @description
 * 1. 启动时，收集运行环境、命令行参数等信息
 * 2. 打开 boot.json
 * 3. 收集工作区信息
 * 4. 动态给出路径
 */

import { app } from "electron";
import { join } from "path";
import * as fse from "fs-extra";

import { CABIN_FILE, CABIN_FOLDER, CABIN_NAME, SYSTEM_PATH } from "@/shared/constant";
import { IBootArgs } from "@/typings/main";

type TKeyConfigFolder = keyof typeof CABIN_FOLDER;
type TKeyConfigFile = keyof typeof CABIN_FILE;

interface IBootParam {
  logPath: string;
  userPath: string;
}

export default class EnvService {
  private _envData!: IBootArgs;

  private _cabinPath!: string;

  constructor() {
    this._envData = {
      defaultPath: "",
      historyPath: [],
      isFallBack: true,
    };
  }

  initEnv(): void {}

  initCli(): void {}

  initBoot(): IBootParam {
    const userDataPath = app.getPath("userData");

    /* 获取 cabinPath */
    const bootFile = join(userDataPath, SYSTEM_PATH.BOOT_FILE);
    fse.ensureFileSync(bootFile);

    try {
      const args = fse.readJSONSync(bootFile) as IBootArgs;
      this._envData = {
        ...this._envData,
        ...args,
      };
    } catch (error) {
      console.error(`${bootFile} 文件读取失败: ${error}`);
    }

    if (fse.existsSync(this._envData.defaultPath)) {
      this.setCabinPath(this._envData.defaultPath);
    } else {
      this.setCabinPath(join(userDataPath, SYSTEM_PATH.DEFAULT_DIR));
    }

    return {
      userPath: userDataPath,
      logPath: join(userDataPath, SYSTEM_PATH.LOG_DIR),
    };
  }

  /**
   * @description 建立笔记库样例
   */
  async initTemplate(): Promise<void> {}

  private async _serializeBoot() {}

  getCabinPath(): string {
    return this._cabinPath;
  }

  setCabinPath(newPath: string): void {
    this._cabinPath = newPath;
    this._serializeBoot();
  }

  resolveCabinFile(key: TKeyConfigFile): string {
    const cabinPath = this.getCabinPath();
    return join(cabinPath, CABIN_NAME, CABIN_FILE[key]);
  }

  resolveCabinFolder(key: TKeyConfigFolder): string {
    const cabinPath = this.getCabinPath();
    return join(cabinPath, CABIN_NAME, CABIN_FOLDER[key]);
  }
}
