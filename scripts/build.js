"use strict";

const fse = require("fs-extra");
const chalk = require("chalk");
const webpack = require("webpack");

const { BuildPath } = require("./config/environment");
const mainConfig = require("./config/webpack.main");
const preloadConfig = require("./config/webpack.preload");
const rendererConfig = require("./config/webpack.renderer");
const { getLicenses } = require("./tools/thirdParty");

const okayLog = chalk.bgGreen.white(" OKAY ") + " ";
const doneLog = chalk.bgBlue.white(" DONE ") + " ";
const errorLog = chalk.bgRed.white(" ERROR ") + " ";

const bundledPkg = [];

const filterPkg = [
  "demo",
  ".github",
  "src",
  ".babelrc",
  "babel.config.js",
  "bower.json",
  "karma.conf.js",
  "webpack.config.js",
  "webpack.dev.config.js",
  "webpack.web.config.js",
  "composer.json",
];

async function preBuild() {
  console.log(chalk.greenBright.bold("UniText Building"));

  await fse.remove(BuildPath.build());
  console.log(`${doneLog}Clean up dist folder`);
}

async function copyResources() {
  const from = BuildPath.public();
  const to = BuildPath.build();
  await fse.copy(from, to);
  console.log(`${okayLog}Copy resources`);
}

function copyPackages() {
  bundledPkg.forEach(async (key) => {
    const from = BuildPath.cwd("node_modules", key);
    const to = BuildPath.build("node_modules", key);
    await fse.copy(from, to, {
      filter: (src, dst) => !filterPkg.some((item) => src.indexOf(item) !== -1),
    });
  });
  console.log(`${okayLog}Copy packages`);
}

async function getPackageJson() {
  const pkgPath = BuildPath.cwd("package.json");
  const raw = await fse.readFile(pkgPath, "utf-8");
  const pkgJson = JSON.parse(raw);

  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  delete pkgJson.dependencies;
  delete pkgJson.husky;
  delete pkgJson["lint-staged"];

  await fse.writeFile(BuildPath.build("package.json"), JSON.stringify(pkgJson));
  console.log(`${okayLog}Truncate package.json`);
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

  await build(preloadConfig)
    .then((result) => {
      console.log(`${okayLog}Preload script built successfully`);
    })
    .catch((err) => {
      console.log(`\n  ${errorLog}failed to build preload script`);
      console.error(`\n${err}\n`);
      process.exit(1);
    });

  await build(mainConfig)
    .then((result) => {
      console.log(`${okayLog}Main process built successfully`);
    })
    .catch((err) => {
      console.log(`\n${errorLog}failed to build main process`);
      console.error(`\n${err}`);
      process.exit(1);
    });

  await build(rendererConfig)
    .then((result) => {
      console.log(`${okayLog}Renderer process built successfully`);
    })
    .catch((err) => {
      console.log(`\n  ${errorLog}failed to build renderer process`);
      console.error(`\n${err}\n`);
      process.exit(1);
    });

  await copyResources();

  copyPackages();

  await getPackageJson();

  getLicenses(process.cwd(), BuildPath.build("THIRD-PARTY-LICENSES.txt"), () => {
    console.log(`${okayLog}Generate License statement`);
  });
})();
