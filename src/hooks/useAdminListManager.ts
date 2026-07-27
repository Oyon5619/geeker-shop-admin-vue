import {
  addManagerApi,
  getManagerListApi,
  modifyManagerApi,
  modifyManagerStatusApi,
  removeManagerApi,
} from "@/api/adminApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { MANAGER_STATUS } from "@/constants/statusEnum";
import type {
  AddManagerApiReq,
  GetManagerListApiReq,
  ModifyManagerApiReq,
} from "@/types/apiTypes/adminApiTypes";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormInst, FormRules, UploadFileInfo } from "naive-ui";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

interface InfoFormValue extends Omit<AddManagerApiReq, "avatar"> {
  avatarList?: UploadFileInfo[];
}

const getManagerListAsync = async (req: GetManagerListApiReq) => {
  const { page, limit } = req;

  try {
    const { data } = await getManagerListApi({ ...req, page, limit });

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      pageCount,
      managerList: data?.list ?? [],
      roles: data?.roles ?? [],
    };
  } catch (err) {
    console.error(err);

    return {
      managerList: [],
      roles: [],
      page,
      limit,
      total: 0,
      pageCount: 0,
    };
  }
};

const modifyManagerStatusAsync = async (req: ModifyManagerApiReq) => {
  const { data } = await modifyManagerStatusApi(req);
  return data;
};

const addManagerAsync = async (req: AddManagerApiReq) => {
  const { data } = await addManagerApi(req);
  return Boolean(data?.id);
};

const modifyManagerAsync = async (req: ModifyManagerApiReq) => {
  const { data } = await modifyManagerApi(req);
  return data;
};

const removeManagerAsync = async (id?: number) => {
  const { data } = await removeManagerApi(id);
  return data;
};

export const useAdminListManager = () => {
  const currentPage = ref(DEFAULT_PAGE);
  const isEdit = ref(false);
  const infoFormDrawerRef = ref<FormDrawerRef>();
  const queryFormValue = reactive<{ keyword?: string }>({});
  const infoFormRef = ref<FormInst>();
  const infoFormValue = reactive<InfoFormValue>({
    status: MANAGER_STATUS.VALID,
  });
  const infoFormRules: FormRules = {
    username: {
      required: true,
      message: "用户名不能为空!",
      trigger: ["blur", "input"],
    },
    role_id: {
      type: "number",
      required: true,
      message: "所属角色不能为空!",
      trigger: ["blur", "change"],
    },
  };

  const {
    run: getManagerList,
    data: managerListData,
    loading,
  } = useRequest(getManagerListAsync, { manual: true });

  const { runAsync: modifyManagerStatus, loading: isManagerStatusModifying } =
    useRequest(modifyManagerStatusAsync, { manual: true });

  const { runAsync: addManager, loading: isManagerAdding } = useRequest(
    addManagerAsync,
    { manual: true },
  );

  const { runAsync: modifyManager, loading: isManagerModifying } = useRequest(
    modifyManagerAsync,
    { manual: true },
  );

  const { runAsync: removeManager, loading: isManagerRemoving } = useRequest(
    removeManagerAsync,
    { manual: true },
  );

  const isSubmitting = computed(
    () =>
      isManagerAdding.value ||
      isManagerModifying.value ||
      isManagerRemoving.value,
  );
  const addOrEditText = computed(() => (isEdit.value ? "编辑" : "新增"));
  const roleOptions = computed(() => {
    const roles = managerListData.value?.roles ?? [];
    return roles.map(({ id: value, name: label }) => ({ label, value }));
  });

  const queryManagerList = (page = DEFAULT_PAGE, limit = PAGE_SIZE_10) => {
    getManagerList({
      page,
      limit,
      keyword: queryFormValue.keyword,
    });
  };

  const resetQuery = () => {
    queryFormValue.keyword = "";
    queryManagerList();
  };

  const onPagination = (page: number) => {
    currentPage.value = page;
    queryManagerList(page);
  };

  const setInfoFormValue = (newValue: AddManagerApiReq) => {
    const { username, password, role_id, status, avatar } = newValue;

    infoFormValue.username = username;
    infoFormValue.password = password;
    infoFormValue.role_id = role_id;
    infoFormValue.status = status;
    infoFormValue.avatarList = avatar
      ? [{ id: avatar, name: avatar, url: avatar, status: "finished" }]
      : [];
  };

  return {
    currentPage,
    managerListData,
    loading,
    queryFormValue,
    isManagerStatusModifying,
    infoFormRef,
    infoFormValue,
    infoFormRules,
    addOrEditText,
    infoFormDrawerRef,
    isEdit,
    roleOptions,
    isSubmitting,
    queryManagerList,
    resetQuery,
    onPagination,
    modifyManagerStatus,
    addManager,
    modifyManager,
    setInfoFormValue,
    removeManager,
  };
};
