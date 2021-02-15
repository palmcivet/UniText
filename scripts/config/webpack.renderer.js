"use strict";

const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { getPath, getRendererEnv } = require("./environment");

const isDev = process.env.NODE_ENV !== "production";

const rendererConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "electron-renderer",
  entry: {
    index: getPath.src("renderer/index.ts"),
  },
  output: {
    path: getPath.build(),
    filename: "js/[name].js",
    libraryTarget: "commonjs2",
    publicPath: "./",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      "vue$": "vue/dist/vue.esm.js",
      "@": getPath.src(),
      "&": getPath.public(),
    },
    extensions: [".ts", ".js", ".vue", ".json", ".css", ".less"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "UniText",
      filename: "index.html",
      template: getPath.public("index.html"),
      inject: "body",
    }),
    new VueLoaderPlugin(),
    new ESLintPlugin({ failOnError: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(getRendererEnv(isDev)),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: {
          loader: "vue-loader",
          options: {
            sourceMap: true,
          },
        },
      },
      {
        test: /\.(ts|js)$/i,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.less$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          isDev
            ? "style-loader"
            : { loader: MiniCssExtractPlugin.loader, options: { publicPath: "../" } },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|bmp|svg)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: isDev ? "[name].[ext]" : "[hash:5].[ext]",
            outputPath: "img",
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: isDev ? "[name].[ext]" : "[hash:5].[ext]",
            outputPath: "font",
          },
        },
      },
    ],
  },
};

if (isDev) {
  rendererConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (!isDev) {
  rendererConfig.devtool = "nosources-source-map";
  rendererConfig.mode = "production";
  rendererConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:5].css",
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  );
}

module.exports = rendererConfig;
