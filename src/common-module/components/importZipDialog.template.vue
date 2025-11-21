<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    modal
    :header="title"
    :closable="true"
    :draggable="false"
    class="min-w-[90vw] max-w-[90vw] sm:min-w-[40vw]"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-file-import"></i>
        <span class="font-semibold">{{ title }}</span>
      </div>
    </template>

    <div class="flex flex-col gap-4 pb-4 pt-1 items-center">
      <!-- 上传区域 -->
      <div class="flex flex-col gap-2 w-full items-center">
        <FileUpload
          ref="refFileUpload"
          mode="basic"
          :multiple="false"
          accept=".zip"
          :maxFileSize="maxFileSize"
          chooseLabel="选择压缩包"
          customUpload
          :showUploadButton="false"
          :showCancelButton="false"
          @select="fileSelectAction"
        >
        </FileUpload>

        <!-- 已选择的文件信息 -->
        <div v-if="viewSelectedFile" class="mt-2 w-full">
          <div
            class="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800"
          >
            <i class="pi pi-file-zip text-2xl text-blue-500"></i>
            <div class="flex-1">
              <div class="font-medium text-sm">{{ viewSelectedFile.name }}</div>
              <div class="text-xs text-gray-500">
                {{ formatFileSize(viewSelectedFile.size) }}
              </div>
            </div>
            <Button
              icon="pi pi-times"
              severity="danger"
              text
              rounded
              size="small"
              @click="removeFile"
            />
          </div>
        </div>

        <!-- 错误信息 -->
        <span v-if="viewErrorMessage" class="text-red-500 text-xs">
          {{ viewErrorMessage }}
        </span>
      </div>

      <!-- 说明信息 -->
      <div
        class="w-full text-sm text-gray-600 dark:text-gray-300 bg-primary-100 dark:bg-primary-900 p-3 rounded-lg"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <i class="pi pi-info-circle text-primary-500"></i>
            <div class="font-semibold">导入说明：</div>
          </div>
          <ul class="text-xs space-y-1 list-disc pl-6">
            <li>只支持ZIP格式压缩包</li>
            <li>同名文件将被自动覆盖</li>
            <li>建议文件大小不超过 {{ formatFileSize(maxFileSize) }}</li>
            <li>上传后将自动解压并完成导入</li>
          </ul>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="取消"
          severity="secondary"
          outlined
          size="small"
          @click="viewIsOpenDialog = false"
        />
        <Button
          label="导入"
          size="small"
          :disabled="!viewSelectedFile || !!viewErrorMessage"
          :loading="viewIsloading"
          @click="uploadAction"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useToast } from "primevue/usetoast";
const toast = useToast();

import { importFrameWorkZip } from "@/common-module/services/service.provider";
const props = defineProps<{
  title: string;
  maxFileSize: number;
  frameWorkId: string;
  isNoUpdate?: boolean;
}>();

const $emit = defineEmits(["onImportSuccess"]);
const viewIsOpenDialog = ref<boolean>(false);
const refFileUpload = ref();
const viewSelectedFile = ref<File | null>(null);
const viewErrorMessage = ref<string>("");
const viewIsloading = ref<boolean>(false);

// 重置表单
const resetForm = () => {
  viewSelectedFile.value = null;
  viewErrorMessage.value = "";
  viewIsloading.value = false;
  if (refFileUpload.value) {
    refFileUpload.value.clear();
  }
};

const openDialog = () => {
  resetForm();
  viewIsOpenDialog.value = true;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateFileType = (file: File): boolean => {
  const allowedTypes = [".zip"];
  const fileName = file.name.toLowerCase();
  return allowedTypes.some((type) => fileName.endsWith(type));
};

const fileSelectAction = (event: any) => {
  const files = event.files;
  if (files && files.length > 0) {
    const file = files[0];

    // 验证文件类型
    if (!validateFileType(file)) {
      viewErrorMessage.value = "请选择 .zip 格式的压缩包";
      return;
    }

    // 验证文件大小
    if (file.size > props.maxFileSize) {
      viewErrorMessage.value = `文件大小不能超过 ${formatFileSize(
        props.maxFileSize
      )}`;
      return;
    }

    viewSelectedFile.value = file;
    viewErrorMessage.value = "";
  }
};

const removeFile = () => {
  viewSelectedFile.value = null;
  viewErrorMessage.value = "";
  if (refFileUpload.value) {
    refFileUpload.value.clear();
  }
};

// 处理上传
const uploadAction = async () => {
  if (!viewSelectedFile.value) {
    viewErrorMessage.value = "请选择要上传的文件";
    return;
  }

  viewIsloading.value = true;

  const formData = new FormData();
  formData.append("file", viewSelectedFile.value);

  const res = await importFrameWorkZip(props.frameWorkId, formData);
  viewIsloading.value = false;

  if (res.result === true) {
    toast.add({
      severity: "success",
      summary: `导入成功`,
      life: 3000,
    });
    viewIsOpenDialog.value = false;
    if (!props.isNoUpdate) {
      setTimeout(() => {
        router.go(0);
      }, 500);
    } else {
      $emit("onImportSuccess");
    }
  }
};

defineExpose({
  openDialog,
});
</script>

<style scoped>
/* 隐藏默认的 "No file chosen" */
:deep(.p-fileupload-basic span) {
  display: none;
}

:deep(.p-fileupload-basic .p-fileupload-choose-button span) {
  display: inline-block;
}
</style>
