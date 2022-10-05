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

import {
  CABIN_FILE,
  CABIN_FOLDER,
  CABIN_NAME,
  SYSTEM_PATH,
  THEME_CSS,
  THEME_JS,
  THEME_PRESET,
} from "@/shared/constant";
import { IBootArgs } from "@/shared/typings/main";
import { IPathRoute } from "@/shared/typings/renderer";

const ThemeConfigList = [...THEME_CSS.map((item) => `${item}.css`), ...THEME_JS.map((item) => `${item}.js`)];

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
      cabinPath: "",
      historyPath: [],
      isFallBack: true,
    };
  }

  /**
   * @description 建立笔记库样例
   */
  private async initTemplate(): Promise<void> {}

  private async _serializeBoot() {}

  public initCli(): void {}

  public initBoot(): IBootParam {
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

    if (fse.existsSync(this._envData.cabinPath)) {
      this.setCabinPath(this._envData.cabinPath);
    } else {
      this.setCabinPath(join(userDataPath, SYSTEM_PATH.DEFAULT_DIR));
    }

    return {
      userPath: userDataPath,
      logPath: join(userDataPath, SYSTEM_PATH.LOG_DIR),
    };
  }

  public normalizePath(route: IPathRoute): string {
    return join(this._cabinPath, ...route);
  }

  public getAppPath(): string {
    return app.getAppPath();
  }

  public getCabinPath(): string {
    return this._cabinPath;
  }

  public setCabinPath(newPath: string): void {
    this._cabinPath = newPath;
    this._serializeBoot();
  }

  public resolveCabinFile(key: TKeyConfigFile): string {
    const cabinPath = this.getCabinPath();
    return join(cabinPath, CABIN_NAME, CABIN_FILE[key]);
  }

  public resolveCabinFolder(key: TKeyConfigFolder, file: Array<string> = []): string {
    const cabinPath = this.getCabinPath();
    return join(cabinPath, CABIN_NAME, CABIN_FOLDER[key], ...file);
  }

  public async resolveThemeList(): Promise<Array<string>> {
    const validThemeList: Array<string> = [];
    const cabinPathTheme = this.resolveCabinFolder("THEMES");

    const themeList = await fse.readdir(cabinPathTheme);
    themeList.forEach(async (theme) => {
      /* 排除预设主题 */
      if (THEME_PRESET.includes(theme)) {
        return;
      }

      let valid = true;
      for (let index = 0; index < ThemeConfigList.length; index++) {
        const config = ThemeConfigList[index];
        const configPath = join(cabinPathTheme, theme, config);
        if (!fse.pathExistsSync(configPath)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        validThemeList.push(theme);
      }
    });

    return validThemeList;
  }
}
