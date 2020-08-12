import * as fse from "fs-extra";
import { joinPath } from "@/common/main/files";
import { validateJson } from "@/app/main/validate";

/**
 * 传入笔记文件夹路径
 * - 加载 `path` 下的 `setting.json` 配置文件
 * - 找不到配置文件，加载默认配置
 * @param path 目标文件夹的绝对路径
 */
export const loadSetting = async (path: string) => {
  if (process.env.NODE_ENV === "development") {
    return [require("@/app/config/dev.json")];
  }

  let setting: any = {};
  if (path !== "" && (await fse.pathExists(path))) {
    const settingPath = joinPath(path, ".CONFIG", "_setting", "setting.json");
    fse.readJSON(settingPath).then((res) => {
      setting = res;
    });
  }

  return [setting, validateJson(setting)];
};
