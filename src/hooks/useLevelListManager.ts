import {
  addUserLevelApi,
  getUserLevelListApi,
  modifyUserLevelApi,
  removeUserLevelApi,
} from "@/api/userLevelApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import type {
  AddUserLevelApiReq,
  ModifyUserLevelApiReq,
} from "@/types/apiTypes/userLevelApiTypes";
import { isEmpty } from "lodash";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const removeUserLevelAsync = async (id: string) => {
  const { data } = await removeUserLevelApi(id);
  return data;
};

const getUserLevelListAsync = async (page: number = DEFAULT_PAGE) => {
  const limit = PAGE_SIZE_10;

  try {
    const { data } = await getUserLevelListApi(page);

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return { userLevelList: data?.list ?? [], page, limit, total, pageCount };
  } catch (err) {
    console.error(err);
    return { userLevelList: [], page, limit, total: 0, pageCount: 0 };
  }
};

const addUserLevelAsync = async (req: AddUserLevelApiReq) => {
  const { data } = await addUserLevelApi(req);
  return !isEmpty(data?.id);
};

const modifyUserLevelAsync = async (req: ModifyUserLevelApiReq) => {
  const { data } = await modifyUserLevelApi(req);
  return data;
};

export const useLevelListManager = () => {
  const isEdit = ref(false);
  const currentPage = ref(DEFAULT_PAGE);
  const userLevelFormModel = reactive<ModifyUserLevelApiReq>({
    status: COMMON_STATUS.VALID,
  });

  const drawerTitle = computed(() =>
    isEdit.value ? "编辑会员等级" : "新增会员等级",
  );
  const submitSuccessTips = computed(() =>
    isEdit.value ? "编辑会员等级成功!" : "新增会员等级成功!",
  );

  const {
    run: getUserLevelList,
    data: userLevelListData,
    loading,
  } = useRequest(getUserLevelListAsync, {
    manual: true,
  });

  const { runAsync: removeUserLevel } = useRequest(removeUserLevelAsync, {
    manual: true,
  });

  const { runAsync: submitUserLevelInfo, loading: isSubmitting } = useRequest(
    async () => {
      if (isEdit.value) {
        return await modifyUserLevelAsync(userLevelFormModel);
      }

      return await addUserLevelAsync(userLevelFormModel);
    },
    { manual: true },
  );

  const onPagination = (page = DEFAULT_PAGE) => {
    currentPage.value = page;
    getUserLevelList(page);
  };

  const setFormValues = (info: ModifyUserLevelApiReq) => {
    const { id, name, level, status, discount, max_price, max_times } = info;

    userLevelFormModel.id = id;
    userLevelFormModel.name = name;
    userLevelFormModel.level = level;
    userLevelFormModel.status = status;
    userLevelFormModel.discount = discount;
    userLevelFormModel.max_price = max_price;
    userLevelFormModel.max_times = max_times;
  };

  const resetFormValues = () => {
    setFormValues({
      id: undefined,
      name: undefined,
      level: undefined,
      status: COMMON_STATUS.VALID,
      discount: undefined,
      max_price: undefined,
      max_times: undefined,
    });
  };

  return {
    loading,
    isSubmitting,
    userLevelFormModel,
    userLevelListData,
    currentPage,
    drawerTitle,
    submitSuccessTips,
    isEdit,
    getUserLevelList,
    removeUserLevel,
    submitUserLevelInfo,
    onPagination,
    setFormValues,
    resetFormValues,
  };
};
