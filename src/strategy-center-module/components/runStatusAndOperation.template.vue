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
        <div class="absolute right-0 top-0 space-x-2 hidden sm:flex">
          <Button
            label="导入"
            icon="pi pi-file-import"
            size="small"
            variant="outlined"
            severity="secondary"
            v-tooltip.left="'导入框架'"
            class="text-xs"
            @click="openImportZipDialog"
          />
          <Button
            label="导出"
            icon="pi pi-file-export"
            size="small"
            variant="outlined"
            severity="secondary"
            v-tooltip="'导出框架'"
            class="text-xs"
            @click="openExportZipDialog"
          />
          <component
            :is="globalConfigData.error_webhook_url ? 'div' : OverlayBadge"
            v-bind="
              !globalConfigData.error_webhook_url ? { severity: 'danger' } : {}
            "
          >
            <Button
              class="hidden sm:inline-flex text-xs"
              icon="pi pi-cog"
              label="设置"
              variant="outlined"
              size="small"
              @click="openConfigDataDialog"
              :disabled="runStatus.startup === dataCenterStatusEnum.start"
              v-tooltip.bottom="{
                value:
                  runStatus.startup === dataCenterStatusEnum.start
                    ? '启动状态不可操作设置'
                    : '配置全局报错机器人，一次性计算多少列因子...',
              }"
            />
          </component>
        </div>
        <div class="font-semibold flex justify-center items-end">
          <div class="flex items-center gap-2">
            <!-- 显示当前是否是加密状态 -->
            <i
              :class="[
                globalConfigData.is_encrypt
                  ? 'pi pi-lock text-green-500 hover:text-green-400'
                  : 'pi pi-lock-open text-red-500 hover:text-red-400',
                'text-lg font-bold !hidden sm:!inline-block cursor-default',
              ]"
              v-tooltip="{
                value: `${
                  globalConfigData.is_encrypt
                    ? '安全模式'
                    : '未开启API KEY/密钥加密（建议开启！）'
                }`,
                class: `${globalConfigData.is_encrypt ? '' : 'min-w-65'}`,
              }"
            ></i>
            <span>{{ frameWorkName }}</span>
          </div>
        </div>
        <Card
          class="absolute left-0 top-0 shadow-lg border-1 border-gray-100 dark:border-neutral-700 hidden sm:block"
          :pt="{
            body: 'px-3 py-2',
          }"
        >
          <template #content>
            <ul
              class="flex flex-col gap-2 text-xs font-medium list-disc pl-4 tracking-wide"
            >
              <li
                :class="
                  globalConfigData.is_simulate
                    ? 'text-gray-500 dark:text-gray-300'
                    : 'text-green-600'
                "
              >
                {{ getModeText() }}模式
              </li>

              <li
                :class="
                  runStatus.startup === dataCenterStatusEnum.start
                    ? 'text-green-600'
                    : 'text-gray-500 dark:text-gray-300'
                "
              >
                {{
                  runStatus.startup === dataCenterStatusEnum.start
                    ? `${getModeText()}已启动`
                    : `${getModeText()}已暂停`
                }}
              </li>

              <li
                :class="
                  globalConfigData.error_webhook_url
                    ? 'text-green-600'
                    : 'text-gray-500 dark:text-gray-300'
                "
              >
                {{
                  globalConfigData.error_webhook_url
                    ? "已配置全局报错机器人"
                    : "未配置全局报错机器人"
                }}
              </li>
            </ul>
          </template>
        </Card>
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
      <div class="space-y-2 sm:space-y-4 mt-3">
        <div
          class="flex justify-center items-center gap-4 min-h-30"
          v-if="runStatus !== null"
        >
          <div>
            <Button
              v-if="runStatus.startup === dataCenterStatusEnum.stop"
              @click="
                operateActualTrading(dataCenterStatusEnum.start, 'startup')
              "
              class="w-30 h-30 hover:scale-105 transition-transform duration-300"
              icon="pi pi-caret-right"
              iconClass="text-4xl"
              rounded
              raised
              :severity="globalConfigData.is_simulate ? `info` : `success`"
              v-tooltip="`启动${getModeText()}`"
            />
            <Button
              v-if="runStatus.startup === dataCenterStatusEnum.start"
              @click="
                operateActualTrading(dataCenterStatusEnum.stop, 'startup')
              "
              class="w-30 h-30 hover:scale-105 transition-transform duration-300"
              icon="pi pi-stop-circle"
              iconClass="text-4xl"
              rounded
              raised
              :severity="globalConfigData.is_simulate ? `help` : `danger`"
              v-tooltip="`停止${getModeText()}`"
            />
          </div>
          <Divider
            layout="vertical"
            :class="
              runStatus.startup === dataCenterStatusEnum.start
                ? `h-25 m-0`
                : `h-18 m-0`
            "
          />
          <div class="h-full flex flex-col justify-center gap-1">
            <div class="flex items-center gap-2">
              <div
                class="text-xs sm:text-sm flex items-center gap-1 text-gray-500 dark:text-gray-300"
              >
                <i class="pi pi-user text-xs sm:text-sm"></i
                ><span>账户监控</span>
              </div>
              <Button
                v-if="runStatus.monitor === dataCenterStatusEnum.stop"
                @click="
                  operateActualTrading(dataCenterStatusEnum.start, 'monitor')
                "
                class="text-xs sm:text-sm py-0.5"
                icon="pi pi-caret-right"
                size="small"
                raised
                :severity="
                  runStatus.startup === dataCenterStatusEnum.stop
                    ? `secondary`
                    : globalConfigData.is_simulate
                    ? `info`
                    : `success`
                "
                variant="outlined"
                v-tooltip="{
                  value:
                    runStatus.startup === dataCenterStatusEnum.stop
                      ? '实盘未启动不可开启账户监控'
                      : '启动账户监控',
                }"
                :disabled="runStatus.startup === dataCenterStatusEnum.stop"
              />
              <Button
                v-if="runStatus.monitor === dataCenterStatusEnum.start"
                @click="
                  operateActualTrading(dataCenterStatusEnum.stop, 'monitor')
                "
                class="text-xs sm:text-sm py-0.5"
                icon="pi pi-stop-circle"
                size="small"
                raised
                :severity="globalConfigData.is_simulate ? `help` : `danger`"
                variant="outlined"
                v-tooltip="'停止账户监控'"
              />
            </div>
            <div class="flex items-center gap-2">
              <div
                class="flex items-center gap-1 text-gray-500 text-xs sm:text-sm dark:text-gray-300"
              >
                <i class="pi pi-chart-line text-xs sm:text-sm"></i
                ><span>下架监控</span>
              </div>
              <Button
                v-if="runStatus.delist === dataCenterStatusEnum.stop"
                @click="
                  operateActualTrading(dataCenterStatusEnum.start, 'delist')
                "
                class="text-xs sm:text-sm py-0.5"
                icon="pi pi-caret-right"
                size="small"
                raised
                :severity="
                  runStatus.startup === dataCenterStatusEnum.stop
                    ? `secondary`
                    : globalConfigData.is_simulate
                    ? `info`
                    : `success`
                "
                variant="outlined"
                v-tooltip="{
                  value:
                    runStatus.startup === dataCenterStatusEnum.stop
                      ? '实盘未启动不可开启下架监控'
                      : '启动下架监控',
                }"
                :disabled="runStatus.startup === dataCenterStatusEnum.stop"
              />
              <Button
                v-if="runStatus.delist === dataCenterStatusEnum.start"
                @click="
                  operateActualTrading(dataCenterStatusEnum.stop, 'delist')
                "
                class="text-xs sm:text-sm py-0.5"
                icon="pi pi-stop-circle"
                size="small"
                raised
                :severity="globalConfigData.is_simulate ? `help` : `danger`"
                variant="outlined"
                v-tooltip="'停止下架监控'"
              />
            </div>
            <div
              class="flex items-center gap-2"
              v-show="runStatus.startup === dataCenterStatusEnum.start"
            >
              <div
                class="flex items-center gap-1 text-gray-500 text-xs sm:text-sm dark:text-gray-300"
              >
                <i class="pi pi-refresh text-xs sm:text-sm"></i
                ><span>重启实盘</span>
              </div>
              <Button
                v-show="runStatus.startup === dataCenterStatusEnum.start"
                icon="pi pi-refresh"
                @click="
                  operateActualTrading(dataCenterStatusEnum.restart, 'startup')
                "
                raised
                variant="outlined"
                size="small"
                class="text-xs sm:text-sm py-0.5"
              />
            </div>
            <div class="flex items-center gap-2">
              <div
                class="flex items-center gap-1 text-gray-500 text-xs sm:text-sm dark:text-gray-300"
              >
                <i class="pi pi-book text-xs sm:text-sm"></i
                ><span>运行日志</span>
              </div>
              <Button
                type="button"
                icon="pi pi-book"
                @click="openLogDialogAction"
                variant="outlined"
                severity="secondary"
                size="small"
                raised
                class="text-xs sm:text-sm py-0.5"
                v-tooltip="'查看运行日志'"
              />
            </div>
          </div>
        </div>
        <div
          class="max-w-full flex gap-2 flex-clo sm:flex-row flex-wrap justify-center items-center"
        >
          <div
            class="flex justify-center items-center"
            v-tooltip.bottom="{
              value:
                runStatus.startup === dataCenterStatusEnum.start
                  ? '实盘运行中不可切换模式，请先停止实盘'
                  : '',
            }"
          >
            <label for="type" class="text-sm flex items-center gap-1"
              >模式：</label
            >
            <Select
              v-model="selectValue"
              :options="modeOpetions"
              optionLabel="label"
              optionValue="value"
              placeholder="选择模式"
              :pt="{
                label: 'text-sm py-1 pr-0',
              }"
              size="small"
              @value-change="changeConfigDataFn"
              :disabled="runStatus.startup === dataCenterStatusEnum.start"
            />
            <i
              class="pi pi-question-circle cursor-pointer text-gray-500 ml-1.5"
              v-tooltip="{
                value: `1. 实盘交易模式（none）：真实下单交易；<br/>2. 模拟实盘模式（simulate）：每小时计算选币和资金曲线，不下单交易；<br/>3. 实盘调试模式（debug）：一次性检查实盘步骤，不下单交易；`,
                escape: false,
                class: 'min-w-108',
                autoHide: false,
              }"
            ></i>
          </div>
          <Divider layout="vertical" class="m-2 hidden sm:flex" />
          <div
            class="hidden sm:flex justify-center items-center gap-2"
            v-tooltip.bottom="{
              value:
                runStatus.startup === dataCenterStatusEnum.start
                  ? '启动状态不可切换是否加密'
                  : '',
            }"
          >
            <label class="text-sm">API KEY/密钥加密</label>

            <ToggleSwitch
              v-model="viewConfigData.is_encrypt"
              @value-change="changeIsEncryptionStatus"
              :disabled="runStatus.startup === dataCenterStatusEnum.start"
            />
          </div>
          <div class="sm:hidden">
            <component
              :is="globalConfigData.error_webhook_url ? 'div' : OverlayBadge"
              v-bind="
                !globalConfigData.error_webhook_url
                  ? { severity: 'danger' }
                  : {}
              "
            >
              <Button
                class="sm:hidden text-xs"
                icon="pi pi-cog"
                severity="secondary"
                size="small"
                @click="openConfigDataDialog"
                :disabled="runStatus.startup === dataCenterStatusEnum.start"
                v-tooltip.bottom="{
                  value:
                    runStatus.startup === dataCenterStatusEnum.start
                      ? '启动状态不可操作设置'
                      : '',
                }"
              />
            </component>
          </div>
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
              v-if="runStatus.startup === dataCenterStatusEnum.stop"
              @click="
                operateActualTrading(dataCenterStatusEnum.start, 'startup')
              "
              icon="pi pi-caret-right"
              rounded
              raised
              :severity="globalConfigData.is_simulate ? `info` : `success`"
              v-tooltip="'启动'"
              size="small"
              class="hover:scale-105 transition-transform duration-300"
            />
            <Button
              v-if="runStatus.startup === dataCenterStatusEnum.start"
              @click="
                operateActualTrading(dataCenterStatusEnum.stop, 'startup')
              "
              icon="pi pi-stop-circle"
              rounded
              raised
              :severity="globalConfigData.is_simulate ? `help` : `danger`"
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
            v-show="runStatus.startup === dataCenterStatusEnum.start"
            label="重启"
            icon="pi pi-refresh"
            @click="
              operateActualTrading(dataCenterStatusEnum.restart, 'startup')
            "
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
        v-if="allPmIdTypeList.length > 0 && viewCurrentPm_id"
        :value="viewCurrentPm_id"
        scrollable
        class="flex-1 h-[90%] w-full border-0 bg-transparent"
      >
        <TabList class="flex space-x-2">
          <Tab
            v-for="tab in allPmIdTypeList"
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
            v-for="tab in allPmIdTypeList"
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

  <!-- 加密说明弹窗 -->
  <EncryptionInfoDialogTmpl
    ref="refEncryptionInfoDialogTmpl"
    @confirmEncryption="confirmChangeIsEncryptionStatus(true)"
    @cancelEncryption="viewConfigData.is_encrypt = false"
  />

  <!-- 关闭加密确认弹窗 -->
  <DisableEncryptionDialogTmpl
    ref="refDisableEncryptionDialogTmpl"
    @confirmDecryption="confirmChangeIsEncryptionStatus(false)"
    @cancelDecryption="viewConfigData.is_encrypt = true"
  />

  <!-- 加密模式开启 实盘/监控/启动/停止前需要输入密码 -->
  <InputEncryptedPwdDialogTmpl
    ref="refInputEncryptedPwdDialogTmpl"
    @confirm="passwordConfirmAction"
    @cancel="viewPendingOperation = null"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, computed } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
const route = useRoute();
const router = useRouter();
import OverlayBadge from "primevue/overlaybadge";
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

import EncryptionInfoDialogTmpl from "@/strategy-center-module/components/EncryptionInfoDialog.vue";
const refEncryptionInfoDialogTmpl = ref<InstanceType<
  typeof EncryptionInfoDialogTmpl
> | null>(null);

import DisableEncryptionDialogTmpl from "@/strategy-center-module/components/DisableEncryptionDialog.vue";
const refDisableEncryptionDialogTmpl = ref<InstanceType<
  typeof DisableEncryptionDialogTmpl
> | null>(null);

import InputEncryptedPwdDialogTmpl from "@/common-module/components/inputEncryptedPwdDialog.template.vue";
const refInputEncryptedPwdDialogTmpl = ref<InstanceType<
  typeof InputEncryptedPwdDialogTmpl
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

const props = defineProps<{
  isLoading: boolean;
  tabType: string; //all汇总 item单个
  currentId: number;
  frameWorkName: string;
  frameWorkId: string;
  frameWorkType: string;
  runStatus: { startup: string; delist: string; monitor: string };
  allPmIdTypeList: tDbFrameWorkRunStatusRes[];
  globalConfigData: {
    is_simulate: string | null;
    error_webhook_url: string;
    factor_col_limit: number;
    is_encrypt: boolean;
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

const modeOpetions = [
  {
    label: "实盘交易",
    value: "real",
  },
  {
    label: "模拟实盘",
    value: "simulate",
  },
  {
    label: "实盘调试",
    value: "debug",
  },
];

const selectValue = computed({
  get() {
    return viewConfigData.value.is_simulate ?? "real"; // null -> "real"
  },
  set(val) {
    viewConfigData.value.is_simulate = val === "real" ? null : val;
  },
});

const viewCurrentPm_id = ref<null | number | string>(null);

const viewConfigData = ref<iConfigData>({
  is_simulate: null,
  error_webhook_url: "",
  factor_col_limit: 64,
  is_encrypt: false,
});
const viewOldConfigData = ref<iConfigData>();
const viewIsOpenConfigDataDialog = ref<boolean>(false);

// 存储当前待执行的操作
const viewPendingOperation = ref<{
  status: dataCenterStatusEnum;
  type: string;
} | null>(null);

const $emit = defineEmits([
  "refreshRunStatusList",
  "refreshGlobalConfigData",
  "refreshAccountList",
]);

watch(
  () => props.allPmIdTypeList,
  (val) => {
    if (val.length > 0) {
      viewCurrentPm_id.value =
        val.find((item) => item.name === "startup")?.pm_id ?? null;
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

      viewConfigData.value.is_simulate =
        viewConfigData.value?.is_simulate ?? null;
    }
  },
  { immediate: true, deep: true }
);

const getModeText = () => {
  if (props.globalConfigData.is_simulate === "debug") {
    return "实盘调试";
  } else if (props.globalConfigData.is_simulate === "simulate") {
    return "模拟实盘";
  } else {
    return "实盘交易";
  }
};

const getPmId = (type: string) => {
  let pmIdItem = props.allPmIdTypeList.filter(
    (item: tDbFrameWorkRunStatusRes) => item.name === type
  );

  if (pmIdItem && pmIdItem.length > 0) {
    return pmIdItem[0]?.pm_id ?? null;
  } else {
    return null;
  }
};

const operateActualTrading = async (
  status: dataCenterStatusEnum,
  type: string
) => {
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

  // 如果是加密模式并且实盘交易 用户需要输入加密时使用的密码
  if (
    viewConfigData.value.is_encrypt === true &&
    status === dataCenterStatusEnum.start &&
    refInputEncryptedPwdDialogTmpl.value
  ) {
    // 存储待执行的操作
    viewPendingOperation.value = { status, type };
    // 显示密码输入弹窗
    refInputEncryptedPwdDialogTmpl.value?.openDialog();
    return;
  }
  startOrStopFrameWorkFn(status, type);
};

const startOrStopFrameWorkFn = async (
  status: dataCenterStatusEnum,
  type: string,
  password: string = ""
) => {
  let temp: vDataCenterStatusParams = {
    framework_id: props.frameWorkId,
    pm_id: getPmId(type),
    type: status,
  };
  if (password) {
    temp.secret_key = password;
  }
  const res = await startOrStopFrameWork(temp);
  // 清除待执行的操作
  viewPendingOperation.value = null;
  if (res.result) {
    toast.add({
      severity: "success",
      summary: "操作成功",
      life: 2000,
    });
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

// 处理密码确认
const passwordConfirmAction = async (password: string) => {
  if (!viewPendingOperation.value) {
    toast.add({
      severity: "error",
      summary: "操作失败",
      detail: "未找到待执行的操作",
      life: 3000,
    });
    return;
  }
  // 执行待执行的操作
  const { status, type } = viewPendingOperation.value;
  startOrStopFrameWorkFn(status, type, password);
};

const openLogDialogAction = async () => {
  viewIsOpenLogDialog.value = true;
  strategyLogRefreshTime.value = strategyLogRefreshTime.value || "0";
  getLogFn();
  startLogRefreshTimer();
};

const getLogFn = async () => {
  const res = await startOrStopFrameWork({
    framework_id: props.frameWorkId,
    pm_id: viewCurrentPm_id.value,
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
    is_simulate: viewConfigData.value?.is_simulate || null,
  });

  if (res.result === true) {
    toast.add({
      severity: "success",
      summary: "操作成功！",
      life: 3000,
    });
    viewIsOpenConfigDataDialog.value = false;
  }
  $emit("refreshGlobalConfigData");
};

const gotoDetail = () => {
  router.push({ name: route.name, params: { id: props.currentId } });
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

const changeIsEncryptionStatus = (value: boolean) => {
  if (value) {
    // 开启加密 - 显示加密说明弹窗
    if (refEncryptionInfoDialogTmpl.value) {
      refEncryptionInfoDialogTmpl.value.openDialog();
    }
  } else {
    // 关闭加密 - 显示关闭确认弹窗
    if (refDisableEncryptionDialogTmpl.value) {
      refDisableEncryptionDialogTmpl.value.openDialog();
    }
  }
};

const confirmChangeIsEncryptionStatus = (isEncryption: boolean) => {
  viewConfigData.value.is_encrypt = isEncryption;
  changeConfigDataFn();
  // 加密状态改变后，刷新账户列表获取最新数据
  $emit("refreshAccountList", props.frameWorkId);
};

onUnmounted(() => {
  clearLogRefreshTimer();
});

onBeforeRouteLeave(() => {
  clearLogRefreshTimer();
});
</script>
