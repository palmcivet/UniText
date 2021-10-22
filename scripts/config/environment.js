"use strict";

const { join } = require("path");
const child_process = require("child_process");
const env = require("dotenv").config();

const pkg = require("../../package.json");

if (env.error) {
  throw Error(".env 配置文件无效或不存在");
}

const git = (command) => {
  return child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();
};

const buildPath = {
  cwd: (...dir) => join(process.cwd(), ...dir),
  src: (...dir) => join(__dirname, "../", "../", "src", ...dir),
  build: (...dir) => join(__dirname, "../", "../", "dist", "build", ...dir),
  public: (...dir) => join(__dirname, "../", "../", "public", ...dir),
};

const mainEnv = (isDev) => {
  const shortHash = git("describe --always");
  const commitDate = git("log -1 --format=%aI");

  return {
    "global.IS_DEV": isDev,
    "global.GIT_SHORT_HASH": JSON.stringify(shortHash),
    "global.GIT_COMMIT_DATE": JSON.stringify(commitDate),
    "global.UNITEXT_VERSION": JSON.stringify(pkg.version),
    "__static": !isDev
      ? JSON.stringify(`http://localhost:${env.PORT_RENDERER}/public`)
      : JSON.stringify(buildPath.public()),
  };
};

const rendererEnv = (isDev) => {
  const main = mainEnv(isDev);

  return {
    __static: main["__static"],
  };
};

module.exports = {
  isDev: process.env.NODE_ENV !== "prod",
  env: Object.assign({}, env.parsed),
  buildPath,
  mainEnv,
  rendererEnv,
};
