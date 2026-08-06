<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import DynamicFormDrawer from "@/components/dynamicFormDrawer.vue";
import FullPage from "@/components/fullPage.vue";
import SimplePagination from "@/components/simplePagination.vue";
import { PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import { useAccessManager } from "@/hooks/useAccessManager";
import { useRoleListManager } from "@/hooks/useRoleListManager";
import type { RoleInfo } from "@/types/apiTypes/roleApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { renderButtonItems, renderStatus } from "@/utils/hRender";
import { showToast, useDialog } from "@/utils/popup";
import type { DataTableColumns } from "naive-ui/es/data-table";
import { computed, onMounted, ref } from "vue";

const formDrawerRef = ref<FormDrawerRef>();
const pviotDrawerRef = ref<FormDrawerRef>();

const {
  getRoleList,
  resetFormValues,
  onPagination,
  setFormValues,
  removeRole,
  submitRoleValue,
  setPivotFormValues,
  resetPivotFormValues,
  updateRoleRules,
  currentPage,
  roleFormModel,
  roleListData,
  drawerTitle,
  loading,
  isEdit,
  roleFormRules,
  isSubmitting,
  submitSuccessTips,
  pivotFormModel,
} = useRoleListManager();
const {
  treeData,
  defaultExpandedKeys,
  loading: isTreeDataLoading,
  getAccessList,
} = useAccessManager();

const onOpenAddDrawer = () => {
  isEdit.value = false;
  formDrawerRef.value?.onOpen();
};

const onOpenPviotDrawer = async ({ id, rules }: RoleInfo) => {
  setPivotFormValues({ id, rule_ids: rules.map((item) => item.id) });
  await getAccessList();
  pviotDrawerRef.value?.onOpen();
};

const onClosePivotDrawer = () => {
  resetPivotFormValues();
};

const onRefresh = () => {
  formDrawerRef.value?.onClose();
  pviotDrawerRef.value?.onClose();

  getRoleList(currentPage.value);
};

const onConfirm = async () => {
  const isSuccess = await submitRoleValue(roleFormModel);
  if (!isSuccess) {
    return;
  }

  showToast("success", submitSuccessTips.value);
  onRefresh();
};

const onCancel = () => {
  resetFormValues();
};

const onModifyRole = (item: RoleInfo) => {
  isEdit.value = true;
  setFormValues(item);
  formDrawerRef.value?.onOpen();
};

const onRemoveRole = (item: RoleInfo) => {
  const onOk = async () => {
    const isSuccess = await removeRole(item.id);
    if (isSuccess) {
      showToast("success", "删除角色成功");
      getRoleList();
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该角色吗?",
    onOk,
  });
};

const onConfirmUpdateRoleRules = async () => {
  const isSuccess = await updateRoleRules(pivotFormModel);
  if (isSuccess) {
    showToast("success", "角色权限配置成功!");
    onRefresh();
  }
};

const actionButtons: ButtonItem<RoleInfo>[] = [
  {
    type: "warning",
    btnText: "配置权限",
    size: "small",
    onClick: onOpenPviotDrawer,
  },
  {
    type: "info",
    btnText: "修改",
    size: "small",
    onClick: onModifyRole,
  },
  {
    type: "error",
    btnText: "删除",
    size: "small",
    onClick: onRemoveRole,
  },
];

const DATA_COLUMNS: DataTableColumns<RoleInfo> = [
  { key: "name", title: "角色名称", width: 180, ellipsis: true },
  { key: "desc", title: "角色描述", width: 600, ellipsis: true },
  { key: "update_time", title: "更新时间", width: 200 },
  { key: "create_time", title: "创建时间", width: 200 },
  {
    key: "status",
    title: "状态",
    render: ({ status }) => renderStatus(status),
  },
  {
    key: "actions",
    title: "操作",
    fixed: "right",
    width: 240,
    render: (row) => renderButtonItems(actionButtons, row),
  },
];

const FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "name",
    label: "角色名称",
    comp: "input",
    compProps: { placeholder: "角色名称" },
  },
  {
    column: "desc",
    label: "角色描述",
    comp: "input",
    compProps: { placeholder: "角色描述", type: "textarea" },
  },
  {
    column: "status",
    label: "状态",
    comp: "switch",
    compProps: {
      checkedValue: COMMON_STATUS.VALID,
      uncheckedValue: COMMON_STATUS.INVALID,
    },
  },
];

const PVIOT_FORM_CONFIGS = computed<FormConfigColumn[]>(() => [
  {
    column: "id",
    label: "角色ID",
    comp: "input",
    compProps: { disabled: true },
  },
  {
    column: "rule_ids",
    label: "权限配置",
    comp: "tree",
    compProps: {
      data: treeData.value(),
      defaultExpandedKeys: defaultExpandedKeys.value,
      defaultCheckedKeys: pivotFormModel.rule_ids,
      defaultExpandAll: true,
      checkable: true,
      cascade: true,
      "on-update:checked-keys": (newKeys: number[]) => {
        pivotFormModel.rule_ids = newKeys;
      },
    },
  },
]);

onMounted(() => {
  getRoleList();
});
</script>

<template>
  <FullPage>
    <n-space vertical>
      <CommonActions @add="onOpenAddDrawer" @refresh="onRefresh" />
      <n-data-table
        :columns="DATA_COLUMNS"
        :data="roleListData?.roleList"
        :loading="loading"
      />
      <SimplePagination
        v-model:page="currentPage"
        :count="roleListData?.pageCount"
        :perSize="PAGE_SIZE_10"
        :total="roleListData?.total"
        @pagination="onPagination"
      />
    </n-space>
  </FullPage>
  <DynamicFormDrawer
    ref="formDrawerRef"
    width="35%"
    :title="drawerTitle"
    :formModel="roleFormModel"
    :formConfigs="FORM_CONFIGS"
    :formRules="roleFormRules"
    :loading="isSubmitting"
    @submit="onConfirm"
    @cancel="onCancel"
  />
  <DynamicFormDrawer
    ref="pviotDrawerRef"
    width="40%"
    title="角色权限配置"
    :formModel="pivotFormModel"
    :formConfigs="PVIOT_FORM_CONFIGS"
    :loading="isTreeDataLoading"
    @submit="onConfirmUpdateRoleRules"
    @cancel="onClosePivotDrawer"
  />
</template>
