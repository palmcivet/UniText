import { app } from "electron";
import * as fse from "fs-extra";

import { isDev } from "@/common/env";
import { joinPath } from "@/common/main/files";
import { validateJson } from "@/common/validate";
import { IBootArgs } from "@/interface/bootstrap";

/**
 * 读取启动文件
 * - 启动文件存在，读取文件，返回文件内容
 * - 用户目录不存在或启动文件不存在，返回 `""`
 */
export const loadBootData = async () => {
  const initArgs: IBootArgs = {
    notesPath: "",
    error: [],
  };

  const bootPath = joinPath(app.getPath("userData"), "unitext.json");

  if (await fse.pathExists(bootPath)) {
    fse
      .readJSON(bootPath)
      .then((res) => {
        initArgs.notesPath = res.notesPath;
      })
      .catch((err) => {
        /* 无需处理 */
      });
  }

  return initArgs;
};

/**
 * 加载 `path` 下的 `setting.json` 配置文件
 * - `path` 存在，加载、校验
 * - `path` 为空，加载默认配置
 * - `path` 不为空，但找不到配置文件，加载默认配置
 * @param path 目标文件夹的绝对路径
 */
export const loadSetting = async (path: string = "") => {
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
