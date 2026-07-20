import {
  addImgClassApi,
  getImgClassListApi,
  modifyImgClassApi,
  removeImgClassApi,
} from "@/api/imgApi";
import { DEFAULT_PAGE, PAGE_SIZE_20 } from "@/constants/pagination";
import type {
  AddImgClassApiReq,
  GetImgClassListApiReq,
} from "@/types/apiTypes/imageApiTypes";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormInst, FormRules } from "naive-ui";
import { reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const getImgClassListAsync = async ({ page, limit }: GetImgClassListApiReq) => {
  const { data } = await getImgClassListApi({ page, limit });

  const total = data?.totalCount ?? 0;
  const pageCount = Math.ceil(total / limit);

  return {
    imgClassList: data?.list ?? [],
    page,
    limit,
    total,
    pageCount,
  };
};

const addImgClassAsync = async (req: AddImgClassApiReq) => {
  const { data } = await addImgClassApi({ ...req, order: req.order ?? 0 });
  return data;
};

const modifyImgClassAsync = async (req: AddImgClassApiReq) => {
  const { data } = await modifyImgClassApi(req);
  return data;
};

const removeImgClassAsync = async (id: number) => {
  const { data } = await removeImgClassApi(id);
  return data;
};

export const useImgClassManager = () => {
  const isEdit = ref(false);
  const activeImgClass = ref<number>();
  const currentPage = ref(DEFAULT_PAGE);
  const formDrawerRef = ref<FormDrawerRef>();
  const formRef = ref<FormInst>();
  const formValues = reactive<AddImgClassApiReq>({ name: "" });
  const formRules: FormRules = {
    name: {
      required: true,
      message: "分类名称不能为空!",
      trigger: ["blur", "input"],
    },
  };

  const {
    run: getImgClassList,
    data: imgClassListData,
    loading: isImgClassListLoading,
  } = useRequest(getImgClassListAsync, { manual: true });

  const { runAsync: addImgClass, loading: isImgClassAdding } = useRequest(
    addImgClassAsync,
    { manual: true },
  );

  const { runAsync: removeImgClass, loading: isImgClassRemoving } = useRequest(
    removeImgClassAsync,
    { manual: true },
  );

  const { runAsync: modifyImgClass, loading: isImgClassModifying } = useRequest(
    modifyImgClassAsync,
    { manual: true },
  );

  const onPagination = (page: number) => {
    currentPage.value = page;
    getImgClassList({ page, limit: PAGE_SIZE_20 });
  };

  const setFormValues = (values: AddImgClassApiReq) => {
    const { name, order, id } = values;

    formValues.name = name;
    formValues.order = order;
    formValues.id = id;
  };

  const resetFormValues = () => {
    setFormValues({ name: "", order: undefined, id: undefined });
  };

  return {
    getImgClassList,
    onPagination,
    resetFormValues,
    setFormValues,
    addImgClass,
    removeImgClass,
    modifyImgClass,
    activeImgClass,
    currentPage,
    imgClassListData,
    isImgClassListLoading,
    isEdit,
    formDrawerRef,
    formValues,
    formRules,
    formRef,
    isImgClassAdding,
    isImgClassRemoving,
    isImgClassModifying,
  };
};
