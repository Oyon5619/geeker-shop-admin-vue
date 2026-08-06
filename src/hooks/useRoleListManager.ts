import {
  addRoleApi,
  getRoleListApi,
  modifyRoleApi,
  removeRoleApi,
  setRoleRulesApi,
} from "@/api/roleApi";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import type {
  AddRoleApiReq,
  ModifyRoleApiReq,
  SetRoleRulesApiReq,
} from "@/types/apiTypes/roleApiTypes";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

const getRoleListAsync = async (page: number = DEFAULT_PAGE) => {
  const limit = PAGE_SIZE_10;

  try {
    const { data } = await getRoleListApi(page);

    const total = data?.totalCount ?? 0;
    const pageCount = Math.ceil(total / limit);

    return { roleList: data?.list ?? [], page, limit, total, pageCount };
  } catch (err) {
    console.error(err);
    return { roleList: [], page, limit, total: 0, pageCount: 0 };
  }
};

const addRoleAsync = async (req: AddRoleApiReq) => {
  const { data } = await addRoleApi(req);
  return Boolean(data?.id);
};

const modifyRoleAsync = async (req: ModifyRoleApiReq) => {
  const { data } = await modifyRoleApi(req);
  return data;
};

const removeRoleAsync = async (id: number) => {
  const { data } = await removeRoleApi(id);
  return data;
};

const updateRoleRulesAsync = async (req: SetRoleRulesApiReq) => {
  const { data } = await setRoleRulesApi(req);
  return data;
};

export const useRoleListManager = () => {
  const currentPage = ref(DEFAULT_PAGE);
  const isEdit = ref(false);
  const roleFormModel = reactive<ModifyRoleApiReq>({
    status: COMMON_STATUS.VALID,
  });
  const roleFormRules = {
    name: {
      required: true,
      message: "请输入角色名称!",
      trigger: ["blur", "input"],
    },
  };

  const pivotFormModel = reactive<SetRoleRulesApiReq>({});

  const drawerTitle = computed(() => (isEdit.value ? "编辑角色" : "新增角色"));
  const submitSuccessTips = computed(() =>
    isEdit.value ? "编辑角色成功!" : "新增角色成功!",
  );

  const {
    run: getRoleList,
    data: roleListData,
    loading,
  } = useRequest(getRoleListAsync, { manual: true });

  const { runAsync: submitRoleValue, loading: isSubmitting } = useRequest(
    async (submitValue: ModifyRoleApiReq) => {
      if (isEdit.value) {
        return await modifyRoleAsync(submitValue);
      }

      return await addRoleAsync(submitValue);
    },
    { manual: true },
  );

  const { runAsync: removeRole } = useRequest(removeRoleAsync, {
    manual: true,
  });

  const { runAsync: updateRoleRules, loading: isRoleRulesUpdating } =
    useRequest(updateRoleRulesAsync, { manual: true });

  const setFormValues = (roleInfo: ModifyRoleApiReq) => {
    const { id, name, desc, status } = roleInfo;

    roleFormModel.id = id;
    roleFormModel.name = name;
    roleFormModel.desc = desc;
    roleFormModel.status = status;
  };

  const resetFormValues = () => {
    setFormValues({
      id: undefined,
      name: undefined,
      desc: undefined,
      status: COMMON_STATUS.VALID,
    });
  };

  const setPivotFormValues = (roleInfo: SetRoleRulesApiReq) => {
    const { id, rule_ids } = roleInfo;

    pivotFormModel.id = id;
    pivotFormModel.rule_ids = rule_ids;
  };

  const resetPivotFormValues = () => {
    setPivotFormValues({ id: undefined, rule_ids: undefined });
  };

  const onPagination = (page: number) => {
    currentPage.value = page;
    getRoleList(page);
  };

  return {
    getRoleList,
    onPagination,
    resetFormValues,
    setFormValues,
    submitRoleValue,
    removeRole,
    setPivotFormValues,
    resetPivotFormValues,
    updateRoleRules,
    roleFormModel,
    currentPage,
    roleListData,
    loading,
    isEdit,
    drawerTitle,
    roleFormRules,
    isSubmitting,
    submitSuccessTips,
    pivotFormModel,
    isRoleRulesUpdating,
  };
};
