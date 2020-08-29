import { app, protocol } from "electron";
import * as fse from "fs-extra";

import { App } from "./app";
import { joinPath } from "@/common/main/files";
import { IBootArgs } from "@/interface/bootstrap";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

/**
 * 读取启动文件
 * - 启动文件存在，读取文件，返回文件内容
 * - 用户目录不存在或启动文件不存在，返回 `""`
 */
export const bootData = async () => {
  const bootPath = joinPath(app.getPath("userData"), "unitext.json");

  const initArgs: IBootArgs = {
    notesPath: "",
    error: [],
  };

  if (await fse.pathExists(bootPath)) {
    return fse
      .readJSON(bootPath)
      .then((res) => {
        initArgs.notesPath = res.notesPath;
        return initArgs;
      })
      .catch((err) => {
        return initArgs;
      });
  } else {
    return initArgs;
  }
};

let unitext: App;

bootData().then((res) => {
  unitext = new App(res);
  unitext.init();
});
