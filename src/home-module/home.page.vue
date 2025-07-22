<template>
  <div class="h-full w-full p-2 sm:p-6 space-y-3 flex flex-col">
    <div class="flex gap-3">
      <!-- 数据中心卡片 -->
      <DataCenterModuleTemplate
        ref="refDataCenterModuleTemplate"
        :currentNewFrameWorkId="currentNewFrameWorkId"
        :frameWorkName="viewFrameWorkName"
        :downloadIsLoading="viewDownloadIsLoading"
      />
      <StrategyCenterModuleTemplate
        :downloadIsLoading="viewDownloadIsLoading"
        :frameWorkList="frameWorkList"
      />
    </div>

    <!-- 操作区和账户卡片区 -->
    <AccountListModuleTemplate />

    <VersionUpdataLogTemplate />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import DataCenterModuleTemplate from "@/home-module/components/dataCenterModule.template.vue";
const refDataCenterModuleTemplate = ref<InstanceType<
  typeof DataCenterModuleTemplate
> | null>(null);
import StrategyCenterModuleTemplate from "@/home-module/components/strategyCenterModule.template.vue";
import AccountListModuleTemplate from "@/home-module/components/accountListModule.template.vue";
import VersionUpdataLogTemplate from "@/common-module/components/versionUpdataLog.template.vue";

import {
  frameWorkDownloadStatusEnum,
  getAllFrameWorkStatusList,
} from "@/common-module/services/service.provider";

const viewDownloadIsLoading = ref<boolean>(false);
const frameWorkList = ref<tDbFrameWorkStatusRes[]>([]);
const currentNewFrameWorkId = ref<string>("");
const viewFrameWorkName = ref<string>("");
const downloadFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);

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
    const res = await getAllFrameWorkStatusList();

    if (res.result === true && res.data.length > 0) {
      frameWorkList.value = JSON.parse(JSON.stringify(res.data))
        .filter((item: tDbFrameWorkStatusRes) => item.type !== "data_center")
        .reverse();

      // 找到数据中心下载状态
      let temp = JSON.parse(JSON.stringify(res.data));
      temp = temp
        .filter((item: tDbFrameWorkStatusRes) => item.type === "data_center")
        .sort((a: tDbFrameWorkStatusRes, b: tDbFrameWorkStatusRes) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
      currentNewFrameWorkId.value = temp[0].framework_id;
      viewFrameWorkName.value = temp[0].framework_name;

      // 检查是否完成下载
      if (res.data[0].status === frameWorkDownloadStatusEnum.finished) {
        viewDownloadIsLoading.value = false;
        if (refDataCenterModuleTemplate.value) {
          refDataCenterModuleTemplate.value.startFrameWorkRunStatusTimer();
        }
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
</script>
