<script lang="ts" setup>
import ImgClassAside from "@/components/imgClassAside.vue";
import ImgList from "@/components/imgList.vue";
import UploadFileDrawer from "@/components/uploadFileDrawer.vue";
import type { ImgClassAsideRef } from "@/types/compRef/imgClassAsideRef";
import type { ImgListRef } from "@/types/compRef/imgListRef";
import type { UploadFileDrawerRef } from "@/types/compRef/uploadFileDrawerRef";
import { showToast } from "@/utils/popup";
import { ref } from "vue";

const asideRef = ref<ImgClassAsideRef>();
const imgListRef = ref<ImgListRef>();

const drawerRef = ref<UploadFileDrawerRef>();

const onAddCategory = () => {
  asideRef.value?.onCreate();
};

const onOpenUploadDrawer = () => {
  const imgClassId = asideRef.value?.getActiveImgClassId();
  if (!imgClassId) {
    showToast("warning", "请先选择其中一个图库分类后再上传^_^");
    return;
  }

  drawerRef.value?.onOpen(imgClassId);
};

const onSelectImgClass = (id: number) => {
  imgListRef.value?.onQueryImgList(id);
};

const OPERATIONS = [
  {
    key: "addCategory",
    type: "primary",
    text: "新增图片分类",
    onClick: onAddCategory,
  },
  {
    key: "uploadImage",
    type: "warning",
    text: "上传图片",
    onClick: onOpenUploadDrawer,
  },
];
</script>

<template>
  <n-flex class="bg-white h-full p-4" vertical>
    <n-flex align="center">
      <n-button
        size="small"
        v-for="item in OPERATIONS"
        :key="item.text"
        :type="item.type"
        @click="item.onClick"
        >{{ item.text }}</n-button
      >
    </n-flex>
    <div class="flex h-full relative overflow-hidden">
      <ImgClassAside ref="asideRef" @select="onSelectImgClass" />
      <ImgList ref="imgListRef" />
    </div>
  </n-flex>
  <UploadFileDrawer ref="drawerRef" @finish="onSelectImgClass" />
</template>

<style scoped></style>
