import { EStartupType } from "@/typings/bootstrap";

const reduceType = (type: any) => {
  const resArr = [];
  for (let key in type) {
    resArr.push(key);
  }
  return resArr;
};

interface IGroup {
  type: "Group";
  title: Array<string | Function>;
  properties: { [key: string]: IGroup | ITextBox | IBoolean | IRange | IDropDown };
  default: { [key: string]: any };
}

interface ITextBox {
  type: "TextBox";
  title: Array<string>;
  default: string;
  description: Array<string>;
}

interface IBoolean {
  type: "Boolean";
  title: Array<string>;
  default: boolean;
  description: Array<string>;
}

interface IRange {
  type: "Range";
  title: Array<string>;
  maximum: number;
  minimum: number;
  default: number;
  description: Array<string>;
}

interface IDropDown {
  type: "DropDown";
  title: Array<string>;
  enum: Array<any>;
  default: any;
  description: Array<string>;
}

const system: IGroup = {
  type: "Group",
  title: ["系统", "System"],
  properties: {
    showTray: {
      type: "Boolean",
      title: ["系统托盘"],
      default: true,
      description: ["是否显示系统托盘图标"],
    },
    exitWhenClosed: {
      type: "Boolean",
      title: ["关闭窗口时退出"],
      default: false,
      description: ["关闭最后一个窗口时退出应用"],
    },
    saveRecent: {
      type: "Boolean",
      title: ["最近文件"],
      default: true,
      description: ["保留最近打开文件的记录"],
    },
    autoOpen: {
      type: "Boolean",
      title: ["自动启动"],
      default: true,
      description: ["用户登录时启动应用"],
    },
    autoUpdate: {
      type: "Boolean",
      default: true,
      title: ["自动更新"],
      description: ["启用后软件将检测并自动更新"],
    },
    language: {
      type: "DropDown",
      enum: ["ZH_CN", "EN_US"],
      default: "ZH_CN",
      title: ["语言"],
      description: ["软件界面所呈现的语言"],
    },
    startup: {
      type: "DropDown",
      enum: ["BLANK", "CREATE", "SCHEDULE"],
      default: "CREATE",
      title: ["启动界面"],
      description: ["打开软件后所呈现的内容"],
    },
  },
  default: {},
};

const appearance = {
  type: "Group",
  title: ["外观"],
  properties: {
    showSideBar: {
      type: "Boolean",
      title: ["默认显示侧边栏"],
      default: true,
    },
    showStatusBar: {
      type: "Boolean",
      title: ["默认显示状态栏"],
      default: true,
    },
    showPanel: {
      type: "Boolean",
      title: ["默认显示右侧面板"],
      default: true,
    },
    dbColumn: { type: "Boolean", default: false },
    panelFloat: { type: "Boolean", default: true },
    panelType: {
      enum: ["TOC", "EXPORT", "INFO"],
      default: "TOC",
    },
    readMode: { type: "Boolean", default: false },
    editMode: {
      enum: ["SOURCE", "WYSIWYG", "RICHTEXT"],
      default: "SOURCE",
    },
    typeMode: {
      enum: ["ZEN", "FOCUS", "TYPER", "NORMAL"],
      default: "NORMAL",
    },
  },
  default: {},
};

const files = {
  type: "Group",
  properties: {
    folderDir: { type: "string", default: "" },
    ignoreFile: {
      type: "array",
      default: [".DS_Store", "desktop.ini", ".CONFIG", "node_modules"],
    },
    hideIgnore: { type: "Boolean", default: false },
    showIndent: { type: "Boolean", default: true },
    defaultFold: { type: "Boolean", default: true },
  },
  default: {},
};

const editor = {
  type: "Group",
  properties: {
    tag: { type: "string", default: "Untaged" },
    category: { type: "string", default: "Uncategory" },
    format: {
      type: "Group",
      properties: {
        indent: {
          type: "integer",
          enum: [2, 4],
          default: 4,
        },
        encoding: {
          type: "string",
          enum: ["UTF-8", "GBK"],
          default: "UTF-8",
        },
        endOfLine: {
          type: "string",
          enum: ["LF", "CRLF"],
          default: "LF",
        },
      },
      default: {},
    },
    config: {
      type: "Group",
      properties: {
        picStorage: { enum: [""], default: "" },
        autoSave: { type: "Boolean", default: false },
        autoSync: { type: "Boolean", default: false },
      },
      default: {},
    },
    miniMap: { type: "Boolean", default: false },
    wordWrap: { type: "Boolean", default: true },
    lineNumber: { type: "Boolean", default: true },
    highlightLine: { type: "Boolean", default: true },
  },
  default: {},
};

const markdown = {
  type: "Group",
  properties: {
    image: {
      type: "Group",
      properties: {
        cachePath: { type: "string", default: ".CONFIG/_cache" },
      },
      default: {},
    },
    scheme: { enum: ["GFM"], default: "GFM" },
  },
  default: {},
};

export const schema = {
  system,
  appearance,
  files,
  editor,
  markdown,
};

export default ((data: any) => {
  enum ETypeMap {
    Text = "string",
    Group = "object",
    Range = "number",
    Select = "",
    Boolean = "boolean",
  }
})(schema);
