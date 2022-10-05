import { BrowserWindow, PrintToPDFOptions } from "electron";
import { writeFile } from "fs-extra";
import { join } from "path";

import Logger from "@/main/utils/logger";
import Service, { Inject } from "@/main/service/_";
import SettingService from "@/main/service/service-setting";
import { isDev } from "@/main/utils/env";
import { IPC_CHANNEL } from "@/shared/channel";
import { IPathRoute } from "@/shared/typings/renderer";

export default class WindowService extends Service {
  private _window: any;

  private _printer: BrowserWindow | null = null;

  @Inject("SettingService")
  private readonly _settingService!: SettingService;

  constructor(logger: Logger) {
    super(logger);
  }

  public createPrinterWindow(): void {
    if (this._printer !== null) {
      return;
    }

    this._printer = new BrowserWindow({
      webPreferences: {
        preload: join(__preload, "index.js"),
      },
      show: false,
    });

    const URL_HOST = isDev ? `http://localhost:${process.env.PORT_RENDERER}` : `file://${__dirname}`;
    this._printer?.webContents.loadURL(`${URL_HOST}/printer.html`);
  }

  public async printToPDF(filepath: IPathRoute, html: string, options: PrintToPDFOptions): Promise<void> {
    try {
      this._printer?.webContents.send(IPC_CHANNEL.PRINTER_CALL, html);
      const data = await this._printer?.webContents.printToPDF(options);
      return writeFile(join(...filepath), data);
    } catch (error) {
      this.error(error);
    }
  }
}
