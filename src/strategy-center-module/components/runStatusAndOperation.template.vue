<template>
  <Card
    v-if="tabType === `item`"
    class="w-full max-w-6xl dark:border-1 dark:border-[#3d3d3d]"
  >
    <!-- 骨架屏（加载状态） -->
    <template v-if="isLoading" #title>
      <div class="space-y-3">
        <Skeleton
          width="75%"
          height="1.5rem"
          class="mx-auto rounded"
        ></Skeleton>
        <div class="flex flex-wrap justify-center gap-2">
          <Skeleton width="5rem" height="2rem"></Skeleton>
          <Skeleton width="4rem" height="2rem"></Skeleton>
          <Skeleton width="6rem" height="2rem"></Skeleton>
        </div>
      </div>
    </template>
    <template v-else #title>
      <div class="font-semibold text-center">
        {{ frameWorkName }}
      </div>
      <div
        class="text-sm text-gray-500 dark:text-gray-300 mt-2 flex flex-wrap items-center justify-center gap-x-1 sm:gap-x-2 gap-y-1"
      >
        当前是
        <Message
          :severity="globalConfigData.is_debug === true ? `warn` : `success`"
          size="small"
          >{{
            globalConfigData.is_debug === true ? `debug模式` : `真实实盘模式`
          }}</Message
        ><Divider layout="vertical" />
        <Message
          :severity="
            runStatus === dataCenterStatusEnum.start ? `success` : `warn`
          "
          size="small"
          >{{
            runStatus === dataCenterStatusEnum.start ? `已启动` : `已暂停`
          }}</Message
        ><span>实盘</span><Divider layout="vertical" />
        <Message
          :severity="globalConfigData.error_webhook_url ? `success` : `warn`"
          size="small"
          >{{
            globalConfigData.error_webhook_url ? `已配置` : `未配置`
          }}</Message
        >全局报错机器人
      </div>
    </template>
    <!-- 骨架屏（加载状态） -->
    <template v-if="isLoading" #content>
      <div class="space-y-4">
        <!-- 大按钮骨架 -->
        <div class="flex justify-center">
          <Skeleton shape="circle" width="6rem" height="6rem"></Skeleton>
        </div>

        <!-- 底部按钮组骨架 -->
        <div class="flex flex-wrap justify-center gap-3">
          <Skeleton width="6rem" height="2rem"></Skeleton>
          <Skeleton width="2rem" height="2rem"></Skeleton>
          <Skeleton width="6rem" height="2rem"></Skeleton>
          <Skeleton width="4rem" height="2rem"></Skeleton>
        </div>
      </div>
    </template>
    <template v-else #content>
      <div class="space-y-2 sm:space-y-4">
        <div class="flex justify-center min-h-30" v-if="runStatus !== null">
          <Button
            v-if="runStatus === dataCenterStatusEnum.stop"
            @click="operateDataCenter(dataCenterStatusEnum.start)"
            class="w-30 h-30 hover:scale-105 transition-transform duration-300"
            icon="pi pi-caret-right"
            iconClass="text-4xl"
            rounded
            raised
            :severity="globalConfigData.is_debug === true ? `info` : `success`"
            v-tooltip="'启动实盘'"
          />
          <Button
            v-if="runStatus === dataCenterStatusEnum.start"
            @click="operateDataCenter(dataCenterStatusEnum.stop)"
            class="w-30 h-30 hover:scale-105 transition-transform duration-300"
            icon="pi pi-stop-circle"
            iconClass="text-4xl"
            rounded
            raised
            :severity="globalConfigData.is_debug === true ? `help` : `danger`"
            v-tooltip="'停止实盘'"
          />
        </div>
        <div
          class="max-w-full flex gap-2 flex-clo sm:flex-row flex-wrap justify-center items-center"
        >
          <div
            class="flex justify-center items-center gap-2"
            v-tooltip.bottom="{
              value:
                runStatus === dataCenterStatusEnum.start
                  ? '启动状态不可切换debug模式'
                  : '',
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
            <label class="text-sm">debug模式</label>
            <!-- 二次确认弹窗！ -->
            <ConfirmDialog group="changeDebugStatus"></ConfirmDialog>

            <ToggleSwitch
              v-model="viewConfigData.is_debug"
              @value-change="changeDebugStatus"
              :disabled="runStatus === dataCenterStatusEnum.start"
            />
          </div>
          <Button
            class="hidden sm:inline-flex"
            icon="pi pi-cog"
            label="设置"
            severity="secondary"
            size="small"
            @click="openConfigDataDialog"
            :disabled="runStatus === dataCenterStatusEnum.start"
            v-tooltip.bottom="{
              value:
                runStatus === dataCenterStatusEnum.start
                  ? '启动状态不可操作设置'
                  : '配置全局报错机器人',
              pt: {
                arrow: {
                  style: {
                    borderBottomColor: 'gray-100',
                  },
                },
                text: '!bg-gray-100 !font-medium !text-xs !text-gray-600',
              },
            }"
          />
          <Button
            class="sm:hidden"
            icon="pi pi-cog"
            severity="secondary"
            size="small"
            @click="openConfigDataDialog"
            :disabled="runStatus === dataCenterStatusEnum.start"
            v-tooltip.bottom="{
              value:
                runStatus === dataCenterStatusEnum.start
                  ? '启动状态不可操作设置'
                  : '',
              pt: {
                arrow: {
                  style: {
                    borderBottomColor: 'gray-100',
                  },
                },
                text: '!bg-gray-100 !font-medium !text-xs !text-gray-600',
              },
            }"
          />
          <Button
            class="hidden sm:inline-flex"
            icon="pi pi-plus"
            label="新增账户"
            size="small"
            variant="outlined"
            @click="openAddAccountForm"
            v-tooltip.bottom="{
              value: '添加新的实盘账户',
              pt: {
                arrow: {
                  style: {
                    borderBottomColor: 'gray-100',
                  },
                },
                text: '!bg-gray-100 !font-medium !text-xs !text-gray-600',
              },
            }"
          />
          <Button
            type="button"
            label="查看运行日志"
            @click="openLogDialogAction"
            variant="outlined"
            severity="secondary"
            size="small"
          />
          <Button
            v-show="runStatus === dataCenterStatusEnum.start"
            label="重启"
            icon="pi pi-refresh"
            @click="operateDataCenter(dataCenterStatusEnum.restart)"
            variant="outlined"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
  <Card v-else class="w-full max-w-6xl dark:border-1 dark:border-[#3d3d3d]">
    <template #content>
      <!-- 骨架屏（加载状态） -->
      <div v-if="isLoading" class="space-y-4">
        <div class="flex justify-between items-center gap-2">
          <Skeleton height="1.5rem" class="rounded flex-1"></Skeleton>

          <Skeleton shape="circle" width="2rem" height="2rem"></Skeleton>

          <Skeleton width="6rem" height="2rem" class="rounded"></Skeleton>

          <Skeleton width="4rem" height="2rem" class="rounded"></Skeleton>
        </div>
      </div>
      <div
        v-else
        class="flex justify-between items-center flex-wrap sm:flex-nowrap space-y-2 gap-2"
      >
        <div class="font-semibold">
          {{ frameWorkName }}
        </div>
        <div class="flex justify-center items-center space-x-2 sm:space-x-4">
          <div
            class="flex justify-center items-center space-x-2 sm:space-x-4 min-w-8"
            v-if="runStatus !== null"
          >
            <Button
              v-if="runStatus === dataCenterStatusEnum.stop"
              @click="operateDataCenter(dataCenterStatusEnum.start)"
              icon="pi pi-caret-right"
              rounded
              raised
              :severity="
                globalConfigData.is_debug === true ? `info` : `success`
              "
              v-tooltip="'启动'"
              size="small"
              class="hover:scale-105 transition-transform duration-300"
            />
            <Button
              v-if="runStatus === dataCenterStatusEnum.start"
              @click="operateDataCenter(dataCenterStatusEnum.stop)"
              icon="pi pi-stop-circle"
              rounded
              raised
              :severity="globalConfigData.is_debug === true ? `help` : `danger`"
              v-tooltip="'停止'"
              size="small"
              class="hover:scale-105 transition-transform duration-300"
            />
          </div>
          <Button
            type="button"
            label="查看运行日志"
            @click="openLogDialogAction"
            variant="outlined"
            severity="secondary"
            size="small"
          />
          <Button
            v-show="runStatus === dataCenterStatusEnum.start"
            label="重启"
            icon="pi pi-refresh"
            @click="operateDataCenter(dataCenterStatusEnum.restart)"
            variant="outlined"
            size="small"
          />
          <Button
            label="编辑"
            icon="pi pi-arrow-right"
            @click="gotoDetail"
            variant="outlined"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>

  <Dialog
    v-model:visible="viewIsOpenConfigDataDialog"
    header="设置"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
  >
    <Form v-slot="$form" :resolver @submit="submitConfigDataAction">
      <div class="space-y-2 sm:space-y-4">
        <label for="error_webhook_url" class="block text-sm font-medium"
          >全局报错机器人:</label
        >
        <InputText
          v-model.trim="viewConfigData.error_webhook_url"
          name="error_webhook_url"
          type="text"
          placeholder="请填写企业微信机器人url"
          class="w-full"
        />
        <Message
          v-if="$form.error_webhook_url?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
          >{{ $form.error_webhook_url.error?.message }}</Message
        >
      </div>
      <div class="flex justify-end pt-4">
        <Button
          type="submit"
          severity="primary"
          label="确定"
          class="px-6 py-2.5"
        />
      </div>
    </Form>
  </Dialog>
  <Drawer
    v-model:visible="viewIsOpenLogDialog"
    header="日志"
    modal
    position="full"
    @hide="clearLogRefreshTimer"
  >
    <div class="h-full flex flex-col">
      <div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div class="space-x-2">
          <label class="text-sm flex-shrink-0">条数:</label>
          <InputNumber
            v-model="viewLogLines"
            type="number"
            :min="1"
            @keydown.enter="openLogDialogAction"
            placeholder="日志条数"
            size="small"
            class="min-w-0"
          />
          <Button
            type="button"
            label="刷新"
            @click="openLogDialogAction"
            variant="outlined"
            class="flex-shrink-0"
            size="small"
          />
        </div>
        <Select
          v-model="strategyLogRefreshTime"
          :options="logRefreshTimeList"
          optionLabel="name"
          optionValue="code"
          placeholder="刷新频率"
          @value-change="refreshTimeChangeAction"
          size="small"
        />
      </div>
      <Tabs
        v-if="logTypeList.length > 0 && viewCurrentPm_id"
        :value="viewCurrentPm_id"
        scrollable
        class="flex-1 h-[90%] w-full border-0 bg-transparent"
      >
        <TabList class="flex space-x-2">
          <Tab
            v-for="tab in logTypeList"
            :key="tab.name"
            :value="tab.pm_id"
            @click="tabClick(tab.pm_id)"
            class="rounded-t-lg px-4 py-2 bg-transparent border-none focus:outline-none"
          >
            {{ logTypeEnum[tab.name as keyof typeof logTypeEnum] }}
          </Tab>
        </TabList>
        <TabPanels
          class="flex-1 border-0 focus:outline-none p-1 overflow-y-auto"
        >
          <TabPanel
            v-for="tab in logTypeList"
            :key="tab.name"
            :value="tab.pm_id"
          >
            <p v-html="viewDataLog" class="pt-1"></p>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <p v-html="viewDataLog" v-else class="flex-1 overflow-y-auto"></p>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { strategyLogRefreshTime } = useStorageValueOrFn();

import { formatOutputLog } from "@/common-module/utils";
import {
  dataCenterStatusEnum,
  startOrStopFrameWork,
  logTypeEnum,
  getAccountInfo,
  editGlobalConfig,
} from "@/common-module/services/service.provider";

const props = defineProps<{
  isLoading: boolean;
  tabType: string; //all汇总 item单个
  currentId: number;
  frameWorkName: string;
  frameWorkId: string;
  frameWorkType: string;
  runStatus: string;
  logTypeList: tDbFrameWorkRunStatusRes[];
  globalConfigData: {
    is_debug: boolean;
    error_webhook_url: string;
  };
}>();
const viewIsOpenLogDialog = ref<boolean>(false);
const viewDataLog = ref<string>("<h1>暂无日志</h1>");
const viewLogLines = ref<number>(50);
const logRefreshTimer = ref<ReturnType<typeof setInterval> | null>(null);
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
const viewCurrentPm_id = ref<null | number | string>(null);

const viewConfigData = ref<{
  is_debug: boolean;
  error_webhook_url: string;
}>({
  is_debug: false,
  error_webhook_url: "",
});
const viewIsOpenConfigDataDialog = ref<boolean>(false);

const $emit = defineEmits([
  "refreshRunStatusList",
  "refreshGlobalConfigData",
  "openAddAccount",
]);

watch(
  () => props.logTypeList,
  (val) => {
    if (val.length > 0) {
      viewCurrentPm_id.value =
        val.find((item) => item.name === "startup")?.pm_id || props.frameWorkId;
    }
  },
  { immediate: true }
);

watch(
  () => props.globalConfigData,
  (val) => {
    if (val) {
      const clonedVal = JSON.parse(JSON.stringify(val));
      viewConfigData.value = {
        ...JSON.parse(JSON.stringify(viewConfigData.value)),
        ...clonedVal,
      };
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.frameWorkId,
  (val) => {
    $emit("refreshGlobalConfigData");
  },
  { immediate: true, deep: true }
);

const operateDataCenter = async (status: dataCenterStatusEnum) => {
  // 启动前判断是否已配置
  if (status === dataCenterStatusEnum.start) {
    const accountRes = await getAccountInfo(props.frameWorkId);
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
    framework_id: props.frameWorkId,
    type: status,
  });
  if (res.result) {
    toast.add({ severity: "success", summary: "操作成功", life: 2000 });
    $emit("refreshRunStatusList");
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
  viewIsOpenLogDialog.value = true;
  strategyLogRefreshTime.value = strategyLogRefreshTime.value || "0";
  getLogFn();
  startLogRefreshTimer();
};

const getLogFn = async () => {
  let pm_id =
    viewCurrentPm_id.value === null
      ? props.frameWorkId
      : viewCurrentPm_id.value;
  const res = await startOrStopFrameWork({
    framework_id: pm_id,
    type: "log",
    lines: viewLogLines.value || 50,
  });

  if (res.result === true) {
    viewDataLog.value = formatOutputLog(res.data || "");
  } else {
    toast.add({
      severity: "error",
      summary: "操作失败",
      detail: res?.msg,
      life: 3000,
    });
  }
};

// 日志
const refreshTimeChangeAction = () => {
  clearLogRefreshTimer();
  startLogRefreshTimer();
};

const clearLogRefreshTimer = () => {
  if (logRefreshTimer.value) {
    clearInterval(logRefreshTimer.value);
    logRefreshTimer.value = null;
  }
};

const startLogRefreshTimer = () => {
  if (strategyLogRefreshTime.value !== "0") {
    logRefreshTimer.value = setInterval(
      getLogFn,
      Number(strategyLogRefreshTime.value) * 1000
    );
  }
};

const tabClick = (pm_id: number) => {
  viewCurrentPm_id.value = pm_id;
  getLogFn();
};

const openConfigDataDialog = () => {
  viewIsOpenConfigDataDialog.value = true;
  viewConfigData.value.error_webhook_url =
    props.globalConfigData.error_webhook_url;
};

const changeDebugStatus = (value: Boolean) => {
  confirm.require({
    group: "changeDebugStatus",
    message: `确定要${value ? "开启" : "关闭"}debug模式吗？`,
    icon: "pi pi-exclamation-triangle",
    header: "提示",
    rejectProps: {
      label: "取消",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "确定",
    },
    accept: () => {
      changeConfigDataFn();
    },
    reject: () => {
      // 取消时恢复原状态
      viewConfigData.value.is_debug = !value;
    },
    onHide: () => {
      viewConfigData.value.is_debug = !value;
    },
  });
};

const resolver = ({ values }: any) => {
  const errors: Record<string, any> = {};
  // 简单url正则校验
  const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
  if (
    viewConfigData.value.error_webhook_url &&
    !urlPattern.test(viewConfigData.value.error_webhook_url)
  ) {
    errors.error_webhook_url = [{ message: "请输入正确的URL格式" }];
  }
  return {
    values,
    errors,
  };
};

const submitConfigDataAction = ({ valid }: any) => {
  if (valid) {
    changeConfigDataFn();
  }
};

const changeConfigDataFn = async () => {
  const res = await editGlobalConfig({
    framework_id: props.frameWorkId,
    is_debug: viewConfigData.value.is_debug,
    error_webhook_url: viewConfigData.value.error_webhook_url,
  });

  if (res.result === true) {
    toast.add({
      severity: "success",
      summary: "操作成功！",
      life: 3000,
    });
    viewIsOpenConfigDataDialog.value = false;
    $emit("refreshGlobalConfigData");
  }
};

const gotoDetail = () => {
  router.push({ name: route.name, params: { id: props.currentId } });
};

const openAddAccountForm = () => {
  $emit("openAddAccount", props.frameWorkId);
};
onUnmounted(() => {
  clearLogRefreshTimer();
});
</script>
