import {
  getChartStatisticApi,
  getUnitMainStatisticApi,
  getUnitStatusStatisticApi,
} from "@/api/statisticApi";
import { TIME_TYPE } from "@/constants/dateTime";
import { ref } from "vue";
import { useRequest } from "vue-hooks-plus";

export const useDataStatistic = () => {
  const timeType = ref<string>(TIME_TYPE.HOUR);

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
      return data;
    },
    { manual: true },
  );

  const {
    data: chartData,
    run: getChartStatistic,
    loading: isChartLoading,
  } = useRequest(async (type?: string) => {
    const { data } = await getChartStatisticApi(type);
    return data;
  });

  const onSelectTimeType = (value: string) => {
    timeType.value = value;
    getChartStatistic(value);
  };

  return {
    getUnitMainStatistic,
    getUnitStatusStatistic,
    getChartStatistic,
    onSelectTimeType,
    timeType,
    unitPanelData,
    unitStatusData,
    chartData,
    isUnitMainLoading,
    isUnitStatusLoading,
    isChartLoading,
  };
};
