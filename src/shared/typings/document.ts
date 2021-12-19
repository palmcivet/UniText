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
  S4 = "S4",
}

/**
 * @enum { ECoding } 编码
 */
export enum ECoding {
  GBK = "GBK",
  UTF8 = "UTF8",
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
  tag: Array<string>;
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
   * @field 文档默认设置
   */
  config: IDocumentConfig;
  /**
   * @field 编辑器相关属性
   * @deprecated 可自动检测，移动到 front matter 外部
   */
  format: IDocumentFormat;
  /**
   * @field 文章的元信息，自动生成。即 Stat 信息，需要跨平台
   */
  meta: IDocumentMeta;
  /**
   * @field 图片映射
   */
  images: Array<string>;
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
