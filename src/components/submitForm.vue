<script lang="ts" setup>
import type { SubmitFormRef } from "@/types/compRef/submitFormRef";
import type {
  FormComp,
  FormConfigColumn,
} from "@/types/submitFormConfigColumn";
import {
  NButton,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSelect,
  NSwitch,
  NTree,
  NUpload,
  type ButtonProps,
  type FormInst,
  type FormRules,
} from "naive-ui";
import { defineComponent, h, reactive, ref, type VNode } from "vue";

interface RadioItem {
  label: string;
  value: string | number;
}

export interface SubmitFormProps {
  formModel: Record<string, unknown>;
  formConfigs?: FormConfigColumn[];
  formRules?: FormRules;
  inline?: boolean;
  labelPlacement?: "top" | "left" | undefined;
  labelWidth?: string | number;
  disabled?: boolean;
}

const renderAvatarUpload = (compProps?: Record<string, unknown>) => {
  const { onClick: onClickFn, ...restProps } = compProps ?? {};
  const children = [
    h(
      NButton,
      { onClick: onClickFn as ButtonProps["onClick"] },
      { default: () => "点击选择" },
    ),
    h(NUpload, { ...restProps }),
  ];

  return h(NFlex, { vertical: true }, { default: () => children });
};
const renderRadioGroup = (compProps?: Record<string, unknown>) => {
  const radioOptions = compProps?.options as RadioItem[];

  const children = radioOptions?.map(({ label, value }) => {
    return h(NRadio, { label, value }, { default: () => label });
  });
  return h(NRadioGroup, null, { default: () => children });
};

const FORM_COMP_MAP: Record<
  FormComp,
  (compProps?: Record<string, unknown>) => VNode
> = {
  input: (compProps) => h(NInput, compProps),
  select: (compProps) => h(NSelect, compProps),
  inputNumber: (compProps) => h(NInputNumber, compProps),
  switch: (compProps) => h(NSwitch, compProps),
  tree: (compProps) => h(NTree, compProps),
  avatarUpload: renderAvatarUpload,
  radioGroup: renderRadioGroup,
};

const formRef = ref<FormInst>();

const {
  formConfigs,
  formModel,
  formRules,
  inline = true,
  labelPlacement,
  labelWidth,
  disabled,
} = defineProps<SubmitFormProps>();
const innerformModel = reactive(formModel);

const onSubmit: SubmitFormRef["onSubmit"] = (callback) => {
  formRef.value?.validate((err) => {
    if (err) {
      console.error(err);
    }

    callback?.();
  });
};

const FormItemInner = defineComponent(
  (props) => {
    const { comp, compProps } = props;
    const renderComp = FORM_COMP_MAP[comp as FormComp]?.(compProps);

    return () => renderComp;
  },
  {
    props: ["comp", "compProps"],
  },
);

defineExpose<SubmitFormRef>({ onSubmit });
</script>

<template>
  <n-form
    ref="formRef"
    :model="formModel"
    :rules="formRules"
    :inline="inline"
    :labelPlacement="labelPlacement"
    :labelWidth="labelWidth"
    :disabled="disabled"
  >
    <n-form-item
      v-for="item in formConfigs"
      :key="item.column"
      :label="item.label"
      :path="item.column"
    >
      <FormItemInner
        :comp="item.comp"
        :compProps="item.compProps"
        v-model:value="innerformModel[item.column]"
      />
    </n-form-item>
  </n-form>
</template>
