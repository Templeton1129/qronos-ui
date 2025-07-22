<template>
  <!-- 首次强制弹窗策略导入 -->
  <div class="hidden sm:flex">
    <Dialog
      v-model:visible="viewAddConfigFileDialog"
      :header="`${accountName}策略导入`"
      appendTo="self"
      :closable="!isForceAddConfigFile"
      modal
      class="max-w-[90vw] min-w-[50vw] z-100"
    >
      <template #default>
        <!-- 策略导入... -->

        <span class="text-xs text-gray-400"
          >(启动之前请务必先导入策略config文件！)</span
        >
        <!-- 上传config 单文件上传 -->
        <div class="hidden sm:flex justify-start items-center gap-4 mt-4">
          <FileUpload
            :key="frameWorkId"
            ref="refFileUpload"
            mode="basic"
            name="file"
            accept=".py"
            :maxFileSize="1000000"
            choose-label="选择config文件"
            customUpload
            @select="onFileSelect"
            class="p-button-outlined"
          />
          <span v-if="selectedFile" class="custom-empty-text">{{
            selectedFile.name
          }}</span>
          <Button
            label="上传"
            @click="uploadConfigFileAction"
            severity="secondary"
            variant="outlined"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { accountBindStrategy } from "@/common-module/services/service.provider";
const toast = useToast();

const props = defineProps<{
  isForceAddConfigFile: boolean;
  frameWorkId: string;
  accountName: string;
}>();
const viewAddConfigFileDialog = ref<boolean>(false);
const refFileUpload = ref<any>(null);
const selectedFile = ref<File | null>(null);

const $emit = defineEmits([
  "refreshAccountInfoList",
  "refreshForceAddConfigFileStatus",
]);

const openDialog = () => {
  viewAddConfigFileDialog.value = true;
};

const onFileSelect = (event: any) => {
  selectedFile.value = event.files?.[0] || null;
};

const uploadConfigFileAction = async (event: any) => {
  if (!selectedFile.value) {
    toast.add({
      severity: "error",
      summary: "请选择文件",
      life: 2000,
    });
    return;
  }
  if (!selectedFile.value.name.endsWith(".py")) {
    toast.add({
      severity: "error",
      summary: "上传失败",
      detail: "只允许上传 Python (.py) 类型文件",
      life: 3000,
    });
    return;
  }
  const formData = new FormData();
  formData.append("file", selectedFile.value);
  const res = await accountBindStrategy(
    props.frameWorkId,
    props.accountName || "",
    formData
  );
  if (res.result === true) {
    toast.add({
      severity: "success",
      summary: "上传成功",
      detail: `上传成功`,
      life: 3000,
    });
    selectedFile.value = null;
    refFileUpload.value.clear(); // 这里会清空UI
    viewAddConfigFileDialog.value = false;
    if (props.isForceAddConfigFile === true) {
      $emit("refreshForceAddConfigFileStatus");
    }
    $emit("refreshAccountInfoList");
  }
};

defineExpose({
  openDialog,
});
</script>
