import {
  addNoticeApi,
  getNoticeListApi,
  modifyNoticeApi,
  removeNoticeApi,
} from "@/api/noticeApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import type {
  AddNoticeApiReq,
  ModifyNoticeApiReq,
} from "@/types/apiTypes/noticeApiTypes";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormInst, FormRules } from "naive-ui";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const getNoticeListAsync = async (page: number = DEFAULT_PAGE) => {
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

const addNoticeAsync = async (req: AddNoticeApiReq) => {
  const { data } = await addNoticeApi(req);
  return data;
};

const modifyNoticeAsync = async (req: ModifyNoticeApiReq) => {
  const { data } = await modifyNoticeApi(req);
  return data;
};

const removeNoticeAysnc = async (id: number) => {
  const { data } = await removeNoticeApi(id);
  return data;
};

export const useNoticeManager = () => {
  const currentPage = ref(DEFAULT_PAGE);
  const formRef = ref<FormInst>();
  const formDrawerRef = ref<FormDrawerRef>();
  const formRules: FormRules = {
    title: {
      required: true,
      message: "公告标题不能为空!",
      trigger: ["blur", "input"],
    },
    content: {
      required: true,
      message: "公告内容不能为空!",
      trigger: ["blur", "input"],
    },
  };
  const formValues = reactive<ModifyNoticeApiReq>({ title: "", content: "" });
  const isEdit = ref(false);

  const {
    run: getNoticeList,
    data: noticeListData,
    loading,
  } = useRequest(getNoticeListAsync, { manual: true });

  const { runAsync: addNotice, loading: isNoticeAdding } = useRequest(
    addNoticeAsync,
    { manual: true },
  );

  const { runAsync: modifyNotice, loading: isNoticeModifying } = useRequest(
    modifyNoticeAsync,
    { manual: true },
  );

  const { runAsync: removeNotice, loading: isNoticeRemoving } = useRequest(
    removeNoticeAysnc,
    { manual: true },
  );

  const isSubmitting = computed(
    () =>
      isNoticeAdding.value || isNoticeModifying.value || isNoticeRemoving.value,
  );

  const addOrEditText = computed(() => (isEdit.value ? "修改" : "新增"));

  const setFormValues = (item: ModifyNoticeApiReq) => {
    const { id, content, title } = item;

    formValues.id = id;
    formValues.content = content;
    formValues.title = title;
  };

  const onPagination = (page: number) => {
    currentPage.value = page;
    getNoticeList(page);
  };

  const resetFormValues = () => {
    setFormValues({ id: undefined, title: "", content: "" });
  };

  return {
    currentPage,
    noticeListData,
    loading,
    formDrawerRef,
    formRules,
    formValues,
    isEdit,
    formRef,
    isSubmitting,
    addOrEditText,
    getNoticeList,
    onPagination,
    resetFormValues,
    setFormValues,
    addNotice,
    modifyNotice,
    removeNotice,
  };
};
