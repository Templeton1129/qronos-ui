<template>
  <div
    class="w-full flex-1 flex flex-col"
    :class="[
      isFullscreen === true
        ? 'w-screen h-screen fixed inset-0 z-[9999] bg-white dark:bg-neutral-900 p-4'
        : 'relative',
    ]"
  >
    <!-- 放大按钮 -->
    <div class="absolute top-2 right-2 z-10">
      <Button
        v-if="isFullscreen === false"
        icon="pi pi-window-maximize"
        text
        rounded
        severity="secondary"
        size="small"
        @click="isFullscreen = true"
        v-tooltip="'放大显示'"
      />
      <Button
        v-else
        icon="pi pi-window-minimize"
        text
        rounded
        severity="secondary"
        size="small"
        @click="isFullscreen = false"
        v-tooltip="'退出放大'"
      />
    </div>

    <v-chart
      :key="`longRatio-${chartKey}`"
      :option="longRatioOption"
      :theme="themeMode === `dark` ? `dark` : `light`"
      class="w-full flex-1"
      autoresize
    />
    <v-chart
      :key="`coinNum-${chartKey}`"
      :option="coinNumOption"
      :theme="themeMode === `dark` ? `dark` : `light`"
      class="w-full flex-1"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { themeMode } = useStorageValueOrFn();

const props = defineProps<{
  dateTime: string[];
  long: number[]; //多头比例
  short: number[]; //空头比例
  empty: number[]; //空仓比例
  long_coin_num: number[]; // 多头选币
  short_coin_num: number[]; // 空头选币
}>();

// 全屏状态
const isFullscreen = ref<boolean>(false);
// 图表重新渲染的key
const chartKey = ref<number>(0);

const longRatioOption = computed(() => ({
  backgroundColor: themeMode.value === "dark" ? "#171717" : "",
  color: ["#22c55e", "#ef4444", "#9ca3af"],
  title: {
    text: "多空比例",
    left: "center",
    textStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
    top: 8,
  },
  tooltip: {
    trigger: "axis",
    z: 1000,
    textStyle: {
      fontSize: 10,
    },
  },
  legend: {
    data: ["Long", "Short", "empty"],
    top: 30,
    textStyle: {
      fontSize: 10,
    },
  },
  grid: {
    top: 50,
    left: 40,
    right: 5,
    bottom: 20,
  },
  xAxis: {
    type: "category",
    data: props.dateTime,
    axisLabel: {
      rotate: 0,
      fontSize: 8,
    },
  },
  yAxis: {
    type: "value",
    min: 0.0,
    max: 1.0,
    name: "Ratio",
    position: "left",
    nameTextStyle: {
      fontSize: 10,
    },
  },
  series: [
    {
      name: "Long",
      type: "line",
      data: props.long,
      showSymbol: false,
      areaStyle: {
        color: "#22c55e",
        opacity: 0.6,
      },
      lineStyle: {
        color: "#22c55e",
      },
    },
    {
      name: "Short",
      type: "line",
      showSymbol: false,
      data: props.short,
      areaStyle: {
        color: "#ef4444",
        opacity: 0.6,
      },
      lineStyle: {
        color: "#ef4444",
      },
    },
    {
      name: "empty",
      type: "line",
      showSymbol: false,
      data: props.empty,
      areaStyle: {
        color: "#9ca3af",
        opacity: 0.6,
      },
      lineStyle: {
        color: "#9ca3af",
      },
    },
  ],
}));

const coinNumOption = computed(() => ({
  backgroundColor: themeMode.value === "dark" ? "#171717" : "",
  title: {
    text: "多空选币",
    left: "center",
    textStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
    top: 8,
  },
  color: ["#6bd16b", "#e57373"],
  tooltip: {
    trigger: "axis",
    z: 1000,
    textStyle: {
      fontSize: 10,
    },
  },
  legend: {
    data: ["多头选币", "空头选币"],
    top: 30,
    textStyle: {
      fontSize: 10,
    },
  },
  grid: {
    top: 50,
    left: 40,
    right: 5,
    bottom: 20,
  },
  xAxis: {
    type: "category",
    data: props.dateTime,
    axisLabel: {
      rotate: 0,
      fontSize: 8,
    },
  },
  yAxis: {
    type: "value",
    name: "数量",
    nameTextStyle: {
      fontSize: 10,
    },
  },
  series: [
    {
      name: "多头选币",
      type: "line",
      data: props.long_coin_num,
      showSymbol: false,
      lineStyle: { color: "#6bd16b" },
    },
    {
      name: "空头选币",
      type: "line",
      data: props.short_coin_num,
      showSymbol: false,
      lineStyle: { color: "#e57373" },
    },
  ],
}));

// 监听窗口大小变化
let lastHeight = window.innerHeight;
const handleResize = () => {
  const currentHeight = window.innerHeight;
  // 只监听高度变化，且变化超过10px才触发重新渲染
  if (Math.abs(currentHeight - lastHeight) > 10) {
    chartKey.value++;
    lastHeight = currentHeight;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

defineExpose({
  handleResize,
});
</script>
