import { ipcMain, BrowserWindow, dialog, shell } from "electron";
import * as fse from "fs-extra";
import { join } from "path";

import { IPC_EXPORT } from "@/shared/channel/ipc";
import { isDev, PUBLIC } from "@/shared/constant";

const genTemplate = (content: string, style = "", title = "Untitled") => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${style}</style>
    <style>
      #markdown-preview {
        margin: 2em 15%;
      }
    </style>
    <title>${title}</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/themes/prism.min.css" rel="stylesheet">
    <link href="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/toolbar/prism-toolbar.min.css" rel="stylesheet">
    <link href="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet">
  </head>
  <body class="line-numbers match-braces rainbow-braces">
    <div id="#markdown-preview">${content}<div>
    <script src="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/components/prism-core.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/toolbar/prism-toolbar.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/show-language/prism-show-language.min.js"></script>
  </body>
</html>`;

export default class Printer {
  view!: BrowserWindow;

  getReady() {
    this.view = new BrowserWindow({
      webPreferences: {
        plugins: true,
        nodeIntegration: true,
      },
      show: false,
    });

    const URL_HOST = isDev ? `http://localhost:${process.env.PORT_RENDERER}` : `file://${__dirname}`;
    this.view.webContents.loadURL(`${URL_HOST}/printer.html`);
    this._listenForIpcMain();
  }

  private _listenForIpcMain() {
    let style = "";

    fse.readFile(join(__static, PUBLIC.THEME, "OneDarkPro", "renderView.css"), "utf-8").then((res) => {
      style = res;
    });

    ipcMain.on(IPC_EXPORT.AS_HTML, async (e, html: string) => {
      const win = BrowserWindow.fromWebContents(e.sender) as BrowserWindow;

      const { filePath, canceled } = await dialog.showSaveDialog(win, {
        filters: [{ name: "HTML", extensions: ["html"] }],
      });

      try {
        const data = genTemplate(html, style);
        if (filePath && !canceled) {
          await fse.writeFile(filePath, data);
          shell.showItemInFolder(filePath);
        }
        // TODO success
      } catch (err) {
        // TODO fail
        console.log(err);
      }
    });

    ipcMain.on(IPC_EXPORT.AS_PDF, async (e, html: string) => {
      const win = BrowserWindow.fromWebContents(e.sender) as BrowserWindow;

      const { filePath, canceled } = await dialog.showSaveDialog(win, {
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });

      this.view.webContents.send(
        "IPC::PRINT",
        `<style>${style} #markdown-preview { margin: 2em 15%; }</style><div id="#markdown-preview">${html}<div>`
      );

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
