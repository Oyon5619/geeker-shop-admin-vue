import type {
  GetAdminInfoApiResp,
  LoginApiReq,
  LoginApiResp,
  ModifyAdminPwdReq,
} from "@/types/apiTypes/adminApiTypes";
import type { BaseResp } from "@/types/apiTypes/baseResp";
import request from "@/utils/request";

// 管理员登录api
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

// 获取管理员信息api
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
