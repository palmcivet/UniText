import * as fse from "fs-extra";

import { IBootArgs } from "@/typings/main";
import { UNITEXT_SYSTEM } from "@/main/utils/config";
import { UniText } from "./UniText";

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

  if (!fse.existsSync(UNITEXT_SYSTEM.DEFAULT_DIR)) {
    fse.mkdirSync(UNITEXT_SYSTEM.DEFAULT_DIR);
  }

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
    await fse.writeJSON(bootFile, bootArgs);
    bootArgs.error.push(err);
  }

  UniTextApp = new UniText(bootArgs);
  UniTextApp.init();
})();
