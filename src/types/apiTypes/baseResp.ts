/** 基本响应体 */
export interface BaseResp<T = unknown> {
  msg: string;
  errorCode?: string;
  data?: T;
}
