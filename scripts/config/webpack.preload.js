"use strict";

const webpack = require("webpack");

const { isDev, BuildPath: buildPath } = require("./environment");

/**
 * @type {import('webpack').Configuration}
 */
const preloadConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-preload",
  entry: {
    index: buildPath.src("preload/index.ts"),
  },
  output: {
    path: buildPath.build("preload"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
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
