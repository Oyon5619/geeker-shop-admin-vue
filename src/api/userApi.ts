import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  AddUserApiReq,
  AddUserApiResp,
  GetUserListApiReq,
  GetUserListApiResp,
  ModifyUserApiReq,
} from "@/types/apiTypes/userApiTypes";
import request from "@/utils/request";

/** 获取普通用户列表 */
export const getUserListApi = (req: GetUserListApiReq) => {
  const { page, ...params } = req;
  return request<unknown, BaseResp<GetUserListApiResp>>({
    url: `/admin/user/${page}`,
    method: "GET",
    params,
  });
};

/** 新增普通用户 */
export const addUserApi = (data: AddUserApiReq) =>
  request<AddUserApiReq, BaseResp<AddUserApiResp>>({
    url: "/admin/user",
    method: "POST",
    data,
  });

/** 修改普通用户 */
export const modifyUserApi = (req: ModifyUserApiReq) => {
  const { id, ...data } = req;

  return request<Omit<ModifyUserApiReq, "id">, BaseResp<boolean>>({
    url: `/admin/user/${id}`,
    method: "POST",
    data,
  });
};

/** 删除普通用户 */
export const removeUserApi = (id: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/user/${id}/delete`,
    method: "POST",
  });
