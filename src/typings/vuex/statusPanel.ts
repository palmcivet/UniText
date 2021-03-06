export interface IStatusPanelState {
  /**
   * @field 目录列表
   */
  toc: Array<ITocItem>;
  /**
   * @field 图片列表
   */
  imgList: Set<string>;
  /**
   * @field 导出
   */
  export: {};
}
