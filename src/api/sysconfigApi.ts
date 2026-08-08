import type { BaseResp } from "@/types/apiTypes/baseResp";
import request from "@/utils/request";

export interface SysUploadSettingInfo {
  Bucket: string;
  http: string;
  ACCESS_KEY: string;
  SECRET_KEY: string;
}

export interface SysAlipaySettingInfo {
  app_id: string;
  ali_public_key: string;
  private_key: string;
}

export interface SysWxpaySettingInfo {
  /** 公众号APP ID */
  app_id: string;
  miniapp_id: string;
  secret: string;
  /** appid */
  appid: string;
  mch_id: string;
  key: string;
  cert_client: string;
  cert_key: string;
}

export interface GetSysBaseSettingsApiResp {
  id: number;
  open_reg: number;
  reg_method: string;
  password_min: number;
  password_encrypt: string;
  upload_method: string;
  upload_config: SysUploadSettingInfo;
  api_safe: number;
  api_secret: string;
  close_order_minute: number;
  auto_received_day: number;
  after_sale_day: number;
  alipay: SysAlipaySettingInfo;
  wxpay: SysWxpaySettingInfo;
  ship: string;
}

export interface ModifySysBaseSettingsApiReq extends Omit<
  Partial<GetSysBaseSettingsApiResp>,
  "upload_config" | "alipay" | "wxpay"
> {
  upload_config?: Partial<SysUploadSettingInfo>;
  alipay?: Partial<SysAlipaySettingInfo>;
  wxpay?: Partial<SysWxpaySettingInfo>;
}

export const getSysBaseSettingsApi = () =>
  request<unknown, BaseResp<GetSysBaseSettingsApiResp>>({
    url: "/admin/sysconfig",
    method: "GET",
  });

export const modifySysBaseSettingsApi = (data: ModifySysBaseSettingsApiReq) =>
  request<ModifySysBaseSettingsApiReq, BaseResp<number>>({
    url: "/admin/sysconfig",
    method: "POST",
    data,
  });
