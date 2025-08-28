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
                        ref="refUpdateFrameWorkButton"
                        v-if="
                          tab.id !== 0 &&
                          getNewFramWorkInfo(
                            tab.framework_name,
                            tab.framework_id
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
                          upateFrameWork(tab.framework_id, tab.framework_name)
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
          <Button
            class="hidden sm:inline-flex"
            label="新增框架"
            icon="pi pi-plus"
            @click="openFrameWorkDialog"
            variant="text"
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
          您目前暂无框架，请先新增框架！
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
    <!-- 新增框架弹窗 -->
    <Dialog
      v-model:visible="isOpenAddFrameWorkDialog"
      header="新增框架"
      :modal="true"
      :closable="true"
      class="w-[90vw] sm:w-[600px] max-w-full"
    >
      <template #default>
        <div class="px-4 py-2 flex flex-col gap-6">
          <RadioButtonGroup v-model="viewAddType" class="flex gap-6">
            <div class="flex gap-2 items-center">
              <RadioButton inputId="official" name="addType" value="official" />
              <label for="official" class="mr-4">下载官网框架</label>
            </div>
            <div class="flex gap-2 items-center">
              <RadioButton
                inputId="custom"
                name="addType"
                value="custom"
                :disabled="true"
              />
              <label for="custom">自定义框架(目前不支持)</label>
            </div>
          </RadioButtonGroup>

          <div class="space-y-4">
            <template v-if="viewAddType === 'official'">
              <Select
                v-model="selectFarmWorkId"
                name="id"
                :options="viewFrameWorkVersionList"
                optionValue="id"
                optionLabel="name"
                filter
                placeholder="请选择框架版本"
                emptyFilterMessage="无该框架版本"
                emptyMessage="暂无新框架"
                class="w-full min-h-10"
                :optionDisabled="
                  (option) =>
                    option.status === frameWorkDownloadStatusEnum.finished
                "
              >
                <template #value="slotProps">
                  <div
                    v-if="slotProps.value"
                    class="flex items-center justify-between w-full"
                  >
                    <template
                      v-for="item in viewFrameWorkVersionList"
                      :key="item.id"
                    >
                      <template v-if="item.id === slotProps.value">
                        <div>{{ item.name }}</div>
                        <i
                          v-if="
                            item.status === frameWorkDownloadStatusEnum.finished
                          "
                          class="pi pi-check-circle text-green-400"
                        ></i>
                        <i
                          v-else-if="
                            item.status ===
                            frameWorkDownloadStatusEnum.downloading
                          "
                          class="pi pi-spinner-dotted"
                        ></i>
                        <i v-else class="pi pi-arrow-circle-down"></i>
                      </template>
                    </template>
                  </div>
                  <span v-else class="flex items-center justify-between w-full">
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center justify-between w-full">
                    <div>{{ slotProps.option.name }}</div>
                    <i
                      v-if="
                        slotProps.option.status ===
                        frameWorkDownloadStatusEnum.finished
                      "
                      class="pi pi-check-circle text-green-400"
                    ></i>
                    <i
                      v-else-if="
                        slotProps.option.status ===
                        frameWorkDownloadStatusEnum.downloading
                      "
                      class="pi pi-spinner-dotted"
                    ></i>
                    <i v-else class="pi pi-arrow-circle-down"></i>
                  </div>
                </template>
              </Select>
            </template>
            <template v-else>
              <div>
                <label class="block text-sm font-medium mb-1"
                  ><span class="text-red-500 mr-1">*</span
                  >本地框架路径(绝对路径)</label
                >
                <InputText
                  v-model="viewCustomFrameWorkPath"
                  class="w-full"
                  placeholder="如 /home/youruser/myproject/xxx"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
      <template #footer>
        <Button
          label="取消"
          text
          severity="secondary"
          @click="isOpenAddFrameWorkDialog = false"
          autofocus
        />
        <Button
          label="确定"
          outlined
          @click="downloadFrameWorkAction"
          autofocus
          :disabled="!selectFarmWorkId"
        />
      </template>
    </Dialog>

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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import Detail from "@/strategy-center-module/components/detail.template.vue";
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
  addFrameWorkVersion,
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
const isOpenAddFrameWorkDialog = ref<boolean>(false);

const viewAddType = ref<string>("official"); //official官方提供 custom自定义
const viewCustomFrameWorkPath = ref<string>("");
const refUpdateFrameWorkButton = ref<any>(null);

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

const openFrameWorkDialog = () => {
  isOpenAddFrameWorkDialog.value = true;
};

const downloadFrameWorkAction = async () => {
  if (selectFarmWorkId.value) {
    const res = await addFrameWorkVersion(selectFarmWorkId.value);
    if (res.result === true) {
      isOpenAddFrameWorkDialog.value = false;
      toast.add({
        severity: "success",
        summary: "框架下载请求已提交",
        life: 2000,
      });
      setTimeout(() => {
        startDownloadFrameWorkStatusTimer(true);
      }, 2000);
    }
  }
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
  framework_id: string
): vFrameWorkVersionItem | null => {
  // 如果没有版本列表数据，直接返回null
  if (!viewFrameWorkVersionList.value?.length) {
    return null;
  }

  // 获取当前框架的分类ID
  const currentFramework = viewFrameWorkVersionList.value.find(
    (item: vFrameWorkVersionItem) => item.id === framework_id
  );

  if (!currentFramework?.classId) {
    return null;
  }

  // 获取同类型框架的版本列表并按时间排序
  const versionList = viewFrameWorkVersionList.value
    .filter((item) => item.classId === currentFramework.classId)
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
const upateFrameWork = (oldFrameworkId: string, oldFrameworkName: string) => {
  const newFramework: vFrameWorkVersionItem | null = getNewFramWorkInfo(
    oldFrameworkName,
    oldFrameworkId
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
