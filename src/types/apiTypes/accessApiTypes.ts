export interface AccessInfo {
  id: number;
  rule_id: number;
  status: number;
  create_time: string;
  update_time: string;
  name: string;
  desc: string;
  frontpath?: string;
  condition?: string;
  menu: number;
  order: number;
  icon: number;
  method: string;
  child?: AccessInfo[];
}

export interface GetAccessListApiResp {
  list: AccessInfo[];
  rules: AccessInfo[];
}

export interface AddAccessApiReq {
  rule_id?: number;
  menu?: number;
  name?: string;
  condition?: string;
  method?: string;
  order?: number;
  icon?: number;
  frontpath?: string;
}

export interface AddAccessApiResp extends AddAccessApiReq {
  create_time: string;
  update_time: string;
  id?: string;
}

export interface ModifyAccessApiReq extends AddAccessApiReq {
  id?: number;
}
