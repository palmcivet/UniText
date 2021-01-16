import { protocol } from "electron";
import * as fse from "fs-extra";

import { IBootArgs } from "@/typings/bootstrap";
import { UNITEXT_SYSTEM } from "@/main/config";
import { UniText } from "./UniText";

protocol.registerSchemesAsPrivileged([
  { scheme: "unitext", privileges: { secure: true, standard: true } },
]);

let UniTextApp: UniText;

/**
 * 读取 `boot.json` 文件，判断文件是否存在
 * - 存在则读取各字段
 * - 不存在则新建文件，并初始化为默认值
 */
(async function boot() {
  const bootArgs: IBootArgs = {
    notesPath: "",
    error: [],
  };

  const bootFile = UNITEXT_SYSTEM.BOOT_FILE;

  try {
    const res = await fse.readJSON(bootFile);
    if (Object.keys(res).indexOf("notesPath") === -1) {
      await fse.writeJSON(bootFile, {
        ...res,
        notesPath: "",
      });
    } else {
      bootArgs.notesPath = res.notesPath;
    }
  } catch (err) {
    await fse.writeJSON(bootFile, {
      notesPath: "",
    });
    bootArgs.error.push(err);
  }

  UniTextApp = new UniText(bootArgs);
  UniTextApp.init();
})();
