import {
  getImgListByClassApi,
  modifyImgNameApi,
  removeImgApi,
} from "@/api/imgApi";
import { DEFAULT_PAGE, PAGE_SIZE_8 } from "@/constants/pagination";
import type {
  GetImgListByClassApiReq,
  ModifyImgNameApiReq,
  RemoveImgApiReq,
} from "@/types/apiTypes/imageApiTypes";
import { computed, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const getImgListByClassAsync = async (req: GetImgListByClassApiReq) => {
  const { page, limit } = req;

  try {
    const { data } = await getImgListByClassApi(req);

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return { imgList: data?.list ?? [], page, limit, total, pageCount };
  } catch (err) {
    console.error(err);
    return { imgList: [], page, limit, total: 0, pageCount: 0 };
  }
};

const removeImgAsync = async (req: RemoveImgApiReq) => {
  const { data } = await removeImgApi(req);
  return data;
};

const modifyImgNameAsync = async (req: ModifyImgNameApiReq) => {
  const { data } = await modifyImgNameApi(req);
  return data;
};

export const useImgListManager = () => {
  const currentPage = ref(DEFAULT_PAGE);
  const imgClassId = ref<number>();

  const {
    run: getImgListByClass,
    data: imgListData,
    loading,
  } = useRequest(getImgListByClassAsync, { manual: true });

  const { runAsync: removeImg, loading: isImgRemoving } = useRequest(
    removeImgAsync,
    { manual: true },
  );
  const { runAsync: modifyImgName, loading: isImgNameModifying } = useRequest(
    modifyImgNameAsync,
    { manual: true },
  );

  const onPagination = (page: number) => {
    currentPage.value = page;
    getImgListByClass({ id: imgClassId.value, page, limit: PAGE_SIZE_8 });
  };

  const isSpinning = computed(
    () => loading.value || isImgRemoving.value || isImgNameModifying.value,
  );

  return {
    getImgListByClass,
    onPagination,
    removeImg,
    modifyImgName,
    imgClassId,
    currentPage,
    imgListData,
    isSpinning,
  };
};
