import {
  addAccessApi,
  getAccessListApi,
  modifyAccessApi,
  removeAccessApi,
} from "@/api/accessApi";
import type {
  AccessInfo,
  AddAccessApiReq,
  ModifyAccessApiReq,
} from "@/types/apiTypes/accessApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import { renderButtonItems } from "@/utils/hRender";
import { ICON_MAP } from "@/utils/iconMap";
import { showToast, useDialog } from "@/utils/popup";
import { isNumber } from "lodash";
import {
  NFlex,
  NIcon,
  NTag,
  type CascaderOption,
  type FormInst,
} from "naive-ui";
import type { TreeOptions } from "naive-ui/es/tree/src/interface";
import { computed, h, reactive, ref, type VNode } from "vue";
import { useRequest } from "vue-hooks-plus";

type BtnClickFn = (
  item: AccessInfo,
  mode: "modify" | "remove",
  event?: MouseEvent,
) => Promise<void>;

const getAccessListAsync = async () => {
  const { data } = await getAccessListApi();

  return { list: data?.list ?? [], rules: data?.rules ?? [] };
};

const renderPrefix = (item: AccessInfo) => {
  const { menu, icon } = item;
  const isMenu = Boolean(menu);

  const tagType = isMenu ? "primary" : "info";
  const text = isMenu ? "菜单" : "权限";

  const tagNode = h(NTag, { type: tagType }, { default: () => text });
  const vnodes: VNode[] = [tagNode];

  if (isMenu) {
    const iconNode = h(NIcon, { component: ICON_MAP[icon], size: 20 });
    vnodes.push(iconNode);
  }

  return h(NFlex, { align: "center" }, { default: () => vnodes });
};

const renderSuffix = (item: AccessInfo, onBtnClick: BtnClickFn) => {
  const buttonItems: ButtonItem<AccessInfo>[] = [
    {
      btnText: "修改",
      type: "warning",
      size: "small",
      onClick: (item) => onBtnClick(item, "modify"),
    },
    {
      btnText: "删除",
      type: "error",
      size: "small",
      onClick: (item) => onBtnClick(item, "remove"),
    },
  ];

  return renderButtonItems(buttonItems, item);
};

const mapToTreeData = (
  onBtnClick: BtnClickFn,
  accessList?: AccessInfo[],
  isNeedSuffix?: boolean,
): TreeOptions | undefined => {
  return accessList?.map((item) => {
    const { id, name, child } = item;
    const children = child?.length
      ? mapToTreeData(onBtnClick, child, isNeedSuffix)
      : undefined;
    const suffix = isNeedSuffix
      ? () => renderSuffix(item, onBtnClick)
      : undefined;

    return {
      key: id,
      label: name,
      prefix: () => renderPrefix(item),
      suffix,
      children,
    };
  });
};

const mapToCascaderOptions = (
  rules?: AccessInfo[],
): CascaderOption[] | undefined => {
  return rules?.map((item) => {
    const { id, name, child } = item;
    const children = child?.length ? mapToCascaderOptions(child) : undefined;

    return { label: name, value: id, children };
  });
};

const getDefaultExpandedKeys = (accessList?: AccessInfo[]): number[] => {
  return accessList?.map((item) => item.id) ?? [];
};

const addAccessApiAsync = async (req: AddAccessApiReq) => {
  const { data } = await addAccessApi(req);
  return isNumber(data?.id);
};

const modifyAccessAsync = async (req: ModifyAccessApiReq) => {
  const { data } = await modifyAccessApi(req);
  return data;
};

const removeAccessAsync = async (id?: number) => {
  const { data } = await removeAccessApi(id);
  return data;
};

export const useAccessManager = () => {
  const isEdit = ref(false);
  const accessFormDrawerRef = ref<FormDrawerRef>();
  const accessFormRef = ref<FormInst>();
  const accessFormValue = reactive<ModifyAccessApiReq>({ menu: 1 });
  const accessFormRules = {
    name: {
      required: true,
      trigger: ["blur", "input"],
      message: "名称不能为空!",
    },
  };

  const prefixText = computed(() => (isEdit.value ? "编辑" : "新增"));
  const isMenu = computed(() => Boolean(accessFormValue.menu));

  const {
    runAsync: getAccessList,
    data: accessListData,
    loading,
  } = useRequest(getAccessListAsync, { manual: true });

  const { runAsync: submitAccessValue, loading: isSubmitting } = useRequest(
    async (submitValue: ModifyAccessApiReq) => {
      if (isEdit.value) {
        return await modifyAccessAsync(submitValue);
      }

      return await addAccessApiAsync(submitValue);
    },
    { manual: true },
  );

  const { runAsync: removeAccess } = useRequest(removeAccessAsync, {
    manual: true,
  });

  const setFormValue = (item: ModifyAccessApiReq) => {
    const {
      id,
      rule_id,
      name,
      menu,
      condition,
      frontpath,
      method,
      order,
      icon,
    } = item;

    accessFormValue.id = id;
    accessFormValue.rule_id = rule_id;
    accessFormValue.name = name;
    accessFormValue.menu = menu;
    accessFormValue.condition = condition;
    accessFormValue.frontpath = frontpath;
    accessFormValue.method = method;
    accessFormValue.order = order;
    accessFormValue.icon = icon;
  };

  const resetFormValue = () => {
    setFormValue({
      id: undefined,
      rule_id: undefined,
      name: undefined,
      condition: undefined,
      frontpath: undefined,
      order: undefined,
      method: undefined,
      icon: undefined,
      menu: 1,
    });
  };

  const onEdit = (item: AccessInfo) => {
    isEdit.value = true;
    setFormValue(item);
    accessFormDrawerRef.value?.onOpen();
  };

  const onRemove = (item: AccessInfo) => {
    const onOk = async () => {
      const isSuccess = await removeAccess(item.id);
      if (isSuccess) {
        showToast("success", "删除成功");
        getAccessList();
      }
    };

    useDialog({
      type: "warning",
      title: "请确认",
      content: "确定要删除吗?",
      onOk,
    });
  };

  const onBtnClick: BtnClickFn = async (item, mode) => {
    if (mode === "modify") {
      onEdit(item);
      return;
    }

    onRemove(item);
  };

  const treeData = computed(
    () => (isNeedSuffix?: boolean) =>
      mapToTreeData(onBtnClick, accessListData.value?.list, isNeedSuffix),
  );
  const defaultExpandedKeys = computed(() =>
    getDefaultExpandedKeys(accessListData.value?.list),
  );
  const cascaderOptions = computed(() =>
    mapToCascaderOptions(accessListData.value?.rules),
  );

  return {
    getAccessList,
    onBtnClick,
    submitAccessValue,
    resetFormValue,
    isSubmitting,
    accessFormRef,
    accessFormDrawerRef,
    treeData,
    defaultExpandedKeys,
    loading,
    accessFormValue,
    isEdit,
    isMenu,
    prefixText,
    cascaderOptions,
    accessFormRules,
  };
};
