import { readJsonSync } from "fs-extra";

import { localesMenu } from "@/common/i18n/iMenu";

export default class Keybinding {
  private readonly _dataSet!: Map<string, string>;

  constructor() {
    this._dataSet = new Map([
      /* system */
      ["system.about", ""],
      ["system.check", ""],
      ["system.preference", "CmdOrCtrl+,"],
      ["system.keybinding", ""],
      ["system.keybinding.default", ""],
      ["system.keybinding.user", ""],
      ["system.snippet", ""],
      ["system.snippet.view", ""],
      ["system.snippet.create", ""],
      ["system.theme.appearance", ""],
      ["system.theme.editor", ""],
      ["system.theme.view", ""],
      ["system.theme.icon", ""],
      ["system.quit", ""],

      /* file */
      ["file.read", ""],
      ["file.edit", ""],
      ["file.new_file", "CmdOrCtrl+N"],
      ["file.new_folder", ""],
      ["file.open_project", ""],
      ["file.close_project", ""],
      ["file.reveal", ""],
      ["file.save", "CmdOrCtrl+S"],
      ["file.copy", "CmdOrCtrl+C"],

      /* edit */
      ["edit.undo", "CmdOrCtrl+Z"],
      ["edit.redo", "CmdOrCtrl+Shift+Z"],
      ["edit.cut", "CmdOrCtrl+X"],
      ["edit.copy", "CmdOrCtrl+C"],
      ["edit.paste", "CmdOrCtrl+V"],
      ["edit.delete", "Delete"],
      ["edit.rename", "Enter"],
      ["edit.reicon", ""],
      ["edit.selectall", "CmdOrCtrl+A"],

      /* view */
      ["view.sidebar", ""],
      ["view.sidepanel", ""],
      ["view.statusbar", ""],
      ["view.preview", ""],
      ["view.source", ""],
      ["view.autowrap", "Option+Z"],
      ["view.minimap", ""],
      ["view.space", ""],

      /* help */
      ["help.learnmore", ""],
      ["help.toggledevtools", "Option+Cmd+I"],

      /* tab */
      ["tab.closecurrent", "Cmd+W"],
      ["tab.closesaves", ""],
      ["tab.closeall", ""],
      ["tab.saveall", "Cmd+Option+S"],
      ["tab.preview", ""],
      ["tab.pin", ""],
    ]);

    this._listenForIpcMain();
  }

  /**
   * 获取用户自定义键绑定
   * @param path 用户自定义文件路径
   */
  load(path: string) {
    const json = readJsonSync(path);

    if (!json || typeof json !== "object") {
      return;
    }

    const userAccelerators = new Map();

    for (const key in json) {
      if (this._dataSet.has(key)) {
        const value = json[key];

        if (typeof value !== "string") return;

        if (value.length === 0) {
          userAccelerators.set(key, "");
        } else if (this._checkAccelerator(value)) {
          userAccelerators.set(key, value);
        }
      }
    }
  }

  getItem(key: MapGet<typeof localesMenu>) {
    return this._dataSet.get(key);
  }

  setItem(key: Map<MapGet<typeof localesMenu>, string>) {
    // 更改键绑定时需要更改菜单
  }

  /**
   * 检测快捷键是否合法
   * @param key 快捷键
   */
  private _checkAccelerator(key: string) {
    return true;
  }

  private _listenForIpcMain() {}
}
