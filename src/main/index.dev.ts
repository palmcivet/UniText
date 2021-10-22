import { app } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";

import "./index";

app.on("browser-window-created", async (event, window) => {
  if (!window.webContents.isDevToolsOpened()) {
    window.webContents.openDevTools();
    installExtension(VUEJS3_DEVTOOLS);
  }
});
