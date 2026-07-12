<script lang="ts" setup>
import {
  BookSharp,
  CartSharp,
  ChatboxEllipsesSharp,
  ImageSharp,
  NotificationsSharp,
  PersonSharp,
  SettingsSharp,
  TicketSharp,
} from "@vicons/ionicons5";
import { useRouter } from "vue-router";

const UNIT_LIST = [
  {
    iconComp: PersonSharp,
    class: "text-cyan-400",
    title: "用户",
    path: "/user/list",
  },
  {
    iconComp: CartSharp,
    class: "text-purple-400",
    title: "商品",
    path: "/goods/list",
  },
  {
    iconComp: BookSharp,
    class: "text-pink-400",
    title: "订单",
    path: "/order/list",
  },
  {
    iconComp: ChatboxEllipsesSharp,
    class: "text-blue-400",
    title: "评价",
    path: "/comment/list",
  },
  {
    iconComp: ImageSharp,
    class: "text-red-600",
    title: "图库",
    path: "/image/list",
  },
  {
    iconComp: NotificationsSharp,
    class: "text-green-600",
    title: "公告",
    path: "/notice/list",
  },
  {
    iconComp: SettingsSharp,
    class: "text-gray-600",
    title: "配置",
    path: "/setting/base",
  },
  {
    iconComp: TicketSharp,
    class: "text-yellow-400",
    title: "优惠券",
    path: "/coupon/list",
  },
];

const router = useRouter();

const onClickUnit = (path: string) => {
  router.push({ path });
};
</script>

<template>
  <n-grid :cols="8" :x-gap="12">
    <n-gi v-for="item in UNIT_LIST" :key="item.title">
      <n-card
        class="shadow-md cursor-pointer"
        @click="onClickUnit(item.path)"
        hoverable
      >
        <n-flex justify="center" align="center" vertical>
          <n-icon size="35" :class="item.class" :component="item.iconComp" />
          <div class="font-thin text-lg">{{ item.title }}</div>
        </n-flex>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<style scoped></style>
