import { getToken } from "@/utils/auth";
import { showToast } from "@/utils/popup";
import { beginFullLoading, endFullLoading } from "@/utils/progress";
import { cloneDeep } from "lodash";
import type { Router } from "vue-router";
import { LAZY_ROUTES } from "./lazyRoutes";
import { LAYOUT_ROUTE_NAME } from "@/constants/common";
import { findAdminMenu } from "@/utils/menuUtil";
import store from "@/store";

// ...待优化
const registerLayoutRoute = (router: Router, toPath: string) => {
  const target = LAZY_ROUTES.find(({ path }) => path === toPath);
  if (!target || router.hasRoute(target.name ?? "")) {
    return false;
  }

  router.addRoute(LAYOUT_ROUTE_NAME, target);
  return true;
};

export const initRouter = (router: Router) => {
  const resultRouter = cloneDeep(router);

  // 全局路由前置守卫
  resultRouter.beforeEach(async (to, from, next) => {
    // 显示loading
    beginFullLoading();

    const token = getToken();

    // 未登录则强制跳转回登录页
    if (!token && to.path !== "/login") {
      showToast("error", "凭证无效或已过期,请登录");
      return next({ path: "/login" });
    }

    // 防止重复登录
    if (token && to.path === "/login") {
      showToast("warning", "请勿重复登录");
      return next({ path: from.path ?? "/" });
    }

    // 动态注册路由
    const isNewRoute = registerLayoutRoute(resultRouter, to.fullPath);

    // 设置页面标题
    const pageTitle = (to.meta.title as string) ?? "";
    document.title = pageTitle;

    isNewRoute ? next(to.fullPath) : next();
  });

  // 全局后置守卫
  resultRouter.afterEach(async (to) => {
    endFullLoading();

    // 当用户通过url输入具体的路由地址后，要改变当前点击的导航标签
    await store.dispatch("addTabByRoutePath", to.fullPath);
  });

  return resultRouter;
};
