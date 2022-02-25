const { execSync } = require("child_process");
const { dependencies, devDependencies, optionalDependencies } = require("../../package.json");

const ignoredDependencies = ["monaco-editor", "@palmcivet/unitext-tree-view"];

const _dependencies = Object.keys(dependencies)
  .filter((dep) => !ignoredDependencies.includes(dep))
  .join(" ");
const _devDependencies = Object.keys(devDependencies)
  .filter((dep) => !ignoredDependencies.includes(dep))
  .join(" ");
const _optionalDependencies = Object.keys(optionalDependencies)
  .filter((dep) => !ignoredDependencies.includes(dep))
  .join(" ");

execSync(`yarn remove ${_dependencies} && yarn add ${_dependencies}`);
execSync(`yarn remove ${_devDependencies} && yarn add -D ${_devDependencies}`);
execSync(`yarn remove ${_optionalDependencies} && yarn add -O ${_optionalDependencies}`);
