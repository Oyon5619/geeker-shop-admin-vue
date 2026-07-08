// 基于naive-ui的消息提示再封装
import {
  createDiscreteApi,
  type DialogOptions,
  type MessageOptions,
  type MessageType,
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

export const showToast = (type: MessageType, content: string) => {
  message.create(content, { type, duration: DEFAULT_DURATION });
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
