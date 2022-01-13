"use strict";

const webpack = require("webpack");

const { isDev, BuildPath, mainEnv } = require("./environment");

/**
 * @type {import('webpack').Configuration}
 */
const mainConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-main",
  entry: {
    index: BuildPath.src(isDev ? "main/index.dev.ts" : "main/index.ts"),
  },
  output: {
    path: BuildPath.build(),
    filename: "background.js",
    libraryTarget: "commonjs2",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      "@": BuildPath.src(),
      "&": BuildPath.build(),
    },
    extensions: [".ts", ".js", ".json"],
  },
  externals: ["level"],
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.DefinePlugin(mainEnv())],
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
