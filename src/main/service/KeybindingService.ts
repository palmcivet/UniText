import { readJsonSync } from "fs-extra";

import Logger from "@/main/backend/Logger";
import { localesMenu } from "@/shared/i18n/ZH_CN";
import Service from "./Service";

type TKey = MapGet<typeof localesMenu>;

export default class KeybindingService extends Service {
  private readonly _dataSet!: Map<TKey, string>;

  constructor(logger: Logger) {
    super(logger);

    this._dataSet = new Map([
      /* system */
      ["system.about-unitext", ""],
      ["system.check-for-updates", ""],
      ["system.setting.system", ""],
      ["system.setting.markdown", ""],
      ["system.setting.preference", "CmdOrCtrl+,"],
      ["system.setting.keybinding", ""],
      ["system.setting.snippet", ""],
      ["system.theme.appearance", ""],
      ["system.theme.editor", ""],
      ["system.theme.view", ""],
      ["system.theme.icon", ""],
      ["system.services", ""],
      ["system.hide", ""],
      ["system.hide-others", ""],
      ["system.close", ""],
      ["system.quit", ""],

      /* file */
      ["file.read-file", ""],
      ["file.edit-file", ""],
      ["file.copy-file", "CmdOrCtrl+C"],
      ["file.new-file", "CmdOrCtrl+N"],
      ["file.new-folder", ""],
      ["file.open-project", ""],
      ["file.close-project", ""],
      ["file.reveal", ""],
      ["file.save", "CmdOrCtrl+S"],
      ["file.save-as", ""],

      /* edit */
      ["edit.undo", "CmdOrCtrl+Z"],
      ["edit.redo", "CmdOrCtrl+Shift+Z"],
      ["edit.cut", "CmdOrCtrl+X"],
      ["edit.copy", "CmdOrCtrl+C"],
      ["edit.paste", "CmdOrCtrl+V"],
      ["edit.delete", "Delete"],
      ["edit.rename", "Enter"],
      ["edit.reicon", ""],
      ["edit.select-all", "CmdOrCtrl+A"],

      /* view */
      ["view.sidebar", ""],
      ["view.sidepanel", ""],
      ["view.statusbar", ""],
      ["view.preview", ""],
      ["view.source", ""],
      ["view.auto-wrap", "Option+Z"],
      ["view.show-minimap", ""],
      ["view.show-space", ""],

      /* format */
      ["format.head-up", "Shift+Ctrl+]"],
      ["format.head-down", "Ctrl+Shift+["],
      ["format.bold", "CmdOrCtrl+B"],
      ["format.italic", "CmdOrCtrl+I"],

      /* help */
      ["help.learn-more", ""],
      ["help.toggle-devtools", "Option+Cmd+I"],

      /* tab */
      ["tab.close-current", "Cmd+W"],
      ["tab.close-saved", ""],
      ["tab.close-all", ""],
      ["tab.save-all", "Cmd+Option+S"],
      ["tab.preview", ""],
      ["tab.pin", ""],
    ]);
  }

  /**
   * 检测快捷键是否合法
   * @param key 快捷键
   */
  private _checkAccelerator(key: TKey): boolean {
    return true;
  }

  /**
   * 获取用户自定义键绑定
   * @param path 用户自定义文件路径
   */

  bootstrap(path: string): void {
    const json = readJsonSync(path);

    if (!json || typeof json !== "object") {
      return;
    }

    for (const key in json) {
      if (!this._dataSet.has(key as any)) {
        return;
      }

      const value = json[key];

      if (typeof value !== "string") {
        return;
      }

      if (value.length === 0) {
        this._dataSet.set(key as TKey, "");
      } else if (this._checkAccelerator(value as any)) {
        this._dataSet.set(key as TKey, value);
      }
    }
  }

  get(key: TKey) {
    return this._dataSet.get(key)!;
  }
}
