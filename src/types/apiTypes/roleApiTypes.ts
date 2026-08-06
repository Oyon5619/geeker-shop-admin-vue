export interface PivotInfo {
  id: number;
  role_id: number;
  rule_id: number;
}

export interface RoleRuleInfo {
  id: number;
  pivot: PivotInfo;
}

export interface RoleInfo {
  id: number;
  name: string;
  desc: string;
  status: number;
  create_time: string;
  update_time: string;
  rules: RoleRuleInfo[];
}

export interface GetRoleListApiResp {
  list: RoleInfo[];
  totalCount: number;
}

export interface AddRoleApiReq {
  name?: string;
  status?: number;
  desc?: string;
}

export interface ModifyRoleApiReq extends AddRoleApiReq {
  id?: number;
}

export interface SetRoleRulesApiReq {
  id?: number;
  rule_ids?: number[];
}
