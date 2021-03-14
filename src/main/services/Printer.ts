import { ipcMain, BrowserWindow, dialog, shell, BrowserView } from "electron";
import * as fse from "fs-extra";

import { IPC_EXPORT } from "@/common/channel/ipc";
import { URL_HOST } from "@/common/url";

export default class {
  view!: BrowserWindow;

  getReady() {
    this.view = new BrowserWindow({
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
      },
      show: false,
    });

    this.view.webContents.loadURL(`${URL_HOST}/printer.html`);
    this._listenForIpcMain();
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_EXPORT.AS_PDF, async (e, html: string) => {
      const win = BrowserWindow.fromWebContents(e.sender) as BrowserWindow;

      const { filePath, canceled } = await dialog.showSaveDialog(win, {});

      this.view.webContents.send("IPC::PRINT", html);

      try {
        const options: Electron.PrintToPDFOptions = { printBackground: true };
        const data = await this.view.webContents.printToPDF(options);
        if (filePath && !canceled) {
          await fse.writeFile(filePath, data, {});
          shell.showItemInFolder(filePath);
        }
        // TODO success
      } catch (err) {
        // TODO fail
        console.log(err);
      }
    });
  }
}
