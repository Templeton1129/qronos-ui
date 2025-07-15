<template>
  <Card
    class="hidden sm:flex flex-1"
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
          <i class="pi pi-database"></i>
          <span class="text-lg font-bold">数据中心</span>
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
      <template v-if="downloadIsLoading">
        <!-- 骨架屏内容 -->
        <div class="flex gap-6 items-center">
          <Skeleton shape="circle" width="5rem" height="5rem" class="mr-4" />
          <div class="flex flex-col gap-2">
            <Skeleton width="8rem" height="1.5rem" />
            <Skeleton width="6rem" height="1.5rem" />
            <Skeleton width="10rem" height="1.5rem" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex gap-2 lg:gap-4 items-center">
          <Button
            v-if="currentDataCenterStatus === dataCenterStatusEnum.stop"
            class="w-20 h-20 hover:scale-105 transition-transform duration-300 flex-shrink-0"
            @click="operateDataCenter(dataCenterStatusEnum.start)"
            icon="pi pi-caret-right"
            iconClass="text-3xl"
            rounded
            raised
            severity="success"
            v-tooltip="'启动数据中心'"
            :disabled="viewStatusIsProcessing"
          />
          <Button
            v-if="currentDataCenterStatus === dataCenterStatusEnum.start"
            class="w-20 h-20 hover:scale-105 transition-transform duration-300 flex-shrink-0"
            @click="operateDataCenter(dataCenterStatusEnum.stop)"
            icon="pi pi-stop-circle"
            iconClass="text-3xl"
            rounded
            raised
            severity="danger"
            v-tooltip="'停止数据中心'"
            :disabled="viewStatusIsProcessing"
          />
          <div class="text-xs flex flex-col gap-1">
            <div class="text-sm font-bold">{{ frameWorkName }}</div>
            <div class="flex items-center">
              <span class="w-16 text-left">内存占用:</span>
              <Tag class="text-xs font-medium">
                {{ viewDataCenterInfo?.mem_usage || "_" }}
              </Tag>
            </div>
            <div class="flex items-center">
              <span class="w-16 text-left">cpu占用:</span>
              <Tag class="text-xs font-medium">
                {{ viewDataCenterInfo?.cpu_usage || "_" }}
              </Tag>
            </div>
            <div class="flex items-center">
              <span class="w-16 text-left">启动时间:</span>
              <Tag class="text-xs font-medium">
                {{
                  viewDataCenterInfo?.pm_uptime
                    ? new Date(viewDataCenterInfo?.pm_uptime).toLocaleString()
                    : "_"
                }}
              </Tag>
            </div>
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
        <i class="pi pi-database"></i>
        <span>数据中心控制</span>
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    header="数据中心控制"
    modal
    class="hidden sm:block w-[90vw] sm:w-[600px] max-w-full"
  >
    <template #default>
      <template v-if="downloadIsLoading">
        <div class="flex gap-6 items-center">
          <Skeleton shape="circle" width="5rem" height="5rem" class="mr-4" />
          <div class="flex flex-col gap-2">
            <Skeleton width="8rem" height="1.5rem" />
            <Skeleton width="6rem" height="1.5rem" />
            <Skeleton width="10rem" height="1.5rem" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-6">
          <div class="flex justify-center">
            <Button
              v-if="currentDataCenterStatus === dataCenterStatusEnum.stop"
              class="w-20 h-20 hover:scale-105 transition-transform duration-300"
              @click="operateDataCenter(dataCenterStatusEnum.start)"
              icon="pi pi-caret-right"
              iconClass="text-3xl"
              rounded
              raised
              severity="success"
              v-tooltip="'启动数据中心'"
              :disabled="viewStatusIsProcessing"
            />
            <Button
              v-if="currentDataCenterStatus === dataCenterStatusEnum.start"
              class="w-20 h-20 hover:scale-105 transition-transform duration-300"
              @click="operateDataCenter(dataCenterStatusEnum.stop)"
              icon="pi pi-stop-circle"
              iconClass="text-3xl"
              rounded
              raised
              severity="danger"
              v-tooltip="'停止数据中心'"
              :disabled="viewStatusIsProcessing"
            />
          </div>
          <div class="text-xs flex flex-col gap-2 items-center">
            <div class="text-sm font-bold">{{ frameWorkName }}</div>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-16 text-left">内存占用:</span>
                <Tag class="text-xs font-medium">
                  {{ viewDataCenterInfo?.mem_usage || "_" }}
                </Tag>
              </div>
              <div class="flex items-center">
                <span class="w-16 text-left">cpu占用:</span>
                <Tag class="text-xs font-medium">
                  {{ viewDataCenterInfo?.cpu_usage || "_" }}
                </Tag>
              </div>
              <div class="flex items-center">
                <span class="w-16 text-left">启动时间:</span>
                <Tag class="text-xs font-medium">
                  {{
                    viewDataCenterInfo?.pm_uptime
                      ? new Date(viewDataCenterInfo?.pm_uptime).toLocaleString()
                      : "_"
                  }}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import {
  dataCenterStatusEnum,
  getFrameWorkRunStatus,
  framwWorkRunStatusEnum,
  startOrStopFrameWork,
} from "@/common-module/services/service.provider";
import { Message } from "primevue";
const props = defineProps<{
  currentNewFrameWorkId: string;
  frameWorkName: string;
  downloadIsLoading: boolean;
}>();

const viewIsFullscreen = ref<boolean | null>(false);
const currentDataCenterStatus = ref<string>(dataCenterStatusEnum.stop);

const viewStatusIsProcessing = ref<boolean>(false);
const frameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const viewCurrentLogPm = ref<tDbFrameWorkRunStatusRes[]>([]);

const viewIsOpenDialog = ref<boolean>(false);
const viewDataCenterInfo = ref<tDbFrameWorkRunStatusRes | null>(null);

const startFrameWorkRunStatusTimer = () => {
  clearFrameWorkRunStatusTimer(); // 先清除可能存在的旧定时器
  pollFrameWorkRunStatus(); // 立即开始轮询
};

const pollFrameWorkRunStatus = async () => {
  viewStatusIsProcessing.value = true;
  try {
    const res = await getFrameWorkRunStatus();
    if (res.result === true && res.data && res.data.length > 0) {
      viewCurrentLogPm.value = res.data;
      const temp = res.data.find(
        (item) => item.framework_id === props.currentNewFrameWorkId
      );

      if (temp) {
        if (
          temp.status === framwWorkRunStatusEnum.online ||
          temp.status === framwWorkRunStatusEnum.stopped ||
          temp.status === framwWorkRunStatusEnum.errored
        ) {
          // 符合停止条件
          viewStatusIsProcessing.value = false;
          viewDataCenterInfo.value = temp;
          currentDataCenterStatus.value =
            temp.status === framwWorkRunStatusEnum.online
              ? dataCenterStatusEnum.start
              : dataCenterStatusEnum.stop;
          return; // 停止轮询
        }
      } else {
        // 未找到对应框架
        viewStatusIsProcessing.value = false;
        return; // 停止轮询
      }
    } else {
      // 数据无效
      viewStatusIsProcessing.value = false;
      return; // 停止轮询
    }
  } catch (error) {
    viewStatusIsProcessing.value = false;
    return;
  }

  // 继续轮询
  frameWorkStatusTimer.value = setTimeout(pollFrameWorkRunStatus, 1000);
};

const clearFrameWorkRunStatusTimer = () => {
  if (frameWorkStatusTimer.value) {
    clearTimeout(frameWorkStatusTimer.value);
    frameWorkStatusTimer.value = null;
  }
};

const operateDataCenter = async (status: dataCenterStatusEnum) => {
  viewStatusIsProcessing.value = true;
  const res = await startOrStopFrameWork({
    framework_id: props.currentNewFrameWorkId,
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

defineExpose({
  startFrameWorkRunStatusTimer,
});
</script>
