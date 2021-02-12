"use strict";

const path = require("path");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

const { getEnvironmentDefinitions, getPath } = require("./environment");
const { dependencies } = require("../../package.json");

const isDev = process.env.NODE_ENV !== "production";

const mainConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-main",
  entry: {
    index: getPath.src("main/index.ts"),
  },
  output: {
    path: getPath.build(),
    filename: "background.js",
    libraryTarget: "commonjs2",
  },
  externals: [...Object.keys(dependencies || {})],
  node: {
    __dirname: !isDev,
    __filename: !isDev,
  },
  resolve: {
    alias: {
      "@": getPath.src(),
      "&": getPath.build(),
    },
    extensions: [".ts", ".js", ".json"],
  },
  plugins: [new ESLintPlugin({ failOnError: true }), new webpack.NoEmitOnErrorsPlugin()],
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};

if (!isDev) {
  mainConfig.devtool = "nosources-source-map";
  mainConfig.mode = "production";
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`,
      ...getEnvironmentDefinitions(),
    })
  );
}

module.exports = mainConfig;
