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
      <div class="relative">
        <div class="absolute right-0 top-0 space-x-2 hidden sm:block">
          <Button
            label="导入"
            icon="pi pi-file-import"
            size="small"
            variant="outlined"
            severity="secondary"
            v-tooltip.left="'导入框架'"
            @click="openImportZipDialog"
          />
          <Button
            label="导出"
            icon="pi pi-file-export"
            size="small"
            variant="outlined"
            v-tooltip="'导出框架'"
            @click="openExportZipDialog"
          />
        </div>
        <div class="font-semibold h-[35px] flex justify-center items-end">
          <span>{{ frameWorkName }}</span>
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
                  : '配置全局报错机器人，一次性计算多少列因子...',
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

  <!-- 设置 -->
  <Dialog
    v-model:visible="viewIsOpenConfigDataDialog"
    header="设置"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
    :closable="false"
  >
    <Form
      v-slot="$form"
      :resolver
      @submit="submitConfigDataAction"
      class="space-y-4"
    >
      <div class="space-y-2">
        <label for="error_webhook_url" class="block text-sm font-medium"
          >全局报错机器人</label
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
      <div class="space-y-2">
        <label
          for="factor_col_limit"
          class="text-sm font-medium flex items-center gap-1"
          >一次性计算多少列因子
          <i
            class="pi pi-question-circle cursor-pointer"
            v-tooltip="{
              value: `内存优化选项，一次性计算多少列因子。64是 16GB内存 电脑的典型值<br/>1. 数字越大，计算速度越快，但同时内存占用也会增加。<br/>2. 该数字是在 '因子数量 * 参数数量' 的基础上进行优化的。<br/>3. 例如，当你遍历 200 个因子，每个因子有 10 个参数，总共生成 2000 列因子。<br/>4. 如果 'factor_col_limit' 设置为 64，则计算会拆分为 ceil(2000 / 64) = 32 个批次，每次最多处理 64 列因子。<br/>5. 对于16GB内存的电脑，在跑含现货的策略时，64是一个合适的设置。<br/>6. 如果是在16GB内存下跑纯合约策略，则可以考虑将其提升到 128，毕竟数值越高计算速度越快。<br/>7. 以上数据仅供参考，具体值会根据机器配置、策略复杂性、回测周期等有所不同。建议大家根据实际情况，逐步测试自己机器的性能极限，找到适合的最优值。`,
              escape: false,
              class: 'min-w-80',
              autoHide: false,
            }"
          ></i
        ></label>
        <InputNumber
          v-model="viewConfigData.factor_col_limit"
          :min="1"
          mode="decimal"
          showButtons
          name="factor_col_limit"
          placeholder="请填写一次性计算多少列因子"
          class="w-full"
        />
        <Message
          v-if="$form.factor_col_limit?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
          >{{ $form.factor_col_limit.error?.message }}</Message
        >
      </div>
      <div class="flex justify-end pt-4 gap-2">
        <Button
          type="submit"
          severity="secondary"
          label="取消"
          @click="closeConfigDataDialog"
        />
        <Button type="submit" severity="primary" label="确定" />
      </div>
    </Form>
  </Dialog>

  <!-- 日志弹窗 -->
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

  <!-- 导入框架 -->
  <ImportZipTemplate
    title="导入框架压缩包"
    :maxFileSize="50 * 1024 * 1024"
    :frameWorkId="frameWorkId"
    ref="refImportZipDialogTmpl"
  />

  <!-- 导出框架 -->
  <ExportZipDialogTemplate
    :frameWorkId="frameWorkId"
    :frameWorkName="frameWorkName"
    ref="refExportZipDialogTemplate"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

import ImportZipTemplate from "@/common-module/components/importZipDialog.template.vue";
const refImportZipDialogTmpl = ref<InstanceType<
  typeof ImportZipTemplate
> | null>(null);
import ExportZipDialogTemplate from "@/common-module/components/exportZipDialog.template.vue";
const refExportZipDialogTemplate = ref<InstanceType<
  typeof ExportZipDialogTemplate
> | null>(null);
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

interface iConfigData {
  is_debug: boolean;
  error_webhook_url: string;
  factor_col_limit: number;
}

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
    factor_col_limit: number;
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

const viewConfigData = ref<iConfigData>({
  is_debug: false,
  error_webhook_url: "",
  factor_col_limit: 64,
});
const viewOldConfigData = ref<iConfigData>();
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
  () => props.frameWorkId,
  (val) => {
    $emit("refreshGlobalConfigData");
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
  // 备份旧配置
  viewOldConfigData.value = JSON.parse(JSON.stringify(viewConfigData.value));
  viewIsOpenConfigDataDialog.value = true;
};

const closeConfigDataDialog = () => {
  viewConfigData.value = JSON.parse(JSON.stringify(viewOldConfigData.value));
  viewIsOpenConfigDataDialog.value = false;
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

  if (!viewConfigData.value.factor_col_limit) {
    errors.factor_col_limit = [{ message: "一次性计算多少列因子不能为空" }];
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
    ...viewConfigData.value,
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

const openImportZipDialog = () => {
  if (refImportZipDialogTmpl.value) {
    refImportZipDialogTmpl.value.openDialog();
  }
};

const openExportZipDialog = () => {
  if (refExportZipDialogTemplate.value) {
    refExportZipDialogTemplate.value.openDialog();
  }
};

onUnmounted(() => {
  clearLogRefreshTimer();
});

onBeforeRouteLeave(() => {
  clearLogRefreshTimer();
});
</script>
