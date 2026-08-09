<script lang="ts" setup>
import type { SubmitFormRef } from "@/types/compRef/submitFormRef";
import type {
  FormComp,
  FormConfigColumn,
} from "@/types/submitFormConfigColumn";
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NInputGroupLabel,
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
import {
  defineComponent,
  h,
  reactive,
  ref,
  type Component,
  type VNode,
} from "vue";

interface OptionItem {
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

const renderOptionGroup = (
  FatherComp: Component,
  childComp: Component,
  compProps?: Record<string, unknown>,
) => {
  const options = compProps?.options as OptionItem[];

  const children = options?.map(({ label, value }) => {
    return h(childComp, { label, value }, { default: () => label });
  });
  return h(FatherComp, null, { default: () => children });
};

const FORM_COMP_MAP: Record<
  FormComp,
  ((compProps?: Record<string, unknown>) => VNode) | undefined
> = {
  input: (compProps) => h(NInput, compProps),
  select: (compProps) => h(NSelect, compProps),
  inputNumber: (compProps) => h(NInputNumber, compProps),
  switch: (compProps) => h(NSwitch, compProps),
  tree: (compProps) => h(NTree, compProps),
  avatarUpload: renderAvatarUpload,
  radioGroup: (compProps) => renderOptionGroup(NRadioGroup, NRadio, compProps),
  checkboxGroup: (compProps) =>
    renderOptionGroup(NCheckboxGroup, NCheckbox, compProps),
  inputNumGroup: undefined, // 已在template里实现
};

const formRef = ref<FormInst>();

const {
  formConfigs,
  formModel,
  formRules,
  inline = false,
  labelPlacement = "left",
  labelWidth = "auto",
  disabled,
} = defineProps<SubmitFormProps>();
const innerformModel = reactive(formModel);

const FormItemInner = defineComponent(
  (props) => {
    const { comp, compProps } = props;
    const resultComp = FORM_COMP_MAP[comp as FormComp]?.(compProps);

    return () => resultComp;
  },
  { props: ["comp", "compProps"] },
);

const onSubmit: SubmitFormRef["onSubmit"] = (callback) => {
  formRef.value?.validate((err) => {
    if (err) {
      console.error(err);
    }

    callback?.();
  });
};

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
      <div class="w-full">
        <n-input-group v-if="item.comp === 'inputNumGroup'">
          <FormItemInner
            comp="inputNumber"
            :compProps="item.compProps"
            v-model:value="innerformModel[item.column]"
          />
          <n-input-group-label>{{ item.suffixLabel }}</n-input-group-label>
        </n-input-group>
        <FormItemInner
          v-else
          :comp="item.comp"
          :compProps="item.compProps"
          v-model:value="innerformModel[item.column]"
        />
        <div
          class="text-[0.625rem] mt-1 text-gray-500"
          v-if="Boolean(item.tips)"
        >
          {{ item.tips }}
        </div>
      </div>
    </n-form-item>
    <slot></slot>
  </n-form>
</template>
