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

export enum ECodeBlocks {
  INDENT = "Indent",
  FENCE = "Fence",
}

/**
 * @interface Markdown 基础语法
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
  /**
   * @field 代码块
   */
  codeBlocks: ECodeBlocks;
}

/**
 * @interface Markdown 扩展语法
 */
export interface IMarkdownExtend {
  /**
   * @field 启用任务列表
   * @example
   * - [ ] TO
   * - [x] DO
   */
  todoList: boolean;
  tables: boolean;
  /**
   * @field 脚注
   * @example
   * ^[footnote]
   */
  footnote: boolean;
  /**
   * @field 目录
   * @example
   * [toc]
   */
  toc: boolean;
  /**
   * @field 上标
   * @example
   * x~3~
   */
  sup: boolean;
  /**
   * @field 下标
   * @example
   * x^3^
   */
  sub: boolean;
  /**
   * @field 插入
   * @example
   * ++insert++
   */
  insert: boolean;
  /**
   * @field 删除
   * @example
   * ~~delete~~
   */
  delete: boolean;
  /**
   * @field 高亮
   * @example
   * ==Mark==
   */
  mark: boolean;
  /**
   * @field 属性
   * @example
   * *[HTML]: Hyper Text Markup Language
   * _[HTML]: Hyper Text Markup Language
   * The HTML is maintained by W3C
   */
  abbr: boolean;
}

/**
 * @interface Markdown 扩展功能
 */
export interface IMarkdownFeature {
  /**
   * @field 启用合并单元格
   */
  tableMerge: boolean;
  /**
   * @field 单元格居中
   * @example
   * | cell |
   * |:---:|
   */
  tableAlign: boolean;
  /**
   * @field 启用文档导入
   */
  import: boolean;
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
   * @field 启用图表
   */
  mermaid: boolean;
}

export interface IMarkdownExport {
  addToc: boolean;
  refCheck: boolean;
  lintCheck: boolean;
  addPageNum: boolean;
  defStyle: string;
  postHook: string;
}
