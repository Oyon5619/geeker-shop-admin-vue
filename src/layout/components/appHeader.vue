<script lang="ts" setup>
import { Cube, MenuSharp, Expand, Contract, Reload } from "@vicons/ionicons5";
import type { DropdownOption } from "naive-ui";
import { h, ref } from "vue";
import store from "@/store";
import { useDialog } from "@/utils/popup";
import { useLogin } from "@/hooks/useLogin";
import { useFullscreen } from "vue-hooks-plus";
import FormDrawer from "@/components/formDrawer.vue";
import { useModifyAdminPwd } from "@/hooks/useModifyAdminPwd";
import { debounce } from "lodash";
import { SYSTEM_APP_NAME } from "@/constants/common";

const adminName = store.state.adminInfo?.username;

const isShowProfile = ref(false);
const formDrawerRef = ref<{ onOpen?: () => void; onClose?: () => void }>({});

const [isFullScreen, { toggleFullscreen }] = useFullscreen();
const { logout, logouting } = useLogin();
const { formRef, formRules, formValues, loading, modifyAdminPwd } =
  useModifyAdminPwd();

const options: DropdownOption[] = [
  {
    key: "render",
    type: "render",
    render: () => {
      return h(
        "div",
        { style: "text-align: center;font-size: 1rem;font-weight: bold;" },
        adminName,
      );
    },
  },
  {
    key: "profile",
    label: "个人信息",
  },
  {
    key: "modifyPwd",
    label: "修改密码",
  },
  {
    key: "logout",
    label: "退出登录",
  },
];

const onLogout = () => {
  useDialog({
    type: "warning",
    title: "请确认",
    content: "你确定要退出登录吗",
    loading: logouting,
    onOk: logout,
  });
};

// 打开修改密码抽屉
const onOpenModifyPwdDrawer = () => {
  formDrawerRef.value.onOpen?.();
};

// 关闭修改密码抽屉
const onCloseModifyPwdDrawer = () => {
  formValues.oldpassword = "";
  formValues.password = "";
  formValues.repassword = "";
};

const onToggleProfileDrawer = () => {
  isShowProfile.value = true;
};

const onReload = () => {
  location.reload();
};

const onSelect = (key: string) => {
  switch (key) {
    case "profile":
      onToggleProfileDrawer();
      break;
    case "modifyPwd":
      onOpenModifyPwdDrawer();
      break;
    case "logout":
      onLogout();
      break;
    default:
      break;
  }
};

// 提交修改后的密码
const onSubmit = () => {
  formRef.value?.validate((err) => {
    if (err) {
      return;
    }

    modifyAdminPwd(formValues);
  });
};

// 提交操作防抖
const onSubmitDebounce = debounce(onSubmit, 300);
</script>

<template>
  <n-flex align="center" class="app-header">
    <n-flex align="center" justify="center" class="w-60 cursor-pointer">
      <n-icon :component="Cube" size="35" />
      <p class="text-lg font-thin">{{ SYSTEM_APP_NAME }}</p>
    </n-flex>
    <n-flex align="center">
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-icon
            class="cursor-pointer"
            :component="MenuSharp"
            size="25"
            @click="$store.commit('TOGGLE_COLLAPSED')"
          />
        </template>
        <span>菜单</span>
      </n-tooltip>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-icon
            class="cursor-pointer"
            :component="Reload"
            size="25"
            @click="onReload"
          />
        </template>
        <span>刷新</span>
      </n-tooltip>
    </n-flex>
    <n-flex class="ml-auto" align="center">
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-icon class="cursor-pointer" size="25" @click="toggleFullscreen">
            <Contract v-if="isFullScreen" />
            <Expand v-else />
          </n-icon>
        </template>
        <span v-if="isFullScreen">退出全屏</span>
        <span v-else>全屏</span>
      </n-tooltip>
      <n-dropdown trigger="hover" :options="options" @select="onSelect">
        <n-avatar :size="40" :src="$store.state.adminInfo?.avatar" round />
      </n-dropdown>
    </n-flex>
  </n-flex>
  <n-drawer v-model:show="isShowProfile" width="20%">
    <n-drawer-content title="个人信息" closable>待实现</n-drawer-content>
  </n-drawer>
  <FormDrawer
    ref="formDrawerRef"
    title="修改密码"
    :loading="loading"
    @submit="onSubmitDebounce()"
    @cancel="onCloseModifyPwdDrawer"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="auto"
      :model="formValues"
      :rules="formRules"
      :disabled="loading"
    >
      <n-form-item label="旧密码" path="oldpassword">
        <n-input
          type="password"
          placeholder="请输入旧密码"
          v-model:value="formValues.oldpassword"
          show-password-on="click"
        />
      </n-form-item>
      <n-form-item label="新密码" path="password">
        <n-input
          type="password"
          placeholder="请输入新密码"
          v-model:value="formValues.password"
          show-password-on="click"
        />
      </n-form-item>
      <n-form-item label="确认新密码" path="repassword">
        <n-input
          type="password"
          placeholder="请再确认新密码"
          v-model:value="formValues.repassword"
          show-password-on="click"
        />
      </n-form-item>
    </n-form>
  </FormDrawer>
</template>

<style scoped>
@reference "@/styles/index.css";

.app-header {
  @apply bg-green-700 h-14 text-white px-4;
}
</style>
