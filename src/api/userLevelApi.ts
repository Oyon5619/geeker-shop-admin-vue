import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  AddUserLevelApiReq,
  AddUserLevelApiResp,
  GetUserLevelListApiResp,
  ModifyUserLevelApiReq,
} from "@/types/apiTypes/userLevelApiTypes";
import request from "@/utils/request";

/** 会员等级列表 */
export const getUserLevelListApi = (page: number) =>
  request<unknown, BaseResp<GetUserLevelListApiResp>>({
    url: `/admin/user_level/${page}`,
    method: "GET",
  });

/** 新增会员等级 */
export const addUserLevelApi = (data: AddUserLevelApiReq) =>
  request<AddUserLevelApiReq, BaseResp<AddUserLevelApiResp>>({
    url: "/admin/user_level",
    method: "POST",
    data,
  });

/** 修改会员等级 */
export const modifyUserLevelApi = (req: ModifyUserLevelApiReq) => {
  const { id, ...data } = req;

  return request<AddUserLevelApiReq, BaseResp<boolean>>({
    url: `/admin/user_level/${id}`,
    method: "POST",
    data,
  });
};

/** 删除会员等级 */
export const removeUserLevelApi = (id: string) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/user_level/${id}/delete`,
    method: "POST",
  });
