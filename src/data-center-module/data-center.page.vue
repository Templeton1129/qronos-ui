<template>
  <div class="h-full w-full flex justify-center p-2 sm:p-6">
    <div v-if="viewDownloadIsLoading" class="fixed inset-0 z-100 bg-black/30">
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="h-[120px] p-2 bg-primary-100 border-1 border-primary-200 shadow-lg rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <ProgressSpinner aria-label="Loading" class="w-[50px] h-[50px]" />
          <div class="font-medium text-xs text-gray-600">
            数据中心资源正在加载中...
          </div>
        </div>
      </div>
    </div>

    <!-- 框架下载完成 -->
    <card
      class="max-w-6xl flex flex-col w-full rounded-lg shadow-lg overflow-hidden"
    >
      <template #header>
        <!-- header -->
        <div
          class="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-primary-600/90 to-primary-400/80 text-white"
        >
          <div>
            <h1 class="text-lg font-bold mb-1">当前使用的框架</h1>
            <div class="text-gray-200 text-md">
              {{ viewFrameWorkName }}
              <!-- <Button
                class="ml-4 h-8"
                size="small"
                label="更改框架"
                @click="changeFrameWorkAction"
              /> -->
            </div>
          </div>
          <div>
            <Button
              class="hidden sm:inline-flex"
              icon="pi pi-cog"
              label="设置"
              severity="secondary"
              @click="openEditDataFormDialog"
              :disabled="viewStatusIsProcessing"
            />
            <Button
              class="sm:hidden"
              icon="pi pi-cog"
              severity="secondary"
              @click="openEditDataFormDialog"
              :disabled="viewStatusIsProcessing"
            />
          </div>
        </div>
      </template>

      <template #content>
        <!-- content -->
        <div class="felx-1 py-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="flex justify-center">
            <Message
              severity="success"
              icon="pi pi-spin pi-sync"
              v-if="currentDataCenterStatus === dataCenterStatusEnum.start"
              >数据中心自动运行中</Message
            >
            <Message severity="warn" icon="pi pi-pause" v-else
              >数据中心已暂停</Message
            >
          </div>
          <!-- 重要操作按钮 -->
          <div class="flex justify-center gap-4 min-h-30">
            <Button
              v-if="currentDataCenterStatus === dataCenterStatusEnum.stop"
              class="w-30 h-30 hover:scale-105 transition-transform duration-300"
              @click="operateDataCenter(dataCenterStatusEnum.start)"
              icon="pi pi-caret-right"
              iconClass="text-4xl"
              rounded
              raised
              severity="success"
              v-tooltip="'启动数据中心'"
              :disabled="viewStatusIsProcessing"
            />
            <Button
              v-if="currentDataCenterStatus === dataCenterStatusEnum.start"
              class="w-30 h-30 hover:scale-105 transition-transform duration-300"
              @click="operateDataCenter(dataCenterStatusEnum.stop)"
              icon="pi pi-stop-circle"
              iconClass="text-4xl"
              rounded
              raised
              severity="danger"
              v-tooltip="'停止数据中心'"
              :disabled="viewStatusIsProcessing"
            />
          </div>
          <!-- 其他操作按钮 -->
          <div class="flex justify-center items-center">
            <Button
              type="button"
              icon="pi pi-book"
              label="查看运行日志"
              @click="openLogDialogAction"
              variant="outlined"
              severity="secondary"
              size="small"
            />
            <Button
              v-show="currentDataCenterStatus === dataCenterStatusEnum.start"
              label="重启"
              variant="outlined"
              icon="pi pi-refresh"
              @click="operateDataCenter(dataCenterStatusEnum.restart)"
              class="ml-2 sm:ml-4"
              size="small"
              :disabled="viewStatusIsProcessing"
            />
          </div>
          <div class="pt-4">
            <DataTimeLineTemplate
              ref="refDataTimeLineTemplate"
              :autoRefresh="true"
              :refreshInterval="5 * 60 * 1000"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <Divider align="center" type="solid">
              <b class="text-gray-500 dark:text-gray-300 font-medium"
                >数据中心配置信息</b
              >
            </Divider>
            <!-- info信息罗列 -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between space-y-4 leading-relaxed"
            >
              <div class="space-y-2 sm:space-y-4">
                <Message severity="secondary" size="small" class="inline-flex"
                  >基础配置</Message
                >
                <div>
                  <ul
                    role="list"
                    class="list-disc space-y-2 sm:space-y-4 pl-4 text-sm"
                  >
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        v-if="resDataCenterInfo?.kline_count_1h"
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        1h周期k线数量为
                        <Message
                          severity="success"
                          variant="simple"
                          size="small"
                          >{{ resDataCenterInfo?.kline_count_1h }}</Message
                        >
                      </div>
                      <div
                        v-else
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message severity="warn" variant="simple" size="small"
                          >未设置</Message
                        >1h周期k线数量
                      </div>
                    </li>
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message
                          :severity="
                            resDataCenterInfo?.error_webhook_url
                              ? `success`
                              : `warn`
                          "
                          variant="simple"
                          size="small"
                          >{{
                            resDataCenterInfo?.error_webhook_url
                              ? "已开启"
                              : "未开启"
                          }}</Message
                        >企业微信机器人
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="space-y-2 sm:space-y-4">
                <Message size="small" class="inline-flex">高级配置</Message>
                <div>
                  <ul
                    role="list"
                    class="list-disc space-y-2 sm:space-y-4 pl-4 text-sm"
                  >
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message
                          :severity="
                            resDataCenterInfo?.use_api.kline
                              ? `success`
                              : `warn`
                          "
                          variant="simple"
                          size="small"
                          >{{
                            resDataCenterInfo?.use_api.kline
                              ? "已使用"
                              : "未使用"
                          }}</Message
                        >API来更新K线
                      </div>
                    </li>
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message
                          :severity="
                            resDataCenterInfo?.use_api.coin_cap
                              ? `success`
                              : `warn`
                          "
                          variant="simple"
                          size="small"
                          >{{
                            resDataCenterInfo?.use_api.coin_cap
                              ? "已使用"
                              : "未使用"
                          }}</Message
                        >API来更新市值数据
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="space-y-2 sm:space-y-4">
                <Message severity="secondary" size="small" class="inline-flex"
                  >其他配置</Message
                >
                <div>
                  <ul
                    role="list"
                    class="list-disc space-y-2 sm:space-y-4 pl-4 text-sm"
                  >
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        v-if="resDataCenterInfo?.enabled_hour_offsets"
                        class="text-gray-600 dark:text-gray-300 flex flex-wrap gap-1 items-center"
                      >
                        <span>设置的分钟偏移有</span>
                        <Message
                          severity="success"
                          variant="simple"
                          size="small"
                          :pt="{
                            text: {
                              class: `max-w-[60%] truncate`,
                            },
                          }"
                          v-tooltip.top="{
                            value:
                              resDataCenterInfo?.enabled_hour_offsets.join(','),
                            pt: {
                              arrow: {
                                style: {
                                  borderBottomColor: 'gray-100',
                                },
                              },
                              text: '!bg-gray-100 !font-medium !text-xs !text-gray-600',
                            },
                          }"
                        >
                          {{
                            resDataCenterInfo?.enabled_hour_offsets.join(",")
                          }}</Message
                        >
                      </div>
                      <div
                        v-else
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message severity="warn" variant="simple" size="small"
                          >未设置</Message
                        >分钟偏移
                      </div>
                    </li>
                    <li class="text-gray-400 dark:text-gray-300">
                      <div
                        class="text-gray-600 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Message
                          :severity="
                            resDataCenterInfo?.funding_rate ? `success` : `warn`
                          "
                          variant="simple"
                          size="small"
                          >{{
                            resDataCenterInfo?.funding_rate ? "需要" : "不需要"
                          }}</Message
                        >使用资金费数据
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </card>
  </div>
  <!-- 编辑数据 -->
  <EditDataFormTemplate
    ref="refEditDataFormTemplate"
    :isForceEdit="viewIsForceEdit"
    :formValues="initialValues"
    :frameWorkId="currentNewFrameWorkId"
    @refresh-data-center-config="getDataCenterConfigFn"
    @operate-data-center="operateDataCenter"
  />

  <!-- 查看日志 -->
  <Drawer
    v-model:visible="viewIsOpenLogDialog"
    header="日志"
    modal
    position="full"
    @hide="clearLogRefreshTimer"
  >
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div class="space-x-2">
          <label class="text-sm flex-shrink-0">条数:</label>
          <InputNumber
            v-model="viewLogLines"
            type="number"
            :min="1"
            @keydown.enter="getLogFn"
            placeholder="日志条数"
            size="small"
            class="min-w-0"
          />
          <Button
            type="button"
            label="刷新"
            @click="getLogFn"
            variant="outlined"
            class="flex-shrink-0"
            size="small"
          />
        </div>
        <Select
          v-model="dataLogRefreshTime"
          :options="logRefreshTimeList"
          optionLabel="name"
          optionValue="code"
          placeholder="刷新频率"
          @value-change="refreshTimeChangeAction"
          size="small"
        />
      </div>
      <p v-html="viewDataLog" class="flex-1 overflow-y-auto"></p>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
import {
  getDataCenterConfig,
  getFrameWorkStatus,
  startOrStopFrameWork,
  frameWorkDownloadStatusEnum,
  dataCenterStatusEnum,
  getFrameWorkRunStatus,
  framwWorkRunStatusEnum,
} from "@/common-module/services/service.provider";
import EditDataFormTemplate from "@/data-center-module/components/editDataForm.template.vue";
import DataTimeLineTemplate from "@/data-center-module/components/dataTimeLine.template.vue";
const refDataTimeLineTemplate = ref<InstanceType<
  typeof DataTimeLineTemplate
> | null>(null);
const refEditDataFormTemplate = ref<InstanceType<
  typeof EditDataFormTemplate
> | null>(null);
import { formatOutputLog } from "@/common-module/utils";

import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { dataLogRefreshTime } = useStorageValueOrFn();

const viewDownloadIsLoading = ref<boolean>(true);
const downloadFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);

const hourOffsetList = [
  "0m",
  "5m",
  "10m",
  "15m",
  "20m",
  "25m",
  "30m",
  "35m",
  "40m",
  "45m",
  "50m",
  "55m",
];
// 初始化数据
const initialValues = ref<tDataCenterConfigParams>({
  id: "",
  kline_count_1h: 2000,
  error_webhook_url: "",
  use_api: { kline: false, coin_cap: false },
  enabled_hour_offsets: hourOffsetList,
  funding_rate: true,
  is_first: false,
});

const viewIsOpenEditDataDialog = ref<boolean>(false);
const viewIsForceEdit = ref<boolean>(false);

const logRefreshTimeList = [
  {
    name: "不自动更新日志",
    code: "0",
  },
  {
    name: "5s自动更新日志",
    code: "5",
  },
  {
    name: "10s自动更新日志",
    code: "10",
  },
];
const viewIsOpenLogDialog = ref<boolean>(false);
const viewDataLog = ref<string>(`<h1>暂无日志</h1>`);
const logRefreshTimer = ref<ReturnType<typeof setInterval> | null>(null);
const currentNewFrameWorkId = ref<string>("");
const viewLogLines = ref<number>(50);
const viewCurrentLogPm = ref<tDbFrameWorkRunStatusRes[]>([]);

const viewFrameWorkName = ref<string>("");
const resDataCenterInfo = ref<tDbDataCenterConfigRes>();

const viewStatusIsProcessing = ref<boolean>(false);
const currentDataCenterStatus = ref<string>(dataCenterStatusEnum.stop);
const frameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(null);

onMounted(async () => {
  startDownloadFrameWorkStatusTimer();
});

const startDownloadFrameWorkStatusTimer = () => {
  // 先清除可能存在的旧定时器
  clearDownloadFrameWorkStatusTimer();

  // 立即执行第一次请求
  executeDownloadStatusCheck();
};

const executeDownloadStatusCheck = async () => {
  viewDownloadIsLoading.value = true;

  try {
    const res = await getFrameWorkStatus(true);

    if (res.result === true && res.data.length > 0) {
      currentNewFrameWorkId.value = res.data[0].framework_id;
      viewFrameWorkName.value = res.data[0].framework_name;

      // 检查是否完成下载
      if (res.data[0].status === frameWorkDownloadStatusEnum.finished) {
        viewDownloadIsLoading.value = false;
        loadDataFn();
        return; // 完成下载，停止轮询
      }
    }
  } catch (error) {
    return;
  }
  // 无论成功失败，都继续轮询（除非已完成下载）
  if (viewDownloadIsLoading.value) {
    downloadFrameWorkStatusTimer.value = setTimeout(
      executeDownloadStatusCheck,
      3000
    );
  }
};

const clearDownloadFrameWorkStatusTimer = () => {
  if (downloadFrameWorkStatusTimer.value) {
    clearTimeout(downloadFrameWorkStatusTimer.value);
    downloadFrameWorkStatusTimer.value = null;
  }
};

const loadDataFn = async () => {
  startFrameWorkRunStatusTimer();
  getDataCenterConfigFn();
  if (refDataTimeLineTemplate.value) {
    refDataTimeLineTemplate.value?.getDateCenterUpdateStatusListFn(
      currentNewFrameWorkId.value
    );
  }
};

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
        (item) => item.framework_id === currentNewFrameWorkId.value
      );

      if (temp) {
        if (
          temp.status === framwWorkRunStatusEnum.online ||
          temp.status === framwWorkRunStatusEnum.stopped ||
          temp.status === framwWorkRunStatusEnum.errored
        ) {
          // 符合停止条件
          viewStatusIsProcessing.value = false;
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

const getDataCenterConfigFn = async () => {
  initialValues.value = {
    id: "",
    kline_count_1h: 2000,
    error_webhook_url: "",
    use_api: { kline: false, coin_cap: false },
    enabled_hour_offsets: hourOffsetList,
    funding_rate: true,
    is_first: false,
  };
  const dataCenterConfig = await getDataCenterConfig(
    currentNewFrameWorkId.value
  );
  if (dataCenterConfig.result === true) {
    if (dataCenterConfig.data === null) {
      viewIsForceEdit.value = true;
      openEditDataFormDialog();
    } else {
      viewIsForceEdit.value = false;
      resDataCenterInfo.value = dataCenterConfig.data;
      initialValues.value = {
        ...JSON.parse(JSON.stringify(initialValues.value)),
        ...dataCenterConfig.data,
      };
    }
  } else {
    toast.add({
      severity: "error",
      summary: "获取数据中心Config配置失败",
      detail: dataCenterConfig.msg,
      life: 3000,
    });
  }
};

const operateDataCenter = async (status: dataCenterStatusEnum) => {
  viewStatusIsProcessing.value = true;
  const res = await startOrStopFrameWork({
    framework_id: currentNewFrameWorkId.value,
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

const openLogDialogAction = async () => {
  dataLogRefreshTime.value = dataLogRefreshTime.value || "0";
  viewIsOpenLogDialog.value = true;
  getLogFn();
  refreshTimeChangeAction();
};

const getLogFn = async () => {
  let temp = viewCurrentLogPm.value.find(
    (item) => item.framework_id === currentNewFrameWorkId.value
  );
  if (temp) {
    const res = await startOrStopFrameWork({
      framework_id: temp.pm_id,
      type: "log",
      lines: viewLogLines.value || 50,
    });

    if (res.result === true) {
      viewDataLog.value = formatOutputLog(res.data || "");
      // toast.add({
      //   severity: "success",
      //   summary: "获取日志成功",
      //   life: 3000,
      // });
    } else {
      toast.add({
        severity: "error",
        summary: "操作失败",
        detail: res?.msg,
        life: 3000,
      });
    }
  }
};

// 定时日志
const refreshTimeChangeAction = () => {
  clearLogRefreshTimer();
  startLogRefreshTimer();
};

// 清除定时器
const clearLogRefreshTimer = () => {
  if (logRefreshTimer.value) {
    clearInterval(logRefreshTimer.value);
    logRefreshTimer.value = null;
  }
};

// 设置定时器
const startLogRefreshTimer = () => {
  if (dataLogRefreshTime.value !== "0") {
    logRefreshTimer.value = setInterval(
      getLogFn,
      Number(dataLogRefreshTime.value) * 1000
    );
  }
};

const openEditDataFormDialog = () => {
  if (refEditDataFormTemplate.value) {
    refEditDataFormTemplate.value?.openDialog(initialValues.value);
  }
};

const changeFrameWorkAction = () => {
  toast.add({
    severity: "warn",
    summary: "当前版本不支持更改框架",
    life: 3000,
  });
};

onUnmounted(() => {
  clearDownloadFrameWorkStatusTimer();
  clearFrameWorkRunStatusTimer();
  clearLogRefreshTimer();
});
</script>
