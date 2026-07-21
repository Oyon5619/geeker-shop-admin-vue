<script lang="ts" setup>
import { PAGE_SIZE_10 } from "@/constants/pagination";
import { useNoticeManager } from "@/hooks/useNoticeManager";
import type { NoticeInfo } from "@/types/apiTypes/noticeApiTypes";
import { NDataTable } from "naive-ui";
import type { TableColumns } from "naive-ui/es/data-table/src/interface";
import { onMounted } from "vue";

const { currentPage, noticeListData, loading, onPagination, getNoticeList } =
  useNoticeManager();

const COLUMNS: TableColumns<NoticeInfo> = [
  { key: "title", title: "公告标题" },
  { key: "create_time", title: "发布时间" },
  { key: "update_time", title: "更新时间" },
  { key: "actions", title: "操作", render: (row) => row.id },
];

onMounted(() => {
  getNoticeList(currentPage.value);
});
</script>

<template>
  <div class="h-full bg-white p-4">
    <n-space vertical>
      <n-flex>
        <n-button type="primary" size="small">新增</n-button>
        <n-button size="small">刷新</n-button>
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
  </div>
</template>
