"use strict";

const { join } = require("path");
const child_process = require("child_process");

const git = (command) => {
  return child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();
};

const getPath = {
  cwd: (...dir) => join(process.cwd(), ...dir),
  src: (...dir) => join(__dirname, "../", "../", "src", ...dir),
  build: (...dir) => join(__dirname, "../", "../", "dist", "build", ...dir),
  public: (...dir) => join(__dirname, "../", "../", "public", ...dir),
};

const getDevEnv = {
  rendererPort: 9091,
  inspectPort: 5861,
  debugPort: 8315,
};

const getMainEnv = (isDev) => {
  const { version } = require("../../package.json");
  const shortHash = git("describe --always");
  const commitDate = git("log -1 --format=%aI");

  return {
    "global.IS_DEV": isDev,
    "global.GIT_SHORT_HASH": JSON.stringify(shortHash),
    "global.GIT_COMMIT_DATE": JSON.stringify(commitDate),
    "global.UNITEXT_VERSION": JSON.stringify(version),
    "__static": !isDev
      ? JSON.stringify(`http://localhost:${getDevEnv.rendererPort}/public`)
      : JSON.stringify(getPath.public()),
  };
};

const getRendererEnv = (isDev) => {
  const env = getMainEnv(isDev);
  return {
    "process.versions.UNITEXT_VERSION": env["global.UNITEXT_VERSION"],
    "__static": env["__static"],
  };
};

module.exports = {
  getPath,
  getDevEnv,
  getMainEnv,
  getRendererEnv,
};
