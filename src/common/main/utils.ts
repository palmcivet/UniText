import * as fse from "fs-extra";
import { joinPath } from "@/common/main/files";
import { validateJson } from "@/app/main/validate";
import * as pkg from "@/../package.json";

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

/**
 * 返回发行说明，为 `""` 则表明未更新
 */
export const checkUpdate = () => {
  const getVersion = (ver: string) =>
    ver
      .substring(1)
      .split(".")
      .map((item: string) => parseInt(item, 10));

  const currentVersion = getVersion((pkg as any).version);
  let notes = "";

  fetch("")
    .then((res) => res.json())
    .then((res) => {
      const latestVersion = getVersion(res.data.name);

      for (let i = 0; i < currentVersion.length; i += 1) {
        if (currentVersion[i] < latestVersion[i]) {
          notes = res.data;
          break;
        }
      }
    });

  return notes;
};
