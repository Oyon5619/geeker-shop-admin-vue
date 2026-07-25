<script lang="ts" setup>
import type { ImgSelectorModalRef } from "@/types/compRef/imgSelectorModalRef";
import { ref } from "vue";
import ImgClassAside from "./imgClassAside.vue";
import ImgList from "./imgList.vue";
import type { ImgListRef } from "@/types/compRef/imgListRef.ts";
import { useDialog } from "@/utils/popup.ts";
import type { ImgInfo } from "@/types/apiTypes/imageApiTypes.ts";

const isShowModal = ref(false);
const imgListRef = ref<ImgListRef>();

const { title } = defineProps<{ title?: string }>();
const emit = defineEmits(["confirm", "close"]);

const onOpen = () => {
  isShowModal.value = true;
};

const onConfirm = (item: ImgInfo) => {
  emit("confirm", item);
  isShowModal.value = false;
};

const onClose = () => {
  emit("close");
  isShowModal.value = false;
};

const onSelectImgClass = (id: number) => {
  imgListRef.value?.onQueryImgList(id);
};

const onSelectAvatar = (item: ImgInfo) => {
  useDialog({
    title: "头像选择确认",
    content: "确定选择该图片作为当前管理员的新头像吗?",
    onOk: () => onConfirm(item),
  });
};

defineExpose<ImgSelectorModalRef>({ onOpen, onClose });
</script>

<template>
  <n-modal
    v-model:show="isShowModal"
    preset="card"
    style="width: 90rem"
    :title="title"
    @close="onClose"
  >
    <n-flex class="h-120 overflow-auto">
      <ImgClassAside @select="onSelectImgClass" isReadOnly />
      <ImgList ref="imgListRef" @select="onSelectAvatar" isReadOnly />
    </n-flex>
  </n-modal>
</template>
