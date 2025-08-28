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
            v-for="(item, idx) in logList[version]"
            :key="idx"
            class="flex items-start gap-2"
          >
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
const version = "0.4.0"; // 当前版本号
const date = "2025-08-28";
const logList = {
  "0.3.0": [
    "📊 首页监控状态增加 1 小时、24 小时盈利/亏损币前五名",
    "⚡ 支持一键升级框架",
    "📈 新增数据中心状态监控时间线",
    "⏱ 资金曲线图、多空比例、多空选币支持滚动/拖拽切换时间范围",
    "🧩 支持上传择时因子",
  ],
  "0.4.0": [
    "🛠 修复问题：修复已知 bug，整体运行更加稳定",
    "📊 数据中心：新增升级功能，支持在线更新至最新版本",
    "🔑 账号功能：支持多端同时登录，使用更灵活",
    "💻 设备管理：全新设备管理页面，可查看历史登录设备，并支持一键下线",
    "📦 框架迁移：新增导出/导入功能，快速迁移框架相关数据",
    "📈 持仓数据：首页持仓支持字段排序与筛选，信息更清晰",
    "🌐 网络状态：右上角新增网络延迟显示，实时掌握连接情况",
  ],
};

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
