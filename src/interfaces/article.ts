/**
 * @interface 文章的元信息，自动生成
 */
export interface IArticleMetaInfo {
  createDate: Date;
  modifyDate: Date;
  wordCount: number; // 字数统计
  charCount: number; // 字符统计
  duration: number; // 编辑时长
}

/**
 * @interface 文章的编辑器相关属性
 */
export interface IArticleEditor {
  indent: 2 | 4;
  encoding: string; // TODO 完善字符编码接口
  endOfLine: "LF" | "CR" | "CRLF";
}

/**
 * @interface 文章的附加属性
 */
export interface IArticleAttribute {
  tagName: string;
  comment: string;
  picStorage: string; // TODO 完善图片存储方案接口
  isAutoSave: boolean;
  isAutoSync: boolean;
  isComputed: boolean;
}

/**
 * @interface 文章属性
 */
export interface IArticle {
  title: string;
  metaInfo: IArticleMetaInfo;
  attribute: IArticleAttribute;
  editor: IArticleEditor;
  content: string;
}
