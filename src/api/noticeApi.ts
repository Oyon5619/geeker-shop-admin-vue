import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  AddNoticeApiReq,
  AddNoticeApiResp,
  GetNoticeListApiResp,
  ModifyNoticeApiReq,
} from "@/types/apiTypes/noticeApiTypes";
import request from "@/utils/request";

// 新增公告
export const addNoticeApi = (data: AddNoticeApiReq) =>
  request<AddNoticeApiReq, BaseResp<AddNoticeApiResp>>({
    url: "/admin/notice",
    method: "POST",
    data,
  });

// 修改公告
export const modifyNoticeApi = (req: ModifyNoticeApiReq) => {
  const { id, ...data } = req;

  return request<ModifyNoticeApiReq, BaseResp<boolean>>({
    url: `/admin/notice/${id}`,
    method: "POST",
    data,
  });
};

// 获取公告列表
export const getNoticeListApi = (page: number) =>
  request<unknown, BaseResp<GetNoticeListApiResp>>({
    url: `/admin/notice/${page}`,
    method: "GET",
  });

// 删除公告
export const removeNoticeApi = (id: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/notice/${id}/delete`,
    method: "POST",
  });
