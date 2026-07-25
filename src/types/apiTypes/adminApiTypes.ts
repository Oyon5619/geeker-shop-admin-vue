// 管理员模块Api的的请求/响应体类型

/** 管理员登录请求体 */
export interface LoginApiReq {
  username: string;
  password: string;
}

/** 管理员登录响应体 */
export interface LoginApiResp {
  token: string;
}

interface AdminRole {
  id: number;
  name: string;
}

export interface AdminMenu {
  id: number;
  rule_id: number;
  status: number;
  create_time: string;
  update_time: string;
  name: string;
  desc: string;
  frontpath?: string;
  condition?: string;
  menu?: number;
  order?: number;
  icon?: string;
  method?: string;
  child?: AdminMenu[];
}

/** 获取管理员个人信息响应体 */
export interface GetAdminInfoApiResp {
  id: number;
  username: string;
  avatar: string;
  super: number;
  role: AdminRole;
  menus: AdminMenu[];
  ruleNames: string[];
}

/** 修改管理员密码请求体 */
export interface ModifyAdminPwdReq {
  oldpassword: string;
  password: string;
  repassword: string;
}

export interface GetManagerListApiReq {
  page: number;
  limit: number;
  keyword?: string;
}

export interface ManagerInfo {
  id: number;
  status: number;
  create_time: string;
  update_time: string;
  username: string;
  avatar: string;
  role_id: number;
  super: number;
  role: AdminRole;
}

export interface GetManagerListApiResp {
  list: ManagerInfo[];
  roles: AdminRole[];
  totalCount: number;
}

export interface AddManagerApiReq {
  username?: string;
  password?: string;
  role_id?: number;
  status?: number;
  avatar?: string;
}

export type AddManagerApiResp = Omit<ManagerInfo, "role">;

export interface ModifyManagerApiReq extends AddManagerApiReq {
  id?: number;
}

export interface ModifyManagerStatusApiReq {
  id?: number;
  status?: number;
}
