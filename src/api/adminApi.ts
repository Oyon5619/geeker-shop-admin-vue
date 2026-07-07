import type {
  BaseResp,
  GetAdminInfoApiResp,
  LoginApiReq,
  LoginApiResp,
} from "@/types/apiTypes";
import request from "@/utils/request";

// 管理员登录api
export const loginApi = async (data: LoginApiReq) =>
  await request<LoginApiReq, BaseResp<LoginApiResp>>({
    url: "/admin/login",
    method: "POST",
    data,
  });

// 管理员退出登录
export const logoutApi = async () =>
  await request<unknown, BaseResp<string>>({
    url: "/admin/logout",
    method: "POST",
  });

// 获取管理员信息api
export const getAdminInfoApi = async () =>
  await request<unknown, BaseResp<GetAdminInfoApiResp>>({
    url: "/admin/getinfo",
    method: "POST",
  });
