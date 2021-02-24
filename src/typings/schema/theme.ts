/**
 * @interface 文件路径
 */
export interface IThemeColorCustom {
  /**
   * @field 外观主题
   */
  appearance: string;
  /**
   * @field 编辑器主题
   */
  monacoEditor: string;
  /**
   * @field 渲染代码主题
   */
  renderCode: string;
  /**
   * @field 渲染文章主题
   */
  renderView: string;
}

/**
 * @interface 颜色主题
 */
export interface IThemeColor extends IThemeColorCustom {
  /**
   * @field 动态主题
   */
  dynamic: boolean;
  /**
   * @field 预设
   */
  preset: string;
}

/**
 * @interface theme.json 的类型
 */
export interface ITheme {
  color: IThemeColor;
}
