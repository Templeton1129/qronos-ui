<template>
  <!-- 跑马灯组件 -->
  <Tag
    class="w-full max-w-6xl overflow-hidden whitespace-nowrap rounded-none border-l-4 border-amber-500 bg-amber-50/80 py-2 px-0 shadow-sm dark:bg-surface-800 dark:border-amber-400"
  >
    <div class="animate-marquee pl-[100%] flex items-center gap-2">
      <i class="pi pi-info-circle text-amber-600 dark:text-amber-300"></i>
      <div class="text-amber-900 font-medium tracking-wide dark:text-amber-100">
        {{ content }}
      </div>
      <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
    </div>
  </Tag>
</template>

<script lang="ts" setup>
const props = defineProps<{
  content: string;
}>();
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-80%);
  }
}
.animate-marquee {
  animation: marquee 14s linear infinite;
  animation-delay: 1s;
  cursor: pointer;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

.dark .pi {
  filter: brightness(1.2);
}
</style>
