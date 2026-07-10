import type { RouteRecordRaw } from "vue-router";

/** 待注册的路由 (全部都在Admin下) */
export const LAZY_ROUTES: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    meta: { title: "管理台首页" },
    component: () => import("@/pages/home.vue"),
  },
  {
    path: "/goods/list",
    name: "GoodList",
    meta: { title: "商品管理" },
    component: () => import("@/pages/goods/goodList.vue"),
  },
  {
    path: "/category/list",
    name: "categories",
    meta: { title: "分类管理" },
    component: () => import("@/pages/goods/goodList.vue"),
  },
  {
    path: "/skus/list",
    name: "skuList",
    meta: { title: "规格管理" },
    component: () => import("@/pages/goods/skuList.vue"),
  },
  {
    path: "/coupon/list",
    name: "coupons",
    meta: { title: "优惠券管理" },
    component: () => import("@/pages/goods/coupons.vue"),
  },
];
