import { modifyAdminPwdApi } from "@/api/adminApi";
import store from "@/store";
import type { ModifyAdminPwdReq } from "@/types/apiTypes";
import { showToast } from "@/utils/popup";
import type { FormInst, FormRules } from "naive-ui";
import { reactive, ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import { useRouter } from "vue-router";

export const useModifyAdminPwd = () => {
  const router = useRouter();

  const formRef = ref<FormInst>();
  const formValues = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const formRules: FormRules = {
    oldpassword: {
      required: true,
      message: "旧密码不能为空!",
      trigger: ["blur", "input"],
    },
    password: {
      required: true,
      message: "新密码不能为空!",
      trigger: ["blur", "input"],
    },
    repassword: [
      {
        required: true,
        message: "请再确认密码!",
        trigger: ["blur", "input"],
      },
      {
        validator: (_, value) => {
          if (!value && formValues.password) {
            return true;
          }
          return value === formValues.password;
        },
        message: "确认密码与新密码必须保持一致!",
        trigger: ["blur", "input"],
      },
    ],
  };

  // 管理员修改密码
  const { runAsync: modifyAdminPwd, loading } = useRequest(
    async (submitData: ModifyAdminPwdReq) => {
      try {
        await modifyAdminPwdApi(submitData);
        await store.dispatch("logout");

        showToast("success", "修改密码成功, 请重新登录");
        router.push({ path: "/login" });
      } catch (err) {
        console.error(err);
      }
    },
    { manual: true },
  );

  return {
    formRef,
    formRules,
    formValues,
    loading,
    modifyAdminPwd,
  };
};
