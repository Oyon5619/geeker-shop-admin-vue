import type { LoginApiReq } from "@/types/apiTypes/adminApiTypes";
import { useRequest } from "vue-hooks-plus";
import store from "@/store";
import { useRouter } from "vue-router";
import { showToast } from "@/utils/popup";

export const useLogin = () => {
  const router = useRouter();

  // 登录
  const { runAsync: login, loading: logining } = useRequest(
    async (loginData: LoginApiReq) => {
      const isSuccess = await store.dispatch("login", loginData);
      if (isSuccess) {
        showToast("success", "登录成功");
        router.push({ path: "/" });
      }
    },
    { manual: true },
  );

  // 退出登录
  const { runAsync: logout, loading: logouting } = useRequest(
    async () => {
      await store.dispatch("logout");
      router.push({ path: "/login" });
    },
    { manual: true },
  );

  return {
    login,
    logout,
    logining,
    logouting: logouting as unknown as boolean,
  };
};
