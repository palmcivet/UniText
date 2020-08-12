import * as fse from "fs-extra";
import { app } from "electron";

import { App } from "./app";
import { IBootArgs, IBootCache } from "@/interface/boot";
import { joinPath } from "@/common/main/files";

/**
 * 读取启动文件
 * - 启动文件存在，读取文件，返回文件内容
 * - 用户目录不存在或启动文件不存在，返回 `""`
 * @function 获取 `notesPath`
 */
const loadBootData = async () => {
  const initArgs: IBootArgs = {
    notesPath: "",
    locale: app.getLocale(),
  };
  const initCache: IBootCache = [];

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

  return {
    initArgs,
    initCache,
  };
};

let unitext: App;

loadBootData().then((res) => {
  unitext = new App(res);
  unitext.init();
});
