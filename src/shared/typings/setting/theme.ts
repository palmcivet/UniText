/**
 * @interface 主题样式
 */
export interface IThemeOverview {
  /**
   * @field 动态主题
   */
  dynamic: boolean;
  /**
   * @field 预设主题 + 自定义主题
   */
  preset: string;
}

/**
 * @interface 单独指定主题
 */
export interface IThemeCustom {
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

export interface ITheme {
  overview: IThemeOverview;
  custom: IThemeCustom;
}
