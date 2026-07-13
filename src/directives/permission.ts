import type { App } from "vue";
import store from "@/store";

const checkPermission = (value: unknown, el?: HTMLElement) => {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限, eg: v-permission="['getStatistics3,GET']"`);
  }

  const hasPermission = value.some((v) => store.state.ruleNames.includes(v));
  const parentNode = el?.parentNode;
  if (!hasPermission && parentNode) {
    parentNode.removeChild(el);
  }

  return hasPermission;
};

export default {
  install(app: App) {
    // 注册自定义的permission指令
    app.directive("permission", {
      mounted(el, binding) {
        checkPermission(binding.value, el);
      },
    });
  },
};
