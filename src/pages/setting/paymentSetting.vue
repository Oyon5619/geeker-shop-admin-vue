<script lang="ts" setup>
import DynamicFormDrawer from "@/components/dynamicFormDrawer.vue";
import FullPage from "@/components/fullPage.vue";
import SubmitForm from "@/components/submitForm.vue";
import { PaymentEnum } from "@/constants/paymentEnum";
import { useBaseSettingManager } from "@/hooks/useBaseSettingManager";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { showToast } from "@/utils/popup";
import { LogoAlipay, LogoWechat } from "@vicons/ionicons5";
import { onMounted, ref } from "vue";

const paymentDrawerRef = ref<FormDrawerRef>();

const {
  paymentKey,
  paymentFormModel,
  shoppingSettingFormModel,
  isSavingShoppingSetting,
  paymentFormConfigs,
  saveShoppingSettingData,
  initShoppingSettingInfo,
  initPaymentSettingInfo,
} = useBaseSettingManager();

const SHOPPING_SETTING_FORM_CONFIGS: FormConfigColumn[] = [
  {
    column: "close_order_minute",
    label: "未支付订单",
    comp: "inputNumGroup",
    compProps: { style: "width: 215px;" },
    // tip: "订单下单未付款，n分钟后自动关闭，设置0不自动关闭",
    suffixLabel: "分钟后自动关闭",
  },
  {
    column: "auto_received_day",
    label: "已发货订单",
    comp: "inputNumGroup",
    compProps: { style: "width: 215px;" },
    suffixLabel: "天后自动确认收货",
  },
  {
    column: "after_sale_day",
    label: "已完成订单",
    comp: "inputNumGroup",
    compProps: { style: "width: 215px;" },
    suffixLabel: "天内允许申请售后",
  },
];

const PAYMENT_INFO_LIST = [
  {
    key: PaymentEnum.ALIPAY,
    iconComp: LogoAlipay,
    iconClass: "text-blue-500",
    title: "支付宝支付",
    desc: "该系统支持即时到账接口",
  },
  {
    key: PaymentEnum.WXPAY,
    iconComp: LogoWechat,
    iconClass: "text-green-500",
    title: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
  },
];

const onShoppingSettingSave = async () => {
  const isSuccess = await saveShoppingSettingData();
  if (!isSuccess) {
    return;
  }

  showToast("success", "更新购物设置成功!");
  initShoppingSettingInfo();
};

const openPaymentSettingDrawer = async (value: string) => {
  paymentKey.value = value;
  await initPaymentSettingInfo();
  paymentDrawerRef.value?.onOpen();
};

onMounted(() => {
  initShoppingSettingInfo();
});
</script>

<template>
  <FullPage>
    <n-tabs type="line" animated>
      <n-tab-pane name="paymentSetting" tab="支付设置">
        <n-table :single-line="false" bordered>
          <thead>
            <tr>
              <th>支付方式</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in PAYMENT_INFO_LIST" :key="item.key">
              <td>
                <n-flex>
                  <n-icon
                    size="45"
                    :component="item.iconComp"
                    :class="item.iconClass"
                  />
                  <n-space vertical size="small">
                    <p class="text-sm font-bold">{{ item.title }}</p>
                    <p class="text-gray-400 text-md">{{ item.desc }}</p>
                  </n-space>
                </n-flex>
              </td>
              <td class="w-25">
                <n-flex justify="center">
                  <n-button
                    type="primary"
                    size="small"
                    @click="openPaymentSettingDrawer(item.key)"
                    round
                  >
                    配置
                  </n-button>
                </n-flex>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-tab-pane>
      <n-tab-pane name="shoppingSetting" tab="购物设置">
        <n-alert title="注意事项" type="info" class="w-150 mb-4">
          <p>未支付订单：订单下单未付款，n分钟后自动关闭，设置0不自动关闭</p>
          <p>
            已发货订单：如果在期间未确认收货，系统自动完成收货，设置0不自动收货
          </p>
          <p>
            已完成订单：订单完成后
            ，用户在n天内可以发起售后申请，设置0不允许申请售后
          </p>
        </n-alert>
        <SubmitForm
          labelPlacement="left"
          labelWidth="auto"
          :formModel="shoppingSettingFormModel"
          :formConfigs="SHOPPING_SETTING_FORM_CONFIGS"
          :disabled="isSavingShoppingSetting"
          :inline="false"
        >
          <n-form-item label=" ">
            <n-button
              type="primary"
              :loading="isSavingShoppingSetting"
              @click="onShoppingSettingSave"
              >保存</n-button
            >
          </n-form-item>
        </SubmitForm>
      </n-tab-pane>
    </n-tabs>
  </FullPage>
  <DynamicFormDrawer
    ref="paymentDrawerRef"
    title="配置"
    width="40%"
    :formModel="paymentFormModel"
    :formConfigs="paymentFormConfigs"
  />
</template>
