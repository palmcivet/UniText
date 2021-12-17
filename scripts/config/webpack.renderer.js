"use strict";

const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const env = require("dotenv").config();

const { buildPath, rendererEnv } = require("./environment");

const isDev = env.NODE_ENV !== "prod";

/**
 * @type {import('webpack').Configuration}
 */
const rendererConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "web",
  entry: {
    index: buildPath.src("renderer/index.ts"),
  },
  output: {
    path: buildPath.build(),
    filename: "js/[name].js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      "vue$": `vue/dist/vue.runtime.esm-browser${isDev ? "" : ".prod"}.js`,
      "@": buildPath.src(),
      "&": buildPath.public(),
    },
    extensions: [".ts", ".js", ".vue", ".json", ".css", ".less"],
    fallback: { crypto: false },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "UniText",
      filename: "index.html",
      template: buildPath.public("index.html"),
      inject: "body",
    }),
    new VueLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(rendererEnv(isDev)),
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
        use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.css$/i,
        use: [
          isDev ? "style-loader" : { loader: MiniCssExtractPlugin.loader, options: { publicPath: "../" } },
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
        test: /\.(woff(2)?|eot|ttf|otf)(\?(v=[0-9]\.[0-9]\.[0-9])?|t=[0-9].)$/i,
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
