import store from "@/store";
import { getToken } from "@/utils/auth";
import { errorToast, toast } from "@/utils/popup";
import { cloneDeep } from "lodash";
import type { Router } from "vue-router";

export function initRouter(router: Router) {
  const resultRouter = cloneDeep(router);

  // 全局路由前置守卫
  resultRouter.beforeEach(async (to, from, next) => {
    const token = getToken();

    // 未登录则强制跳转回登录页
    if (!token && to.path !== "/login") {
      errorToast("凭证无效或已过期,请登录");
      return next({ path: "/login" });
    }

    // 防止重复登录
    if (token && to.path === "/login") {
      toast("请勿重复登录", { type: "warning" });
      return next({ path: from.path ?? "/" });
    }

    if (token) {
      await store.dispatch("getAdminInfo");
    }

    next();
  });

  return resultRouter;
}
