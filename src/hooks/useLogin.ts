import type { LoginApiReq } from "@/types/apiTypes";
import { useRequest } from "vue-hooks-plus";
import store from "@/store";
import { useRouter } from "vue-router";

export const useLogin = () => {
  const router = useRouter();

  const { runAsync: login, loading: logining } = useRequest(
    async (loginData: LoginApiReq) => {
      await store.dispatch("login", loginData);
      router.push({ path: "/" });
    },
    { manual: true },
  );

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
