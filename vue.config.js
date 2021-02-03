const path = require("path");

module.exports = {
  runtimeCompiler: true,
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
        mac: {
          target: "dmg",
          darkModeSupport: true,
        },
        win: {
          target: [
            {
              target: "zip",
              arch: ["ia32", "x64"],
            },
            {
              target: "msi",
              arch: ["ia32", "x64"],
            },
          ],
        },
        linux: {
          target: [
            {
              target: "deb",
            },
            {
              target: "rpm",
            },
            {
              target: "AppImage",
            },
            {
              target: "snap",
            },
          ],
        },
      },
    },
  },
};
