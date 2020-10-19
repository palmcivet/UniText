const path = require("path");

module.exports = {
  runtimeCompiler: true,
  pages: {
    index: {
      entry: path.join(__dirname, "src/app/renderer/index.ts"),
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: false,
      mainProcessFile: "src/app/main/index.ts",
      outputDir: "dist",
      builderOptions: {
        productName: "UniText",
        win: {
          target: [
            {
              target: "nsis",
              arch: ["ia32", "x64"],
            },
          ],
        },
        mac: {},
        linux: {
          target: [{ target: "AppImage" }, { target: "deb" }, { target: "snap" }],
        },
        asar: false,
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "UniText",
        },
        publish: ["github"],
      },
    },
  },
};
