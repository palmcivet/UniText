/**
 * 启动步骤
 * 1. 寻找特定文件夹(`.unitext`)
 * 2. 加载配置文件；若不存在，加载默认配置
 * 3. 根据配置加载主题
 */

import fs from "fs-extra";
import { app } from "electron";
import { App } from "./app";
import { devConfig } from "./dev_config";

const path = require("path");

// const loadPreference = new Promise((resolve) => {
//   const filePath = path.resolve("~/.unitext");
//   fs.readFileSync(path.join(filePath, "_settings.json"));
// });

const parseSettings = (settings: any = null) => {
  if (settings === null) {
    settings = devConfig;
  }

  return {
    locale: app.getLocale() || settings.general.language,
    ...settings,
  };
};

const initConfig = parseSettings();
const initArgs: any = [];
const fileCache: any = [];

const unitext = new App(initConfig, initArgs, fileCache);
unitext.init();
