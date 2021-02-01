import * as fse from "fs-extra";

import { TKeybindingSet } from "@/typings/bootstrap";

export class Keybinding {
  private readonly defaultSet!: TKeybindingSet;

  constructor() {
    this.defaultSet = new Map<string, string>([
      /* system */
      ["system.about", ""],
      ["system.check", ""],
      ["system.settings", ""],
      ["system.keybinding", ""],
      ["system.snippet", ""],
      ["system.quit", "CmdOrCtrl+Q"],

      /* file */
      ["file.read", ""],
      ["file.edit", ""],
      ["file.newfile", "CmdOrCtrl+N"],
      ["file.newfolder", ""],
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
      ["view.statusbar", ""],
      ["view.file", ""],

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
    const json = fse.readJsonSync(path);

    if (!json || typeof json !== "object") {
      return;
    }

    const userAccelerators = new Map();

    for (const key in json) {
      if (this.defaultSet.has(key)) {
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

  getItem(key: string) {
    return this.defaultSet.get(key);
  }

  setItem(key: string) {
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
