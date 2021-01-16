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
   * @field 编辑时长
   */
  duration: number;
}

/**
 * @interface 编辑器格式相关属性
 */
export interface IDocumentFormat {
  /**
   * @field 缩进
   */
  indent: 2 | 4;
  /**
   * @field 编码格式
   */
  encoding: string; // TODO 完善字符编码的接口
  /**
   * @field 控制符
   */
  endOfLine: "LF" | "CRLF";
}

/**
 * @interface 文件设置相关属性
 */
export interface IDocumentConfig {
  /**
   * @field 图片存储方案
   */
  picStorage: string; // TODO 完善图片存储方案的接口
  /**
   * @field 自动保存
   */
  autoSave: boolean;
  /**
   * @field 自动同步
   */
  autoSync: boolean;
}

/**
 * @interface Markdown 的 Front-Matter
 */
export interface IDocumentFrontMatter {
  /**
   * @field 文章标签
   */
  tag: string;
  /**
   * @field 备注信息
   */
  remark: string;
  /**
   * @field 是否标记为完成
   */
  complete: boolean;
  metaInfo: IDocumentMetaInfo;
  format: IDocumentFormat;
  config: IDocumentConfig;
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
