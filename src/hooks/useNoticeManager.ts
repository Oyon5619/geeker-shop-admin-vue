import { getNoticeListApi } from "@/api/noticeApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const getNoticeListAsync = async (page: number) => {
  const limit = PAGE_SIZE_10;

  try {
    const { data } = await getNoticeListApi(page);

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return { noticeList: data?.list ?? [], page, limit, total, pageCount };
  } catch (err) {
    console.error(err);
    return { noticeList: [], page, limit, total: 0, pageCount: 0 };
  }
};

export const useNoticeManager = () => {
  const currentPage = ref(DEFAULT_PAGE);

  const {
    run: getNoticeList,
    data: noticeListData,
    loading,
  } = useRequest(getNoticeListAsync, { manual: true });

  const onPagination = (page: number) => {
    currentPage.value = page;
    getNoticeList(page);
  };

  return {
    currentPage,
    noticeListData,
    loading,
    getNoticeList,
    onPagination,
  };
};
