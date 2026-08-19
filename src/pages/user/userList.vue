<script lang="ts" setup>
import CommonActions from "@/components/commonActions.vue";
import DynamicFormDrawer from "@/components/dynamicFormDrawer.vue";
import FullPage from "@/components/fullPage.vue";
import SimplePagination from "@/components/simplePagination.vue";
import SubmitForm from "@/components/submitForm.vue";
import { INPUT_COMP_PROPS } from "@/constants/common";
import { DEFAULT_PAGE, PAGE_SIZE_10 } from "@/constants/pagination";
import { COMMON_STATUS } from "@/constants/statusEnum";
import { useUserListManager } from "@/hooks/useUserListManager";
import type { ImgInfo } from "@/types/apiTypes/imageApiTypes";
import type { UserInfo } from "@/types/apiTypes/userApiTypes";
import type { ButtonItem } from "@/types/buttonItem";
import type { FormDrawerRef } from "@/types/compRef/formDrawerRef";
import type { ImgSelectorModalRef } from "@/types/compRef/imgSelectorModalRef";
import type { FormConfigColumn } from "@/types/submitFormConfigColumn";
import {
  renderButtonItems,
  renderStatus,
  renderText,
  renderThumbnail,
} from "@/utils/hRender";
import { showToast, useDialog } from "@/utils/popup";
import type { DataTableColumns } from "naive-ui/es/data-table";
import { computed, onMounted, ref } from "vue";

const formDrawerRef = ref<FormDrawerRef>();
const selectorRef = ref<ImgSelectorModalRef>();

const {
  currentPage,
  queryValues,
  userListData,
  loading,
  isEdit,
  userFormModel,
  drawerTitle,
  submitSuccessTips,
  isSubmitting,
  submitUserInfo,
  getUserList,
  removeUser,
  setFormValues,
  resetFormValues,
} = useUserListManager();

const userLevelOptions = computed(() =>
  userListData.value?.userLevels.map(({ id: value, name: label }) => ({
    label,
    value,
  })),
);

const onOpenImgSelectorModal = () => {
  selectorRef.value?.onOpen();
};

const onSelectAvatarConfirm = ({ url }: ImgInfo) => {
  userFormModel.avatarList = [{ id: url, name: url, url, status: "finished" }];
};

const onOpenAddDrawer = () => {
  isEdit.value = false;
  formDrawerRef.value?.onOpen();
};

const onSearch = () => {
  getUserList({ ...queryValues, page: currentPage.value });
};

const onRefresh = () => {
  currentPage.value = DEFAULT_PAGE;
  queryValues.keyword = "";
  queryValues.user_level_id = "";

  onSearch();
  formDrawerRef.value?.onClose();
};

const onPagination = (page: number) => {
  currentPage.value = page;
  getUserList({ ...queryValues, page });
};

const onRemoveUser = (item: UserInfo) => {
  const onOk = async () => {
    const isSuccess = await removeUser(item.id);
    if (isSuccess) {
      showToast("success", "删除用户成功");
      onRefresh();
    }
  };

  useDialog({
    type: "warning",
    title: "请确认",
    content: "确定要删除该用户吗?",
    onOk,
  });
};

const onModifyUser = (item: UserInfo) => {
  isEdit.value = true;
  setFormValues(item);
  formDrawerRef.value?.onOpen();
};

const onConfirm = async () => {
  const isSuccess = await submitUserInfo();
  if (!isSuccess) {
    return;
  }

  showToast("success", submitSuccessTips.value);
  onRefresh();
};

const onCancel = () => {
  resetFormValues();
};

const actionButtons: ButtonItem<UserInfo>[] = [
  {
    type: "info",
    btnText: "编辑",
    size: "small",
    onClick: onModifyUser,
  },
  {
    type: "error",
    btnText: "删除",
    size: "small",
    onClick: onRemoveUser,
  },
];

const QUERY_FORM_CONFIGS = computed(() => {
  const configs: FormConfigColumn[] = [
    {
      column: "keyword",
      label: "关键词",
      comp: "input",
      compProps: { ...INPUT_COMP_PROPS, size: "small" },
    },
  ];

  if (userLevelOptions.value?.length) {
    configs.push({
      column: "user_level_id",
      label: "会员等级",
      comp: "select",
      compProps: {
        ...INPUT_COMP_PROPS,
        size: "small",
        options: userLevelOptions.value,
        allowClear: true,
      },
    });
  }

  return configs;
});

const DATA_COLUMNS: DataTableColumns<UserInfo> = [
  { key: "thumbnail", title: "用户", render: renderThumbnail },
  {
    key: "userLevel",
    title: "用户会员等级",
    render: (row) => {
      return renderText(row.user_level?.name);
    },
  },
  {
    key: "status",
    title: "状态",
    render: (row) => renderStatus(row.status),
  },
  {
    key: "update_time",
    title: "更新时间",
  },
  {
    key: "create_time",
    title: "创建时间",
  },
  {
    key: "actions",
    title: "操作",
    fixed: "right",
    width: 160,
    render: (row) => renderButtonItems(actionButtons, row),
  },
];

const USER_FORM_CONFIGS = computed<FormConfigColumn[]>(() => {
  return [
    {
      column: "username",
      label: "用户名",
      comp: "input",
    },
    {
      column: "password",
      label: "密码",
      comp: "input",
    },
    {
      column: "nickname",
      label: "昵称",
      comp: "input",
    },
    {
      column: "phone",
      label: "手机",
      comp: "input",
    },
    {
      column: "email",
      label: "邮箱",
      comp: "input",
    },
    {
      column: "status",
      label: "状态",
      comp: "switch",
      compProps: {
        checkedValue: COMMON_STATUS.VALID,
        uncheckedValue: COMMON_STATUS.INVALID,
      },
    },
    {
      column: "user_level_id",
      label: "会员等级",
      comp: "select",
      compProps: {
        options: userLevelOptions.value,
        allowClear: true,
      },
    },
    {
      column: "avatar",
      label: "头像",
      comp: "avatarUpload",
      compProps: {
        onClick: onOpenImgSelectorModal,
        listType: "image-card",
        fileList: userFormModel.avatarList,
      },
    },
  ];
});

onMounted(() => {
  getUserList();
});
</script>

<template>
  <FullPage>
    <n-space vertical>
      <SubmitForm
        :formConfigs="QUERY_FORM_CONFIGS"
        :formModel="queryValues"
        inline
      >
        <n-form-item label=" ">
          <n-space>
            <n-button type="primary" size="small" @click="onRefresh">
              搜索
            </n-button>
            <n-button size="small" @click="onRefresh">重置</n-button>
          </n-space>
        </n-form-item>
      </SubmitForm>
      <CommonActions @add="onOpenAddDrawer" @refresh="onRefresh" />
      <n-data-table
        :columns="DATA_COLUMNS"
        :data="userListData?.userList"
        :loading="loading"
      />
      <SimplePagination
        v-model:page="currentPage"
        :count="userListData?.pageCount"
        :perSize="PAGE_SIZE_10"
        :total="userListData?.total"
        @pagination="onPagination"
      />
    </n-space>
    <DynamicFormDrawer
      ref="formDrawerRef"
      width="35%"
      :title="drawerTitle"
      :formModel="userFormModel"
      :formConfigs="USER_FORM_CONFIGS"
      :loading="isSubmitting"
      @cancel="onCancel"
      @submit="onConfirm"
    />
    <ImgSelectorModal
      ref="selectorRef"
      title="选择头像"
      @confirm="onSelectAvatarConfirm"
    />
  </FullPage>
</template>
