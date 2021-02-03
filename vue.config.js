const path = require("path");

module.exports = {
  runtimeCompiler: true,
  outputDir: "build",
  pages: {
    index: {
      entry: path.join(__dirname, "src/renderer/index.ts"),
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ["fs"],
      customFileProtocol: "unitext://./",
      nodeModulesPath: ["node_modules"],
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: false,
      mainProcessFile: "src/main/index.ts",
      outputDir: "dist",
      builderOptions: {
        productName: "UniText",
        appId: "com.github.unitext",
        directories: {
          buildResources: "resources",
          output: "dist",
        },
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/",
        },
        asar: true,
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "UniText",
        },
        dmg: {
          title: "${productName}",
        },
        mac: {
          target: ["dmg"],
          darkModeSupport: true,
        },
        win: {
          target: ["zip", "nsis"],
        },
        linux: {
          category: "Office;TextEditor;Utility",
          mimeTypes: ["text/markdown"],
          target: ["deb", "rpm", "AppImage", "snap"],
        },
      },
    },
  },
};
