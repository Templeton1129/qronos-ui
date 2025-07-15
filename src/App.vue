<template>
  <Toast
    :pt="{
      root: {
        class: 'w-[90vw] md:w-auto md:max-w-md',
      },
      message: {
        class: 'text-sm md:text-base',
      },
      closeButton: {
        class: '!hidden md:!block',
      },
    }"
  />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();
// 全局错误 toast 监听
const handleGlobalError = (e: any) => {
  toast.add({
    severity: "error",
    summary: e.detail,
    life: 3000,
  });
};

// 全局导航事件监听（来自 http.provider 等服务模块） 解决在纯js文件使用不了route.push的问题！
const handleGlobalNavigate = (e: any) => {
  const path = e.detail;
  if (path && typeof path === "string") {
    router.push(path);
  }
};

onMounted(() => {
  window.addEventListener("global-error-toast", handleGlobalError);
  window.addEventListener("global-navigate", handleGlobalNavigate);
});

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener("global-error-toast", handleGlobalError);
  window.removeEventListener("global-navigate", handleGlobalNavigate);
});
</script>
