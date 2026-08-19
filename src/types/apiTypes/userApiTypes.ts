export interface UserLevelItem {
  id: number;
  name: string;
}

export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  nickname: string;
  phone: string;
  email: string;
  user_level_id: number;
  create_time: number;
  update_time: string;
  last_login_time?: string;
  status: number;
  user_level?: UserLevelItem;
}

export interface GetUserListApiReq {
  page: number;
  limit?: number;
  keyword?: string;
  user_level_id?: string;
}

export interface GetUserListApiResp {
  list: UserInfo[];
  totalCount: number;
  user_level: UserLevelItem[];
}

export interface AddUserApiReq extends Partial<
  Pick<
    UserInfo,
    | "username"
    | "status"
    | "nickname"
    | "phone"
    | "email"
    | "avatar"
    | "user_level_id"
  >
> {
  password?: string;
}

export interface AddUserApiResp extends AddUserApiReq {
  id?: number;
}

export interface ModifyUserApiReq extends AddUserApiResp {}
