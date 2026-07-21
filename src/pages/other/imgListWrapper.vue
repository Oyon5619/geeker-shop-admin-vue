<script lang="ts" setup>
import Authority from "@/components/authority.vue";
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
</script>

<template>
  <n-flex class="bg-white h-full p-4" vertical>
    <n-flex align="center">
      <Authority :permission="['createImageClass,POST']">
        <n-button size="small" type="primary" @click="onAddCategory">
          新增图片分类
        </n-button>
      </Authority>
      <Authority :permission="['uploadImage,POST']">
        <n-button size="small" type="warning" @click="onOpenUploadDrawer">
          上传图片
        </n-button>
      </Authority>
    </n-flex>
    <div class="flex h-full relative overflow-hidden">
      <Authority :permission="['getImageClassList,GET']">
        <ImgClassAside ref="asideRef" @select="onSelectImgClass" />
      </Authority>
      <Authority :permission="['getCurrentImageList,GET']">
        <ImgList ref="imgListRef" />
      </Authority>
    </div>
  </n-flex>
  <UploadFileDrawer ref="drawerRef" @finish="onSelectImgClass" />
</template>

<style scoped></style>
