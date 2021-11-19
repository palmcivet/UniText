import { TSchema, IGroup, reduceType, reduceSchema } from "./_";
import { ECoding, EEoL, EIndent, EPicture } from "@/shared/typings/document";
import {
  EStartup,
  EPanelType,
  EEditMode,
  ETypeMode,
  IPreferenceInterface,
  IPreferenceWorkbench,
  IPreferenceBrowser,
  IPreferenceEditor,
  IPreferenceDocument,
  IPreference,
} from "@/shared/typings/setting/preference";
import { CABIN_NAME } from "../constant";

const pInterface: IGroup<IPreferenceInterface> = {
  type: "Group",
  title: ["界面"],
  description: ["界面的默认设置，加载时载入"],
  properties: {
    showSideBar: {
      type: "CheckBox",
      title: ["显示左侧边栏"],
      default: true,
      description: [""],
    },
    showStatusBar: {
      type: "CheckBox",
      title: ["显示状态栏"],
      default: true,
      description: [""],
    },
    showPanel: {
      type: "CheckBox",
      title: ["显示右侧面板"],
      default: true,
      description: [""],
    },
    panelFloat: {
      type: "CheckBox",
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
      type: "CheckBox",
      title: ["阅读模式"],
      default: false,
      description: [""],
    },
    dbColumn: {
      type: "CheckBox",
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

const pWorkBench: IGroup<IPreferenceWorkbench> = {
  type: "Group",
  title: ["系统", "System"],
  description: ["软件的默认设置，启动时载入"],
  properties: {
    startup: {
      type: "DropDown",
      enum: reduceType(EStartup),
      default: EStartup.CREATE,
      title: ["启动后呈现的内容"],
      description: ["打开软件后所呈现的内容"],
    },
    saveRecent: {
      type: "CheckBox",
      title: ["记录最近打开的文件"],
      default: true,
      description: ["记录最近打开的文件，以快速恢复工作"],
    },
    autoOpen: {
      type: "CheckBox",
      title: ["自动打开上一次的文件"],
      default: true,
      description: [""],
    },
    autoSave: {
      type: "CheckBox",
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
  },
  default: {},
};

const pFileManager: IGroup<IPreferenceBrowser> = {
  type: "Group",
  title: ["文件管理"],
  description: ["文件管理器的默认设置"],
  properties: {
    ignoreFile: {
      type: "TextGroup",
      title: ["忽略文件"],
      default: [".DS_Store", "desktop.ini", "node_modules", CABIN_NAME],
      description: [""],
    },
    showIndent: {
      type: "CheckBox",
      title: ["显示指示线"],
      default: true,
      description: ["文件管理器显示指示线"],
    },
  },
  default: {},
};

const pEditor: IGroup<IPreferenceEditor> = {
  type: "Group",
  title: ["编辑器"],
  description: ["编辑器的默认设置"],
  properties: {
    lineWrap: {
      type: "CheckBox",
      title: ["换行"],
      default: true,
      description: [""],
    },
    showMiniMap: {
      type: "CheckBox",
      title: ["显示代码地图"],
      default: false,
      description: ["编辑区右侧显示代码地图"],
    },
    showLineNumber: {
      type: "CheckBox",
      title: ["显示行号"],
      default: true,
      description: [""],
    },
    highlightLine: {
      type: "CheckBox",
      title: ["高亮当前行"],
      default: true,
      description: [""],
    },
  },
  default: {},
};

const pDocument: IGroup<IPreferenceDocument> = {
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
  interface: pInterface,
  workbench: pWorkBench,
  browser: pFileManager,
  editor: pEditor,
  document: pDocument,
};

export default reduceSchema(schemaPreference);