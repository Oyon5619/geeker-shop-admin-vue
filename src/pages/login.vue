<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import type { FormInst, FormRules } from "naive-ui";
import { LockClosedOutline, FlashOutline } from "@vicons/ionicons5";
import { useLogin } from "@/hooks/useLogin";
import { SYSTEM_NAME } from "@/constants/common";

const { login, logining } = useLogin();

const formRef = ref<FormInst>();
const formValues = reactive({ username: "", password: "" });
const formRules: FormRules = {
  username: {
    required: true,
    message: "用户名不能为空!",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "密码不能为空!",
    trigger: "blur",
  },
};

const onSubmit = () => {
  formRef.value?.validate(async (err) => {
    if (err) {
      console.error(err);
      return;
    }

    await login(formValues);
  });
};

const onEnterKeyUp = (e: KeyboardEvent) => {
  if (e.key !== "Enter") {
    return;
  }

  onSubmit();
};

onMounted(() => {
  document.addEventListener("keyup", onEnterKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", onEnterKeyUp);
});
</script>

<template>
  <n-grid class="h-full" cols="4" responsive="screen" item-responsive>
    <n-grid-item class="bg-green-700" span="0 m:2 l:3">
      <n-flex class="h-full" justify="center" align="center" vertical>
        <p class="text-5xl text-white font-bold">Welcome!</p>
        <p class="text-xl text-white">
          An <strong>{{ SYSTEM_NAME }}</strong> based on Vue 3.
        </p>
      </n-flex>
    </n-grid-item>
    <n-grid-item span="4 m:2 l:1">
      <n-flex class="h-full" justify="center" align="center">
        <n-form
          class="w-[80%]"
          ref="formRef"
          size="large"
          :model="formValues"
          :rules="formRules"
          :disabled="logining"
        >
          <n-form-item class="text-xl font-bold">
            {{ SYSTEM_NAME }}
          </n-form-item>
          <n-form-item label="用户名" path="username">
            <n-input
              placeholder="请输入用户名"
              v-model:value="formValues.username"
            >
              <template #prefix>
                <n-icon :component="FlashOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input
              type="password"
              placeholder="请输入密码"
              v-model:value="formValues.password"
              show-password-on="click"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button
              type="primary"
              :loading="logining"
              @click="onSubmit"
              block
              round
              >登录</n-button
            >
          </n-form-item>
        </n-form>
      </n-flex>
    </n-grid-item>
  </n-grid>
</template>
