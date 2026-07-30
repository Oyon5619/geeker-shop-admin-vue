import type {
  AddAccessApiReq,
  AddAccessApiResp,
  GetAccessListApiResp,
  ModifyAccessApiReq,
} from "@/types/apiTypes/accessApiTypes";
import type { BaseResp } from "@/types/apiTypes/baseResp";
import request from "@/utils/request";

// 获取菜单权限列表
export const getAccessListApi = () =>
  request<unknown, BaseResp<GetAccessListApiResp>>({
    url: "/admin/rule/1",
    method: "GET",
  });

// 新增菜单/权限
export const addAccessApi = (data: AddAccessApiReq) =>
  request<AddAccessApiReq, BaseResp<AddAccessApiResp>>({
    url: "/admin/rule",
    method: "POST",
    data,
  });

// 修改菜单/权限
export const modifyAccessApi = (req: ModifyAccessApiReq) => {
  const { id, ...data } = req;

  return request<ModifyAccessApiReq, BaseResp<boolean>>({
    url: `/admin/rule/${id}`,
    method: "POST",
    data,
  });
};

// 删除菜单/权限
export const removeAccessApi = (id?: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/rule/${id}/delete`,
    method: "POST",
  });
