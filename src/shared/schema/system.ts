import { ISchema, IGroup, reduceType, reduceSchema } from "./_";
import { ETitleBar, ISystemLaunch, ISystemWindow, ISystem } from "@/shared/typings/setting/system";
import { EI18n } from "@/shared/typings/setting/preference";

const sLaunch: IGroup<ISystemLaunch> = {
  type: "Group",
  title: ["启动", "Launch"],
  description: ["软件的启动设置，启动时载入"],
  properties: {
    language: {
      type: "DropDown",
      enum: reduceType(EI18n).filter((v) => isNaN(Number.parseInt(v))),
      default: "ZH_CN",
      title: ["界面语言"],
      description: ["软件界面所呈现的语言"],
    },
    showTray: {
      type: "CheckBox",
      title: ["显示系统托盘"],
      default: true,
      description: ["是否显示系统托盘图标"],
    },
    exitWhenClosed: {
      type: "CheckBox",
      title: ["最后一个窗口关闭时退出"],
      default: false,
      description: ["最后一个窗口关闭时退出应用。`false` 则最小化到系统托盘"],
    },
    autoOpen: {
      type: "CheckBox",
      title: ["登录时自动启动软件"],
      default: true,
      description: ["登录时自动启动软件"],
    },
    autoUpdate: {
      type: "CheckBox",
      default: true,
      title: ["自动更新"],
      description: ["启用后软件将检测并自动更新"],
    },
    cabinPath: {
      type: "TextBox",
      title: ["笔记库位置"],
      default: "",
      description: ["默认笔记库位置"],
    },
  },
  default: {},
};

const sWindow: IGroup<ISystemWindow> = {
  type: "Group",
  title: ["窗口样式"],
  description: [""],
  properties: {
    width: {
      type: "Range",
      title: ["宽度"],
      description: ["窗口的默认宽度"],
      minimum: 647,
      default: 1132,
    },
    height: {
      type: "Range",
      title: ["高度"],
      description: ["窗口的默认高度"],
      minimum: 400,
      default: 700,
    },
    titleBarStyle: {
      type: "DropDown",
      title: ["标题栏样式"],
      description: ["标题栏的默认样式"],
      enum: reduceType(ETitleBar),
      default: ETitleBar.HIDDEN,
    },
  },
  default: {},
};

export const schemaSystem: ISchema<ISystem> = {
  launch: sLaunch,
  window: sWindow,
};

export default reduceSchema(schemaSystem);
