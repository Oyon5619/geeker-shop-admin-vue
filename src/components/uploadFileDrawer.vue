<script lang="ts" setup>
import { MAX_UPLOAD_NUM, UPLOAD_ACTION } from "@/constants/upload";
import { ArchiveSharp } from "@vicons/ionicons5";
import { ref } from "vue";
import type { UploadSettledFileInfo } from "naive-ui";
import { getToken } from "@/utils/auth";
import { showToast } from "@/utils/popup";
import { isType, safeJsonParse } from "@/utils/common";
import type { BaseResp } from "@/types/apiTypes/baseResp";

interface UploadEvent {
  file: UploadSettledFileInfo;
  event?: ProgressEvent;
}

const visible = ref(false);
const imgClassId = ref<number>();

const emit = defineEmits(["finish"]);

const token = getToken() as string;

const onOpen = (id?: number) => {
  visible.value = true;
  imgClassId.value = id;
};

const onClose = () => {
  visible.value = false;
};

const onUploadFinish = () => {
  showToast("success", "上传图片成功");
  emit("finish", imgClassId.value);
  onClose();
};

const onUploadError = ({ event }: UploadEvent) => {
  const eventTarget = event?.target;
  const isXMLHttpReq = isType(eventTarget, "XMLHttpRequest");
  if (!isXMLHttpReq) {
    return;
  }

  const errResp: BaseResp = safeJsonParse(
    (eventTarget as XMLHttpRequest).response,
  );
  showToast("error", errResp.msg);
};

defineExpose({ onOpen, onClose });
</script>

<template>
  <n-drawer v-model:show="visible" width="25%">
    <n-drawer-content title="上传图片" closable>
      <n-upload
        :action="UPLOAD_ACTION"
        :max="MAX_UPLOAD_NUM"
        :headers="{ token }"
        :data="{ image_class_id: imgClassId?.toString() ?? '' }"
        name="img"
        accept="image/*"
        @finish="onUploadFinish"
        @error="onUploadError"
        multiple
      >
        <n-upload-dragger>
          <div class="mb-3">
            <n-icon size="48" :depth="3" :component="ArchiveSharp" />
          </div>
          <n-text class="text-md">点击或者拖动文件到该区域来上传</n-text>
        </n-upload-dragger>
      </n-upload>
    </n-drawer-content>
  </n-drawer>
</template>
