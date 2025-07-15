<template>
  <teleport to="body" :disabled="isFullscreen === false">
    <div
      class="w-full flex-1"
      :class="[
        isFullscreen === true
          ? 'w-screen h-screen fixed inset-0 z-[9999] bg-white dark:bg-neutral-900 p-4'
          : 'relative flex',
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
        :key="chartKey"
        :option="option"
        :theme="themeMode === `dark` ? `dark` : `light`"
        class="w-full flex-1"
        autoresize
      />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { themeMode } = useStorageValueOrFn();

const props = defineProps<{
  equity: number[];
  dateTime: string[];
  dd2here: number[];
  sub_stg_eqs: {
    [key: string]: { candle_begin_time: string[]; net: number[] };
  };
}>();

// 全屏状态
const isFullscreen = ref<boolean>(false);
// 图表重新渲染的key
const chartKey = ref<number>(0);

const subStgDataTime = ref<string[]>([]);

watch(
  props.sub_stg_eqs,
  (newVal) => {
    if (Object.keys(newVal).length > 0) {
      subStgDataTime.value =
        newVal[Object.keys(newVal)[0]]?.candle_begin_time || [];
      // 将数据中的T去除
      subStgDataTime.value = subStgDataTime.value.map((item) =>
        item.replace("T", " ")
      );
    }
  },
  { immediate: true }
);

const getSubStgOption = () => {
  const output = [];
  if (Object.keys(props.sub_stg_eqs).length > 0) {
    let tempObj = {
      name: "",
      type: "line",
      data: [] as number[],
      xAxisIndex: 1,
      yAxisIndex: 0,
      showSymbol: false,
    };

    for (const key in props.sub_stg_eqs) {
      tempObj.name = key;
      tempObj.data = props.sub_stg_eqs[key].net;
      output.push({ ...tempObj });
    }
  }
  return output;
};
const option = computed(() => {
  return {
    backgroundColor: themeMode.value === "dark" ? "#171717" : "",
    // "#6baed6", "#bdbdbd",
    color: ["#f5a623", "#bbbbbb"],
    title: {
      text: "策略净值曲线图",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
      },
      top: 12,
    },
    tooltip: {
      trigger: "axis",
      z: 1000,
      textStyle: {
        fontSize: 10,
      },
    },
    legend: {
      // "S1-多头后面过滤+空头后面过滤", "S2-多头+空头后面过滤"
      data: ["Equity", "dd2here", ...Object.keys(props.sub_stg_eqs)],
      textStyle: {
        fontSize: 10,
      },
      top: 35,
    },
    grid: {
      top: 125,
      left: 41,
      right: 45,
      bottom: 20,
    },
    xAxis: [
      {
        type: "category",
        data: props.dateTime,
        axisLabel: {
          rotate: 0,
          fontSize: 8,
        },
      },
      {
        type: "category",
        data: subStgDataTime.value,
        axisLabel: {
          rotate: 0,
          fontSize: 8,
        },
        show: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Equity(%)",

        position: "left",
        axisLabel: {
          formatter: "{value}%",
        },
      },
      {
        type: "value",
        name: "dd2here(%)",
        position: "right",
        axisLabel: {
          formatter: "{value}%",
        },
        show: true,
      },
    ],
    series: [
      {
        name: "Equity",
        type: "line",
        data: props.equity,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: { color: "#f5a623", width: 2 },
        markPoint: {
          symbol: "circle", // 明确指定标记形状
          symbolSize: 8, // 调整标记大小
          label: {
            show: true, // 确保标签显示
            formatter: "{b}: {c}%",
            position: "top",
            color: "#f5a623", // 标签文字颜色
          },
          itemStyle: { color: "#f5a623" },
          data: [
            {
              type: "max",
              name: "Max",
            },
            {
              type: "min",
              name: "Min",
            },
          ],
        },
      },
      {
        name: "dd2here",
        type: "line",
        data: props.dd2here,
        areaStyle: {
          color: "#bbbbbb",
          opacity: 0.3,
        },
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { color: "#bbbbbb", width: 2, opacity: 0.3 },
        opacity: 0.5,
        markPoint: {},
      },
      ...getSubStgOption(),
    ],
  };
});

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
