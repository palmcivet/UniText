"use strict";

const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

const { getPath, getMainEnv } = require("./environment");

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
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      "@": getPath.src(),
      "&": getPath.build(),
    },
    extensions: [".ts", ".js", ".json"],
  },
  plugins: [
    new ESLintPlugin({ failOnError: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(getMainEnv(isDev)),
  ],
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
}

module.exports = mainConfig;
