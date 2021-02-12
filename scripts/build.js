"use strict";

const fse = require("fs-extra");
const chalk = require("chalk");
const webpack = require("webpack");

const { getPath } = require("./config/environment");
const mainConfig = require("./config/webpack.main");
const rendererConfig = require("./config/webpack.renderer");

const doneLog = chalk.bgGreen.white(" DONE ") + " ";
const okayLog = chalk.bgBlue.white(" OKAY ") + " ";
const errorLog = chalk.bgRed.white(" ERROR ") + " ";

async function preBuild() {
  console.log(chalk.greenBright.bold("UniText Building"));

  await fse.remove(getPath.build());
  console.log(`${doneLog}Clean up dist folder`);
}

async function copyResources() {
  const from = getPath.public();
  const to = getPath.build();
  await fse.copy(from, to);
}

async function copyPackageJson() {
  const pkgPath = getPath.cwd("package.json");
  const raw = await fse.readFile(pkgPath, "utf-8");
  const pkgJson = JSON.parse(raw);

  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  delete pkgJson.dependencies;
  delete pkgJson.husky;
  delete pkgJson["lint-staged"];

  await fse.writeFile(getPath.build("package.json"), JSON.stringify(pkgJson));
}

function build(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err);
      else if (stats.hasErrors()) {
        let err = "";

        stats
          .toString({
            chunks: false,
            colors: true,
          })
          .split(/\r?\n/)
          .forEach((line) => {
            err += `    ${line}\n`;
          });

        reject(err);
      } else {
        resolve(
          stats.toString({
            chunks: false,
            colors: true,
          })
        );
      }
    });
  });
}

(async () => {
  await preBuild();

  await copyResources();

  await copyPackageJson();

  build(mainConfig)
    .then((result) => {
      console.log(`${okayLog}Main process built successfully`);
    })
    .catch((err) => {
      console.log(`\n${errorLog}failed to build main process`);
      console.error(`\n${err}`);
      process.exit(1);
    });

  build(rendererConfig)
    .then((result) => {
      console.log(`${okayLog}Renderer process built successfully`);
    })
    .catch((err) => {
      console.log(`\n  ${errorLog}failed to build renderer process`);
      console.error(`\n${err}\n`);
      process.exit(1);
    });
})();
