<script lang="ts" setup>
import FormDrawer from "@/components/formDrawer.vue";
import { PAGE_SIZE_10 } from "@/constants/pagination";
import { useNoticeManager } from "@/hooks/useNoticeManager";
import type { NoticeInfo } from "@/types/apiTypes/noticeApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import { renderButtonItems } from "@/utils/hRender";
import { showToast, useDialog } from "@/utils/popup";
import { NDataTable } from "naive-ui";
import type { TableColumns } from "naive-ui/es/data-table/src/interface";
import { onMounted } from "vue";

const {
  currentPage,
  noticeListData,
  loading,
  formDrawerRef,
  formRules,
  formValues,
  formRef,
  isEdit,
  isSubmitting,
  addOrEditText,
  onPagination,
  getNoticeList,
  resetFormValues,
  addNotice,
  modifyNotice,
  setFormValues,
  removeNotice,
} = useNoticeManager();

const refreshNoticeList = (page?: number) => {
  getNoticeList(page);
  formDrawerRef.value?.onClose();
};

const onModifyNotice = (item: NoticeInfo) => {
  isEdit.value = true;
  setFormValues(item);
  formDrawerRef.value?.onOpen();
};

const onRemoveNotice = (item: NoticeInfo) => {
  const onOk = async () => {
    const isSuccess = await removeNotice(item.id);
    if (isSuccess) {
      showToast("success", "删除公告成功");
      refreshNoticeList();
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该公告吗?",
    onOk,
  });
};

const actionButtons: ButtonItem<NoticeInfo>[] = [
  {
    type: "info",
    btnText: "修改",
    size: "small",
    onClick: onModifyNotice,
  },
  {
    type: "error",
    btnText: "删除",
    size: "small",
    onClick: onRemoveNotice,
  },
];

const COLUMNS: TableColumns<NoticeInfo> = [
  { key: "id", title: "公告ID" },
  { key: "title", title: "公告标题" },
  { key: "create_time", title: "发布时间" },
  { key: "update_time", title: "更新时间" },
  {
    key: "actions",
    title: "操作",
    width: 180,
    fixed: "right",
    render: (row) => renderButtonItems<NoticeInfo>(actionButtons, row),
  },
];

const onOpenDrawer = () => {
  formDrawerRef.value?.onOpen();
};

const onSubmit = () => {
  formRef.value?.validate(async (err) => {
    if (err) {
      console.error(err);
      return;
    }

    if (isEdit.value) {
      await modifyNotice(formValues);
    } else {
      await addNotice(formValues);
    }

    showToast("success", `${addOrEditText}公告成功`);
    refreshNoticeList();
  });
};

onMounted(() => {
  refreshNoticeList();
});
</script>

<template>
  <div class="h-full bg-white p-4">
    <n-space vertical size="large">
      <n-flex>
        <n-button type="primary" size="small" @click="onOpenDrawer"
          >新增</n-button
        >
        <n-button size="small" @click="refreshNoticeList(currentPage)"
          >刷新本页数据</n-button
        >
      </n-flex>

      <n-spin :show="loading" description="加载公告数据中...">
        <n-data-table :columns="COLUMNS" :data="noticeListData?.noticeList" />
      </n-spin>
      <n-flex justify="center">
        <n-pagination
          v-model:page="currentPage"
          :page-count="noticeListData?.pageCount"
          :page-size="PAGE_SIZE_10"
          @update:page="onPagination"
          simple
        />
      </n-flex>
    </n-space>
    <FormDrawer
      :title="`${addOrEditText}公告`"
      :loading="isSubmitting"
      :okText="`确定${addOrEditText}`"
      width="40%"
      ref="formDrawerRef"
      @submit="onSubmit"
      @cancel="resetFormValues"
    >
      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        :disabled="isSubmitting"
        :rules="formRules"
        :model="formValues"
      >
        <n-form-item label="公告标题" path="title">
          <n-input
            placeholder="请输入公告标题"
            v-model:value="formValues.title"
          />
        </n-form-item>
        <n-form-item label="公告内容" path="content">
          <n-input
            placeholder="请输入公告内容"
            type="textarea"
            v-model:value="formValues.content"
          />
        </n-form-item>
      </n-form>
    </FormDrawer>
  </div>
</template>
