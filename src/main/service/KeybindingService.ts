import { readJsonSync } from "fs-extra";

import Logger from "@/main/backend/Logger";
import Service from "@/main/service/Service";
import { TActionAccessID } from "@/shared/typings/setting";

type TCommand = TActionAccessID;
type TKeybinding = string;
type TWhen = string;
type TArgs = string;

type TSerializableKeybindingItem = {
  cmd: TCommand;
  key?: TKeybinding;
  when?: TWhen;
  args?: TArgs;
};

type TKeybindingItem = Omit<TSerializableKeybindingItem, "cmd">;

export default class KeybindingService extends Service {
  private readonly _dataSet!: Map<TCommand, TKeybindingItem>;

  constructor(logger: Logger) {
    super(logger);
    this._dataSet = new Map<TCommand, TKeybindingItem>([
      /* system */
      ["system.about-unitext", { key: "" }],
      ["system.check-for-updates", { key: "" }],
      ["system.setting.system", { key: "" }],
      ["system.setting.markdown", { key: "" }],
      ["system.setting.preference", { key: "CmdOrCtrl+," }],
      ["system.setting.keybinding", { key: "" }],
      ["system.settings.theme", { key: "" }],
      ["system.theme.appearance", { key: "" }],
      ["system.theme.editor", { key: "" }],
      ["system.theme.view", { key: "" }],
      ["system.theme.icon", { key: "" }],
      ["system.services", { key: "" }],
      ["system.hide", { key: "" }],
      ["system.hide-others", { key: "" }],
      ["system.close", { key: "" }],
      ["system.quit", { key: "" }],

      /* file */
      ["file.read-file", { key: "" }],
      ["file.edit-file", { key: "" }],
      ["file.copy-file", { key: "CmdOrCtrl+C" }],
      ["file.new-file", { key: "CmdOrCtrl+N" }],
      ["file.new-folder", { key: "" }],
      ["file.open-project", { key: "" }],
      ["file.close-project", { key: "" }],
      ["file.reveal", { key: "" }],
      ["file.save", { key: "CmdOrCtrl+S" }],
      ["file.save-as", { key: "" }],

      /* edit */
      ["edit.undo", { key: "CmdOrCtrl+Z" }],
      ["edit.redo", { key: "CmdOrCtrl+Shift+Z" }],
      ["edit.cut", { key: "CmdOrCtrl+X" }],
      ["edit.copy", { key: "CmdOrCtrl+C" }],
      ["edit.paste", { key: "CmdOrCtrl+V" }],
      ["edit.delete", { key: "Delete" }],
      ["edit.rename", { key: "Enter" }],
      ["edit.reicon", { key: "" }],
      ["edit.select-all", { key: "CmdOrCtrl+A" }],

      /* view */
      ["view.sidebar", { key: "" }],
      ["view.sidepanel", { key: "" }],
      ["view.statusbar", { key: "" }],
      ["view.preview", { key: "" }],
      ["view.source", { key: "" }],
      ["view.auto-wrap", { key: "Option+Z" }],
      ["view.show-minimap", { key: "" }],
      ["view.show-space", { key: "" }],

      /* format */
      ["format.head-up", { key: "Shift+Ctrl+]" }],
      ["format.head-down", { key: "Ctrl+Shift+[" }],
      ["format.bold", { key: "CmdOrCtrl+B" }],
      ["format.italic", { key: "CmdOrCtrl+I" }],

      /* help */
      ["help.learn-more", { key: "" }],
      ["help.toggle-devtools", { key: "Option+Cmd+I" }],

      /* tab */
      ["tab.close-current", { key: "Cmd+W" }],
      ["tab.close-saved", { key: "" }],
      ["tab.close-all", { key: "" }],
      ["tab.save-all", { key: "Cmd+Option+S" }],
      ["tab.preview", { key: "" }],
      ["tab.pin", { key: "" }],
    ]);
  }

  /**
   * 检测快捷键是否合法
   * @param cmd 快捷键
   */
  private _checkAccelerator(cmd: TCommand): boolean {
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
        this._dataSet.set(key as TCommand, {});
      } else if (this._checkAccelerator(value as any)) {
        this._dataSet.set(key as TCommand, {});
      }
    }
  }

  getKeybinding(cmd: TCommand) {
    return this._dataSet.get(cmd)?.key;
  }
}
