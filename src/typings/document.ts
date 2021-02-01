/**
 * @enum { EIndent } 缩进
 */
export enum EIndent {
  /**
   * @field Tab 2
   */
  T2 = "T2",
  /**
   * @field Tab 4
   */
  T4 = "T4",
  /**
   * @field Space 2
   */
  S2 = "S2",
  /**
   * @field Space 4
   */
  S4 = "TS4",
}

/**
 * @enum { ECoding } 编码
 */
export enum ECoding {
  GBK = "GBK",
  UTF8 = "UTF-8",
  ASCII = "ASCII",
  GB2312 = "GB2312",
}

/**
 * @enum { EEoL } 行尾序列
 */
export enum EEoL {
  LF = "LF",
  CRLF = "CRLF",
}

/**
 * @enum { EPicture } 图片存储方案
 */
export enum EPicture {
  LOCAL = "LOCAL",
  SMMS = "SMMS",
  IMGUR = "IMGUR",
  QIUNIU = "QIUNIU",
  ALI = "ALI",
  TENCENT = "TENCENT",
}

/**
 * @interface 文章的元信息，自动生成
 */
export interface IDocumentMetaInfo {
  /**
   * @field 创建日期
   */
  created: string;
  /**
   * @field 更改日期
   */
  modified: string;
  /**
   * @field 字数统计
   */
  wordCount: number;
  /**
   * @field 字符统计
   */
  charCount: number;
  /**
   * @field 阅读时长
   */
  readTime: number;
  /**
   * @field 编辑时长
   */
  editTime: number;
}

/**
 * @interface 编辑器相关属性
 */
export interface IDocumentFormat {
  /**
   * @field 缩进
   */
  indent: EIndent;
  /**
   * @field 编码
   */
  encoding: ECoding;
  /**
   * @field 行尾序列
   */
  endOfLine: EEoL;
}

/**
 * @interface 文档的默认设置
 */
export interface IDocumentConfig {
  /**
   * @field 文章标签
   */
  tag: string;
  /**
   * @field 图片存储方案
   */
  picture: EPicture;
}

/**
 * @interface Markdown 的 Front-Matter
 */
export interface IDocumentFrontMatter {
  /**
   * @field 备注信息
   */
  remark: string;
  /**
   * @field 是否标记为完成
   */
  complete: boolean;
  /**
   * @field 文档的默认设置
   */
  config: IDocumentConfig;
  /**
   * @field 文章的元信息，自动生成
   */
  metaInfo: IDocumentMetaInfo;
  /**
   * @field 编辑器相关属性
   */
  format: IDocumentFormat;
}

/**
 * @interface 文章属性
 */
export interface IDocument extends IDocumentFrontMatter {
  /**
   * @field 文档内容
   */
  content: string;
}
