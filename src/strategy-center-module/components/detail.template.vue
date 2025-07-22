<template>
  <div class="flex flex-col items-center w-full space-y-4">
    <div
      v-for="frameWorkDataItem of framWorkData"
      :key="frameWorkDataItem.framework_id"
      class="space-y-2 sm:space-y-4 w-full flex flex-col items-center"
    >
      <!-- 跑马灯 -->
      <MarqueeTemplate
        v-if="tabType === `item` && viewGlobalConfigData?.is_debug === true"
        content="当前是debug模式，不会真正下单产生真实的金钱交易！"
      />
      <!--框架运行情况及控制  -->
      <RunStatusAndOperationTemplate
        :isLoading="viewIsLoading"
        :tabType="tabType"
        :currentId="frameWorkDataItem.id"
        :frameWorkName="frameWorkDataItem.framework_name"
        :frameWorkId="frameWorkDataItem.framework_id"
        :frameWorkType="frameWorkDataItem.type"
        :runStatus="getRunStatus(frameWorkDataItem.framework_id)"
        :logTypeList="getLogTypeList(frameWorkDataItem.framework_id)"
        :globalConfigData="viewGlobalConfigData"
        @refreshGlobalConfigData="
          getGlobalConfigDataFn(frameWorkDataItem.framework_id)
        "
        @refreshRunStatusList="startFrameWorkRunStatusTimer"
        @openAddAccount="(frameWorkId:string) => openAddAccountForm(frameWorkId)"
      />

      <AccountManageTemplate
        v-if="tabType === `item`"
        ref="refAccountManageTemplate"
        :runStatus="getRunStatus(frameWorkDataItem.framework_id)"
        :frameWorkId="frameWorkDataItem.framework_id"
        :frameWorkType="frameWorkDataItem.type"
      />

      <div
        class="hidden sm:flex -mt-8 w-full max-w-6xl justify-center gap-2 sm:gap-4 flex-wrap"
        v-if="tabType === `item`"
      >
        <!--factors  -->
        <UploadFilesTemplate
          :frameWorkId="frameWorkDataItem.framework_id"
          uploadName="因子库"
          :uploadType="uploadFolderEnum.factors"
        />
        <!--sections -->
        <UploadFilesTemplate
          :frameWorkId="frameWorkDataItem.framework_id"
          uploadName="截面因子库"
          :uploadType="uploadFolderEnum.sections"
        />
        <!--positions -->
        <UploadFilesTemplate
          v-if="frameWorkDataItem.type === frameWorkTypeEnum.position"
          :frameWorkId="frameWorkDataItem.framework_id"
          uploadName="仓位管理策略"
          :uploadType="uploadFolderEnum.positions"
        />
        <!--signals -->
        <UploadFilesTemplate
          :frameWorkId="frameWorkDataItem.framework_id"
          uploadName="择时因子库"
          :uploadType="uploadFolderEnum.signals"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted, nextTick } from "vue";
import MarqueeTemplate from "@/common-module/components/marquee.template.vue";
import RunStatusAndOperationTemplate from "@/strategy-center-module/components/runStatusAndOperation.template.vue";
import AccountManageTemplate from "@/strategy-center-module/components/accountManage.template.vue";
const refAccountManageTemplate = ref<
  InstanceType<typeof AccountManageTemplate>[]
>([]);
import UploadFilesTemplate from "@/strategy-center-module/components/uploadFiles.template.vue";

import {
  getFrameWorkRunStatus,
  framwWorkRunStatusEnum,
  dataCenterStatusEnum,
  getDataCenterConfig,
  uploadFolderEnum,
  frameWorkTypeEnum,
} from "@/common-module/services/service.provider";
const props = defineProps<{
  tabType: string; //all汇总 item单个
  framWorkData: tDbFrameWorkStatusRes[];
}>();
const viewIsLoading = ref(true); // 新增加载状态
const runStatuslList = ref<tDbFrameWorkRunStatusRes[]>([]);
const frameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const viewGlobalConfigData = ref({
  is_debug: false,
  error_webhook_url: "",
});

onMounted(async () => {
  startFrameWorkRunStatusTimer();
});

const getRunStatus = (framework_id: string) => {
  let runStatusItem = runStatuslList.value.find(
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
  try {
    const res = await getFrameWorkRunStatus();
    if (res.result === true && res.data && res.data.length > 0) {
      runStatuslList.value = res.data;

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
        return;
      }
    } else {
      viewIsLoading.value = false;
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

const getLogTypeList = (framework_id: string) => {
  let output: tDbFrameWorkRunStatusRes[] = [];
  let currentFarmWorkData = runStatuslList.value.filter(
    (item) => item.framework_id === framework_id
  );
  if (currentFarmWorkData) {
    output = currentFarmWorkData;
  }

  return output;
};

const getGlobalConfigDataFn = async (framework_id: string) => {
  const res = await getDataCenterConfig(framework_id);
  if (res.result === true) {
    viewGlobalConfigData.value.is_debug = res.data?.is_debug || false;
    viewGlobalConfigData.value.error_webhook_url =
      res.data?.error_webhook_url || "";
  }
};

onUnmounted(() => {
  clearFrameWorkRunStatusTimer();
});

const openAddAccountForm = async (frameWorkId: string) => {
  await nextTick();
  if (refAccountManageTemplate.value) {
    const targetComponent = refAccountManageTemplate.value.find(
      (component) => component.frameWorkId === frameWorkId
    );
    if (targetComponent) {
      targetComponent.openAddAccountForm();
    }
  }
};
</script>

<style scoped>
/* 更平滑的动画效果 */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-80%);
  }
}
.animate-marquee {
  animation: marquee 14s linear infinite;
  animation-delay: 1s; /* 初始延迟避免页面加载时突兀 */
  cursor: pointer;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* 暗黑模式适配 */
.dark .pi {
  filter: brightness(1.2);
}
</style>
