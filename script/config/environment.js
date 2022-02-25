"use strict";

const { join } = require("path");
const child_process = require("child_process");
const env = require("dotenv").config();

const pkg = require("../../package.json");

if (env.error) {
  throw Error(".env 配置文件无效或不存在");
}

const isDev = process.env.NODE_ENV !== "prod";

const rootPath = join(__dirname, "../", "../");
const BuildPath = {
  cwd: (...dir) => join(process.cwd(), ...dir),
  src: (...dir) => join(rootPath, "src", ...dir),
  theme: (...dir) => join(rootPath, "theme", ...dir),
  build: (...dir) => join(rootPath, "dist", "build", ...dir),
  public: (...dir) => join(rootPath, "public", ...dir),
};

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();
}

function mainEnv() {
  const shortHash = git("describe --always");
  const commitDate = git("log -1 --format=%aI");

  return {
    "global.IS_DEV": isDev,
    "global.GIT_SHORT_HASH": JSON.stringify(shortHash),
    "global.GIT_COMMIT_DATE": JSON.stringify(commitDate),
    "global.UNITEXT_VERSION": JSON.stringify(pkg.version),
    "__static": isDev
      ? JSON.stringify(BuildPath.public())
      : JSON.stringify(`http://localhost:${env.PORT_RENDERER}/public`),
    "__preload": isDev
      ? JSON.stringify(BuildPath.build("preload"))
      : JSON.stringify(`http://localhost:${env.PORT_RENDERER}/public/preload`),
  };
}

function rendererEnv() {
  const main = mainEnv();

  return {
    __static: main["__static"],
  };
}

module.exports = {
  env: Object.assign({}, env.parsed),
  BuildPath,
  rendererEnv,
  mainEnv,
  isDev,
};
