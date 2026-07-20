<script lang="ts" setup>
import { INITIAL_PAGINATION_20, PAGE_SIZE_20 } from "@/constants/pagination";
import { useImgClassManager } from "@/hooks/useImgClassManager";
import type { ImgClassInfo } from "@/types/apiTypes/imageApiTypes";
import { CloseSharp, ConstructSharp, ListSharp } from "@vicons/ionicons5";
import classNames from "classnames";
import { computed, onMounted } from "vue";
import FormDrawer from "./formDrawer.vue";
import { showToast, useDialog } from "@/utils/popup";

const emit = defineEmits(["select"]);

const {
  activeImgClass,
  imgClassListData,
  isImgClassListLoading,
  isEdit,
  formDrawerRef,
  formValues,
  formRules,
  formRef,
  isImgClassAdding,
  isImgClassModifying,
  currentPage,
  onPagination,
  getImgClassList,
  resetFormValues,
  setFormValues,
  addImgClass,
  removeImgClass,
  modifyImgClass,
} = useImgClassManager();

const isFormDrawerDisabled = computed(
  () => isImgClassAdding.value || isImgClassModifying.value,
);

const openFormDrawer = (value: boolean = false) => {
  isEdit.value = value;
  formDrawerRef.value?.onOpen?.();
};

const refreshImgClassList = () => {
  getImgClassList(INITIAL_PAGINATION_20);
  formDrawerRef.value?.onClose?.();
};

const onEditImgClass = (item: ImgClassInfo) => {
  const { name, order, id } = item;

  openFormDrawer(true);
  resetFormValues();
  setFormValues({ name, order, id });
};

const onRemoveImgClass = (item: ImgClassInfo) => {
  const onOk = async () => {
    const isSuccess = await removeImgClass(item.id);
    if (isSuccess) {
      showToast("success", "删除图库分类成功");
      refreshImgClassList();
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该图片分类吗?",
    onOk,
  });
};

const OPERATIONS = [
  {
    key: "edit",
    btnType: "info",
    iconComp: ConstructSharp,
    onClick: onEditImgClass,
  },
  {
    key: "remove",
    btnType: "error",
    iconComp: CloseSharp,
    onClick: onRemoveImgClass,
  },
];

const onItemActive = ({ id }: ImgClassInfo) => {
  if (activeImgClass.value === id) {
    return;
  }

  activeImgClass.value = id;
  emit("select", id);
};

const onSubmit = () => {
  formRef.value?.validate(async (err) => {
    if (err) {
      console.error(err);
      return;
    }

    if (isEdit.value) {
      await modifyImgClass(formValues);
    } else {
      await addImgClass(formValues);
    }

    showToast("success", `${isEdit.value ? "编辑" : "新增"}图库分类成功`);
    refreshImgClassList();
  });
};

onMounted(() => {
  refreshImgClassList();
});

defineExpose({
  onCreate: () => {
    openFormDrawer();
    resetFormValues();
  },
  getActiveImgClassId: () => activeImgClass.value,
});
</script>

<template>
  <div class="aside-container" vertical>
    <n-flex
      class="h-10 px-2 font-bold border-b border-b-gray-200"
      align="center"
    >
      <n-icon size="25" :component="ListSharp" />
      <p>图库分类一览</p>
    </n-flex>
    <div class="flex-1 overflow-y-auto">
      <n-spin :show="isImgClassListLoading" description="加载图片分类数据中">
        <n-flex
          align="center"
          v-for="item in imgClassListData?.imgClassList"
          :class="
            classNames('img-class-item', {
              'img-item-active': activeImgClass === item.id,
            })
          "
          :key="item.id"
          @click="onItemActive(item)"
        >
          <p class="text-md">{{ item.name }}</p>
          <n-flex align="center" class="ml-auto">
            <n-button
              v-for="iconItem in OPERATIONS"
              :key="iconItem.key"
              :type="iconItem.btnType"
              size="small"
              @click.stop="iconItem.onClick(item)"
            >
              <template #icon>
                <n-icon size="16" :component="iconItem.iconComp" />
              </template>
            </n-button>
          </n-flex>
        </n-flex>
      </n-spin>
    </div>
    <n-flex
      justify="center"
      align="center"
      class="h-10 mt-auto border-t border-t-gray-200"
    >
      <n-pagination
        v-model:page="currentPage"
        :page-count="imgClassListData?.pageCount"
        :page-size="PAGE_SIZE_20"
        @update:page="onPagination"
        simple
      />
    </n-flex>
  </div>
  <FormDrawer
    :title="`${isEdit ? '编辑' : '新增'}图库分类`"
    :loading="isFormDrawerDisabled"
    ref="formDrawerRef"
    @submit="onSubmit"
    @cancel="resetFormValues"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="auto"
      :disabled="isFormDrawerDisabled"
      :model="formValues"
      :rules="formRules"
    >
      <n-form-item label="分类名称" path="name">
        <n-input placeholder="请输入分类名称" v-model:value="formValues.name" />
      </n-form-item>
      <n-form-item label="排序" path="order">
        <n-input-number
          placeholder="请输入排序"
          v-model:value="formValues.order"
          :min="0"
          :max="1000"
        />
      </n-form-item>
    </n-form>
  </FormDrawer>
</template>

<style scoped>
@reference "@/styles/index.css";

.aside-container {
  @apply w-60 border-gray-200 border flex flex-col;
}

.img-class-item {
  @apply h-12 px-3 border-b first:border-t first:border-t-gray-200 border-b-gray-200 cursor-pointer;
}

.img-item-active {
  @apply border-l-4 border-l-green-600 text-green-600 font-bold;
}
</style>
