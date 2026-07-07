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
  { path: "/", name: "Home", component: Home },
  {
    path: "/login",
    name: "Login",
    component: loginComp,
  },
  {
    path: "/example",
    name: "Example",
    component: ExampleComp,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: ROUTES,
});

export default initRouter(router);
