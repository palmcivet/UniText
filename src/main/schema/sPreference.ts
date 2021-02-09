import { TSchema, IGroup, reduceType, reduceSchema } from "@/main/utils/schema";
import { IPreference } from "@/typings/bootstrap";
import { ECoding, EEoL, EIndent, EPicture } from "@/typings/document";
import {
  EI18n,
  EStartup,
  EPanelType,
  EEditMode,
  ETypeMode,
  IPreferenceSystem,
  IPreferenceUserInterface,
  IPreferenceFileManager,
  IPreferenceEditor,
  IPreferenceDocument,
} from "@/typings/service/preference";

const system: IGroup<IPreferenceSystem> = {
  type: "Group",
  title: ["系统", "System"],
  description: ["软件的默认设置，启动时载入"],
  properties: {
    showTray: {
      type: "Boolean",
      title: ["显示系统托盘"],
      default: true,
      description: ["是否显示系统托盘图标"],
    },
    exitWhenClosed: {
      type: "Boolean",
      title: ["最后一个窗口关闭时退出"],
      default: false,
      description: ["最后一个窗口关闭时退出应用。`false` 则最小化到系统托盘"],
    },
    openWhenLogged: {
      type: "Boolean",
      title: ["登录时自动启动软件"],
      default: true,
      description: ["登录时自动启动软件"],
    },
    saveRecent: {
      type: "Boolean",
      title: ["记录最近打开的文件"],
      default: true,
      description: ["记录最近打开的文件，以快速恢复工作"],
    },
    autoOpen: {
      type: "Boolean",
      title: ["自动打开上一次的文件"],
      default: true,
      description: [""],
    },
    autoUpdate: {
      type: "Boolean",
      default: true,
      title: ["自动更新"],
      description: ["启用后软件将检测并自动更新"],
    },
    autoSave: {
      type: "Boolean",
      title: ["自动保存"],
      default: false,
      description: [""],
    },
    saveDelay: {
      type: "Range",
      title: ["自动保存时间间隔"],
      minimum: 1000,
      default: 5000,
      description: [""],
    },
    language: {
      type: "DropDown",
      enum: reduceType(EI18n).filter((v) => isNaN(Number.parseInt(v))),
      default: "ZH_CN",
      title: ["界面语言"],
      description: ["软件界面所呈现的语言"],
    },
    startup: {
      type: "DropDown",
      enum: reduceType(EStartup),
      default: EStartup.CREATE,
      title: ["启动后呈现的内容"],
      description: ["打开软件后所呈现的内容"],
    },
  },
  default: {},
};

const userInterface: IGroup<IPreferenceUserInterface> = {
  type: "Group",
  title: ["界面"],
  description: ["界面的默认设置，加载时载入"],
  properties: {
    showSideBar: {
      type: "Boolean",
      title: ["显示左侧边栏"],
      default: true,
      description: [""],
    },
    showStatusBar: {
      type: "Boolean",
      title: ["显示状态栏"],
      default: true,
      description: [""],
    },
    showPanel: {
      type: "Boolean",
      title: ["显示右侧面板"],
      default: true,
      description: [""],
    },
    panelFloat: {
      type: "Boolean",
      title: ["右侧面板是否悬浮"],
      default: true,
      description: [""],
    },
    panelType: {
      type: "DropDown",
      title: ["右侧面板展示的信息类型"],
      enum: reduceType(EPanelType),
      default: EPanelType.TOC,
      description: [""],
    },
    readMode: {
      type: "Boolean",
      title: ["阅读模式"],
      default: false,
      description: [""],
    },
    dbColumn: {
      type: "Boolean",
      title: ["查看编辑状态"],
      default: false,
      description: ["对于源码模式，查看预览；对于 WYSIWYG，查看源码"],
    },
    editMode: {
      type: "DropDown",
      title: ["编辑模式"],
      enum: reduceType(EEditMode),
      default: EEditMode.SOURCE,
      description: ["默认的编辑模式"],
    },
    typeMode: {
      type: "DropDown",
      title: ["输入模式"],
      enum: reduceType(ETypeMode),
      default: ETypeMode.NORMAL,
      description: ["默认的输入模式"],
    },
  },
  default: {},
};

const fileManager: IGroup<IPreferenceFileManager> = {
  type: "Group",
  title: ["文件管理"],
  description: ["文件管理器的默认设置"],
  properties: {
    folderDir: {
      type: "TextBox",
      title: ["笔记库位置"],
      default: "",
      description: ["默认笔记库位置"],
    },
    ignoreFile: {
      type: "TextGroup",
      title: ["忽略文件"],
      default: [".DS_Store", "desktop.ini", ".CONFIG", "node_modules"],
      description: [""],
    },
    showIndent: {
      type: "Boolean",
      title: ["显示指示线"],
      default: true,
      description: ["文件管理器显示指示线"],
    },
  },
  default: {},
};

const editor: IGroup<IPreferenceEditor> = {
  type: "Group",
  title: ["编辑器"],
  description: ["编辑器的默认设置"],
  properties: {
    lineWrap: {
      type: "Boolean",
      title: ["换行"],
      default: true,
      description: [""],
    },
    showMiniMap: {
      type: "Boolean",
      title: ["显示代码地图"],
      default: false,
      description: ["编辑区右侧显示代码地图"],
    },
    showLineNumber: {
      type: "Boolean",
      title: ["显示行号"],
      default: true,
      description: [""],
    },
    highlightLine: {
      type: "Boolean",
      title: ["高亮当前行"],
      default: true,
      description: [""],
    },
  },
  default: {},
};

const document: IGroup<IPreferenceDocument> = {
  type: "Group",
  title: ["文档"],
  description: ["新建一份文档时默认采用的设置"],
  properties: {
    indent: {
      type: "DropDown",
      title: ["缩进"],
      enum: reduceType(EIndent),
      default: EIndent.T4,
      description: [""],
    },
    encoding: {
      type: "DropDown",
      title: ["编码"],
      enum: reduceType(ECoding),
      default: ECoding.UTF8,
      description: [""],
    },
    endOfLine: {
      type: "DropDown",
      title: ["行尾序列"],
      enum: reduceType(EEoL),
      default: EEoL.LF,
      description: [""],
    },
    tag: {
      type: "TextGroup",
      title: ["默认标签"],
      default: ["Untaged"],
      description: ["未分类标签归到该类别"],
    },
    picture: {
      type: "DropDown",
      enum: reduceType(EPicture),
      title: ["图片存储方案"],
      default: EPicture.LOCAL,
      description: [""],
    },
    category: {
      type: "TextBox",
      title: ["默认分类"],
      default: "Uncategory",
      description: ["未分类文件归到该类别"],
    },
  },
  default: {},
};

export const schemaPreference: TSchema<IPreference> = {
  system,
  userInterface,
  fileManager,
  editor,
  document,
};

export default reduceSchema(schemaPreference);
