import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { initRouter } from "./initRouter";

import NotFound from "@/pages/404.vue";
import Admin from "@/layout/admin.vue";
import Login from "@/pages/login.vue";
import { LAYOUT_ROUTE_NAME } from "@/constants/common";

const DEFAULT_ROUTES: RouteRecordRaw[] = [
  {
    path: "/",
    name: LAYOUT_ROUTE_NAME,
    component: Admin,
    meta: { title: "管理台首页" },
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "管理台登录页" },
    component: Login,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: { title: "404 页面未找到" },
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: DEFAULT_ROUTES,
});

export default initRouter(router);
