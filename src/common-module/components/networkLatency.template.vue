<template>
  <div
    class="fixed top-12 right-1 sm:top-2 sm:right-4 bg-white opacity-80 dark:bg-neutral-600 px-2 py-1 rounded-full shadow-md z-2000 flex items-center gap-1 border border-gray-200 dark:border-neutral-700 cursor-default"
  >
    <div class="w-2 h-2 rounded-full" :class="latencyBgColorClass"></div>
    <span class="text-xs" :class="latencyTextColorClass"
      >{{ networkStore.latency }}ms</span
    >
  </div>
</template>

<script setup lang="ts">
import { useNetworkStore } from "@/store/network";
import { computed } from "vue";

const networkStore = useNetworkStore();

// 根据延迟时间计算显示颜色
const latencyBgColorClass = computed(() => {
  const latency = networkStore.latency;
  if (latency < 100) return "bg-green-500";
  if (latency < 300) return "bg-yellow-500";
  return "bg-red-500";
});

const latencyTextColorClass = computed(() => {
  const latency = networkStore.latency;
  if (latency < 100) return "text-green-500";
  if (latency < 300) return "text-yellow-500";
  return "text-red-500";
});
</script>
