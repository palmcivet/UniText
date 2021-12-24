/**
 * @interface 元信息，从 Stat 获得。需要跨平台
 */
export interface IDocumentMeta {
  /**
   * @field 创建日期
   */
  cTime: number;
  /**
   * @field 更改日期
   */
  mTime: number;
  /**
   * @field 编辑时长
   */
  editTime: number;
}

/* plaintext begin */

/**
 * @enum { ETXTIndent } 缩进
 */
export enum ETXTIndent {
  T2 = "T2",
  T4 = "T4",
  S2 = "S2",
  S4 = "S4",
}

/**
 * @enum { ETXTCoding } 编码
 */
export enum ETXTCoding {
  GBK = "GBK",
  UTF8 = "UTF8",
  ASCII = "ASCII",
  GB2312 = "GB2312",
}

/**
 * @enum { ETXTEoL } 行尾序列
 */
export enum ETXTEoL {
  LF = "LF",
  CRLF = "CRLF",
}

/**
 * @interface 编辑器相关属性
 */
export interface ITXTFormat {
  /**
   * @field 缩进
   */
  indent: ETXTIndent;
  /**
   * @field 编码
   */
  encoding: ETXTCoding;
  /**
   * @field 行尾序列
   */
  endOfLine: ETXTEoL;
}

/**
 * @interface 文本的可计算属性
 */
export interface ITXTComputable {
  /**
   * @field 单词数量
   */
  wordCount: number;
  /**
   * @field 字符数量
   */
  charCount: number;
  /**
   * @field 预计阅读时长
   */
  readTime: number;
}

/* plaintext end */

/* markdown begin */

/**
 * @enum { EMDPicture } 图片存储方案
 */
export enum EMDPicture {
  LOCAL = "LOCAL",
  SMMS = "SMMS",
  IMGUR = "IMGUR",
  QIUNIU = "QIUNIU",
  ALI = "ALI",
  TENCENT = "TENCENT",
}

/**
 * @interface 文档的默认设置
 */
export interface IMDConfig {
  /**
   * @field 备注信息
   */
  remark: string;
  /**
   * @field 是否标记为完成
   */
  complete: boolean;
  /**
   * @field 文章标签
   */
  tags: Array<string>;
  /**
   * @field 图片存储方案
   */
  picture: EMDPicture;
}

/**
 * @interface Markdown 的 Front-Matter
 */
export interface IMDFrontMatter {
  /**
   * @field markdown 文档的元信息，自动生成
   */
  meta: IDocumentMeta;
  /**
   * @field markdown 文档默认设置
   */
  config: IMDConfig;
  /**
   * @field markdown 文档中的图片映射
   */
  images: Array<string>;
}

/**
 * @interface 文章属性
 */
export interface IDocumentMD extends IMDFrontMatter {
  /**
   * @field 文档内容
   */
  content: string;
}

/* markdown end */

/* pdf begin */

export interface IDocumentPDF {}

/* pdf end */
