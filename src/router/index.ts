import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import NotFound from "@/pages/404.vue";
import Home from "@/pages/home.vue";

const lazyExample = () => import("@/pages/example.vue");

const ROUTES: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/example",
    name: "Example",
    component: lazyExample,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: ROUTES,
});

export default router;
