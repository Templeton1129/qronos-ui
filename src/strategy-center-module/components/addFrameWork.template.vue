<template>
  <Button
    class="hidden sm:inline-flex"
    label="新增框架"
    icon="pi pi-plus"
    variant="text"
    @click="toggleMenu"
  />
  <Menu ref="refMenu" :model="menuItems" popup class="min-w-35" />

  <Dialog
    v-model:visible="viewIsOpenOfficialDialog"
    header="下载官网框架"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="w-[90vw] sm:w-[600px] max-w-full"
  >
    <div class="px-4 py-2 flex flex-col gap-4">
      <Select
        v-model="selectFarmWorkId"
        name="id"
        :options="frameWorkVersionList"
        optionValue="id"
        optionLabel="name"
        filter
        placeholder="请选择框架版本"
        emptyFilterMessage="无该框架版本"
        emptyMessage="暂无新框架"
        class="w-full min-h-10"
        :optionDisabled="
          (option) => option.status === frameWorkDownloadStatusEnum.finished
        "
      >
        <template #value="slotProps">
          <div
            v-if="slotProps.value"
            class="flex items-center justify-between w-full"
          >
            <template v-for="item in frameWorkVersionList" :key="item.id">
              <template v-if="item.id === slotProps.value">
                <div class="flex gap-1 items-center">
                  <template v-if="item.course_name.split('-')[1]">
                    <Tag
                      :severity="
                        yearSeverityMap[item.course_name.split('-')[1]]
                      "
                      class="text-xs font-mono p-1 py-0.5"
                      >{{ item.course_name.split("-")[1] }}</Tag
                    >
                  </template>
                  <div>{{ item.name }}</div>
                </div>
                <i
                  v-if="item.status === frameWorkDownloadStatusEnum.finished"
                  class="pi pi-check-circle text-green-400"
                ></i>
                <i
                  v-else-if="
                    item.status === frameWorkDownloadStatusEnum.downloading
                  "
                  class="pi pi-spinner-dotted"
                ></i>
                <i v-else class="pi pi-arrow-circle-down"></i>
              </template>
            </template>
          </div>
          <span v-else class="flex items-center justify-between w-full">{{
            slotProps.placeholder
          }}</span>
        </template>
        <template #option="slotProps">
          <div class="flex items-center justify-between w-full">
            <div class="flex gap-2 items-center">
              <template v-if="slotProps.option.course_name.split('-')[1]">
                <Tag
                  class="text-xs font-mono p-1 py-0.5"
                  :severity="
                    yearSeverityMap[slotProps.option.course_name.split('-')[1]]
                  "
                  >{{ slotProps.option.course_name.split("-")[1] }}</Tag
                >
              </template>
              <div>{{ slotProps.option.name }}</div>
            </div>
            <i
              v-if="
                slotProps.option.status === frameWorkDownloadStatusEnum.finished
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
    </div>
    <template #footer>
      <Button
        label="取消"
        text
        severity="secondary"
        @click="viewIsOpenOfficialDialog = false"
      />
      <Button
        label="确定"
        outlined
        @click="downloadFrameWorkAction"
        :disabled="!selectFarmWorkId"
      />
    </template>
  </Dialog>

  <ImportCustomFrameWorkZipTemplate
    ref="refImportZipDialog"
    frameworkNamePrefix="usr_"
    :existingFrameworkNames="exitFramwWorkName"
    zipPrefix="usr_"
    :maxFileSize="50 * 1024 * 1024"
    @onImportSuccess="emit('onImportSuccess')"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import ImportCustomFrameWorkZipTemplate from "@/strategy-center-module/components/importCustomFrameWorkZip.template.vue";
import {
  addFrameWorkVersion,
  frameWorkDownloadStatusEnum,
} from "@/common-module/services/service.provider";

const props = defineProps<{
  frameWorkVersionList: vFrameWorkVersionItem[];
  frameWorkStatusList: tDbFrameWorkStatusRes[];
}>();

const emit = defineEmits<{
  onOfficialDownload: [string];
  onImportSuccess: [];
}>();

const refMenu = ref();
const refImportZipDialog = ref<InstanceType<
  typeof ImportCustomFrameWorkZipTemplate
> | null>(null);
const viewIsOpenOfficialDialog = ref(false);
const selectFarmWorkId = ref<string | null>(null);

const yearSeverityMap: { [key: string]: string } = {
  "2025": "",
  "2026": "info",
};

const exitFramwWorkName = computed<string[]>(() => {
  return props.frameWorkStatusList.map((item) => item.framework_name);
});

const menuItems = [
  {
    label: "下载官网框架",
    icon: "pi pi-download",
    command: () => {
      selectFarmWorkId.value = null;
      viewIsOpenOfficialDialog.value = true;
    },
  },
  {
    label: "导入自研框架",
    icon: "pi pi-file-import",
    command: () => refImportZipDialog.value?.openDialog(),
  },
];

const toggleMenu = (event: Event) => {
  refMenu.value?.toggle(event);
};

const downloadFrameWorkAction = async () => {
  if (!selectFarmWorkId.value) return;
  const res = await addFrameWorkVersion(selectFarmWorkId.value);
  if (res.result === true) {
    viewIsOpenOfficialDialog.value = false;
    toast.add({
      severity: "success",
      summary: "框架下载请求已提交",
      life: 2000,
    });
    emit("onOfficialDownload", selectFarmWorkId.value);
  }
};
</script>
