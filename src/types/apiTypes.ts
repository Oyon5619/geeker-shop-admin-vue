/** 基本响应体 */
export interface BaseResp<T = unknown> {
  msg: string;
  errorCode?: string;
  data?: T;
}

/** --------------------- 管理员模块 --------------------- */

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

/** --------------------- 首页统计模块 --------------------- */

export interface PanelData {
  title: string;
  value: number;
  unit: string;
  unitColor: string;
  subTitle: string;
  subValue: number;
  subUnit?: string;
}

export interface StatusInfo {
  label: string;
  value?: number;
}

export interface GetUnitMainStatisticResp {
  panels: PanelData[];
}

export interface GetUnitStatusStatisticResp {
  goods: StatusInfo[];
  order: StatusInfo[];
}

export interface GetChartStatisticResp {
  x: string[];
  y: number[];
}
