import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  AddRoleApiReq,
  GetRoleListApiResp,
  ModifyRoleApiReq,
  RoleInfo,
  SetRoleRulesApiReq,
} from "@/types/apiTypes/roleApiTypes";
import request from "@/utils/request";

// 获取角色列表
export const getRoleListApi = (page: number) =>
  request<unknown, BaseResp<GetRoleListApiResp>>({
    url: `/admin/role/${page}`,
    method: "GET",
  });

// 新增角色
export const addRoleApi = (data: AddRoleApiReq) =>
  request<AddRoleApiReq, BaseResp<Omit<RoleInfo, "rules">>>({
    url: "/admin/role",
    method: "POST",
    data,
  });

// 删除角色
export const removeRoleApi = (id: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/role/${id}/delete`,
    method: "POST",
  });

// 修改角色
export const modifyRoleApi = (req: ModifyRoleApiReq) => {
  const { id, ...data } = req;

  return request<Omit<ModifyRoleApiReq, "id">, BaseResp<boolean>>({
    url: `/admin/role/${id}`,
    method: "POST",
    data,
  });
};

// 配置角色权限
export const setRoleRulesApi = (data: SetRoleRulesApiReq) =>
  request<SetRoleRulesApiReq, BaseResp<boolean>>({
    url: "/admin/role/set_rules",
    method: "POST",
    data,
  });
