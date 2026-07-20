<script lang="ts" setup>
import { useImgListManager } from "@/hooks/useImgListManager";
import { INITIAL_PAGINATION_8, PAGE_SIZE_8 } from "@/constants/pagination";
import { ImageSharp } from "@vicons/ionicons5";
import { showToast, useDialog } from "@/utils/popup";
import type { ImgInfo } from "@/types/apiTypes/imageApiTypes";
import { reactive, ref } from "vue";
import type { FormInst, FormRules } from "naive-ui";
import { NModal } from "naive-ui";

const isShowModal = ref(false);
const formRef = ref<FormInst>();
const formValues = reactive<{ id?: number; name?: string }>({});
const formRules: FormRules = {
  name: {
    required: true,
    message: "图片名不能为空!",
    trigger: "blur",
  },
};

const {
  imgClassId,
  getImgListByClass,
  removeImg,
  modifyImgName,
  onPagination,
  currentPage,
  imgListData,
  isSpinning,
} = useImgListManager();

const onQueryImgList = (id?: number) => {
  imgClassId.value = id;
  getImgListByClass({ ...INITIAL_PAGINATION_8, id });
};

const onRemove = (itemId: number) => {
  const onOk = async () => {
    const isSuccess = await removeImg({ ids: [itemId] });
    if (isSuccess) {
      showToast("success", "删除图片成功");
      onQueryImgList(imgClassId.value);
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该图片吗?",
    onOk,
  });
};

const onModifyName = ({ id, name }: ImgInfo) => {
  formValues.id = id;
  formValues.name = name;

  isShowModal.value = true;
};

const onModifyNameConfirm = () =>
  new Promise((resolve, reject) => {
    formRef.value?.validate(async (err) => {
      if (err) {
        return reject(err);
      }

      const isModifySuccess = await modifyImgName(formValues);
      if (isModifySuccess) {
        showToast("success", "修改图片名成功");
        onQueryImgList(imgClassId.value);
        resolve(true);
      }
    });
  });

const onCloseModal = () => {
  isShowModal.value = false;

  formValues.id = undefined;
  formValues.name = undefined;
};

defineExpose({ onQueryImgList });
</script>

<template>
  <n-spin
    :show="isSpinning"
    description="加载图片数据中..."
    class="flex flex-1 ml-1 border border-gray-200"
    content-class="flex flex-1 flex-col"
  >
    <n-grid
      v-if="Boolean(imgListData?.total)"
      x-gap="12"
      y-gap="12"
      class="flex-1 overflow-y-auto bg-gray-200 p-3"
      :cols="4"
    >
      <n-gi v-for="item in imgListData?.imgList" :key="item.id">
        <n-card size="small" class="h-70" segmented hoverable>
          <template #cover>
            <n-image :src="item.url" class="w-full h-60">
              <template #error>
                <n-icon size="200" :component="ImageSharp" />
              </template>
            </n-image>
          </template>
          <template #default>
            <n-flex align="center">
              <n-ellipsis class="w-30">{{ item.name }}</n-ellipsis>
              <n-space size="small" class="ml-auto">
                <n-button size="small" type="info" @click="onModifyName(item)"
                  >重命名</n-button
                >
                <n-button size="small" type="error" @click="onRemove(item.id)"
                  >删除</n-button
                >
              </n-space>
            </n-flex>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <n-flex v-else justify="center" align="center" class="h-full flex-1">
      <n-result status="info" title="当前图片数据为空" />
    </n-flex>
    <n-flex
      justify="center"
      align="center"
      class="h-10 mt-auto border-t border-t-gray-200"
    >
      <n-pagination
        v-model:page="currentPage"
        :page-count="imgListData?.pageCount"
        :page-size="PAGE_SIZE_8"
        @update:page="onPagination"
        simple
      />
    </n-flex>
  </n-spin>
  <n-modal
    v-model:show="isShowModal"
    preset="dialog"
    title="修改图片名"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onModifyNameConfirm"
    @negative-click="onCloseModal"
    @close="onCloseModal"
  >
    <n-form ref="formRef" :model="formValues" :rules="formRules">
      <n-form-item label="当前图片名" path="name">
        <n-input placeholder="请输入图片名" v-model:value="formValues.name" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
