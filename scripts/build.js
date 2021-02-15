"use strict";

const fse = require("fs-extra");
const chalk = require("chalk");
const webpack = require("webpack");

const { getPath } = require("./config/environment");
const mainConfig = require("./config/webpack.main");
const rendererConfig = require("./config/webpack.renderer");
const { getLicenses } = require("./tools/thirdParty");

const doneLog = chalk.bgGreen.white(" DONE ") + " ";
const okayLog = chalk.bgBlue.white(" OKAY ") + " ";
const errorLog = chalk.bgRed.white(" ERROR ") + " ";

const bundledPkg = ["clipboard"];

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

  await fse.remove(getPath.build());
  console.log(`${doneLog}Clean up dist folder`);
}

async function copyResources() {
  const from = getPath.public();
  const to = getPath.build();
  await fse.copy(from, to);
}

function copyPackages() {
  bundledPkg.forEach(async (key) => {
    const from = getPath.cwd("node_modules", key);
    const to = getPath.build("node_modules", key);
    await fse.copy(from, to, {
      filter: (src, dst) => !filterPkg.some((item) => src.indexOf(item) !== -1),
    });
  });
}

async function getPackageJson() {
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

  await copyResources();

  copyPackages();

  await getPackageJson();

  getLicenses(process.cwd(), getPath.build("THIRD-PARTY-LICENSES.txt"));
})();
