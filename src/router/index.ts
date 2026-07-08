import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import NotFound from "@/pages/404.vue";
import Home from "@/pages/home.vue";
import { initRouter } from "./permission";

const ExampleComp = () => import("@/pages/example.vue");
const loginComp = () => import("@/pages/login.vue");

const ROUTES: RouteRecordRaw[] = [
  { path: "/", name: "Home", meta: { title: "管理台首页" }, component: Home },
  {
    path: "/login",
    name: "Login",
    meta: { title: "管理台登录页" },
    component: loginComp,
  },
  {
    path: "/example",
    name: "Example",
    meta: { title: "例子" },
    component: ExampleComp,
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
