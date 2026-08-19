<script lang="ts" setup>
import { ref } from "vue";
import SubmitForm, { type SubmitFormProps } from "./submitForm.vue";
import type { SubmitFormRef } from "@/types/compRef/submitFormRef.ts";

interface DynamicFormDrawerProps extends SubmitFormProps {
  title: string;
  okText?: string;
  cancelText?: string;
  width?: string | number;
  loading?: boolean;
}

const {
  title,
  okText = "提交",
  cancelText = "取消",
  width = "25%",
  loading,
  formConfigs,
  formModel,
  formRules,
  inline,
} = defineProps<DynamicFormDrawerProps>();
const emit = defineEmits(["submit", "cancel"]);

const visible = ref(false);
const submitFormRef = ref<SubmitFormRef>();

const onOpen = () => {
  visible.value = true;
};

const onClose = () => {
  visible.value = false;
  emit("cancel");
};

const onSubmit = () => {
  submitFormRef.value?.onSubmit(() => {
    emit("submit");
  });
};

// 给父组件暴露方法
defineExpose({ onOpen, onClose });
</script>

<template>
  <n-drawer
    v-model:show="visible"
    :width="width"
    @mask-click="onClose"
    @after-leave="onClose"
  >
    <n-drawer-content :title="title" closable>
      <n-flex vertical class="h-full">
        <div class="flex-1 overflow-y-auto">
          <SubmitForm
            ref="submitFormRef"
            :formConfigs="formConfigs"
            :formModel="formModel"
            :formRules="formRules"
            :inline="inline"
            :disabled="loading"
          />
        </div>
        <n-flex align="center">
          <n-button type="primary" :loading="loading" @click="onSubmit">{{
            okText
          }}</n-button>
          <n-button @click="onClose">{{ cancelText }}</n-button>
        </n-flex>
      </n-flex>
    </n-drawer-content>
  </n-drawer>
</template>
