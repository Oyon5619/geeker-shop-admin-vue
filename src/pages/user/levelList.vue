<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import DynamicFormDrawer from "@/components/dynamicFormDrawer.vue";
import FullPage from "@/components/fullPage.vue";
import { PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import { useLevelListManager } from "@/hooks/useLevelListManager";
import type { UserLevelInfo } from "@/types/apiTypes/userLevelApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { renderButtonItems, renderStatus } from "@/utils/hRender";
import { showToast, useDialog } from "@/utils/popup";
import type { DataTableColumns } from "naive-ui/es/data-table";
import { onMounted, ref } from "vue";

const formDrawerRef = ref<FormDrawerRef>();

const {
  currentPage,
  userLevelListData,
  isEdit,
  loading,
  drawerTitle,
  isSubmitting,
  userLevelFormModel,
  submitSuccessTips,
  onPagination,
  removeUserLevel,
  resetFormValues,
  submitUserLevelInfo,
  setFormValues,
} = useLevelListManager();

const onRefresh = () => {
  onPagination();
  formDrawerRef.value?.onClose();
};

const onOpenAddDrawer = () => {
  isEdit.value = false;
  formDrawerRef.value?.onOpen();
};

const onCancel = () => {
  resetFormValues();
};

const onModifyUserLevel = (item: UserLevelInfo) => {
  isEdit.value = true;
  setFormValues(item);
  formDrawerRef.value?.onOpen();
};

const onRemoveUserLevel = (item: UserLevelInfo) => {
  const onOk = async () => {
    const isSuccess = await removeUserLevel(item.id);
    if (isSuccess) {
      showToast("success", "删除会员等级成功");
      onRefresh();
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该会员等级吗?",
    onOk,
  });
};

const onConfirm = async () => {
  const isSuccess = await submitUserLevelInfo();
  if (!isSuccess) {
    return;
  }

  showToast("success", submitSuccessTips.value);
  onRefresh();
};

const actionButtons: ButtonItem<UserLevelInfo>[] = [
  {
    type: "info",
    btnText: "编辑",
    size: "small",
    onClick: onModifyUserLevel,
  },
  {
    type: "error",
    btnText: "删除",
    size: "small",
    onClick: onRemoveUserLevel,
  },
];

const DATA_COLUMNS: DataTableColumns<UserLevelInfo> = [
  { key: "name", title: "会员等级" },
  { key: "discount", title: "折扣率" },
  { key: "level", title: "等级序号" },
  {
    key: "status",
    title: "状态",
    render: ({ status }) => renderStatus(status),
  },
  {
    key: "actions",
    title: "操作",
    fixed: "right",
    width: 160,
    render: (row) => renderButtonItems(actionButtons, row),
  },
];

const FORM_RULES = {
  name: {
    required: true,
    message: "等级名称不能为空!",
    trigger: ["blur", "input"],
  },
};

const FORM_CONFIGS: FormConfigColumn[] = [
  { column: "name", label: "等级名称", comp: "input" },
  { column: "level", label: "等级权重", comp: "inputNumber" },
  {
    column: "discount",
    label: "折扣率(%)",
    comp: "inputNumGroup",
    suffixLabel: "%",
    tips: "折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买",
    compProps: { min: 1, max: 99 },
  },
  {
    column: "max_price",
    label: "升级条件1",
    comp: "inputNumGroup",
    prefixLabel: "累积消费满",
    suffixLabel: "元",
    tips: "设置会员等级所需要的累计消费必须大于等于0,单位：元",
    compProps: { min: 0 },
  },
  {
    column: "max_times",
    label: "升级条件2",
    comp: "inputNumGroup",
    prefixLabel: "累积消费满",
    suffixLabel: "笔",
    tips: "设置会员等级所需要的购买量必须大于等于0,单位：笔",
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

onMounted(() => {
  onRefresh();
});
</script>

<template>
  <FullPage>
    <n-space vertical>
      <CommonActions
        refreshText="刷新本页数据"
        @add="onOpenAddDrawer"
        @refresh="() => onPagination(currentPage)"
      />
      <n-data-table
        :columns="DATA_COLUMNS"
        :data="userLevelListData?.userLevelList"
        :loading="loading"
      />
      <SimplePagination
        v-model:page="currentPage"
        :count="userLevelListData?.pageCount"
        :perSize="PAGE_SIZE_10"
        :total="userLevelListData?.total"
        @pagination="onPagination"
      />
    </n-space>
    <DynamicFormDrawer
      ref="formDrawerRef"
      width="35%"
      :title="drawerTitle"
      :formModel="userLevelFormModel"
      :formConfigs="FORM_CONFIGS"
      :formRules="FORM_RULES"
      :loading="isSubmitting"
      @cancel="onCancel"
      @submit="onConfirm"
    />
  </FullPage>
</template>
