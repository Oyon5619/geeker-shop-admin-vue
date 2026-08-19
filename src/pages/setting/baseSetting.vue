<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import FullPage from "@/components/fullPage.vue";
import SubmitForm from "@/components/submitForm.vue";
import { INPUT_COMP_PROPS } from "@/constants/common";
import { PwdComplexityEnum } from "@/constants/pwdComplexityEnum";
import { useBaseSettingManager } from "@/hooks/useBaseSettingManager";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { showToast } from "@/utils/popup";
import { onMounted } from "vue";

const {
  regAndAccessFormModel,
  uploadSettingFormModel,
  apiSafeFormModel,
  saveBaseSettingData,
  loading,
  initBaseSettingInfo,
} = useBaseSettingManager();

const REG_AND_ACCESS_FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "open_reg",
    label: "是否允许注册会员",
    comp: "radioGroup",
    compProps: {
      options: [
        { label: "关闭", value: 0 },
        { label: "开启", value: 1 },
      ],
    },
  },
  {
    column: "reg_method",
    label: "注册类型",
    comp: "select",
    compProps: {
      ...INPUT_COMP_PROPS,
      options: [
        { label: "普通注册", value: "username" },
        { label: "手机注册", value: "phone" },
      ],
      allowClear: true,
    },
  },
  {
    column: "password_min",
    label: "密码最小长度",
    comp: "inputNumber",
    compProps: { min: 5 },
  },
  {
    column: "pwdComplexity",
    label: "强制密码复杂度",
    comp: "checkboxGroup",
    compProps: {
      options: [
        { label: "数字", value: PwdComplexityEnum.NUM },
        { label: "小写字母", value: PwdComplexityEnum.LOWER },
        { label: "大写字母", value: PwdComplexityEnum.UPPER },
        { label: "符号", value: PwdComplexityEnum.SIGN },
      ],
    },
  },
];

const UPLOAD_SETTING_FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "upload_method",
    label: "默认上传方式",
    comp: "radioGroup",
    compProps: {
      options: [
        { label: "对象存储", value: "oss" },
        { label: "本地", value: "local" },
      ],
    },
  },
  {
    column: "Bucket",
    label: "Bucket",
    comp: "input",
    compProps: INPUT_COMP_PROPS,
  },
  {
    column: "ACCESS_KEY",
    label: "ACCESS_KEY",
    comp: "input",
    compProps: INPUT_COMP_PROPS,
  },
  {
    column: "SECRET_KEY",
    label: "SECRET_KEY",
    comp: "input",
    compProps: INPUT_COMP_PROPS,
  },
  {
    column: "http",
    label: "空间域名",
    comp: "input",
    compProps: {
      ...INPUT_COMP_PROPS,
      placeholder: "请补全 http:// 或 https://",
    },
  },
];

const API_SAFE_FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "api_safe",
    label: "是否开启API安全",
    comp: "radioGroup",
    compProps: {
      options: [
        { label: "关闭", value: 0 },
        { label: "开启", value: 1 },
      ],
    },
    tips: "api安全功能开启之后调用前端api需要传输签名串",
  },
  {
    column: "api_secret",
    label: "密钥",
    comp: "input",
    compProps: INPUT_COMP_PROPS,
    tips: "秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token",
  },
];

const TAB_FORM_PANES = [
  {
    key: "regAndAccess",
    tabName: "注册与访问",
    formConfigs: REG_AND_ACCESS_FORM_CONFIGS,
    formModel: regAndAccessFormModel,
  },
  {
    key: "uploadSetting",
    tabName: "上传设置",
    formConfigs: UPLOAD_SETTING_FORM_CONFIGS,
    formModel: uploadSettingFormModel,
  },
  {
    key: "apiSafe",
    tabName: "API安全",
    formConfigs: API_SAFE_FORM_CONFIGS,
    formModel: apiSafeFormModel,
  },
];

const onSave = async () => {
  const isSuccess = await saveBaseSettingData();
  if (!isSuccess) {
    return;
  }

  showToast("success", "更新基础设置成功!");
  initBaseSettingInfo();
};

onMounted(() => {
  initBaseSettingInfo();
});
</script>

<template>
  <FullPage>
    <CommonActions
      :showAdd="false"
      refreshText="刷新配置"
      @refresh="initBaseSettingInfo"
    />
    <n-spin :show="loading" description="刷新数据中...">
      <n-tabs type="line" animated>
        <n-tab-pane
          v-for="item in TAB_FORM_PANES"
          :key="item.key"
          :name="item.key"
          :tab="item.tabName"
        >
          <SubmitForm
            labelPlacement="left"
            labelWidth="auto"
            :formModel="item.formModel"
            :formConfigs="item.formConfigs"
            :inline="false"
          >
            <n-form-item label=" ">
              <n-button type="primary" @click="onSave">保存</n-button>
            </n-form-item>
          </SubmitForm>
        </n-tab-pane>
      </n-tabs>
    </n-spin>
  </FullPage>
</template>
