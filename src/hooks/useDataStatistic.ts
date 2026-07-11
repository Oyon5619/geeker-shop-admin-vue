import {
  getUnitMainStatisticApi,
  getUnitStatusStatisticApi,
} from "@/api/statisticApi";
import { useRequest } from "vue-hooks-plus";

export const useDataStatistic = () => {
  const {
    run: getUnitMainStatistic,
    data: unitPanelData,
    loading: isUnitMainLoading,
  } = useRequest(
    async () => {
      const { data } = await getUnitMainStatisticApi();

      return data?.panels ?? [];
    },
    { manual: true },
  );

  const {
    data: unitStatusData,
    run: getUnitStatusStatistic,
    loading: isUnitStatusLoading,
  } = useRequest(
    async () => {
      const { data } = await getUnitStatusStatisticApi();

      return data ?? [];
    },
    { manual: true },
  );

  return {
    getUnitMainStatistic,
    getUnitStatusStatistic,
    unitPanelData,
    unitStatusData,
    isUnitMainLoading,
    isUnitStatusLoading,
  };
};
