<template>
  <Card
    class="hidden sm:flex flex-2"
    :pt="{
      body: {
        class: 'px-4 py-3',
      },
    }"
    :class="[
      viewIsFullscreen === true
        ? 'w-screen h-screen fixed inset-0 z-50 bg-white dark:bg-neutral-900 p-4 flex flex-col rounded-none'
        : '',
    ]"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-scatter"></i>
          <span class="text-lg font-bold">策略中心</span>
        </div>
        <Button
          v-if="viewIsFullscreen === false"
          icon="pi pi-window-maximize"
          text
          rounded
          severity="secondary"
          size="small"
          @click="() => (viewIsFullscreen = true)"
          v-tooltip="'全屏显示'"
        />
        <Button
          v-else
          icon="pi pi-window-minimize"
          text
          rounded
          severity="secondary"
          size="small"
          @click="() => (viewIsFullscreen = false)"
          v-tooltip="'退出全屏'"
        />
      </div>
    </template>
    <template #content>
      <template v-if="viewIsLoading">
        <div class="flex flex-col gap-3 pr-4">
          <div
            v-for="i in 2"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="flex flex-col gap-1 pl-2">
              <Skeleton width="120px" height="20px" />
              <Skeleton width="80px" height="14px" />
            </div>
            <div class="flex items-center gap-2">
              <Skeleton shape="circle" width="32px" height="32px" />
              <Skeleton shape="circle" width="32px" height="32px" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-if="viewFrameWorkInfoList && viewFrameWorkInfoList.length > 0"
          class="flex flex-col gap-2 pr-4"
          :class="[
            viewIsFullscreen === false ? 'max-h-[108px] overflow-y-auto' : '',
          ]"
        >
          <div
            v-for="(item, index) of viewFrameWorkInfoList"
            :key="index"
            class="flex items-center justify-between"
          >
            <div class="flex flex-col gap-1 pl-2">
              <div class="text-sm flex items-center gap-1">
                <span
                  class="relative flex h-3 w-3 items-center justify-center"
                  v-if="item.status === dataCenterStatusEnum.start"
                >
                  <span
                    class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-500 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
                  ></span>
                </span>

                <span v-else class="rounded-full h-2 w-2 bg-gray-300"></span>
                <span>{{ item.framework_name }}</span>
              </div>
              <div class="text-xs flex gap-2">
                <div class="flex items-center gap-2">
                  <span>内存占用:</span>
                  <Tag class="text-xs font-medium">
                    {{ item?.mem_usage || "_" }}
                  </Tag>
                </div>
                <div class="flex items-center gap-2">
                  <span>cpu占用:</span>
                  <Tag class="text-xs font-medium">
                    {{ item?.cpu_usage || "_" }}
                  </Tag>
                </div>
                <div class="flex items-center gap-2">
                  <span>启动时间:</span>
                  <Tag class="text-xs font-medium">
                    {{
                      item?.pm_uptime
                        ? new Date(item?.pm_uptime).toLocaleString()
                        : "_"
                    }}
                  </Tag>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-cog"
                text
                rounded
                size="small"
                @click="goToFrameWorkPage(item.id)"
              />
              <Button
                v-if="item.status === dataCenterStatusEnum.stop"
                @click="
                  operateDataCenter(
                    item.framework_id,
                    dataCenterStatusEnum.start
                  )
                "
                icon="pi pi-caret-right"
                rounded
                raised
                v-tooltip="'启动'"
                :disabled="viewIsLoading"
                size="small"
                class="hover:scale-105 transition-transform duration-300"
              />
              <Button
                v-if="item.status === dataCenterStatusEnum.start"
                @click="
                  operateDataCenter(
                    item.framework_id,
                    dataCenterStatusEnum.stop
                  )
                "
                icon="pi pi-stop-circle"
                icon-class="text-red-500"
                rounded
                raised
                v-tooltip="'停止'"
                :disabled="viewIsLoading"
                size="small"
                class="hover:scale-105 transition-transform duration-300 bg-white dark:bg-neutral-700 border-1 border-neutral-300 dark:border-neutral-600"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-sm flex items-center">
            <span>您目前暂无框架，请先</span>
            <Button
              size="small"
              variant="outlined"
              text
              class="p-1 text-sm"
              label="新增框架"
              @click="goToFrameWorkPage()"
            >
            </Button>
            ！
          </div>
        </div>
      </template>
    </template>
  </Card>
  <Card class="sm:hidden flex-1">
    <template #content>
      <div
        class="font-bold text-center flex items-center justify-center gap-2"
        @click="() => (viewIsOpenDialog = true)"
      >
        <i class="pi pi-chart-scatter"></i>
        <span>策略中心控制</span>
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    header="策略中心控制"
    modal
    class="hidden sm:block w-[90vw] sm:w-[600px] max-w-full"
  >
    <template #default>
      <template v-if="viewIsLoading">
        <div class="flex flex-col gap-3 pr-4">
          <div
            v-for="i in 2"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="flex flex-col gap-1 pl-2">
              <Skeleton width="120px" height="20px" />
              <Skeleton width="80px" height="14px" />
            </div>
            <div class="flex items-center gap-2">
              <Skeleton shape="circle" width="32px" height="32px" />
              <Skeleton shape="circle" width="32px" height="32px" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-if="viewFrameWorkInfoList && viewFrameWorkInfoList.length > 0"
          class="flex flex-col gap-2 pr-4"
        >
          <div
            v-for="(item, index) of viewFrameWorkInfoList"
            :key="index"
            class="flex items-center justify-between"
          >
            <div class="flex flex-col gap-2 pl-2">
              <div class="text-sm flex items-center gap-1">
                <span
                  class="relative flex h-3 w-3 items-center justify-center"
                  v-if="item.status === dataCenterStatusEnum.start"
                >
                  <span
                    class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-500 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
                  ></span>
                </span>

                <span v-else class="rounded-full h-2 w-2 bg-gray-300"></span>

                <span>{{ item.framework_name }}</span>
              </div>
              <div class="text-xs flex gap-2 flex-wrap pl-3">
                <div class="flex items-center">
                  <span class="w-16">内存占用:</span>
                  <Tag class="text-xs font-medium">
                    {{ item?.mem_usage || "_" }}
                  </Tag>
                </div>
                <div class="flex items-center">
                  <span class="w-16">cpu占用:</span>
                  <Tag class="text-xs font-medium">
                    {{ item?.cpu_usage || "_" }}
                  </Tag>
                </div>
                <div class="flex items-center">
                  <span class="w-16">启动时间:</span>
                  <Tag class="text-xs font-medium">
                    {{
                      item?.pm_uptime
                        ? new Date(item?.pm_uptime).toLocaleString()
                        : "_"
                    }}
                  </Tag>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-cog"
                text
                rounded
                size="small"
                @click="goToFrameWorkPage(item.id)"
              />
              <Button
                v-if="item.status === dataCenterStatusEnum.stop"
                @click="
                  operateDataCenter(
                    item.framework_id,
                    dataCenterStatusEnum.start
                  )
                "
                icon="pi pi-caret-right"
                rounded
                raised
                v-tooltip="'启动'"
                :disabled="viewIsLoading"
                size="small"
                class="hover:scale-105 transition-transform duration-300"
              />
              <Button
                v-if="item.status === dataCenterStatusEnum.start"
                @click="
                  operateDataCenter(
                    item.framework_id,
                    dataCenterStatusEnum.stop
                  )
                "
                icon="pi pi-stop-circle"
                icon-class="text-red-500"
                rounded
                raised
                v-tooltip="'停止'"
                :disabled="viewIsLoading"
                size="small"
                class="hover:scale-105 transition-transform duration-300 bg-white dark:bg-neutral-700 border-0"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-sm flex items-center">
            <span>您目前暂无框架，请先</span>
            <Button
              size="small"
              variant="outlined"
              text
              class="p-1 text-sm"
              label="新增框架"
              @click="goToFrameWorkPage()"
            >
            </Button>
            ！
          </div>
        </div>
      </template>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  dataCenterStatusEnum,
  getFrameWorkRunStatus,
  framwWorkRunStatusEnum,
  getAccountInfo,
  startOrStopFrameWork,
} from "@/common-module/services/service.provider";
import { useRouter } from "vue-router";
const router = useRouter();
const viewIsFullscreen = ref<boolean | null>(false);
const viewIsOpenDialog = ref<boolean>(false);
const viewIsLoading = ref<boolean>(true);
const viewRunStatuslList = ref<tDbFrameWorkRunStatusRes[]>([]);

const props = defineProps<{
  downloadIsLoading: boolean;
  frameWorkList: tDbFrameWorkStatusRes[];
}>();

import { useToast } from "primevue/usetoast";
const toast = useToast();

const frameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const viewFrameWorkInfoList = ref<
  (tDbFrameWorkStatusRes & {
    status?: string;
    pm_uptime?: number | null;
    cpu_usage?: string | null;
    mem_usage?: string | null;
  })[]
>([]);

onMounted(async () => {
  // 等待 props.frameWorkList 有数据后再开始轮询
  if (props.frameWorkList && props.frameWorkList.length > 0) {
    startFrameWorkRunStatusTimer();
  }
});

// 监听 props.frameWorkList 的变化
watch(
  () => props.frameWorkList,
  (newVal: tDbFrameWorkStatusRes[]) => {
    if (newVal && newVal.length > 0) {
      startFrameWorkRunStatusTimer();
    }
  },
  { immediate: true }
);

const getRunStatus = (framework_id: string) => {
  let runStatusItem = viewRunStatuslList.value.find(
    (item) => item.framework_id === framework_id
  );
  return runStatusItem?.status === framwWorkRunStatusEnum.online
    ? dataCenterStatusEnum.start
    : dataCenterStatusEnum.stop;
};

const startFrameWorkRunStatusTimer = () => {
  clearFrameWorkRunStatusTimer();
  executeRunStatusCheck();
};

const executeRunStatusCheck = async () => {
  viewIsLoading.value = true;
  viewFrameWorkInfoList.value = JSON.parse(JSON.stringify(props.frameWorkList));
  try {
    const res = await getFrameWorkRunStatus();
    if (res.result === true && res.data && res.data.length > 0) {
      viewRunStatuslList.value = res.data;

      let isIngStatus = false;
      for (let item of res.data) {
        if (
          item.status === framwWorkRunStatusEnum.starting ||
          item.status === framwWorkRunStatusEnum.stopping ||
          item.status === framwWorkRunStatusEnum.restarting
        ) {
          isIngStatus = true;
          break;
        }
      }

      if (isIngStatus === false) {
        viewIsLoading.value = false;
        // 数据合并
        for (let item of viewFrameWorkInfoList.value) {
          item.status = getRunStatus(item.framework_id);
          const runStatusItem = res.data.find(
            (runItem) => runItem.framework_id === item.framework_id
          );
          item.pm_uptime = runStatusItem?.pm_uptime || null;
          item.cpu_usage = runStatusItem?.cpu_usage || null;
          item.mem_usage = runStatusItem?.mem_usage || null;
        }
        return;
      }
    } else {
      viewIsLoading.value = false;
      // 数据合并
      for (let item of viewFrameWorkInfoList.value) {
        item.status = getRunStatus(item.framework_id);
        const runStatusItem = res.data.find(
          (runItem) => runItem.framework_id === item.framework_id
        );
        item.pm_uptime = runStatusItem?.pm_uptime || null;
        item.cpu_usage = runStatusItem?.cpu_usage || null;
        item.mem_usage = runStatusItem?.mem_usage || null;
      }
      return;
    }
  } catch (error) {
    return;
  }
  frameWorkStatusTimer.value = setTimeout(() => {
    executeRunStatusCheck();
  }, 1000);
};

const clearFrameWorkRunStatusTimer = () => {
  if (frameWorkStatusTimer.value) {
    clearTimeout(frameWorkStatusTimer.value);
    frameWorkStatusTimer.value = null;
  }
};

const operateDataCenter = async (
  frameWorkId: string,
  status: dataCenterStatusEnum
) => {
  // 启动前判断是否已配置
  if (status === dataCenterStatusEnum.start) {
    const accountRes = await getAccountInfo(frameWorkId);
    if (
      !accountRes.result ||
      accountRes.data == null ||
      accountRes.data.length == 0
    ) {
      toast.add({
        severity: "warn",
        summary: "请先增加账户,导入策略,完成配置!",
        life: 3000,
      });
      return;
    }
  }

  const res = await startOrStopFrameWork({
    framework_id: frameWorkId,
    type: status,
  });
  if (res.result) {
    toast.add({ severity: "success", summary: "操作成功", life: 2000 });
    startFrameWorkRunStatusTimer();
  } else {
    toast.add({
      severity: "error",
      summary: "操作失败",
      detail: res.msg,
      life: 3000,
    });
  }
};

const goToFrameWorkPage = (id: number = 0) => {
  router.push({
    path: `/strategyCenter/${id}`,
  });
};
</script>
