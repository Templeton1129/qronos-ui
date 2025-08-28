<template>
  <div class="w-full space-y-6">
    <!-- 时间线头部 -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
    >
      <span class="text-gray-600 dark:text-gray-300 font-semibold">
        数据更新状态时间线
      </span>
      <div class="flex items-center gap-2">
        <Button
          icon="pi pi-refresh"
          label="刷新"
          size="small"
          variant="outlined"
          @click="getDateCenterUpdateStatusListFn()"
          :loading="viewIsLoading"
        />
        <Select
          v-model="viewSelectedTimeRange"
          :options="timeRangeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="时间范围"
          size="small"
          @change="getDateCenterUpdateStatusListFn()"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-3">
      <!-- 骨架屏 -->
      <div v-if="viewIsLoading === true" class="space-y-3">
        <div v-for="i in pageSize" :key="i" class="flex flex-col gap-y-2">
          <Skeleton width="30%" height="18px" />
          <Skeleton width="100%" height="50px" borderRadius="8px" />
        </div>
      </div>
      <!-- 时间线内容 -->
      <Timeline
        v-else-if="viewIsLoading === false && viewTimelineData.length > 0"
        :value="currentPageData"
        :pt="{
          eventOpposite: {
            class: 'hidden',
          },
          eventContent: {
            class: 'pr-0',
          },
        }"
      >
        <template #content="slotProps">
          <div class="flex flex-col gap-y-2 pb-3">
            <div class="text-xs flex items-center gap-2">
              <div>
                <span class="text-gray-500 dark:text-neutral-400"
                  >开始时间：</span
                ><span class="font-mono font-semibold">
                  {{ slotProps.item.start_time }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-neutral-400"
                  >结束时间：</span
                ><span class="font-mono font-semibold">{{
                  slotProps.item.end_time
                }}</span>
              </div>
              <Message
                v-if="hasStartupOperation(slotProps.item.operations)"
                severity="success"
                :pt="{
                  text: {
                    class: 'text-xs font-semibold',
                  },
                  content: {
                    class: 'px-1.5 py-0.5',
                  },
                }"
              >
                启动
              </Message>
            </div>
            <div
              class="px-3 py-2 bg-white dark:bg-neutral-900 rounded-md shadow-xs border border-gray-200 dark:border-neutral-700 flex flex-col"
            >
              <div class="flex flex-col gap-y-2">
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 sm:gap-y-0"
                >
                  <div class="flex items-center text-xs gap-1">
                    <span class="text-primary-500 font-semibold text-sm">{{
                      getOffsetTime(slotProps.item.runtime)
                    }}</span>
                    <span class="text-xs">分钟偏移 </span>
                    <span>有{{ slotProps.item.operation_count }}个操作</span>
                  </div>
                </div>
                <Timeline
                  :value="
                    getDisplayOperations(
                      slotProps.item.operations,
                      slotProps.item.id
                    )
                  "
                  :pt="{
                    root: { class: 'pl-2' },
                    eventOpposite: { class: 'hidden' },
                    event: { class: 'min-h-2' },
                    eventContent: { class: 'pr-0 ' },
                  }"
                >
                  <template #marker="opProps">
                    <span
                      class="w-2 h-2 rounded-full block mt-2"
                      :class="getOperationStatusColor(opProps.item.status)"
                    ></span>
                  </template>
                  <template #content="opProps">
                    <div class="flex flex-col gap-1 pb-2">
                      <div class="flex items-center justify-between gap-1">
                        <span
                          class="text-xs text-gray-500 dark:text-neutral-400 font-semibold font-mono"
                          >{{
                            dayjs(
                              opProps.item.timestamp
                                .replace(" ", "T")
                                .replace(" ", "")
                            ).format("YYYY-MM-DD HH:mm:ss") || "--"
                          }}</span
                        >
                        <div class="flex items-center gap-1">
                          <Tag
                            class="tetx-xs font-medium flex-shrink-0"
                            size="small"
                            severity="secondary"
                            :value="dataCenterOperationTypeEnum[opProps.item.operation_type as keyof typeof dataCenterOperationTypeEnum]"
                            :pt="{ label: { class: 'text-xs' } }"
                          />
                          <Tag
                            class="tetx-xs font-medium flex-shrink-0"
                            size="small"
                            :severity="
                              getOperationStatusSeverity(opProps.item.status)
                            "
                            :value="dateCenterOperationStatusEnum[opProps.item.status as keyof typeof dateCenterOperationStatusEnum]"
                            :pt="{ label: { class: 'text-xs' } }"
                          />
                        </div>
                      </div>
                      <div
                        class="text-xs text-gray-700 dark:text-gray-300 break-all pl-1"
                      >
                        {{ opProps.item.description }}
                      </div>
                    </div>
                  </template>
                </Timeline>
              </div>
              <div
                v-if="slotProps.item.operations.length > 3"
                class="flex justify-end"
              >
                <Button
                  text
                  size="small"
                  severity="secondary"
                  class="text-xs p-1"
                  :label="expandedMap[slotProps.item.id] ? '收起' : '展开全部'"
                  @click="toggleExpand(slotProps.item.id)"
                />
              </div>
            </div>
          </div>
        </template>
      </Timeline>

      <div v-else-if="viewIsLoading === false && viewTimelineData.length === 0">
        <div class="flex flex-col items-center justify-center gap-y-2">
          <img src="@/assets/home-img/no-data.png" class="w-40 h-auto" />
          <div class="text-gray-500 dark:text-neutral-400">暂无数据</div>
        </div>
      </div>

      <!-- 分页控件 -->
      <Paginator
        v-if="viewIsLoading === false && viewTimelineData.length > 0"
        v-model:first="firstPageIndex"
        :rows="pageSize"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :rowsPerPage="pageSize"
        @page="pageChange"
        :pt="{
          root: {
            class: 'p-0',
          },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import dayjs from "dayjs";
import {
  dateCenterOperationStatusEnum,
  dataCenterOperationTypeEnum,
  getDateCenterUpdateStatusList,
} from "@/common-module/services/service.provider";

const props = defineProps<{
  autoRefresh: boolean;
  refreshInterval: number;
}>();

const viewFrameworkId = ref<string>("");
const viewIsLoading = ref(false);
const viewTimelineData = ref<tDbDataCenterUpdateStatusRes[]>([]);
const firstPageIndex = ref(0);
const pageSize = ref(5);

const viewSelectedTimeRange = ref<number>(24);
const timeRangeOptions = [
  { label: "最近6小时", value: 6 },
  { label: "最近12小时", value: 12 },
  { label: "最近24小时", value: 24 },
];
// 展开状态，key为timeline的索引
const expandedMap = ref<Record<string, boolean>>({});
// 自动刷新定时器
let refreshTimer: ReturnType<typeof setInterval> | null = null;

const toggleExpand = (id: string) => {
  expandedMap.value[id] = !expandedMap.value[id];
};

const getDisplayOperations = (operations: any[], id: string) => {
  if (expandedMap.value[id]) return operations;
  return operations.slice(0, 3);
};

const getDateCenterUpdateStatusListFn = async (frameworkId?: string) => {
  if (frameworkId) {
    viewFrameworkId.value = frameworkId;
  }
  viewIsLoading.value = true;
  try {
    const res = await getDateCenterUpdateStatusList(
      viewFrameworkId.value,
      Number(viewSelectedTimeRange.value)
    );
    if (res.result === true) {
      viewTimelineData.value = res.data;
    }
  } catch (error) {
    console.error("获取数据中心更新状态列表失败:", error);
  } finally {
    viewIsLoading.value = false;
  }
};

const getOffsetTime = (runtime: string): string => {
  let minutes = new Date(runtime).getMinutes();
  return `${minutes}m`;
};

const getOperationStatusSeverity = (status: string): string => {
  switch (status) {
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "failed":
      return "danger";
    case "skipped":
      return "warn";
    case "unknown":
      return "secondary";
    default:
      return "secondary";
  }
};

const getOperationStatusColor = (status: string): string => {
  switch (status) {
    case "in_progress":
      return "bg-primary-400";
    case "completed":
      return "bg-green-400";
    case "failed":
      return "bg-red-400";
    case "skipped":
      return "bg-yellow-400";
    case "unknown":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const hasStartupOperation = (operations: any[]) => {
  if (operations && operations.length > 0) {
    const firstOp = operations[0];
    return (
      firstOp.description &&
      firstOp.description.startsWith("==================")
    );
  }
  return false;
};

const totalRecords = computed(() => viewTimelineData.value.length);

const currentPageData = computed(() => {
  const start = firstPageIndex.value;
  const end = start + pageSize.value;
  return viewTimelineData.value.slice(start, end);
});

const pageChange = (event: any) => {
  firstPageIndex.value = event.first;
  pageSize.value = event.rows;
};

const startAutoRefresh = () => {
  clearAutoRefreshTimer();
  if (props.autoRefresh && props.refreshInterval && props.refreshInterval > 0) {
    refreshTimer = setInterval(
      getDateCenterUpdateStatusListFn,
      props.refreshInterval
    );
  }
};

const clearAutoRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

// 监听props变化
watch(
  () => props.autoRefresh,
  (newVal) => {
    if (newVal) {
      startAutoRefresh();
    } else {
      clearAutoRefreshTimer();
    }
  }
);

// 组件卸载时清理定时器
onUnmounted(() => {
  clearAutoRefreshTimer();
});

onBeforeRouteLeave(() => {
  clearAutoRefreshTimer();
});

// 暴露方法给父组件
defineExpose({
  getDateCenterUpdateStatusListFn,
  startAutoRefresh,
});
</script>

<style scoped></style>
