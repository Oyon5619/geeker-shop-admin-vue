import type { BaseResp } from "@/types/apiTypes/baseResp";
import type {
  GetChartStatisticResp,
  GetUnitMainStatisticResp,
  GetUnitStatusStatisticResp,
} from "@/types/apiTypes/statisticApiTypes";
import request from "@/utils/request";

// 获取首页主要单元的统计数据
export const getUnitMainStatisticApi = () =>
  request<unknown, BaseResp<GetUnitMainStatisticResp>>({
    url: "/admin/statistics1",
    method: "GET",
  });

// 获取首页各单元的状态统计数据
export const getUnitStatusStatisticApi = () =>
  request<unknown, BaseResp<GetUnitStatusStatisticResp>>({
    url: "/admin/statistics2",
    method: "GET",
  });

// 获取图表统计数据
export const getChartStatisticApi = (timeType?: string) =>
  request<unknown, BaseResp<GetChartStatisticResp>>({
    url: "/admin/statistics3",
    method: "GET",
    params: { type: timeType },
  });
