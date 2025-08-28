<template>
  <!-- 导出功能 -->
  <Dialog
    header="导出"
    :visible="viewIsOpenDialog"
    :closable="false"
    :draggable="false"
    :modal="true"
    @hide="viewIsOpenDialog = false"
    class="min-w-[90vw] sm:max-w-[90vw] sm:min-w-[40vw]"
    :pt="{
      footer: 'justify-between items-center',
    }"
  >
    <div class="space-y-4">
      <div class="text-lg font-semibold">确认导出「{{ frameWorkName }}」？</div>
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
        <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">
          导出压缩包内容将包含：
        </div>
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <i class="pi pi-check-circle text-success-500"></i>
            <span>账户配置信息及资金曲线数据</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check-circle text-success-500"></i>
            <span>因子库及策略文件</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check-circle text-success-500"></i>
            <span>全局配置信息</span>
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="space-x-3 w-full flex justify-end">
        <Button
          label="取消"
          severity="secondary"
          @click="viewIsOpenDialog = false"
        />
        <Button
          label="确定"
          class="p-button-primary"
          :loading="viewExportIsLoading"
          @click="exportStrategyAction"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import {
  getExportFrameWorkZipName,
  getExportFrameWorkZip,
} from "@/common-module/services/service.provider";
const toast = useToast();
const viewIsOpenDialog = ref<boolean>(false);

const props = defineProps<{
  frameWorkName: string;
  frameWorkId: string;
}>();
const viewExportIsLoading = ref<boolean>(false);

const openDialog = () => {
  viewIsOpenDialog.value = true;
};

const exportStrategyAction = async () => {
  try {
    viewExportIsLoading.value = true;
    const res = await getExportFrameWorkZipName(props.frameWorkId);
    viewExportIsLoading.value = false;
    if (res.result === true && res.data) {
      const res1 = await getExportFrameWorkZip(res.data);
      if (res1.result === true) {
        // 获取文件blob
        const blob = res1.data;
        // 创建下载链接
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = res.data; // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        // 清理
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
      }
    } else {
      toast.add({
        severity: "error",
        summary: "获取文件名失败",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "导出失败",
      life: 3000,
    });
  } finally {
    viewIsOpenDialog.value = false;
  }
};

defineExpose({
  openDialog,
});
</script>
