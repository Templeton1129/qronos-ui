<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    :header="`升级框架`"
    :modal="true"
    :closable="false"
    class="min-w-[60vw] max-w-[90vw]"
    :pt="{
      content: {
        class: 'p-0',
      },
    }"
  >
    <template #default>
      <Stepper v-model:value="step" linear class="basis-[50rem]">
        <StepList>
          <Step
            :value="1"
            class="text-sm"
            :pt="{
              number: {
                class: 'text-sm min-w-7 h-7',
              },
            }"
            >下载新框架</Step
          >
          <Step
            :value="2"
            class="text-sm"
            :pt="{
              number: {
                class: 'text-sm min-w-7 h-7',
              },
            }"
            >迁移数据</Step
          >
          <Step
            :value="3"
            class="text-sm"
            :pt="{
              number: {
                class: 'text-sm min-w-7 h-7',
              },
            }"
            >暂停实盘</Step
          >
          <Step
            :value="4"
            class="text-sm"
            :pt="{
              number: {
                class: 'text-sm min-w-7 h-7',
              },
            }"
            >删除老框架</Step
          >
        </StepList>
        <StepPanels
          :pt="{
            root: {
              class: 'p-0',
            },
          }"
        >
          <!-- 步骤1：下载新框架 -->
          <StepPanel :value="1">
            <div
              class="flex flex-col justify-center gap-4 pt-6 h-45 w-full items-center"
            >
              <template v-if="viewIsDownload === false">
                <Button
                  :label="`下载新框架《${viewFrameInfo?.newFrameworkName}》`"
                  icon="pi pi-download"
                  @click="
                    () => {
                      viewIsDownload = true;
                      loadDataFn();
                    }
                  "
                />
              </template>
              <template v-else>
                <div class="text-base font-bold">下载新框架</div>
                <ProgressBar :value="viewProgressValue" class="w-2/3" />
                <div class="text-xs text-gray-500">
                  {{ viewStatusLabel }}
                </div>
              </template>
              <Button
                v-if="viewIsFailed"
                label="重试"
                icon="pi pi-refresh"
                @click="downloadFrameWorkFn"
                severity="danger"
                size="small"
              />
            </div>
          </StepPanel>
          <!-- 步骤2：迁移数据 -->
          <StepPanel :value="2">
            <div
              class="flex flex-col justify-center gap-4 pt-6 h-45 w-full items-center"
            >
              <div class="text-base font-bold">迁移数据</div>
              <ProgressBar :value="viewProgressValue" class="w-2/3" />
              <div class="text-xs text-gray-500">
                {{ viewStatusLabel }}
              </div>
              <Button
                v-if="viewIsFailed"
                label="重试"
                icon="pi pi-refresh"
                @click="migrationDataFn"
                severity="danger"
                size="small"
              />
              <span class="text-xs text-gray-500">
                迁移内容：账户统计数据(data/账户名称)，账户配置文件(account)，数据计算快照(data/snapshot)
              </span>
            </div>
          </StepPanel>
          <!-- 步骤3：暂停实盘 -->
          <StepPanel :value="3">
            <div
              class="flex flex-col justify-center gap-4 pt-6 h-45 w-full items-center"
            >
              <div class="text-base font-bold">暂停实盘</div>
              <ProgressSpinner
                v-if="viewStatusLabel === '正在暂停实盘...'"
                class="w-12 h-12"
              />
              <div class="text-xs text-gray-500">
                {{ viewStatusLabel }}
              </div>
              <Button
                v-if="viewIsFailed"
                label="重试"
                icon="pi pi-refresh"
                @click="stopFrameWorkFn"
                severity="danger"
                size="small"
              />
            </div>
          </StepPanel>
          <!-- 步骤4：删除老框架 -->
          <StepPanel :value="4">
            <div
              class="flex flex-col justify-center gap-4 pt-6 h-45 w-full items-center"
            >
              <div class="text-base font-bold text-red-600">删除老框架</div>
              <ProgressBar :value="viewProgressValue" class="w-2/3" />
              <div class="text-xs text-gray-500">
                {{ viewStatusLabel }}
              </div>
              <Button
                v-if="viewIsFailed"
                label="重试"
                icon="pi pi-refresh"
                @click="deleteFrameWorkFn"
                severity="danger"
                size="small"
              />
              <span class="text-xs text-gray-500">
                删除操作只删除数据库中的数据，不会删除框架文件，请放心操作
              </span>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </template>
    <template #footer>
      <Button
        v-if="step === 1 && viewIsLoading === false && viewIsDownload === false"
        label="取消"
        @click="closeDialog"
        severity="secondary"
      />
      <Button
        v-if="step < 4 && viewIsDownload === true && !viewIsFailed"
        label="下一步"
        @click="nextStep"
        :disabled="viewIsLoading"
      />
      <Button
        v-if="step === 4 && !viewIsFailed"
        label="关闭"
        @click="closeDialog"
        :disabled="viewIsLoading"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import {
  addFrameWorkVersion,
  getFrameWorkStatus,
  frameWorkDownloadStatusEnum,
  frameWorkDataMigration,
  getFrameWorkRunStatus,
  framwWorkRunStatusEnum,
  startOrStopFrameWork,
  dataCenterStatusEnum,
  deleteFrameWork,
} from "@/common-module/services/service.provider";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useRouter } from "vue-router";
const router = useRouter();

const viewIsOpenDialog = ref<boolean>(false);
const step = ref<number>(1);
const viewIsDownload = ref<boolean>(false);
const viewIsLoading = ref<boolean>(false);
const viewIsFailed = ref<boolean>(false);
const viewStatusLabel = ref<string>("");
const viewProgressValue = ref<number>(0);
const viewTimer = ref<ReturnType<typeof setInterval> | null>(null);

const downloadFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);
const viewFrameWorkStatusList = ref<tDbFrameWorkStatusRes[]>([]);
const stopFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);

interface iViewFrameInfo {
  oldFrameworkId: string;
  oldFrameworkName: string;
  newFrameworkId: string;
  newFrameworkName: string;
}
const viewFrameInfo = ref<iViewFrameInfo>({
  oldFrameworkId: "",
  oldFrameworkName: "",
  newFrameworkId: "",
  newFrameworkName: "",
});

const $emit = defineEmits(["refreshStrategyCenter"]);

const openDialog = (frameInfo: iViewFrameInfo) => {
  viewFrameInfo.value = frameInfo;
  viewIsOpenDialog.value = true;
  step.value = 1;
  resetStepState();
};

const resetStepState = () => {
  viewIsLoading.value = false;
  viewIsFailed.value = false;
  viewStatusLabel.value = "";
  viewProgressValue.value = 0;
  viewIsDownload.value = false;
  clearTimer();
  clearDownloadFrameWorkStatusTimer();
};

const clearTimer = () => {
  if (viewTimer.value) {
    clearInterval(viewTimer.value);
    viewTimer.value = null;
  }
};

const handleStepFailure = (errorMessage: string, showToast: boolean = true) => {
  viewIsLoading.value = false;
  viewIsFailed.value = true;
  viewStatusLabel.value = errorMessage;
  viewProgressValue.value = 100;
  clearTimer();
  clearDownloadFrameWorkStatusTimer();

  if (showToast) {
    toast.add({
      severity: "error",
      summary: errorMessage,
      life: 3000,
    });
  }
};

const loadDataFn = async () => {
  if (step.value === 1) {
    downloadFrameWorkFn();
  }
  if (step.value === 2) {
    migrationDataFn();
  }
  if (step.value === 3) {
    stopFrameWorkFn();
  }
  if (step.value === 4) {
    deleteFrameWorkFn();
  }
};

const downloadFrameWorkFn = async () => {
  viewIsLoading.value = true;
  viewIsFailed.value = false;
  viewProgressValue.value = 0;
  viewStatusLabel.value = "正在下载新框架...";
  try {
    const res = await addFrameWorkVersion(viewFrameInfo.value.newFrameworkId);
    if (res.result === true) {
      // 下载请求成功，开始轮询下载状态
      setTimeout(() => {
        startDownloadFrameWorkStatusTimer(true);
      }, 3000);
    } else {
      handleStepFailure("下载失败，请重新下载！");
    }
  } catch (e) {
    handleStepFailure("下载失败，请重新下载！");
  }
};

const migrationDataFn = async () => {
  viewIsLoading.value = true;
  viewIsFailed.value = false;
  viewProgressValue.value = 0;
  viewStatusLabel.value = "正在迁移数据...";
  try {
    const res = await frameWorkDataMigration(
      viewFrameInfo.value.oldFrameworkId,
      viewFrameInfo.value.newFrameworkId
    );
    if (res.result === true) {
      viewIsLoading.value = false;
      clearTimer();
      viewTimer.value = setInterval(() => {
        viewProgressValue.value += 20;
        if (viewProgressValue.value >= 100) {
          viewProgressValue.value = 100;
          viewStatusLabel.value = "迁移完成";
          viewIsLoading.value = false;
          clearTimer();
        }
      }, 1000);
    } else {
      handleStepFailure("数据迁移失败，请重试");
    }
  } catch (e) {
    handleStepFailure("数据迁移失败，请重试");
  }
};

const stopFrameWorkFn = async () => {
  viewIsLoading.value = true;
  viewIsFailed.value = false;
  viewStatusLabel.value = "正在检测实盘是否启动...";
  try {
    // 判断当前实盘是否在启动状态，若不在启动 则viewStatusLabel显示"当前实盘已暂停，可直接下一步"
    const res = await getFrameWorkRunStatus();
    if (res.result === true && res.data && res.data.length > 0) {
      const isRunning = res.data.some(
        (item) =>
          item.framework_id === viewFrameInfo.value.oldFrameworkId &&
          item.status === framwWorkRunStatusEnum.online
      );
      if (isRunning) {
        viewStatusLabel.value = "正在暂停实盘...";
        // 如果框架正在运行中，则需要先暂停框架
        const stopRes = await startOrStopFrameWork({
          framework_id: viewFrameInfo.value.oldFrameworkId,
          type: dataCenterStatusEnum.stop,
        });
        if (stopRes.result === true) {
          // 开始轮询确认暂停状态
          startStopFrameWorkStatusTimer();
        } else {
          handleStepFailure("暂停实盘失败，请重试");
        }
      } else {
        viewStatusLabel.value = "当前实盘已暂停，可直接下一步";
        viewIsLoading.value = false;
      }
    } else {
      viewStatusLabel.value = "当前实盘已暂停，可直接下一步";
      viewIsLoading.value = false;
    }
  } catch (e) {
    handleStepFailure("暂停实盘失败，请重试");
  }
};

const deleteFrameWorkFn = async () => {
  viewIsLoading.value = true;
  viewIsFailed.value = false;
  viewProgressValue.value = 0;
  viewStatusLabel.value = "正在删除老框架...";
  try {
    const res = await deleteFrameWork(viewFrameInfo.value.oldFrameworkId);
    if (res.result === true) {
      // 删除请求成功，开始进度条动画
      viewTimer.value = setInterval(() => {
        viewProgressValue.value += 20;
        if (viewProgressValue.value >= 100) {
          viewProgressValue.value = 100;
          viewStatusLabel.value = "删除完成";
          viewIsLoading.value = false;
          clearTimer();
        }
      }, 500);
    } else {
      handleStepFailure("删除老框架失败，请重试");
    }
  } catch (e) {
    handleStepFailure("删除老框架失败，请重试");
  }
};

const nextStep = () => {
  if (viewIsFailed.value) {
    toast.add({
      severity: "warn",
      summary: "请先解决当前步骤的问题",
      life: 2000,
    });
    return;
  }
  step.value += 1;
  loadDataFn();
};

const startDownloadFrameWorkStatusTimer = async (failed: boolean = false) => {
  clearDownloadFrameWorkStatusTimer(); // 先清除可能存在的旧定时器
  await executeDownloadStatusCheck(failed); // 立即执行第一次检查
};

const clearDownloadFrameWorkStatusTimer = () => {
  if (downloadFrameWorkStatusTimer.value) {
    clearTimeout(downloadFrameWorkStatusTimer.value);
    downloadFrameWorkStatusTimer.value = null;
  }
};

const executeDownloadStatusCheck = async (failed: boolean = false) => {
  viewIsLoading.value = true;
  viewProgressValue.value += 20;
  try {
    const res = await getFrameWorkStatus();

    if (res.result === true) {
      viewFrameWorkStatusList.value = res.data;

      // 情况1: 没有数据
      if (!res.data || res.data.length === 0) {
        handleStepFailure("下载失败，请重新下载！");
        return; // 停止轮询
      }

      // 情况2: 失败处理
      if (failed) {
        const isFailed = res.data.find(
          (item) =>
            item.framework_id === viewFrameInfo.value.newFrameworkId &&
            item.status === frameWorkDownloadStatusEnum.failed
        );
        if (isFailed) {
          handleStepFailure("下载失败，请重新下载！");
          return; // 停止轮询
        }
      }

      // 情况3: 检查下载状态
      const isDownloading = res.data.some(
        (item: tDbFrameWorkStatusRes) =>
          item.status === frameWorkDownloadStatusEnum.downloading ||
          item.status === frameWorkDownloadStatusEnum.notDownloaded
      );

      // 成功！
      if (!isDownloading) {
        viewIsLoading.value = false;
        viewProgressValue.value = 100;
        viewStatusLabel.value = "下载完成";
        viewIsDownload.value = true;
        clearDownloadFrameWorkStatusTimer();
        return; // 停止轮询
      }
    } else {
      // API请求失败
      handleStepFailure("获取框架状态失败");
      return; // 停止轮询
    }
  } catch (error) {
    handleStepFailure("下载失败，请重新下载！");
    return;
  }

  // 继续轮询
  downloadFrameWorkStatusTimer.value = setTimeout(() => {
    executeDownloadStatusCheck(failed);
  }, 3000);
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
          item.framework_id === viewFrameInfo.value.oldFrameworkId &&
          item.status === framwWorkRunStatusEnum.stopped
      );

      if (isStopped) {
        viewStatusLabel.value = "已暂停实盘，可直接下一步";
        viewIsLoading.value = false;
        clearStopFrameWorkStatusTimer();
        return;
      }
    }
  } catch (error) {
    // 轮询失败，但不停机，继续尝试
  }

  // 继续轮询
  stopFrameWorkStatusTimer.value = setTimeout(() => {
    executeStopFrameWorkStatusCheck();
  }, 2000);
};

const closeDialog = () => {
  viewIsOpenDialog.value = false;
  resetStepState();
  if (step.value === 4) {
    $emit("refreshStrategyCenter");
  }
};

onUnmounted(() => {
  clearTimer();
  clearDownloadFrameWorkStatusTimer();
  clearStopFrameWorkStatusTimer(); // 清理暂停实盘轮询定时器
});

defineExpose({
  openDialog,
});
</script>
