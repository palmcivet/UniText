export enum EWindowTitleBar {
  DEFAULT = "default",
  HIDDEN = "hidden",
  INSET = "hiddenInset",
  CUSTOM = "customButtonsOnHover",
}

/**
 * @interface 窗口样式
 */
export interface IThemeWindow {
  /**
   * @field 宽度
   */
  width: number;
  /**
   * @field 高度
   */
  height: number;
  /**
   * @field 标题栏样式
   */
  titleBarStyle: EWindowTitleBar;
}

/**
 * @interface 颜色主题
 */
export interface IThemeColor {
  /**
   * @field 动态主题
   */
  dynamic: boolean;
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
