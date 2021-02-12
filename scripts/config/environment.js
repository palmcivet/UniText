"use strict";

const { join } = require("path");

const { version } = require("../../package.json");

const getPath = {
  cwd: (dir = "") => join(process.cwd(), dir),
  src: (dir = "") => join(__dirname, "../", "../", "src", dir),
  build: (dir = "") => join(__dirname, "../", "../", "dist", "build", dir),
  public: (dir = "") => join(__dirname, "../", "../", "public", dir),
};

const getEnvironmentDefinitions = () => {
  return {
    "global.UNITEXT_VERSION": JSON.stringify(version),
  };
};

const getRendererEnvironmentDefinitions = () => {
  const env = getEnvironmentDefinitions();
  return {
    "process.versions.UNITEXT_VERSION": env["global.UNITEXT_VERSION"],
  };
};

module.exports = {
  getPath,
  getEnvironmentDefinitions,
  getRendererEnvironmentDefinitions,
};
