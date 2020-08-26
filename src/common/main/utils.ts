import * as fse from "fs-extra";
import { joinPath } from "@/common/main/files";
import { validateJson } from "@/common/validate";
import { isDev } from "@/common/env";

/**
 * 加载 `path` 下的 `setting.json` 配置文件
 * - `path` 存在，加载、校验
 * - `path` 为空，加载默认配置
 * - `path` 不为空，但找不到配置文件，加载默认配置
 * @param path 目标文件夹的绝对路径
 */
export const loadSetting = async (path: string) => {
  // DEV
  if (isDev) {
    return [require("@/app/config/dev.json")];
  }

  let setting: any = {};
  if (path !== "" && (await fse.pathExists(path))) {
    const settingPath = joinPath(path, ".CONFIG", "config", "setting.json");
    fse.readJSON(settingPath).then((res) => {
      setting = res;
    });
  }

  return [setting, validateJson(setting)];
};
