<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    :modal="true"
    :closable="false"
    :draggable="false"
    :show-header="false"
    class="max-w-[90vw] min-w-[40vw]"
    :pt="{
      content: {
        class: 'pt-5',
      },
    }"
  >
    <div class="space-y-4 sm:space-y-6 px-2 py-1">
      <div class="flex items-center gap-2">
        <i class="pi pi-gift text-primary-600 text-2xl"></i>
        <span class="font-bold text-xl text-primary-600"
          >公测版本 {{ version }}</span
        >
        <span class="ml-auto text-xs text-gray-400">{{ date }}</span>
      </div>
      <div class="bg-primary-50 dark:bg-neutral-800 rounded px-4 py-3">
        <div
          class="font-semibold text-base text-primary-600 dark:text-primary-300 mb-3"
        >
          本次更新内容：
        </div>
        <ul class="space-y-3">
          <li
            v-for="(item, idx) in logList"
            :key="idx"
            class="flex items-start gap-2"
          >
            <i class="pi pi-check-circle text-green-500 mt-0.5"></i>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <Button label="已阅" @click="closeDialog" autofocus class="w-full" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const version = "0.3.0"; // 当前版本号
const date = "2025-07-22";
const logList = [
  "首页监控状态增加1小时，24小时盈利/亏损币前五名",
  "支持一键升级框架",
  "新增数据中心状态监控时间线",
  "资金曲线图、多空比例、多空选币支持滚动/拖拽切换时间范围",
  "支持上传择时因子",
];

const viewIsOpenDialog = ref(false);

onMounted(() => {
  const lastReadVersion = localStorage.getItem("lastReadVersion");
  if (lastReadVersion !== version) {
    viewIsOpenDialog.value = true;
  }
});

const closeDialog = () => {
  viewIsOpenDialog.value = false;
  localStorage.setItem("lastReadVersion", version);
};
</script>
