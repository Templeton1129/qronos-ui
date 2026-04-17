<template>
  <div class="h-full w-full p-2 sm:p-6">
    <div class="flex flex-col gap-2 sm:gap-4 w-full items-center">
      <!-- 顶部导航栏 -->
      <div class="flex items-center justify-between gap-4 w-full max-w-6xl">
        <!-- 顶部导航栏骨架屏 -->
        <template v-if="viewDownloadIsLoading">
          <div class="min-w-0 flex-1">
            <div class="w-full">
              <div class="flex space-x-2">
                <Skeleton
                  height="3rem"
                  class="rounded-md w-full sm:w-[80%]"
                ></Skeleton>
              </div>
            </div>
          </div>
          <Skeleton
            height="2.5rem"
            class="rounded-md hidden sm:block w-[20%]"
          ></Skeleton>
        </template>
        <template v-else>
          <div class="min-w-0 flex-1">
            <Tabs :value="currentFarmWorkId" scrollable class="w-full border-0">
              <TabList class="flex space-x-2">
                <Tab
                  v-for="tab in viewTabList"
                  :key="tab.framework_id"
                  :value="tab.id"
                  @click="tabClick(tab.id)"
                  class="px-3 py-2 border-none"
                >
                  <div class="flex items-center gap-2">
                    <span>
                      {{ tab.framework_name }}
                    </span>
                    <div class="flex items-center">
                      <Button
                        v-if="
                          tab.id !== 0 &&
                          getNewFramWorkInfo(
                            tab.framework_name,
                            tab.framework_id,
                            tab.type
                          )
                        "
                        icon="pi pi-arrow-up"
                        size="small"
                        class="p-0 w-7 h-7"
                        rounded
                        text
                        severity="success"
                        v-tooltip="'升级框架'"
                        @click.stop="
                          upateFrameWork(
                            tab.framework_name,
                            tab.framework_id,
                            tab.type
                          )
                        "
                      />
                      <Button
                        v-if="tab.id !== 0"
                        icon="pi pi-trash"
                        size="small"
                        class="p-0 w-7 h-7"
                        rounded
                        text
                        severity="danger"
                        v-tooltip="'删除框架'"
                        @click.stop="
                          deleteFrameWork(tab.framework_id, tab.framework_name)
                        "
                      />
                    </div>
                  </div>
                </Tab>
              </TabList>
            </Tabs>
          </div>
          <AddFrameWork
            :frameWorkVersionList="viewFrameWorkVersionList"
            :frameWorkStatusList="viewFrameWorkStatusList"
            @onOfficialDownload="onOfficialDownloadAction"
            @onImportSuccess="loadData"
          />
        </template>
      </div>
      <!-- 汇总框架 -->
      <div
        class="flex flex-col w-full max-w-6xl gap-2"
        v-if="currentFarmWorkId === 0"
      >
        <!-- items骨架屏 -->
        <div v-if="viewDownloadIsLoading === true" class="felx-1 space-y-4">
          <template v-for="item in 4">
            <div class="flex justify-between items-center gap-2">
              <Skeleton height="1.5rem" class="rounded flex-1"></Skeleton>

              <Skeleton shape="circle" width="2rem" height="2rem"></Skeleton>

              <Skeleton width="6rem" height="2rem" class="rounded"></Skeleton>

              <Skeleton width="4rem" height="2rem" class="rounded"></Skeleton>
            </div>
          </template>
        </div>
        <Detail
          v-else-if="
            viewDownloadIsLoading === false &&
            viewFrameWorkStatusList.length > 0
          "
          tabType="all"
          :framWorkData="viewFrameWorkStatusList"
        />
        <div
          class="p-2 sm:px-6"
          v-else-if="
            viewDownloadIsLoading === false &&
            viewFrameWorkStatusList.length === 0
          "
        >
          你目前暂无框架，请先新增框架！
        </div>
        <!-- 单个详情 -->
      </div>
      <!-- 单个框架 -->
      <div class="flex flex-col w-full gap-2" v-else>
        <Detail tabType="item" :framWorkData="currentFarmWorkData" />
      </div>
    </div>
    <div class="sm:hidden text-xs text-gray-400 text-center pt-2">
      新增框架，账户配置，因子库导入等功能请在PC端操作！
    </div>

    <!-- 升级框架 -->
    <UpdateFrameWorkDialog
      ref="refUpdateFrameWorkDialog"
      @refreshStrategyCenter="loadData"
    />
    <!-- 删除框架 -->
    <DeleteFrameWorkDialog
      ref="refDeleteFrameWorkDialog"
      @refreshStrategyCenter="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import Detail from "@/strategy-center-module/components/detail.template.vue";
import AddFrameWork from "@/strategy-center-module/components/addFrameWork.template.vue";
import UpdateFrameWorkDialog from "@/strategy-center-module/components/updateFrameWork.template.vue";
const refUpdateFrameWorkDialog = ref<InstanceType<
  typeof UpdateFrameWorkDialog
> | null>(null);

import DeleteFrameWorkDialog from "@/strategy-center-module/components/deleteFrameWork.template.vue";
const refDeleteFrameWorkDialog = ref<InstanceType<
  typeof DeleteFrameWorkDialog
> | null>(null);

import {
  getframWorkVersionList,
  getFrameWorkStatus,
  frameWorkDownloadStatusEnum,
} from "@/common-module/services/service.provider";

const route = useRoute();
const router = useRouter();

const currentFarmWorkId = ref<number>(0);

const viewTabList = computed(() => {
  return [
    {
      id: 0,
      framework_id: "0",
      status: "",
      type: "",
      time: "",
      framework_name: "汇总框架",
      path: "",
      source: "",
    },
    ...viewFrameWorkStatusList.value,
  ];
});
const viewFrameWorkStatusList = ref<tDbFrameWorkStatusRes[]>([]);
const viewFrameWorkVersionList = ref<vFrameWorkVersionItem[]>([]);
const viewDownloadIsLoading = ref<boolean>(true);
const downloadFrameWorkStatusTimer = ref<ReturnType<typeof setTimeout> | null>(
  null
);

const selectFarmWorkId = ref<string | null>(null);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  await getframWorkVersionListFn();
  await startDownloadFrameWorkStatusTimer();

  // 页面加载完成后，获取路由参数中的id
  if (route.params && route.params.id) {
    // 如果路由参数中有id，则设置选择的框架ID
    if (route.params.id === "0") {
      currentFarmWorkId.value = 0;
      return;
    }

    if (viewTabList.value.find((item) => item.id === Number(route.params.id))) {
      currentFarmWorkId.value = Number(route.params.id);
    } else {
      currentFarmWorkId.value = 0;
      router.replace({
        name: route.name,
        params: { id: currentFarmWorkId.value },
      });
    }
  } else {
    currentFarmWorkId.value = 0;
    router.push({
      name: route.name,
      params: { id: currentFarmWorkId.value },
    });
  }
};

const currentFarmWorkData = computed(() => {
  // 根据当前选择的框架ID获取对应的框架数据
  let output: any = [];
  if (currentFarmWorkId.value !== 0) {
    let temp = viewTabList.value.find(
      (item) => item.id === currentFarmWorkId.value
    );
    output = temp ? [temp] : [];
  }
  return output;
});

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      currentFarmWorkId.value = Number(newId) || 0;
    }
  }
);

const startDownloadFrameWorkStatusTimer = async (failed: boolean = false) => {
  clearDownloadFrameWorkStatusTimer(); // 先清除可能存在的旧定时器
  await executeDownloadStatusCheck(failed); // 立即执行第一次检查
};

const executeDownloadStatusCheck = async (failed: boolean = false) => {
  viewDownloadIsLoading.value = true;

  try {
    const res = await getFrameWorkStatus();

    if (res.result === true) {
      viewFrameWorkStatusList.value = res.data;
      formatData();

      // 情况1: 没有数据
      if (!res.data || res.data.length === 0) {
        viewDownloadIsLoading.value = false;
        selectFarmWorkId.value = null;
        return; // 停止轮询
      }

      // 情况2: 失败处理
      if (failed) {
        const isFailed = res.data.find(
          (item) =>
            item.framework_id === selectFarmWorkId.value &&
            item.status === frameWorkDownloadStatusEnum.failed
        );
        if (isFailed) {
          toast.add({
            severity: "error",
            summary: "下载失败，请重新下载！",
            life: 2000,
          });
          viewDownloadIsLoading.value = false;
          selectFarmWorkId.value = null;
          return; // 停止轮询
        }
      }

      // 情况3: 检查下载状态
      const isDownloading = res.data.some(
        (item: tDbFrameWorkStatusRes) =>
          item.status === frameWorkDownloadStatusEnum.downloading ||
          item.status === frameWorkDownloadStatusEnum.notDownloaded
      );

      if (!isDownloading) {
        viewDownloadIsLoading.value = false;
        selectFarmWorkId.value = null;
        return; // 停止轮询
      }
    } else {
      // API请求失败
      toast.add({
        severity: "error",
        summary: "获取框架状态失败",
        life: 2000,
      });
      viewDownloadIsLoading.value = false;
      return; // 停止轮询
    }
  } catch (error) {
    return;
  }

  // 继续轮询
  downloadFrameWorkStatusTimer.value = setTimeout(() => {
    executeDownloadStatusCheck(failed);
  }, 3000);
};

const clearDownloadFrameWorkStatusTimer = () => {
  if (downloadFrameWorkStatusTimer.value) {
    clearTimeout(downloadFrameWorkStatusTimer.value);
    downloadFrameWorkStatusTimer.value = null;
  }
};

const getframWorkVersionListFn = async () => {
  const res = await getframWorkVersionList();
  if (res.result === true) {
    viewFrameWorkVersionList.value = res.data;
  }
};

const formatData = () => {
  if (
    !viewFrameWorkVersionList.value.length ||
    !viewFrameWorkStatusList.value.length
  )
    return;
  // 处理框架版本数据
  for (let item of viewFrameWorkVersionList.value) {
    let findItemIndex = viewFrameWorkStatusList.value.findIndex(
      (item1: tDbFrameWorkStatusRes) => item1.framework_id === item.id
    );

    if (findItemIndex !== -1) {
      item.status = viewFrameWorkStatusList.value[findItemIndex].status;
    }
  }
};

const onOfficialDownloadAction = (frameworkId: string) => {
  selectFarmWorkId.value = frameworkId;
  setTimeout(() => {
    startDownloadFrameWorkStatusTimer(true);
  }, 2000);
};

const tabClick = (tabValue: number) => {
  currentFarmWorkId.value = tabValue;
  // 路由跳转到对应的框架详情页
  router.push({ name: route.name, params: { id: tabValue } });
};

// 删除框架
const deleteFrameWork = (frameworkId: string, frameworkName: string) => {
  if (refDeleteFrameWorkDialog.value) {
    refDeleteFrameWorkDialog.value.openDialog(frameworkId, frameworkName);
  }
};

/**
 * 检查并获取框架的最新可用版本信息
 * 当前框架名称
 * 当前框架ID
 * 如果有新版本则返回新版本信息，否则返回null
 */
const getNewFramWorkInfo = (
  oldFrameworkName: string,
  framework_id: string,
  framework_type: string
): vFrameWorkVersionItem | null => {
  // 如果没有版本列表数据，直接返回null
  if (!viewFrameWorkVersionList.value?.length) {
    return null;
  }

  // 获取同类型框架的版本列表并按时间排序
  const versionList = viewFrameWorkVersionList.value
    .filter((item) => item.framework_type === framework_type)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // 检查是否存在新版本
  const latestVersion = versionList[0];
  if (
    !latestVersion ||
    latestVersion.id === framework_id ||
    latestVersion.name === oldFrameworkName
  ) {
    return null;
  }

  return latestVersion;
};

// 升级框架
const upateFrameWork = (
  oldFrameworkName: string,
  oldFrameworkId: string,
  framework_type: string
) => {
  const newFramework: vFrameWorkVersionItem | null = getNewFramWorkInfo(
    oldFrameworkName,
    oldFrameworkId,
    framework_type
  );
  if (newFramework) {
    if (refUpdateFrameWorkDialog.value) {
      refUpdateFrameWorkDialog.value.openDialog({
        oldFrameworkId,
        oldFrameworkName,
        newFrameworkId: newFramework.id || "",
        newFrameworkName: newFramework.name || "",
      });
    }
  }
};

onUnmounted(() => {
  clearDownloadFrameWorkStatusTimer();
});

onBeforeRouteLeave(() => {
  clearDownloadFrameWorkStatusTimer();
});
</script>

<style scoped>
:deep(.p-tabs),
:deep(.p-tablist-tab-list) {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
