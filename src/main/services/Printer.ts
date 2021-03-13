import { ipcMain, BrowserView, BrowserWindow, dialog, shell } from "electron";

import { IPC_EXPORT } from "@/common/channel/ipc";
import * as fse from "fs-extra";

export default class {
  view!: BrowserView;

  getReady() {
    this.view = new BrowserView();
    this._listenForIpcMain();
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_EXPORT.AS_PDF, async (e, html: string) => {
      const win = BrowserWindow.fromWebContents(e.sender) as BrowserWindow;

      const { filePath, canceled } = await dialog.showSaveDialog(win, {});

      try {
        this.view.webContents
          .executeJavaScript("document.body.innerHTML =`" + html + "`;")
          .then((res) => {
            console.log(res);
            console.log("AFT");
          })
          .catch((err) => {
            console.log(err);
          });

        this.view.webContents.on("dom-ready", async () => {
          const options: Electron.PrintToPDFOptions = { printBackground: true };

          const data = await this.view.webContents.printToPDF(options);

          if (filePath && !canceled) {
            await fse.writeFile(filePath, data, {});
            shell.showItemInFolder(filePath);
          }
        });
        console.log("GO");

        // TODO success
      } catch (err) {
        // TODO fail
        console.log(err);
      }
    });
  }
}
