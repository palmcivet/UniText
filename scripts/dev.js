"use strict";

const chalk = require("chalk");
const electron = require("electron");
const { spawn } = require("child_process");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDevServer = require("webpack-dev-server");

const { env, buildPath } = require("./config/environment");
const mainConfig = require("./config/webpack.main");
const rendererConfig = require("./config/webpack.renderer");

let electronProcess = null;
let manualRestart = false;

function logStats(proc, data) {
  let log = "";

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array(19 - proc.length + 1).join("-")}`);
  log += "\n";

  if (typeof data === "object") {
    data
      .toString({
        colors: true,
        chunks: false,
      })
      .split(/\r?\n/)
      .forEach((line) => {
        log += "  " + line + "\n";
      });
  } else {
    log += `  ${data}\n`;
  }

  log += chalk.yellow.bold(`┗ ${new Array(28 + 1).join("-")}`);

  console.log(log);
}

function electronLog(data, color) {
  let log = "";
  data = data.toString().split(/\r?\n/);
  data.forEach((line) => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold("┏ Electron -------------------") +
        "\n" +
        log +
        chalk[color].bold("┗ ----------------------------")
    );
  }
}

function startRenderer() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(rendererConfig);

    compiler.hooks.compilation.tap("HtmlWebpackPluginAfterEmit", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync("AfterPlugin", (data, callback) => {
        callback(null, data);
      });
    });

    compiler.hooks.done.tap("AfterCompiler", (stats) => {
      logStats("Renderer", stats);
    });

    const server = new WebpackDevServer(
      {
        port: env.PORT_RENDERER,
        static: buildPath.public(),
      },
      compiler
    );

    server.start();
    resolve();
  });
}

function startMain() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainConfig);

    compiler.hooks.watchRun.tapAsync("Compiling", (_, done) => {
      logStats("Main", chalk.white.bold("compiling..."));
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      logStats("Main", stats);

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        startElectron();

        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }

      resolve();
    });
  });
}

function startElectron() {
  const pkg = require("../package.json");

  electronProcess = spawn(electron.toString(), [
    `--inspect=${env.PORT_INSPECT}`,
    `--remote-debugging-port=${env.PORT_DEBUG}`,
    "--nolazy",
    buildPath.build(pkg.main),
  ]);

  electronProcess.stdout.on("data", (data) => {
    electronLog(data, "blue");
  });
  electronProcess.stderr.on("data", (data) => {
    electronLog(data, "red");
  });

  electronProcess.on("close", () => {
    if (!manualRestart) process.exit();
  });
}

(() => {
  console.log(chalk.greenBright.bold("UniText Serve"));

  Promise.all([startRenderer(), startMain()])
    .then(() => {
      startElectron();
    })
    .catch((err) => {
      console.error(err);
    });
})();
