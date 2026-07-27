import type {
  AddManagerApiReq,
  AddManagerApiResp,
  GetAdminInfoApiResp,
  GetManagerListApiReq,
  GetManagerListApiResp,
  LoginApiReq,
  LoginApiResp,
  ModifyAdminPwdReq,
  ModifyManagerApiReq,
  ModifyManagerStatusApiReq,
} from "@/types/apiTypes/adminApiTypes";
import type { BaseResp } from "@/types/apiTypes/baseResp";
import request from "@/utils/request";

// 管理员登录
export const loginApi = (data: LoginApiReq) =>
  request<LoginApiReq, BaseResp<LoginApiResp>>({
    url: "/admin/login",
    method: "POST",
    data,
  });

// 管理员退出登录
export const logoutApi = () =>
  request<unknown, BaseResp<string>>({
    url: "/admin/logout",
    method: "POST",
  });

// 获取管理员信息
export const getAdminInfoApi = () =>
  request<unknown, BaseResp<GetAdminInfoApiResp>>({
    url: "/admin/getinfo",
    method: "POST",
  });

// 修改管理员密码
export const modifyAdminPwdApi = (data: ModifyAdminPwdReq) =>
  request<ModifyAdminPwdReq, BaseResp<boolean>>({
    url: "/admin/updatepassword",
    method: "POST",
    data,
  });

// 获取管理员列表
export const getManagerListApi = (req: GetManagerListApiReq) => {
  const { page, ...params } = req;

  return request<unknown, BaseResp<GetManagerListApiResp>>({
    url: `/admin/manager/${page}`,
    method: "GET",
    params,
  });
};

// 新增管理员
export const addManagerApi = (data: AddManagerApiReq) =>
  request<AddManagerApiReq, BaseResp<AddManagerApiResp>>({
    url: "/admin/manager",
    method: "POST",
    data,
  });

// 修改管理员
export const modifyManagerApi = (req: ModifyManagerApiReq) => {
  const { id, ...data } = req;

  return request<Omit<ModifyManagerApiReq, "id">, BaseResp<boolean>>({
    url: `/admin/manager/${id}`,
    method: "POST",
    data,
  });
};

// 删除管理员
export const removeManagerApi = (id?: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/manager/${id}/delete`,
    method: "POST",
  });

// 修改管理员状态
export const modifyManagerStatusApi = (req: ModifyManagerStatusApiReq) => {
  const { id, ...data } = req;

  return request<Omit<ModifyManagerStatusApiReq, "id">, BaseResp<boolean>>({
    url: `/admin/manager/${id}/update_status`,
    method: "POST",
    data,
  });
};
