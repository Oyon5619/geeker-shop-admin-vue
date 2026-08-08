import {
  getSysBaseSettingsApi,
  modifySysBaseSettingsApi,
  type GetSysBaseSettingsApiResp,
  type ModifySysBaseSettingsApiReq,
  type SysAlipaySettingInfo,
  type SysWxpaySettingInfo,
} from "@/api/sysconfigApi";
import { COMMA } from "@/constants/common";
import { PaymentEnum } from "@/constants/paymentEnum";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import { compact } from "lodash";
import { computed, reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";

interface RegAndAccessInfo extends Pick<
  ModifySysBaseSettingsApiReq,
  "open_reg" | "reg_method" | "password_min"
> {
  pwdComplexity?: string[];
}

type UploadSettingInfo = Pick<ModifySysBaseSettingsApiReq, "upload_method"> &
  ModifySysBaseSettingsApiReq["upload_config"];

type ApiSafeInfo = Pick<ModifySysBaseSettingsApiReq, "api_safe" | "api_secret">;

type PaymentSettingInfo = Pick<ModifySysBaseSettingsApiReq, "alipay" | "wxpay">;

type ShoppingSettingInfo = Pick<
  ModifySysBaseSettingsApiReq,
  "close_order_minute" | "auto_received_day" | "after_sale_day"
>;

const SYS_SETTING_MODIFY_SUVVESS_CODE = 0;

const getSysBaseSettingsAsync = async () => {
  const { data } = await getSysBaseSettingsApi();
  return data;
};

const modifyBaseSettingsAsync = async (req: ModifySysBaseSettingsApiReq) => {
  const { data } = await modifySysBaseSettingsApi(req);
  return data === SYS_SETTING_MODIFY_SUVVESS_CODE;
};

export const useBaseSettingManager = () => {
  const paymentKey = ref<string>(PaymentEnum.ALIPAY);
  const regAndAccessFormModel = reactive<RegAndAccessInfo>({});
  const uploadSettingFormModel = reactive<UploadSettingInfo>({});
  const apiSafeFormModel = reactive<ApiSafeInfo>({});
  const paymentSettingFormModel = reactive<PaymentSettingInfo>({});
  const shoppingSettingFormModel = reactive<ShoppingSettingInfo>({});
  const alipaySettingFormModel = reactive<Partial<SysAlipaySettingInfo>>({});
  const wxpaySettingFormModel = reactive<Partial<SysWxpaySettingInfo>>({});

  const paymentFormModel = computed(() =>
    paymentKey.value === PaymentEnum.ALIPAY
      ? alipaySettingFormModel
      : wxpaySettingFormModel,
  );

  const paymentFormConfigs = computed<FormConfigColumn[]>(() => {
    if (paymentKey.value === PaymentEnum.ALIPAY) {
      return [
        { column: "app_id", label: "app_id", comp: "input" },
        {
          column: "ali_public_key",
          label: "ali_public_key",
          comp: "input",
          compProps: { type: "textarea" },
        },
        {
          column: "private_key",
          label: "private_key",
          comp: "input",
          compProps: { type: "textarea" },
        },
      ];
    }

    return [
      { column: "app_id", label: "公众号 APP ID", comp: "input" },
      { column: "miniapp_id", label: "小程序 APP ID", comp: "input" },
      { column: "secret", label: "小程序 secret", comp: "input" },
      { column: "appid", label: "appid", comp: "input" },
      { column: "mch_id", label: "商户号", comp: "input" },
      { column: "key", label: "API密钥", comp: "input" },
    ];
  });

  const {
    runAsync: getSysBaseSettings,
    data: baseSettings,
    loading,
  } = useRequest(getSysBaseSettingsAsync, { manual: true });

  const { runAsync: saveBaseSettingData } = useRequest(
    async () => {
      const { pwdComplexity, ...rest } = regAndAccessFormModel;
      const { upload_method, ...upload_config } = uploadSettingFormModel;
      const password_encrypt = pwdComplexity?.join(COMMA);

      return await modifyBaseSettingsAsync({
        ...rest,
        password_encrypt,
        upload_method,
        upload_config,
      });
    },
    { manual: true },
  );
  const {
    runAsync: saveShoppingSettingData,
    loading: isSavingShoppingSetting,
  } = useRequest(
    async () => {
      return await modifyBaseSettingsAsync({ ...shoppingSettingFormModel });
    },
    { manual: true },
  );
  const { runAsync: savePaymentSetting, loading: isSavingPaymentSetting } =
    useRequest(
      async () => {
        if (paymentKey.value === "alipay") {
          return await modifyBaseSettingsAsync({
            alipay: alipaySettingFormModel,
          });
        }

        return await modifyBaseSettingsAsync({ wxpay: wxpaySettingFormModel });
      },
      { manual: true },
    );

  const initRegAndAccessInfo = (data?: GetSysBaseSettingsApiResp) => {
    const { open_reg, reg_method, password_min, password_encrypt } = data ?? {};

    regAndAccessFormModel.open_reg = open_reg;
    regAndAccessFormModel.reg_method = reg_method;
    regAndAccessFormModel.password_min = password_min;
    regAndAccessFormModel.pwdComplexity = compact(
      password_encrypt?.split(COMMA),
    );
  };

  const initUploadSettingInfo = (data?: GetSysBaseSettingsApiResp) => {
    const { upload_method, upload_config } = data ?? {};
    const { Bucket, ACCESS_KEY, SECRET_KEY, http } = upload_config ?? {};

    uploadSettingFormModel.upload_method = upload_method;
    uploadSettingFormModel.Bucket = Bucket;
    uploadSettingFormModel.ACCESS_KEY = ACCESS_KEY;
    uploadSettingFormModel.SECRET_KEY = SECRET_KEY;
    uploadSettingFormModel.http = http;
  };

  const initApiSafeInfo = (data?: GetSysBaseSettingsApiResp) => {
    const { api_safe, api_secret } = data ?? {};

    apiSafeFormModel.api_safe = api_safe;
    apiSafeFormModel.api_secret = api_secret;
  };

  const initBaseSettingInfo = async () => {
    const data = await getSysBaseSettings();

    initRegAndAccessInfo(data);
    initUploadSettingInfo(data);
    initApiSafeInfo(data);
  };

  const initShoppingSettingInfo = async () => {
    const data = await getSysBaseSettings();
    const { auto_received_day, close_order_minute, after_sale_day } =
      data ?? {};

    shoppingSettingFormModel.auto_received_day = auto_received_day;
    shoppingSettingFormModel.close_order_minute = close_order_minute;
    shoppingSettingFormModel.after_sale_day = after_sale_day;
  };

  const initPaymentSettingInfo = async () => {
    const data = await getSysBaseSettings();
    const { alipay, wxpay } = data ?? {};

    if (paymentKey.value === PaymentEnum.ALIPAY) {
      const { app_id, ali_public_key, private_key } = alipay ?? {};

      alipaySettingFormModel.app_id = app_id;
      alipaySettingFormModel.ali_public_key = ali_public_key;
      alipaySettingFormModel.private_key = private_key;
      return;
    }

    // paymentKey.value === PaymentEnum.WXPAY
    const {
      app_id,
      miniapp_id,
      secret,
      appid,
      mch_id,
      key,
      cert_client,
      cert_key,
    } = wxpay ?? {};

    wxpaySettingFormModel.app_id = app_id;
    wxpaySettingFormModel.appid = appid;
    wxpaySettingFormModel.miniapp_id = miniapp_id;
    wxpaySettingFormModel.secret = secret;
    wxpaySettingFormModel.mch_id = mch_id;
    wxpaySettingFormModel.key = key;
    wxpaySettingFormModel.cert_client = cert_client;
    wxpaySettingFormModel.cert_key = cert_key;
  };

  return {
    getSysBaseSettings,
    saveBaseSettingData,
    initBaseSettingInfo,
    initShoppingSettingInfo,
    saveShoppingSettingData,
    savePaymentSetting,
    initPaymentSettingInfo,
    regAndAccessFormModel,
    uploadSettingFormModel,
    apiSafeFormModel,
    paymentSettingFormModel,
    shoppingSettingFormModel,
    baseSettings,
    loading,
    isSavingShoppingSetting,
    isSavingPaymentSetting,
    paymentKey,
    paymentFormModel,
    paymentFormConfigs,
  };
};
