import Store from "electron-store";
import * as fse from "fs-extra";

import { TStore } from "@/typings/bootstrap";
import { joinPath } from "@/common/fileSystem/files";
import { CONFIG_FILE } from "../../../common/env";
import settingSchema from "./setting.json";

/**
 * 加载 `path` 下的 `setting.json` 配置文件
 * - `path` 存在，加载、校验
 * - `path` 为空，加载默认配置
 * - `path` 不为空，但找不到配置文件，加载默认配置
 * @param path 目标文件夹的绝对路径
 */
export const loadSetting = (path: string = "") => {
  const option = {
    schema: settingSchema,
    name: "setting",
  };

  let setting: TStore;

  if (path === "") {
    setting = new Store(option);
  } else {
    setting = new Store({
      cwd: joinPath(path, CONFIG_FILE.CONFIG_DIR),
      ...option,
    });
    if (fse.pathExistsSync(path)) {
      setting.set(fse.readJSONSync(joinPath(path, CONFIG_FILE.SETTING)));
    }
  }

  return setting;
};

export const loadSnippet = () => {};

export const loadKeybinding = () => {};
