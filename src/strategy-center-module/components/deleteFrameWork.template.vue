<template>
  <!-- 目前不需要 -->
  <Dialog
    v-model:visible="viewIsOpen"
    :modal="true"
    class="min-w-[50vw] max-w-[90vw]"
    :closable="false"
    header="删除框架"
  >
    <template #default>
      <!-- 步骤1：确认删除 -->
      <div
        v-if="viewStepNumber === 1"
        class="flex flex-col items-center gap-y-4 py-2"
      >
        <div class="flex items-center gap-x-2">
          <i class="pi pi-exclamation-triangle text-2xl mr-2 text-yellow-600" />
          <span>
            确定要删除
            <span
              class="font-bold text-lg text-gray-800 dark:text-gray-200 mx-1"
              >“{{ viewFrameworkName }}”</span
            >
            框架吗？</span
          >
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-300 text-center">
          删除操作只删除数据库中的数据，不会删除该框架相关文件
        </div>
      </div>

      <!-- 步骤2：暂停中 -->
      <div
        v-if="viewStepNumber === 2"
        class="flex flex-col items-center gap-y-3 py-4"
      >
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
        <div class="text-gray-700">实盘框架正在暂停中，请稍候...</div>
      </div>

      <!-- 是否删除所有信息 目前不需要 -->
      <!-- <div
        v-if="viewStepNumber === 3"
        class="flex flex-col items-center gap-y-4 py-2"
      >
        <div class="flex items-center gap-x-2">
          <Checkbox
            v-model="viewIsDeleteAll"
            :binary="true"
            inputId="deleteAll"
            :disabled="true"
          />
          <label for="deleteAll" class="text-gray-700 font-medium"
            >是否删除所有信息</label
          >
        </div>
        <div class="text-xs text-gray-500">
          目前暂不支持勾选，删除操作只删除数据库中的数据，不会删除框架文件，请放心操作
        </div>
      </div> -->

      <!-- 步骤3：删除成功 -->
      <div
        v-if="viewStepNumber === 3"
        class="flex flex-col items-center gap-y-3 py-4"
      >
        <template v-if="!viewIsFailed">
          <i class="pi pi-check-circle text-green-500 text-3xl" />
          <div class="font-bold text-lg">
            “{{ viewFrameworkName }}”框架删除成功！
          </div>
          <div class="text-xs text-gray-500">相关数据已清理。</div>
        </template>
        <template v-else>
          <div class="text-red-500">删除失败，请重试</div>
          <Button
            v-if="viewIsFailed"
            label="重试"
            icon="pi pi-refresh"
            @click="deleteFrameWorkFn"
            severity="danger"
            size="small"
          />
        </template>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col gap-y-2 w-full">
        <Divider class="my-2" />
        <div class="flex justify-end gap-2">
          <Button
            v-if="viewStepNumber === 1"
            label="取消"
            @click="viewIsOpen = false"
            outlined
            :disabled="viewIsLoading"
          />
          <Button
            v-if="viewStepNumber !== 3"
            label="确定"
            @click="nextStep"
            severity="secondary"
            :loading="viewIsLoading"
            :disabled="viewStepNumber === 2"
          />
          <Button
            v-else
            label="关闭"
            @click="refreshDataCenter"
            severity="success"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

import {
  getFrameWorkRunStatus,
  startOrStopFrameWork,
  framwWorkRunStatusEnum,
  dataCenterStatusEnum,
  deleteFrameWork,
} from "@/common-module/services/service.provider";

const viewIsOpen = ref(false);
const viewFrameworkId = ref("");
const viewFrameworkName = ref("");
const viewStepNumber = ref(1);
// const viewIsDeleteAll = ref(false);
const viewIsLoading = ref(false);
const viewIsFailed = ref(false);
const stopFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);

const $emit = defineEmits(["refreshStrategyCenter"]);

const openDialog = (frameWorkId: string, frameWorkName: string) => {
  viewStepNumber.value = 1;
  viewFrameworkId.value = frameWorkId;
  viewFrameworkName.value = frameWorkName;
  viewIsOpen.value = true;
};

const nextStep = async () => {
  if (viewStepNumber.value === 1) {
    try {
      viewIsLoading.value = true;
      const res = await getFrameWorkRunStatus();
      if (res.result === true && res.data && res.data.length > 0) {
        const isRunning = res.data.some(
          (item) =>
            item.framework_id === viewFrameworkId.value &&
            item.status === framwWorkRunStatusEnum.online
        );
        if (isRunning) {
          viewStepNumber.value++;
          // 如果框架正在运行中，则需要先暂停框架
          const res = await startOrStopFrameWork({
            framework_id: viewFrameworkId.value,
            type: dataCenterStatusEnum.stop,
          });
          if (res.result === true) {
            setTimeout(() => {
              startStopFrameWorkStatusTimer();
            }, 2000);
          }
        } else {
          deleteFrameWorkFn();
        }
      } else {
        viewStepNumber.value = 3;
      }
    } catch (error) {
      viewIsLoading.value = false;
      viewStepNumber.value = 1;
    }
  }
};

const startStopFrameWorkStatusTimer = async () => {
  clearStopFrameWorkStatusTimer(); // 先清除可能存在的旧定时器
  await executeStopFrameWorkStatusCheck(); // 立即执行第一次检查
};

const clearStopFrameWorkStatusTimer = () => {
  if (stopFrameWorkStatusTimer.value) {
    clearTimeout(stopFrameWorkStatusTimer.value);
    stopFrameWorkStatusTimer.value = null;
  }
};

const executeStopFrameWorkStatusCheck = async () => {
  try {
    const res = await getFrameWorkRunStatus();
    if (res.result === true && res.data && res.data.length > 0) {
      const isStopped = res.data.some(
        (item) =>
          item.framework_id === viewFrameworkId.value &&
          item.status === framwWorkRunStatusEnum.stopped
      );

      if (isStopped) {
        clearStopFrameWorkStatusTimer();
        deleteFrameWorkFn();
        return;
      }
    }
  } catch (error) {}

  // 继续轮询
  stopFrameWorkStatusTimer.value = setTimeout(() => {
    executeStopFrameWorkStatusCheck();
  }, 2000);
};

const deleteFrameWorkFn = async () => {
  const res = await deleteFrameWork(viewFrameworkId.value);
  viewIsLoading.value = false;
  if (res.result === true) {
    viewIsFailed.value = false;
    viewStepNumber.value = 3;
  } else {
    viewIsFailed.value = true;
    viewStepNumber.value = 3;
  }
};

const refreshDataCenter = () => {
  viewIsOpen.value = false;
  clearStopFrameWorkStatusTimer();
  $emit("refreshStrategyCenter");
};

onUnmounted(() => {
  clearStopFrameWorkStatusTimer();
});

defineExpose({
  openDialog,
});
</script>
