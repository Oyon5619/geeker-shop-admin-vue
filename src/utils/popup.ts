// 基于naive-ui的消息提示再封装
import {
  createDiscreteApi,
  type DialogOptions,
  type MessageOptions,
} from "naive-ui";

interface UseDialogParams extends Omit<
  DialogOptions,
  "positiveText" | "negativeText" | "onPositiveClick" | "onNegativeClick"
> {
  onOk?: () => void;
  onCancel?: () => void;
}

const DEFAULT_DURATION = 3000;
const { message, dialog } = createDiscreteApi(["message", "dialog"]);

export const okToast = (content: string, options?: MessageOptions) => {
  message.success(content ?? "success", {
    ...options,
    duration: options?.duration ?? DEFAULT_DURATION,
  });
};

export const errorToast = (content: string, options?: MessageOptions) => {
  message.error(content ?? "error", {
    ...options,
    duration: options?.duration ?? DEFAULT_DURATION,
  });
};

export const toast = (content: string, options?: MessageOptions) => {
  message.create(content, {
    ...options,
    duration: options?.duration ?? DEFAULT_DURATION,
  });
};

export const useDialog = (params: UseDialogParams) => {
  const { onOk, onCancel, ...rest } = params;

  dialog.create({
    ...rest,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: onOk,
    onNegativeClick: onCancel,
  });
};
