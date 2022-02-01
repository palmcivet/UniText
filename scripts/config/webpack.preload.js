"use strict";

const webpack = require("webpack");

const { isDev, BuildPath } = require("./environment");

/**
 * @type {import('webpack').Configuration}
 */
const preloadConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-preload",
  entry: {
    index: BuildPath.src("preload/index.ts"),
  },
  output: {
    path: BuildPath.build("preload"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    alias: {
      "@": BuildPath.src(),
    },
    extensions: [".ts"],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
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
  preloadConfig.devtool = "nosources-source-map";
  preloadConfig.mode = "production";
}

module.exports = preloadConfig;
