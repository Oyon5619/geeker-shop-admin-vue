// 首页统计模块Api的请求/响应体类型

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
