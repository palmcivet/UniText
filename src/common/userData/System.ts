import { dialog, ipcMain } from "electron";
import Store from "electron-store";
import { join } from "path";
import * as fse from "fs-extra";

import schema from "@/common/schema/sSystem";
import { CONFIG_FILE, SYSTEM_PATH } from "@/common/env";
import { IPC_OTHER, IPC_PREFERENCE } from "@/common/channel/ipc";
import Logger from "@/main/services/Logger";
import { ISystem } from "@/typings/schema/system";
import { IBootArgs } from "@/typings/main";

export default class System {
  private _dataSet!: Store<ISystem>;

  private _logger!: Logger;

  private _cache!: {
    file: string;
    data: IBootArgs;
    /**
     * @getter `data.defaultPath`
     */
    defaultPath: string;
  };

  constructor(sysPath: string, logger: Logger) {
    this._logger = logger;
    this._cache = this._initCache(sysPath);
    this._setBasePath(this._cache.defaultPath);
    this._listenForIpcMain();
  }

  private _initCache(path: string) {
    fse.ensureDirSync(SYSTEM_PATH.DEFAULT_DIR(path));

    const that = this;
    const bootFile = SYSTEM_PATH.BOOT_FILE(path);

    let bootData: IBootArgs = {
      defaultPath: "",
      isFallBack: true,
      historyPaths: [],
    };

    /**
     * 不存在则置空，等用户填写再创建
     */
    if (fse.pathExistsSync(bootFile)) {
      try {
        let res = fse.readJSONSync(bootFile) as IBootArgs;

        if (Object.keys(res).includes("defaultPath") && fse.existsSync(res.defaultPath)) {
          bootData = {
            ...bootData,
            ...res,
          };
        }
      } catch (err) {
        that._logger.error(`${bootFile} 文件读取失败: ${err}`);
      }
    }

    return {
      file: bootFile,
      data: bootData,
      get defaultPath() {
        return this.data.defaultPath;
      },
      set defaultPath(path: string) {
        this.data.defaultPath = path;
        fse.writeJSON(bootFile, this.data).catch((err) => {
          that._logger.error(`${bootFile} 文件写入失败: ${err}`);
        });
      },
    };
  }

  private _setBasePath(filePath: string): void {
    this._cache.defaultPath = filePath;
    this._dataSet = new Store({
      cwd: join(filePath, ...CONFIG_FILE.SYSTEM),
      name: "system",
      schema: schema as Store.Schema<ISystem>,
    });
  }

  getItem(key: MapGet<ISystem>): any {
    return this._dataSet.get(key);
  }

  getDefaultPath() {
    return this._cache.defaultPath;
  }

  private _listenForIpcMain() {
    ipcMain.on(IPC_PREFERENCE.SET_ITEM, (event, key: string, val: any) => {
      this._dataSet.set(key, val);
    });

    ipcMain.on(IPC_PREFERENCE.GET_ALL, (event) => {
      event.reply(IPC_PREFERENCE.GET_ALL_REPLY, this._dataSet.store);
    });

    ipcMain.on(IPC_OTHER.SET_PATH_PRINCIPAL, async (e, newPath: string) => {
      ipcMain.emit(IPC_OTHER.SET_PATH_AGENT, newPath);

      const res = await dialog.showMessageBox({
        type: "info",
        title: `将在 ${newPath} 建立配置文件，是否继续？`,
        message: "确认退出？",
        buttons: ["确认", "取消"],
        cancelId: 1,
      });

      if (res.response === 1) return;

      this._setBasePath(newPath);
    });
  }
}
