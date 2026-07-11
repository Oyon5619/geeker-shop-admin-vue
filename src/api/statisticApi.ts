import type {
  BaseResp,
  GetGraphStatisticResp,
  GetUnitMainStatisticResp,
  GetUnitStatusStatisticResp,
} from "@/types/apiTypes";
import request from "@/utils/request";

// 获取首页主要单元的统计数据
export const getUnitMainStatisticApi = async () =>
  request<unknown, BaseResp<GetUnitMainStatisticResp>>({
    url: "/admin/statistics1",
    method: "GET",
  });

// 获取首页各单元的状态统计数据
export const getUnitStatusStatisticApi = async () =>
  request<unknown, BaseResp<GetUnitStatusStatisticResp>>({
    url: "/admin/statistics2",
    method: "GET",
  });

// 获取图表统计数据
export const getGraphStatisticApi = async (hour: string) =>
  request<unknown, BaseResp<GetGraphStatisticResp>>({
    url: "/admin/statistics3",
    method: "GET",
    params: { hour },
  });
