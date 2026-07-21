// 公告管理模块Api的请求/响应体类型

export interface AddNoticeApiReq {
  title: string;
  content: string;
}

export interface AddNoticeApiResp {
  title: string;
  content: string;
  create_time: string;
  update_time: string;
  id: number;
}

export interface ModifyNoticeApiReq extends AddNoticeApiReq {
  id?: number;
}

export interface NoticeInfo {
  id: number;
  title: string;
  content: string;
  order: number;
  create_time: string;
  update_time: string;
}

export interface GetNoticeListApiResp {
  list: NoticeInfo[];
  totalCount: number;
}
