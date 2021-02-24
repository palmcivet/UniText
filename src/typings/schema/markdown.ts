/**
 * @enum { EPreset } 语法方案预设
 */
export enum EPreset {
  CMM = "CommonMark",
  GFM = "GitHub Flavored Markdown",
  EVN = "Evernote",
  YDN = "YoudaoNote",
  WZN = "WizNote",
  RAW = "Raw",
}

/**
 * @interface 书写习惯
 */
export interface IMarkdownHabit {
  /**
   * @field 语法预设
   */
  preset: EPreset;
  /**
   * @field 是否启用硬换行。空两格及以上或回车换行，否则认为是同一行
   */
  hardBreaks: boolean;
  /**
   * @field 自动探测可点击的地址
   */
  linkify: boolean;
}

/**
 * @interface 导出设置
 */
export interface IMarkdownExport {
  /**
   * @field 添加目录
   */
  addToc: boolean;
  /**
   * @field 添加页号
   */
  addPageNum: boolean;
  /**
   * @field 自定义样式
   */
  addStyle: string;
  /**
   * @field 引用检查
   */
  refCheck: boolean;
  /**
   * @field 语法检查
   */
  lintCheck: boolean;
  /**
   * @field Post Hook。操作完成后执行用户定义的脚本
   */
  postHook: string;
}

/**
 * @interface 扩展语法
 */
export interface IMarkdownExtend {
  /**
   * @field 启用任务列表
   * @example
   * - [ ] TO
   * - [x] DO
   */
  todoList: boolean;
  /**
   * @field 启用表格
   */
  tables: boolean;
  /**
   * @field 启用目录
   * @example
   * [toc]
   */
  toc: boolean;
  /**
   * @field  启用脚注
   * @example
   * ^[footnote]
   */
  footnote: boolean;
  /**
   * @field 启用上标
   * @example
   * x~3~
   */
  sup: boolean;
  /**
   * @field 启用下标
   * @example
   * x^3^
   */
  sub: boolean;
  /**
   * @field 启用插入线
   * @example
   * ++insert++
   */
  insert: boolean;
  /**
   * @field 启用删除线
   * @example
   * ~~delete~~
   */
  delete: boolean;
  /**
   * @field 启用高亮
   * @example
   * ==Mark==
   */
  mark: boolean;
  /**
   * @field 启用 abbr 属性
   * @example
   * *[HTML]: Hyper Text Markup Language
   * _[HTML]: Hyper Text Markup Language
   * The HTML is maintained by W3C
   */
  abbr: boolean;
}

/**
 * @interface 扩展功能
 */
export interface IMarkdownFeature {
  /**
   * @field 启用合并单元格
   */
  tableMerge: boolean;
  /**
   * @field 启用单元格居中
   * @example
   * | cell |
   * |:---:|
   */
  tableAlign: boolean;
  /**
   * @field 启用自定义容器
   * @example
   * ::: warn
   * Note
   * :::
   */
  container: boolean;
  /**
   * @field 启用行高亮
   * @example
   * ```js {1,4-6}
   * let a;
   * ```
   */
  linehighlight: boolean;
  /**
   * @field 启用文档导入
   */
  fileImport: boolean;
  /**
   * @field 启用 Emoji
   */
  emoji: boolean;
  /**
   * @field 启用 Katex
   */
  katex: boolean;
  /**
   * @field 启用印刷板式
   */
  typographer: boolean;
  /**
   * @field 启用 Mermaid
   */
  mermaid: boolean;
}

/**
 * @interface Markdown.json 的类型
 */
export interface IMarkdown {
  habit: IMarkdownHabit;
  export: IMarkdownExport;
  extend: IMarkdownExtend;
  feature: IMarkdownFeature;
}
