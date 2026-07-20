// 图库管理模块Api的请求/响应体类型

export interface GetImgClassListApiReq {
  page: number;
  limit: number;
}

export interface ImgClassInfo {
  id: number;
  name: string;
  order: number;
  image_count: number;
}

export interface GetImgClassListApiResp {
  list: ImgClassInfo[];
  totalCount: number;
}

export interface AddImgClassApiReq {
  id?: number;
  name: string;
  order?: number;
}

export interface GetImgListByClassApiReq {
  id?: number;
  page: number;
  limit: number;
}

export interface ImgInfo {
  id: number;
  url: string;
  name: string;
  path: string;
  create_time: string;
  update_time: string;
  image_class_id: number;
}

export interface GetImgListByClassApiResp {
  list: ImgInfo[];
  totalCount: number;
}

export interface ModifyImgNameApiReq {
  id?: number;
  name?: string;
}

export interface RemoveImgApiReq {
  ids: number[];
}
