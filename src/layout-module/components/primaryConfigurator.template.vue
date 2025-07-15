<template>
  <!-- mobile -->
  <Button
    type="button"
    class="inline-flex sm:hidden bg-white text-gray-700 border-0 dark:bg-neutral-900 dark:text-white w-6 h-6 sm:w-8 sm:h-8 mr-1 md:mr-2"
    @click="changeDarkOrSystem"
    size="small"
    :icon="currentThemeMode === 'system' ? 'pi pi-sun' : 'pi pi-moon'"
  ></Button>
  <Button
    type="button"
    rounder
    size="small"
    @click="toggle"
    class="inline-flex sm:hidden w-6 h-6 sm:w-8 sm:h-8"
  >
    <i class="pi pi-palette text-white"></i>
  </Button>
  <!-- pc -->
  <Button
    type="button"
    class="hidden sm:inline-flex w-8 h-8 bg-white text-gray-700 dark:bg-neutral-900 dark:text-white border-1 border-gray-200 dark:border-neutral-700"
    @click="changeDarkOrSystem"
    :icon="currentThemeMode === 'system' ? 'pi pi-sun' : 'pi pi-moon'"
  ></Button>
  <Button
    type="button"
    rounder
    size="small"
    @click="toggle"
    class="hidden sm:inline-flex w-8 h-8"
  >
    <i class="pi pi-palette text-white"></i>
  </Button>
  <Popover ref="op">
    <div class="text-sm font-medium pl-2 text-primary-500">Primary</div>
    <div class="grid grid-cols-8 gap-2 p-2">
      <div
        v-for="primary in primaryList"
        :key="primary.key"
        class="flex flex-col items-center cursor-pointer group"
        @click="changePrimary(primary.key)"
      >
        <div
          :class="[
            'w-5 h-5 rounded-full group-hover:border-2 group-hover:border-gray-100  transition duration-300',
            primary.key === currentPrimary
              ? `scale-140 border-2 border-gray-200`
              : ``,
          ]"
          :style="{ background: primary.color }"
        ></div>
      </div>
    </div>
  </Popover>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { setPrimaryTheme } from "@/main";
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { themeMode } = useStorageValueOrFn();

const primaryList = [
  {
    key: "violet",
    name: "紫色",
    color: "#8B5CF6",
  },
  {
    key: "amber",
    name: "琥珀色",
    color: "#F59E0B",
  },
  // {
  //   key: "noir",
  //   name: "黑色",
  //   color: "#334155",
  // },
  {
    key: "emerald",
    name: "翡翠色",
    color: "#10b981",
  },
  {
    key: "green",
    name: "绿色",
    color: "#22c55e",
  },
  {
    key: "lime",
    name: "石灰色",
    color: "#84cc16",
  },
  {
    key: "orange",
    name: "橘色",
    color: "#f97316",
  },
  {
    key: "yellow",
    name: "黄色",
    color: "#eab308",
  },
  {
    key: "teal",
    name: "蓝绿色",
    color: "#14b8a6",
  },
  {
    key: "cyan",
    name: "青色",
    color: "#06b6d4",
  },
  {
    key: "sky",
    name: "天蓝色",
    color: "#0ea5e9",
  },
  {
    key: "blue",
    name: "蓝色",
    color: "#3b82f6",
  },
  {
    key: "indigo",
    name: "靛蓝",
    color: "#6366f1",
  },
  {
    key: "purple",
    name: "紫色",
    color: "#a855f7",
  },
  {
    key: "fuchsia",
    name: "紫红色",
    color: "#d946ef",
  },
  {
    key: "pink",
    name: "粉色",
    color: "#ec4899",
  },
  {
    key: "rose",
    name: "玫红",
    color: "#f43f5e",
  },
];
const op = ref();
const currentPrimary = ref(localStorage.getItem("theme") || "violet"); // 默认主题
const currentThemeMode = ref(themeMode.value || "system");

const toggle = (event: Event) => {
  op.value.toggle(event);
};

const changePrimary = (key: string) => {
  currentPrimary.value = key;
  localStorage.setItem("theme", key);
  setPrimaryTheme();
};

const changeDarkOrSystem = () => {
  if (currentThemeMode.value === "system") {
    currentThemeMode.value = "dark";
    document.documentElement.classList.add("dark");
  } else {
    currentThemeMode.value = "system";
    document.documentElement.classList.remove("dark");
  }
  themeMode.value = currentThemeMode.value;
};
</script>
