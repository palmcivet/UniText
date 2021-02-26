import { IGroup, reduceSchema, reduceType, TSchema } from "@/common/schema";
import {
  EPreset,
  IMarkdownHabit,
  IMarkdownExport,
  IMarkdownExtend,
  IMarkdownFeature,
  IMarkdown,
} from "@/typings/schema/markdown";

const mHabit: IGroup<IMarkdownHabit> = {
  type: "Group",
  title: ["书写习惯"],
  description: ["设置 Markdown 的书写习惯"],
  properties: {
    preset: {
      type: "DropDown",
      title: ["语法预设"],
      enum: reduceType(EPreset),
      default: EPreset.GFM,
      description: ["语法预设方案，可被单独设置覆盖"],
    },
    hardBreaks: {
      type: "CheckBox",
      title: ["是否启用硬换行"],
      default: true,
      description: ["空两格及以上或回车换行，否则认为是同一行"],
    },
    linkify: {
      type: "CheckBox",
      title: ["自动探测可点击的地址"],
      default: true,
      description: [""],
    },
    html: {
      type: "CheckBox",
      title: ["启用 HTML 标签"],
      default: true,
      description: [""],
    },
    filterLink: {
      type: "TextGroup",
      title: ["过滤 URL。支持正则"],
      default: [""],
      description: [""],
    },
  },
  default: {},
};

const mExport: IGroup<IMarkdownExport> = {
  type: "Group",
  title: ["导出设置"],
  description: ["设置导出的格式"],
  properties: {
    addToc: {
      type: "CheckBox",
      title: ["添加目录"],
      default: true,
      description: [""],
    },
    addPageNum: {
      type: "CheckBox",
      title: ["添加页号"],
      default: true,
      description: [""],
    },
    addStyle: {
      type: "TextBox",
      title: ["添加样式"],
      default: "",
      description: [""],
    },
    refCheck: {
      type: "CheckBox",
      title: ["引用检查"],
      default: true,
      description: [""],
    },
    lintCheck: {
      type: "CheckBox",
      title: ["语法检查"],
      default: true,
      description: [""],
    },
    postHook: {
      type: "TextBox",
      title: ["Post Hook"],
      default: "",
      description: ["操作完成后执行用户定义的脚本"],
    },
  },
  default: {},
};

const mExtend: IGroup<IMarkdownExtend> = {
  type: "Group",
  title: ["扩展语法"],
  description: ["设置扩展语法"],
  properties: {
    todoList: {
      type: "CheckBox",
      title: ["启用任务列表"],
      default: true,
      description: [""],
    },
    tables: {
      type: "CheckBox",
      title: ["启用表格"],
      default: true,
      description: [""],
    },
    toc: {
      type: "CheckBox",
      title: ["启用目录"],
      default: true,
      description: [""],
    },
    footnote: {
      type: "CheckBox",
      title: ["启用脚注"],
      default: true,
      description: [""],
    },
    sup: {
      type: "CheckBox",
      title: ["启用上标"],
      default: true,
      description: [""],
    },
    sub: {
      type: "CheckBox",
      title: ["启用下标"],
      default: true,
      description: [""],
    },
    insert: {
      type: "CheckBox",
      title: ["启用插入线"],
      default: true,
      description: [""],
    },
    delete: {
      type: "CheckBox",
      title: ["启用删除线"],
      default: true,
      description: [""],
    },
    mark: {
      type: "CheckBox",
      title: ["启用高亮"],
      default: true,
      description: [""],
    },
    abbr: {
      type: "CheckBox",
      title: ["启用 abbr 属性"],
      default: true,
      description: [""],
    },
  },
  default: {},
};

const mFeature: IGroup<IMarkdownFeature> = {
  type: "Group",
  title: ["扩展功能"],
  description: ["设置扩展功能"],
  properties: {
    tableMerge: {
      type: "CheckBox",
      title: ["启用合并单元格"],
      default: true,
      description: [""],
    },
    tableAlign: {
      type: "CheckBox",
      title: ["启用单元格居中"],
      default: true,
      description: [""],
    },
    container: {
      type: "CheckBox",
      title: ["启用自定义容器"],
      default: true,
      description: [""],
    },
    linehighlight: {
      type: "CheckBox",
      title: ["启用行高亮"],
      default: true,
      description: [""],
    },
    fileImport: {
      type: "CheckBox",
      title: ["启用文档导入"],
      default: true,
      description: [""],
    },
    emoji: {
      type: "CheckBox",
      title: ["启用 Emoji"],
      default: true,
      description: [""],
    },
    katex: {
      type: "CheckBox",
      title: ["启用 KaTex"],
      default: true,
      description: [""],
    },
    typographer: {
      type: "CheckBox",
      title: ["启用印刷板式"],
      default: true,
      description: [""],
    },
    mermaid: {
      type: "CheckBox",
      title: ["启用 Mermaid"],
      default: true,
      description: [""],
    },
  },
  default: {},
};

export const schemaMarkdown: TSchema<IMarkdown> = {
  habit: mHabit,
  export: mExport,
  extend: mExtend,
  feature: mFeature,
};

export default reduceSchema(schemaMarkdown);
