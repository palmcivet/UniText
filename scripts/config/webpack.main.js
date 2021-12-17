"use strict";

const webpack = require("webpack");

const { isDev, buildPath, mainEnv } = require("./environment");

/**
 * @type {import('webpack').Configuration}
 */
const mainConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-main",
  entry: {
    index: buildPath.src(isDev ? "main/index.dev.ts" : "main/index.ts"),
  },
  output: {
    path: buildPath.build(),
    filename: "background.js",
    libraryTarget: "commonjs2",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      "@": buildPath.src(),
      "&": buildPath.build(),
    },
    extensions: [".ts", ".js", ".json"],
  },
  externals: ["level"],
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.DefinePlugin(mainEnv(isDev))],
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
