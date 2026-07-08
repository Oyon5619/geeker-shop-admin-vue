import { modifyAdminPwdApi } from "@/api/adminApi";
import store from "@/store";
import type { ModifyAdminPwdReq } from "@/types/apiTypes";
import { showToast } from "@/utils/popup";
import { useRequest } from "vue-hooks-plus";
import { useRouter } from "vue-router";

export const useModifyAdminPwd = () => {
  const { push: routerPush } = useRouter();

  const { runAsync: modifyAdminPwd, loading } = useRequest(
    async (submitData: ModifyAdminPwdReq) => {
      try {
        await modifyAdminPwdApi(submitData);
        await store.dispatch("logout");

        showToast("success", "修改密码成功, 请重新登录");
        routerPush({ path: "/login" });
      } catch (err) {
        console.error(err);
      }
    },
    { manual: true },
  );

  return { modifyAdminPwd, loading };
};
