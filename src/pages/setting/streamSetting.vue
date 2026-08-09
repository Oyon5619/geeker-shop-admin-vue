<script lang="ts" setup>
import FullPage from "@/components/fullPage.vue";
import SubmitForm from "@/components/submitForm.vue";
import { INPUT_COMP_PROPS } from "@/constants/common";
import { useBaseSettingManager } from "@/hooks/useBaseSettingManager";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { showToast } from "@/utils/popup";
import { onMounted } from "vue";

const {
  streamSettingFormModel,
  isSavingStreamSetting,
  initStreamSettingInfo,
  saveStreamSetting,
} = useBaseSettingManager();

const STREAM_FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "ship",
    label: "物流查询key",
    comp: "input",
    compProps: INPUT_COMP_PROPS,
    tips: "用于查询物流信息，接口申请（仅供参考）",
  },
];

const onSave = async () => {
  const isSuccess = await saveStreamSetting();
  if (!isSuccess) {
    return;
  }

  showToast("success", "更新物流设置成功!");
  initStreamSettingInfo();
};

onMounted(() => {
  initStreamSettingInfo();
});
</script>

<template>
  <FullPage>
    <SubmitForm
      :formModel="streamSettingFormModel"
      :formConfigs="STREAM_FORM_CONFIGS"
      :disabled="isSavingStreamSetting"
    >
      <n-form-item label=" ">
        <n-button
          type="primary"
          :loading="isSavingStreamSetting"
          @click="onSave"
          >保存</n-button
        >
      </n-form-item>
    </SubmitForm>
  </FullPage>
</template>
