<template>
  <!-- 骨架屏：加载中 -->
  <div v-if="viewIsLoading" class="w-full sm:px-4">
    <div class="flex flex-wrap gap-4">
      <div v-for="i in 2" :key="i" class="w-full sm:w-[48%]">
        <Card class="sm:m-2">
          <template #header>
            <div class="flex justify-between items-center px-4 py-2">
              <div class="flex items-center gap-4 w-[80%]">
                <Skeleton width="40px" height="20px" class="rounded" />
                <div class="flex items-center gap-1" v-for="i in 4" :key="i">
                  <Skeleton width="30px" height="20px" class="rounded" />
                </div>
              </div>
              <Skeleton width="24px" height="24px" shape="circle" />
            </div>
          </template>
          <template #content>
            <div class="space-y-2 -m-2">
              <Divider class="my-0 mb-2" />
              <div
                class="pt-1 text-xs flex flex-col sm:flex-row gap-y-1 items-center sm:justify-between"
              >
                <Skeleton width="120px" height="16px" />
                <Skeleton width="120px" height="16px" />
              </div>
              <div class="flex flex-col items-center gap-y-1">
                <Skeleton width="100%" height="240px" class="rounded" />
              </div>
              <div class="flex justify-start mt-2">
                <Skeleton width="80%" height="20px" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>

  <div
    v-else-if="viewIsLoading === false && viewAccountInfoList.length > 0"
    class="w-full sm:px-4 space-y-2 sm:space-y-0"
  >
    <div class="px-0 sm:px-2">
      <Button
        icon="pi pi-plus"
        variant="outlined"
        class="hidden sm:inline-flex bg-white dark:bg-neutral-800 px-4 w-full sm:w-auto"
        size="small"
        label="新增账户"
        @click="openAddAccountForm"
      ></Button>
    </div>
    <Carousel
      :value="viewAccountInfoList"
      :numVisible="2"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      :show-navigators="false"
    >
      <template #item="slotProps">
        <Card
          class="sm:m-2 hover:shadow-lg transition-shadow duration-200 relative"
          :pt="{
            body: {
              class: 'px-4 pt-0 pb-2',
            },
          }"
        >
          <template #header>
            <div class="flex justify-between items-center px-4 py-2">
              <div class="flex items-center gap-2">
                <div
                  class="text-lg font-semibold sm:max-w-[30%] flex-1 sm:flex-none truncate cursor-default"
                  v-tooltip.top="slotProps.data.account_name"
                >
                  {{ slotProps.data.account_name }}
                </div>
                <div class="flex items-center gap-1">
                  <Tag
                    size="small"
                    :value="`${slotProps.data.leverage}x`"
                    rounded
                    severity="success"
                    class="text-xs font-medium cursor-pointer"
                    v-tooltip.top="'杠杆'"
                    @click="(e:Event) => toggleLeveragePopover(e, slotProps.data)"
                  ></Tag>
                  <Tag
                    size="small"
                    :value="`黑名单${
                      slotProps.data?.black_list?.length || 0
                    }个`"
                    rounded
                    severity="warn"
                    class="text-xs font-medium cursor-pointer"
                    @click="(e:Event) => toggleBlacklistPopover(e, slotProps.data)"
                  >
                  </Tag>
                  <Tag
                    size="small"
                    :value="slotProps.data.account_config.hour_offset"
                    rounded
                    severity="info"
                    class="text-xs font-medium cursor-pointer"
                    v-tooltip.top="'分钟偏移'"
                  >
                  </Tag>

                  <Button
                    size="small"
                    text
                    severity="secondary"
                    class="py-0 px-1 ml-2 text-xs leading-6 hidden sm:inline-flex"
                    @click="
                      () => {
                        viewActiveAccount = slotProps.data;
                        openEditAccountForm();
                      }
                    "
                    >查看更多</Button
                  >
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Tag
                  :value="slotProps.data.is_lock ? '禁用状态' : '启用状态'"
                  :severity="slotProps.data.is_lock ? 'danger' : 'success'"
                  class="hidden sm:inline-flex text-md font-medium"
                >
                </Tag>
                <Button
                  icon="pi pi-ellipsis-v"
                  size="small"
                  severity="secondary"
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                  @click="(event:Event)=>toggle(event,slotProps.data)"
                  class="border-0"
                />
                <Menu
                  v-if="
                    slotProps.data.account_name ===
                    viewActiveAccount?.account_name
                  "
                  ref="menu"
                  :model="menuItems"
                  :popup="true"
                  class="min-w-35"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="space-y-2">
              <Divider class="my-0 mb-2" />
              <div
                v-if="
                  !slotProps.data.account_config.apiKey ||
                  !slotProps.data.account_config.secret
                "
                class="text-sm flex items-center justify-center gap-1"
              >
                <i class="pi pi-exclamation-triangle"></i>
                <span>当前未配置API KEY/密钥，请先</span>
                <Button
                  size="small"
                  variant="outlined"
                  severity="secondary"
                  text
                  class="py-0 px-0 text-sm"
                  label="配置"
                  @click="
                    () => {
                      viewActiveAccount = slotProps.data;
                      openEditAccountForm();
                    }
                  "
                >
                </Button>
              </div>
              <div v-else class="h-[22px] text-center text-sm">
                已配置API KEY和密钥
              </div>
              <div class="pt-1 text-xs flex flex-row justify-between">
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-y-1 sm:gap-y-0"
                >
                  <span
                    >图更新：<span class="text-gray-500 dark:text-gray-300">{{
                      getUpdateDataTime(slotProps.data)
                    }}</span></span
                  >
                  <span
                    >上次交易：<span class="text-gray-500 dark:text-gray-300">{{
                      getUpdateDataTime(slotProps.data)
                    }}</span></span
                  >
                </div>
                <Tag
                  :value="slotProps.data.is_lock ? '禁用状态' : '启用状态'"
                  :severity="slotProps.data.is_lock ? 'danger' : 'success'"
                  class="inline-flex sm:hidden text-md font-medium"
                >
                </Tag>
              </div>
              <div class="flex flex-col items-center gap-y-1 -mt-2">
                <div
                  v-if="
                    slotProps.data?.equity &&
                    slotProps.data?.equity?.time &&
                    slotProps.data?.equity?.net &&
                    slotProps.data?.equity?.dd2here &&
                    slotProps.data?.sub_stg_eqs
                  "
                  class="h-100 w-full flex"
                  :key="slotProps.data.account_name"
                >
                  <StrategicNetValueChart
                    :dateTime="slotProps.data.equity.time"
                    :equity="slotProps.data.equity.net"
                    :dd2here="slotProps.data.equity.dd2here"
                    :sub_stg_eqs="slotProps.data.sub_stg_eqs"
                  />
                </div>
                <div
                  v-else
                  class="h-100 w-full flex flex-col gap-2 items-center justify-center"
                >
                  <img
                    src="@/assets/home-img/no-data.png"
                    class="w-40 h-auto"
                  />
                  <span class="text-sm text-gray-500 dark:text-gray-300"
                    >暂无策略净值曲线图</span
                  >
                </div>

                <!-- 策略信息 -->
                <div
                  v-if="slotProps.data.strategy_name"
                  class="text-sm flex items-center leading-[22px]"
                >
                  <span class="text-gray-600">策略：</span>
                  <span class="font-bold"
                    >“{{ slotProps.data.strategy_name }}”</span
                  >
                </div>
                <div v-else class="text-sm hidden sm:flex items-center">
                  当前还未导入策略，请先<Button
                    size="small"
                    variant="outlined"
                    severity="secondary"
                    text
                    class="py-0 px-0 text-sm"
                    label="导入策略"
                    @click="
                      () => {
                        if (refUploadStrategyFile) {
                          viewActiveAccount = slotProps.data;
                          refUploadStrategyFile?.openDialog();
                        }
                      }
                    "
                  >
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </template>
    </Carousel>

    <ConfirmDialog :group="viewActiveAccount?.account_name"></ConfirmDialog>

    <Popover
      ref="op"
      class="w-60"
      :target="`#blacklist-tag-${viewActiveAccount?.account_name}`"
    >
      <div class="mb-3">
        <div class="font-bold text-center">
          黑名单共{{ viewActiveAccount?.black_list.length || 0 }}个
        </div>
        <Divider class="my-1" />
        <div
          class="max-h-[180px] overflow-y-auto px-1"
          v-if="
            viewActiveAccount?.black_list &&
            viewActiveAccount?.black_list.length > 0
          "
        >
          <div
            v-for="(item, index) in viewActiveAccount?.black_list"
            :key="index"
            class="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-700"
          >
            <span class="text-xs">{{ item }}</span>
            <Button
              icon="pi pi-trash"
              variant="text"
              severity="secondary"
              size="small"
              icon-class="text-xs"
              class="p-1"
              @click="removeFromBlacklist(item)"
            />
          </div>
        </div>
        <div
          v-if="viewActiveAccount?.black_list.length === 0"
          class="text-gray-500 text-sm py-2"
        >
          暂无黑名单
        </div>
      </div>

      <!-- 添加新项 -->
      <div class="flex gap-2 mt-2">
        <AutoComplete
          size="small"
          v-model="newBlacklistItem"
          :suggestions="suggestions"
          forceSelection
          @complete="formatSuggestions"
          @keydown.enter.prevent
          placeholder="输入后点击提示标签添加黑名单"
          emptySearchMessage="重复的输入"
          class="w-full"
        />
        <Button
          icon="pi pi-plus"
          size="small"
          @click="addToBlacklist"
          :disabled="!newBlacklistItem"
        />
      </div>
    </Popover>

    <Popover
      v-if="
        viewActiveAccount?.leverage !== null &&
        viewActiveAccount?.leverage !== undefined
      "
      ref="leveragePopoverRef"
      :target="`#leverage-tag-${viewActiveAccount?.account_name}`"
      class="w-72"
    >
      <div class="mb-2 font-bold">调整杠杆</div>
      <div class="flex items-center gap-2 mb-2">
        <InputNumber
          v-model="leverageEditValue"
          name="leverage"
          mode="decimal"
          :min="0"
          :max="2"
          :step="0.01"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          size="small"
          class="w-full"
          showButtons
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button size="small" label="确认" @click="onLeverageConfirmClick" />
        <Button
          size="small"
          label="取消"
          severity="secondary"
          @click="closeLeveragePopover"
        />
      </div>
    </Popover>

    <LeverageConfirmDialog
      ref="refLeverageConfirmDialog"
      :leverage="leverageEditValue"
      @cancel="cancelLeverageChange"
      @confirm="saveLeverageConfirm"
    />
  </div>

  <!-- Empty State -->
  <Card
    v-else-if="viewIsLoading === false && viewAccountInfoList.length === 0"
    class="w-full max-w-6xl"
  >
    <template #content>
      <div class="flex flex-col justify-center items-center">
        <i class="pi pi-wallet text-5xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 mb-4">暂无账户信息</p>
        <Button
          label="新增账户"
          icon="pi pi-plus"
          variant="outlined"
          @click="openAddAccountForm"
        />
      </div>
    </template>
  </Card>

  <AccountFormTemplate
    ref="refAccountFormTemplateEdit"
    :isForceAddAccount="viewIsForceAddAccount"
    :frameWorkType="frameWorkType"
    :frameWorkId="frameWorkId"
    type="修改"
    formItemSize="small"
    @refreshAccountInfoList="getAccountInfoListFn"
  />

  <Dialog
    v-model:visible="viewIsOpenImportOrAddDialog"
    modal
    header=""
    :closable="false"
    :draggable="false"
    class="min-w-[90vw] sm:max-w-[90vw] sm:min-w-[40vw]"
  >
    <template #default>
      <div class="flex gap-4">
        <div
          @click="viewSelectImport = true"
          class="flex-1 flex items-center px-4 py-5 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RadioButton
            v-model="viewSelectImport"
            inputId="strategy-library"
            name="strategy-mode"
            :value="true"
            class="mr-3"
          />
          <div class="text-center flex-1 space-y-1">
            <div class="font-medium text-gray-800 dark:text-gray-200">
              导入框架数据压缩包
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              用于快速迁移或恢复框架数据
            </div>
          </div>
        </div>
        <div
          @click="viewSelectImport = false"
          class="flex-1 flex items-center px-4 py-5 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RadioButton
            v-model="viewSelectImport"
            inputId="custom-strategy"
            name="strategy-mode"
            :value="false"
            class="mr-3"
          />
          <div class="text-center flex-1 space-y-1">
            <div class="font-medium text-gray-800 dark:text-gray-200">
              新增账户
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              手动创建一个新账户
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3 pt-1">
        <Button label="确定" variant="outlined" @click="importSelectConfirm" />
      </div>
    </template>
  </Dialog>

  <!-- 导入框架 -->
  <ImportZipDialogTemplate
    title="导入框架压缩包"
    :maxFileSize="50 * 1024 * 1024"
    :frameWorkId="frameWorkId"
    :isNoUpdate="true"
    @onImportSuccess="importFrameWorkSuccess"
    ref="refImportZipDialogTmpl"
  />

  <!-- 首次强制弹窗新增账户 -->
  <div class="hidden sm:flex">
    <AccountFormTemplate
      ref="refAccountFormTemplateAdd"
      :isForceAddAccount="viewIsForceAddAccount"
      :frameWorkId="frameWorkId"
      :frameWorkType="frameWorkType"
      type="新增"
      formItemSize="small"
      @refreshForceStatus="changeForceAccountStatus"
      @refreshAccountInfoList="getAccountInfoListFn"
    />
  </div>

  <!-- 首次强制策略导入 -->
  <div class="hidden sm:flex">
    <UploadStrategyFile
      v-show="viewAccountInfoList.length > 0"
      ref="refUploadStrategyFile"
      :isForceAddConfigFile="viewIsForceAddStrategyFile"
      :frameWorkId="frameWorkId"
      :accountName="viewActiveAccount?.account_name || ``"
      @refreshForceAddConfigFileStatus="changeForceStrategyStatus"
      @refreshAccountInfoList="getAccountInfoListFn"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import AccountFormTemplate from "@/strategy-center-module/components/accountForm.template.vue";
const refAccountFormTemplateAdd = ref<InstanceType<
  typeof AccountFormTemplate
> | null>(null);
const refAccountFormTemplateEdit = ref<InstanceType<
  typeof AccountFormTemplate
> | null>(null);
import UploadStrategyFile from "@/strategy-center-module/components/uploadStrategyFile.vue";
const refUploadStrategyFile = ref<InstanceType<
  typeof UploadStrategyFile
> | null>(null);
import LeverageConfirmDialog from "@/strategy-center-module/components/LeverageConfirmDialog.vue";
const refLeverageConfirmDialog = ref<InstanceType<
  typeof LeverageConfirmDialog
> | null>(null);
import ImportZipDialogTemplate from "@/common-module/components/importZipDialog.template.vue";
const refImportZipDialogTmpl = ref<InstanceType<
  typeof ImportZipDialogTemplate
> | null>(null);

import {
  getAccountInfo,
  deleteAccount,
  dataCenterStatusEnum,
  addOrEditAccountInfo,
  lockAccount,
  getAccountInfoChart,
} from "@/common-module/services/service.provider";
import StrategicNetValueChart from "@/home-module/components/strategicNetValueChart.template.vue";

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

const menu = ref();
const responsiveOptions = ref([
  {
    breakpoint: "2000px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "1630px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "900px",
    numVisible: 1,
    numScroll: 1,
  },
]);

const props = defineProps<{
  runStatus: { startup: string; delist: string; monitor: string };
  frameWorkId: string;
  frameWorkType: string;
}>();
const viewIsLoading = ref<boolean>(false);

const addAccountDialogVisible = ref<boolean>(false);
const viewAccountInfoList = ref<tDbAccountInfoRes[]>([]);
const viewIsForceAddAccount = ref<boolean>(false);

const viewIsForceAddStrategyFile = ref<boolean>(false);
const viewActiveAccount = ref<tDbAccountInfoRes>();
const newBlacklistItem = ref<string>("");
// 黑名单相关配置
const op = ref(); // 触发 Popover 的 DOM 元素
const suggestions = ref<string[]>([]);

const leveragePopoverRef = ref();
const leverageEditValue = ref<number>(1); // 临时变量

const viewIsOpenImportOrAddDialog = ref<boolean>(false);
const viewSelectImport = ref<boolean>(true);

onMounted(() => {
  getAccountInfoListFn();
});

const toggle = (event: Event, accountData: tDbAccountInfoRes) => {
  viewActiveAccount.value = accountData;
  nextTick(() => {
    menu.value.toggle(event);
  });
};

const getAccountInfoListFn = async () => {
  viewIsLoading.value = true;
  const res = await getAccountInfo(props.frameWorkId);
  if (res.result === true) {
    viewAccountInfoList.value = res.data;
    // 如果没有账号，强制打开新增弹窗
    if (res.data.length === 0) {
      viewIsOpenImportOrAddDialog.value = true;
    } else {
      viewIsOpenImportOrAddDialog.value = false;
      viewIsForceAddAccount.value = false;
      if (res.data.length === 1) {
        viewActiveAccount.value = res.data[0];
        if (viewIsForceAddStrategyFile.value === true) {
          if (refUploadStrategyFile.value) {
            refUploadStrategyFile.value?.openDialog();
          }
        }
      }
      // 获取图表信息数据
      getAccountChartDataFn();
    }
  }
};

const importSelectConfirm = () => {
  // 导入框架
  if (viewSelectImport.value) {
    if (refImportZipDialogTmpl.value) {
      refImportZipDialogTmpl.value?.openDialog();
    }
  } else {
    // 新增账户
    viewIsForceAddAccount.value = true;
    openAddAccountForm();
  }
};

const importFrameWorkSuccess = () => {
  viewIsOpenImportOrAddDialog.value = false;
  setTimeout(() => {
    router.go(0);
  }, 500);
};

const getAccountChartDataFn = async () => {
  const res = await getAccountInfoChart(props.frameWorkId);
  viewIsLoading.value = false;
  if (res.result === true) {
    viewAccountInfoList.value.forEach((accountItem) => {
      const chartItem = res.data.find((item) => {
        return item.account_name === accountItem.account_name;
      });
      accountItem.equity = chartItem?.equity || null;
      accountItem.sub_stg_eqs = chartItem?.sub_stg_eqs || null;
    });
  }
};

const getUpdateDataTime = (data: tDbHomeAccountInfoRes) => {
  if (data?.equity?.time) {
    let lastTimeList = data.equity.time;
    if (lastTimeList.length > 0) {
      return lastTimeList[lastTimeList.length - 1];
    } else {
      return "--";
    }
  }
  return "--";
};

// 可能账户全删除了！！
watch(viewAccountInfoList, (list) => {
  if (list.length === 0) {
    viewIsForceAddAccount.value = true;
    addAccountDialogVisible.value = true;
  } else {
    viewIsForceAddAccount.value = false;
  }
});

const getAccountIsLock = (accountName: string) => {
  const account = viewAccountInfoList.value.find(
    (item) => item.account_name === accountName
  );
  return account?.is_lock;
};

const menuItems = computed(() => {
  return [
    {
      label: "导入策略",
      icon: "pi pi-file-import",
      command: () => {
        if (refUploadStrategyFile.value) {
          refUploadStrategyFile.value?.openDialog();
        }
      },
      class: "hidden sm:flex",
    },
    {
      label: "配置账户",
      icon: "pi pi-pen-to-square",
      command: () => {
        openEditAccountForm();
      },
    },
    {
      label: `${
        getAccountIsLock(viewActiveAccount.value?.account_name || ``)
          ? "启用"
          : "禁用"
      }账户`,
      icon: "pi pi-exclamation-circle",
      command: () => {
        if (viewActiveAccount.value) {
          lockAccountFn(viewActiveAccount.value);
        }
      },
    },
    {
      label: "删除账户",
      icon: "pi pi-trash",
      command: () => {
        deleteAccountAction();
      },
    },
  ];
});

const openAddAccountForm = () => {
  if (refAccountFormTemplateAdd.value) {
    refAccountFormTemplateAdd.value?.openDialog(null);
  }
};
const openEditAccountForm = () => {
  if (refAccountFormTemplateEdit.value && viewActiveAccount.value) {
    refAccountFormTemplateEdit.value?.openDialog(viewActiveAccount.value);
  }
};
const changeForceAccountStatus = () => {
  viewIsOpenImportOrAddDialog.value = false;
  viewIsForceAddStrategyFile.value = true;
};

const changeForceStrategyStatus = () => {
  viewIsForceAddStrategyFile.value = false;
};

const deleteAccountAction = async () => {
  if (props.runStatus.startup === dataCenterStatusEnum.start) {
    toast.add({
      severity: "warn",
      summary: "实盘启动状态不可删除子账户！",
      life: 3000,
    });
    return;
  }
  confirm.require({
    group: viewActiveAccount.value?.account_name,
    header: "删除",
    message: `你确定要删除${viewActiveAccount.value?.account_name}吗?`,
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "取消",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "删除",
      severity: "danger",
    },
    accept: async () => {
      const currentAccount = viewAccountInfoList.value.find(
        (item) => item.account_name === viewActiveAccount.value?.account_name
      );
      // 删除账户调用接口
      if (currentAccount) {
        const res = await deleteAccount(
          currentAccount.framework_id,
          currentAccount.account_name
        );
        if (res.result === true) {
          toast.add({ severity: "success", summary: "删除成功", life: 2000 });
          getAccountInfoListFn();
        }
      }
    },
    reject: () => {},
  });
};

const toggleBlacklistPopover = (
  event: Event,
  accountData: tDbAccountInfoRes
) => {
  viewActiveAccount.value = accountData;
  op.value.toggle(event);
};

const formatSuggestions = (event: any) => {
  let input: string = event.query.trim();
  if (!input) {
    event.suggestions = [];
    suggestions.value = [];
    return;
  }
  // 只允许字母和数字
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(input)) {
    event.suggestions = [];
    suggestions.value = [];
    return;
  }
  // 自动补全 -USDT 后缀
  input = input.toUpperCase() + "-USDT";
  // 过滤已存在的
  const exists = viewActiveAccount.value?.black_list.includes(input);
  if (!exists) {
    event.suggestions = [input];
  } else {
    event.suggestions = [];
  }
  suggestions.value = event.suggestions;
};

// 添加黑名单（只允许一个）
const addToBlacklist = () => {
  if (!newBlacklistItem.value || !viewActiveAccount.value) return;
  // 只保留一个
  viewActiveAccount.value.black_list.push(newBlacklistItem.value);
  addOrEditAccountAction(viewActiveAccount.value);
  newBlacklistItem.value = "";
};

// 移除黑名单
const removeFromBlacklist = (blacklistItem: string) => {
  if (!viewActiveAccount.value) return;
  viewActiveAccount.value.black_list =
    viewActiveAccount.value.black_list.filter(
      (item: string) => item !== blacklistItem
    );
  addOrEditAccountAction(viewActiveAccount.value);
};

const addOrEditAccountAction = async (fromData: tDbAccountInfoRes) => {
  const res = await addOrEditAccountInfo({
    ...fromData,
    framework_id: props.frameWorkId || "",
  });
  if (res.result === true) {
    toast.add({ severity: "success", summary: "操作成功", life: 2000 });
    getAccountInfoListFn();
  }
};

const toggleLeveragePopover = (
  event: Event,
  accountData: tDbAccountInfoRes
) => {
  viewActiveAccount.value = accountData;
  leverageEditValue.value = viewActiveAccount.value?.leverage || 1;
  if (leveragePopoverRef.value) {
    leveragePopoverRef.value.toggle(event);
  }
};

const onLeverageConfirmClick = () => {
  if (leverageEditValue.value && leverageEditValue.value > 1) {
    refLeverageConfirmDialog.value?.openDialog();
  } else {
    saveLeverage();
  }
};

const saveLeverage = async () => {
  if (!viewActiveAccount.value) return;
  viewActiveAccount.value.leverage = leverageEditValue.value;
  await addOrEditAccountAction(viewActiveAccount.value);
};

const closeLeveragePopover = () => {
  leveragePopoverRef.value.hide();
};

const cancelLeverageChange = () => {
  leverageEditValue.value = 1;
};

const saveLeverageConfirm = () => {
  saveLeverage();
};

const lockAccountFn = async (accountData: tDbAccountInfoRes) => {
  const res = await lockAccount(
    props.frameWorkId,
    accountData.account_name,
    !accountData.is_lock
  );
  if (res.result === true && res.data?.is_lock === !accountData.is_lock) {
    toast.add({ severity: "success", summary: "操作成功", life: 2000 });
    getAccountInfoListFn();
  }
};

defineExpose({
  openAddAccountForm,
  frameWorkId: props.frameWorkId,
  getAccountInfoListFn,
});
</script>

<style scoped>
/* 隐藏默认的 "No file chosen" */
:deep(.p-fileupload-basic span) {
  display: none;
}

:deep(.p-fileupload-basic .p-fileupload-choose-button span) {
  display: inline-block;
}
</style>
