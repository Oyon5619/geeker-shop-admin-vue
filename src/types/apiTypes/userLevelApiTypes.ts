export interface UserLevelInfo {
  id: string;
  name: string;
  level: number;
  status: number;
  discount: number;
  max_price: number;
  max_times: number;
}

export interface GetUserLevelListApiResp {
  list: UserLevelInfo[];
  totalCount: number;
}

export interface AddUserLevelApiReq extends Partial<
  Omit<UserLevelInfo, "id">
> {}

export interface AddUserLevelApiResp extends UserLevelInfo {}

export interface ModifyUserLevelApiReq extends Partial<UserLevelInfo> {}
