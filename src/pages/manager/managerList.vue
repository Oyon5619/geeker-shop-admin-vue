<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import FormDrawer from "@/components/formDrawer.vue";
import FullPage from "@/components/fullPage.vue";
import { PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import { useAdminListManager } from "@/hooks/useAdminListManager";
import store from "@/store";
import type { ManagerInfo } from "@/types/apiTypes/adminApiTypes";
import type { ImgInfo } from "@/types/apiTypes/imageApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import type { ImgSelectorModalRef } from "@/types/compRef/imgSelectorModalRef";
import {
  renderButtonItems,
  renderThumbnail,
  renderManagerStatus,
} from "@/utils/hRender";
import { showToast, useDialog } from "@/utils/popup";
import type { DataTableColumns } from "naive-ui";
import { onMounted, ref } from "vue";

const selectorRef = ref<ImgSelectorModalRef>();

const {
  currentPage,
  queryFormValue,
  loading,
  managerListData,
  isManagerStatusModifying,
  addOrEditText,
  isEdit,
  infoFormDrawerRef,
  infoFormValue,
  infoFormRules,
  infoFormRef,
  roleOptions,
  isSubmitting,
  queryManagerList,
  resetQuery,
  onPagination,
  modifyManagerStatus,
  addManager,
  modifyManager,
  setInfoFormValue,
  removeManager,
} = useAdminListManager();

const isCurrentAdmin = (id?: number) => store.state.adminInfo?.id === id;

const onFormDrawerOpen = (isEditValue: boolean) => {
  isEdit.value = isEditValue;
  infoFormDrawerRef.value?.onOpen();
};

const onEditFormDrawerOpen = (item: ManagerInfo) => {
  setInfoFormValue(item);
  onFormDrawerOpen(true);
};

const onRemoveManager = (item: ManagerInfo) => {
  const onOk = async () => {
    const isSuccess = await removeManager(item.id);
    if (!isSuccess) {
      return;
    }

    showToast("success", "删除管理员成功!");
    if (isCurrentAdmin(item.id)) {
      showToast("warning", "当前登录的管理员已被删除, 系统自动登出");
      await store.dispatch("logout");
      return;
    }

    queryManagerList();
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该管理员吗?",
    loading: isSubmitting.value,
    onOk,
  });
};

const actionButtons: ButtonItem<ManagerInfo>[] = [
  {
    type: "info",
    btnText: "修改",
    size: "small",
    onClick: onEditFormDrawerOpen,
  },
  {
    type: "error",
    btnText: "删除",
    size: "small",
    onClick: onRemoveManager,
  },
];

const onSwitch = async (row: ManagerInfo, newValue: boolean) => {
  const { id, username } = row;
  const isSuccess = await modifyManagerStatus({ id, status: Number(newValue) });
  if (isSuccess) {
    showToast("success", `修改管理员${username}的状态成功!`);
    queryManagerList(currentPage.value);
  }

  return isSuccess;
};

const onSubmit = () => {
  infoFormRef.value?.validate(async (err) => {
    if (err) {
      return console.error(err);
    }

    const { avatarList, ...rest } = infoFormValue;
    const avatar = avatarList?.[0]?.url ?? "";
    const submitData = { ...rest, avatar };

    const isSuccess = isEdit.value
      ? await modifyManager(submitData)
      : await addManager(submitData);
    if (!isSuccess) {
      return;
    }

    showToast("success", `${addOrEditText.value}管理员成功!`);

    queryManagerList();
    infoFormDrawerRef.value?.onClose();
  });
};

const onCancel = () => {
  setInfoFormValue({ status: COMMON_STATUS.VALID });
};

const onOpenImgSelectorModal = () => {
  selectorRef.value?.onOpen();
};

const onSelectAvatarConfirm = ({ url }: ImgInfo) => {
  infoFormValue.avatarList = [{ id: url, name: url, url, status: "finished" }];
};

const COLUMNS: DataTableColumns<ManagerInfo> = [
  { key: "thumbnail", title: "管理员", render: renderThumbnail },
  { key: "roleName", title: "所属角色", render: ({ role }) => role.name },
  { key: "update_time", title: "更新时间" },
  {
    key: "status",
    title: "状态",
    render: (row) =>
      renderManagerStatus(row, {
        onSwitch,
        loading: isManagerStatusModifying.value,
      }),
  },
  {
    key: "actions",
    title: "操作",
    width: 160,
    fixed: "right",
    render: (row) => renderButtonItems<ManagerInfo>(actionButtons, row),
  },
];

onMounted(() => {
  queryManagerList();
});
</script>

<template>
  <FullPage>
    <n-space vertical>
      <n-form
        :model="queryFormValue"
        :show-feedback="false"
        label-placement="left"
        size="small"
        inline
      >
        <n-form-item label="关键词">
          <n-input
            placeholder="管理员昵称"
            v-model:value="queryFormValue.keyword"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" size="small" @click="queryManagerList()"
              >查询</n-button
            >
            <n-button size="small" @click="resetQuery">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>
      <CommonActions
        refresh-text="刷新本页数据"
        @add="onFormDrawerOpen(false)"
        @refresh="queryManagerList(currentPage)"
      />
      <n-data-table
        :loading="loading"
        :columns="COLUMNS"
        :data="managerListData?.managerList"
      />
      <n-flex justify="center">
        <n-pagination
          v-model:page="currentPage"
          :page-count="managerListData?.pageCount"
          :page-size="PAGE_SIZE_10"
          @update:page="onPagination"
          simple
        />
        <p>共有 {{ managerListData?.total }} 条数据</p>
      </n-flex>
    </n-space>
    <FormDrawer
      ref="infoFormDrawerRef"
      width="30%"
      :loading="isSubmitting"
      :title="`${addOrEditText}管理员信息`"
      :okText="`确定${addOrEditText}`"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <n-form
        ref="infoFormRef"
        label-placement="left"
        label-width="auto"
        :disabled="isSubmitting"
        :model="infoFormValue"
        :rules="infoFormRules"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            placeholder="请输入"
            v-model:value="infoFormValue.username"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            placeholder="请输入(可选)"
            v-model:value="infoFormValue.password"
          />
        </n-form-item>
        <n-form-item label="所属角色" path="role_id">
          <n-select
            placeholder="请选择"
            v-model:value="infoFormValue.role_id"
            :options="roleOptions"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch
            v-model:value="infoFormValue.status"
            :checked-value="COMMON_STATUS.VALID"
            :unchecked-value="COMMON_STATUS.INVALID"
          />
        </n-form-item>
        <n-form-item label="头像" path="avatar">
          <n-flex vertical>
            <n-button @click="onOpenImgSelectorModal">点击选择</n-button>
            <n-upload
              list-type="image-card"
              :file-list="infoFormValue.avatarList"
              :max="1"
              disabled
            />
          </n-flex>
        </n-form-item>
      </n-form>
    </FormDrawer>
    <ImgSelectorModal
      ref="selectorRef"
      title="选择头像"
      @confirm="onSelectAvatarConfirm"
    />
  </FullPage>
</template>
