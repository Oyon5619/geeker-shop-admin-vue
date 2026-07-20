import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  AddImgClassApiReq,
  GetImgClassListApiReq,
  GetImgClassListApiResp,
  GetImgListByClassApiReq,
  GetImgListByClassApiResp,
  ImgClassInfo,
  ModifyImgNameApiReq,
  RemoveImgApiReq,
} from "@/types/apiTypes/imageApiTypes";
import request from "@/utils/request";

// 查询图库分类列表数据
export const getImgClassListApi = (req: GetImgClassListApiReq) => {
  const { page, limit } = req;

  return request<unknown, BaseResp<GetImgClassListApiResp>>({
    url: `/admin/image_class/${page}`,
    method: "GET",
    params: limit ? { limit } : undefined,
  });
};

// 增加图库分类
export const addImgClassApi = (data: AddImgClassApiReq) =>
  request<AddImgClassApiReq, BaseResp<ImgClassInfo>>({
    url: "/admin/image_class",
    method: "POST",
    data,
  });

// 修改图库分类
export const modifyImgClassApi = (req: AddImgClassApiReq) => {
  const { id, ...data } = req;

  return request<AddImgClassApiReq, BaseResp<boolean>>({
    url: `/admin/image_class/${id}`,
    method: "POST",
    data,
  });
};

// 删除图库分类
export const removeImgClassApi = (id: number) =>
  request<unknown, BaseResp<boolean>>({
    url: `/admin/image_class/${id}/delete`,
    method: "POST",
  });

// 查询指定分类下的图片列表
export const getImgListByClassApi = (data: GetImgListByClassApiReq) => {
  const { id, page, limit } = data;

  return request<unknown, BaseResp<GetImgListByClassApiResp>>({
    url: `/admin/image_class/${id}/image/${page}`,
    method: "GET",
    params: limit ? { limit } : undefined,
  });
};

// 删除图片
export const removeImgApi = (data: RemoveImgApiReq) =>
  request<RemoveImgApiReq, BaseResp<boolean>>({
    url: "/admin/image/delete_all",
    method: "POST",
    data,
  });

// 修改图片名
export const modifyImgNameApi = (req: ModifyImgNameApiReq) => {
  const { id, name } = req;

  return request<Pick<ModifyImgNameApiReq, "name">, BaseResp<boolean>>({
    url: `/admin/image/${id}`,
    method: "POST",
    data: { name },
  });
};
