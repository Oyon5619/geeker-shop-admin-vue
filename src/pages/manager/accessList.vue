<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import FormDrawer from "@/components/formDrawer.vue";
import { useAccessManager } from "@/hooks/useAccessManager";
import { showToast } from "@/utils/popup";
import { onMounted } from "vue";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";
import { ICON_MAP } from "@/utils/iconMap";
import { renderFlex, renderIcon } from "@/utils/hRender";

const RULE_MENU_OPTIONS = [
  { label: "菜单", value: 1 },
  { label: "规则", value: 0 },
];

const METHOD_OPTIONS = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
];

const ICON_OPTIONS = [
  { label: "menu", value: "menu" },
  { label: "user-filled", value: "user-filled" },
  { label: "notification", value: "notification" },
  { label: "data-analysis", value: "data-analysis" },
  { label: "user", value: "user" },
];

const renderLabel = ({ label = "", value = "" }: SelectBaseOption) => {
  const icon = renderIcon(ICON_MAP[value]);

  return renderFlex([icon, label as string]);
};

const {
  getAccessList,
  resetFormValue,
  submitAccessValue,
  accessFormDrawerRef,
  treeData,
  defaultExpandedKeys,
  accessFormValue,
  prefixText,
  accessFormRef,
  isEdit,
  isMenu,
  cascaderOptions,
  accessFormRules,
  isSubmitting,
  loading,
} = useAccessManager();

const onOpenAdd = () => {
  isEdit.value = false;
  accessFormDrawerRef.value?.onOpen();
};

const onRefresh = () => {
  getAccessList();
};

const onSubmit = () => {
  accessFormRef.value?.validate(async (err) => {
    if (err) {
      return;
    }

    const isSuccess = await submitAccessValue(accessFormValue);
    if (!isSuccess) {
      return;
    }

    showToast("success", `${prefixText.value}成功!`);
    getAccessList();
  });
};

const onCancel = () => {
  resetFormValue();
};

onMounted(() => {
  onRefresh();
});
</script>

<template>
  <n-spin
    class="h-full bg-white overflow-y-auto p-4"
    :show="loading"
    description="加载权限数据中..."
  >
    <n-space size="large" vertical>
      <CommonActions @add="onOpenAdd" @refresh="onRefresh" />
      <n-tree
        block-line
        :data="treeData"
        :default-expanded-keys="defaultExpandedKeys"
      />
    </n-space>
    <FormDrawer
      ref="accessFormDrawerRef"
      width="35%"
      :loading="isSubmitting"
      :title="`${prefixText}权限信息`"
      :okText="`确定${prefixText}`"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <n-form
        ref="accessFormRef"
        label-placement="left"
        label-width="auto"
        :disabled="isSubmitting"
        :model="accessFormValue"
        :rules="accessFormRules"
      >
        <n-form-item label="上级菜单" path="rule_id">
          <n-cascader
            v-model:value="accessFormValue.rule_id"
            :options="cascaderOptions"
          />
        </n-form-item>
        <n-form-item label="菜单/规则" path="menu">
          <n-radio-group v-model:value="accessFormValue.menu">
            <n-radio
              v-for="item in RULE_MENU_OPTIONS"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</n-radio
            >
          </n-radio-group>
        </n-form-item>
        <n-form-item label="名称" path="name">
          <n-input placeholder="名称" v-model:value="accessFormValue.name" />
        </n-form-item>
        <div v-show="!isMenu">
          <n-form-item label="后端规则" path="condition">
            <n-input
              placeholder="后端规则"
              v-model:value="accessFormValue.condition"
            />
          </n-form-item>
          <n-form-item label="请求方式" path="method">
            <n-select
              :options="METHOD_OPTIONS"
              v-model:value="accessFormValue.method"
            />
          </n-form-item>
        </div>
        <n-form-item v-show="isMenu" label="菜单图标" path="icon">
          <n-select
            :options="ICON_OPTIONS"
            :render-label="renderLabel"
            v-model:value="accessFormValue.icon"
            clearable
          />
        </n-form-item>
        <n-form-item label="排序" path="order">
          <n-input-number
            v-model:value="accessFormValue.order"
            :min="0"
            clearable
          />
        </n-form-item>
      </n-form>
    </FormDrawer>
  </n-spin>
</template>

<style scoped></style>
