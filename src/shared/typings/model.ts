import { Uri } from "monaco-editor";
import { IPathRoute, ITab } from "./renderer";
import { IMDFrontMatter, ITXTFormat } from "./document";

/**
 * @interface 打开的 Markdown 文件
 */
export interface IEditorState extends ITab {
  /**
   * @field markdown 文件的 front matter
   */
  frontmatter: IMDFrontMatter;
  /**
   * @field 文本的格式
   */
  format: ITXTFormat;
  /**
   * @field Monaco Editor 编辑模型
   */
  uri: Uri;
  /**
   * @field 路径
   */
  route: IPathRoute;
  /**
   * @field 是否临时文件
   */
  isTemp: boolean;
  /**
   * @field 是否是阅读模式
   */
  isReadMode: boolean;
}

export interface IViewState extends ITab {}

export interface IWorkbenchState extends ITab {}
