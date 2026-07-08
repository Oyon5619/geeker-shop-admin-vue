import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { initRouter } from "./permission";

import NotFound from "@/pages/404.vue";
import Home from "@/pages/home.vue";
import Admin from "@/layout/admin.vue";

const ExampleComp = () => import("@/pages/example.vue");
const loginComp = () => import("@/pages/login.vue");

const ROUTES: RouteRecordRaw[] = [
  {
    path: "/",
    component: Admin,
    // 后台子路由
    children: [
      {
        path: "/",
        name: "Home",
        meta: { title: "管理台首页" },
        component: Home,
      },
      {
        path: "/example",
        name: "Example",
        meta: { title: "例子" },
        component: ExampleComp,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "管理台登录页" },
    component: loginComp,
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
  routes: ROUTES,
});

export default initRouter(router);
