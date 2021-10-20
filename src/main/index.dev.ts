import { app, BrowserWindow } from "electron";
import { Socket } from "net";
// eslint-disable-next-line import/no-unresolved
import extensions from "vue-devtools";

import "./index";

app.on("browser-window-created", (event, window) => {
  if (!window.webContents.isDevToolsOpened()) {
    window.webContents.openDevTools();
    window.webContents.session.loadExtension(extensions).catch((e) => {
      console.error(
        "Fail to load vue extension. Please run `npm run postinstall`, or remove it and try again!"
      );
      console.error(e);
    });
  }
});

const devServer = new Socket({}).connect(3031, "127.0.0.1");
devServer.on("data", () => {
  BrowserWindow.getAllWindows().forEach((w) => w.reload());
});
