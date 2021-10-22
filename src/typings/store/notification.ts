export type TNotificationLevel = "INFO" | "WARN" | "ERROR";

export interface INotificationMessage {
  level: TNotificationLevel;
  title: string;
  body?: string;
}

export interface INotificationState {
  /**
   * @field 数据获取完毕
   */
  hasFetched: boolean;
  /**
   * @field 组件挂载完毕
   */
  hasMounted: boolean;

  /* 以上作为生命周期 */

  /**
   * @fileld 打开消息面板
   */
  showMessage: boolean;
  /**
   * @fileld 消息队列
   */
  messageQueue: Array<INotificationMessage>;
}
