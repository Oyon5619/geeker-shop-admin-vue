/** 基本响应体 */
export interface BaseResp<T = unknown> {
  msg: string;
  errorCode?: string;
  data?: T;
}

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

interface AdminMenu {
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

export interface GetAdminInfoApiResp {
  id: number;
  username: string;
  avatar: string;
  super: number;
  role: AdminRole;
  menus: AdminMenu[];
  ruleNames: string[];
}
