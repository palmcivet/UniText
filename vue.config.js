const path = require("path");

const STATIC = path.join(__dirname, "public");
const ASSETS = path.join(__dirname, "src", "assets");

module.exports = {
  pages: {
    index: {
      entry: path.join(__dirname, "src/app/renderer/index.ts"),
    },
  },
  css: {
    loaderOptions: {
      less: {
        import: [`${ASSETS}/styles/var.less"`],
        modifyVars: {
          "btn-height-base": "30px",
          "input-height-base": "30px",
        },
        javascriptEnabled: true,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessTypeChecking: process.env.NODE_ENV === "production" ? true : false,
      mainProcessFile: "src/app/main/index.ts",
      builderOptions: {
        productName: "UniText",
        win: {
          icon: "./public/app-icons/gridea.ico",
          target: [
            {
              target: "nsis",
              arch: ["ia32", "x64"],
            },
          ],
        },
        mac: {
          icon: "./public/app-icons/gridea.icns",
        },
        linux: {
          icon: "./public/app-icons/gridea.png",
          target: [
            {
              target: "AppImage",
            },
            {
              target: "deb",
            },
            {
              target: "snap",
            },
          ],
        },
        asar: false,
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: "Gridea", // 图标名称
        },
        publish: ["github"],
      },
    },
  },
};
