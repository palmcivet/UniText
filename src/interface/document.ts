/**
 * @enum {EEol} 文档结尾控制符，End OF Line
 */
export enum EEol {
  LF,
  CR,
  CRLF,
}

/**
 * @interface 文章的元信息，自动生成
 */
export interface IDocumentMetaInfo {
  createDate: Date; // 创建日期
  modifyDate: Date; // 更改日期
  wordCount: number; // 字数统计
  charCount: number; // 字符统计
  duration: number; // 编辑时长
}

/**
 * @interface 编辑器格式相关属性
 */
export interface IDocumentFormat {
  indent: 2 | 4; // 缩进
  // TODO 完善字符编码的接口
  encoding: string; // 编码格式
  endOfLine: EEol; // 控制符
}

/**
 * @interface 文件设置相关属性
 */
export interface IDocumentConfig {
  // TODO 完善图片存储方案的接口
  picStorage: string; // 图片存储方案
  autoSave: boolean; // 自动保存
  autoSync: boolean; // 自动同步
  complete: boolean; // 是否完成
}

/**
 * @interface Markdown 的 Front-Matter
 */
export interface IDocumentFrontMatter {
  tag: string;
  comment: string;
  metaInfo: IDocumentMetaInfo;
  format: IDocumentFormat;
  config: IDocumentConfig;
}

/**
 * @interface 文章属性
 */
export interface IDocument extends IDocumentFrontMatter {
  content: string;
}
