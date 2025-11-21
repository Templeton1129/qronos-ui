<template>
  <card class="flex-1 dark:border-1 dark:border-[#3d3d3d]">
    <template #title>
      <template v-if="isloading === true">
        <div class="flex justify-between items-center text-lg">
          <Skeleton
            width="40%"
            height="2.2rem"
            class="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          ></Skeleton>
          <Skeleton
            width="20%"
            height="2.2rem"
            class="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          ></Skeleton>
        </div>
        <Skeleton
          width="100%"
          height="1.5rem"
          class="mt-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
        ></Skeleton>
      </template>
      <template v-else>
        <div class="flex justify-between items-center text-lg">
          <div class="cursor-default">{{ props.uploadName }}</div>
          <div class="relative">
            <input
              ref="folderInput"
              type="file"
              webkitdirectory
              directory
              multiple
              class="absolute inset-0 opacity-0 z-10 w-8 h-8 cursor-pointer pointer-events-none"
              @change="folderChange"
            />
            <Button
              icon="pi pi-folder-open"
              @click="triggerFolderInput"
              variant="outlined"
              severity="secondary"
              size="small"
              class="cursor-pointer"
            />
          </div>
        </div>
        <div class="text-sm text-gray-500">{{ props.uploadType }}</div>
      </template>
    </template>
    <template #content>
      <!-- 因子库列表骨架屏 -->
      <div
        class="w-full border-0 bg-transparent shadow-none text-sm"
        v-if="isloading === true"
      >
        <div class="max-h-[160px] overflow-hidden space-y-2">
          <Skeleton
            v-for="i in 4"
            :key="i"
            width="100%"
            height="1.5rem"
            class="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          ></Skeleton>
        </div>
      </div>
      <Listbox
        v-else
        :options="uploadedFileList"
        listStyle="max-height:160px"
        class="w-full border-0 bg-transparent shadow-none text-sm"
        emptyMessage="暂无上传文件"
        :pt="{
          option: {
            class: 'px-2 py-2',
          },
        }"
      ></Listbox>
    </template>
  </card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import {
  getUploadFiles,
  uploadFiles,
} from "@/common-module/services/service.provider";

const props = defineProps<{
  uploadName: string;
  frameWorkId: string;
  uploadType: string;
}>();

const toast = useToast();
const folderInput = ref<HTMLInputElement | null>(null);
const uploadedFileList = ref<string[]>([]);
const isloading = ref<boolean>(false);

onMounted(() => {
  getUploadFilesFn();
});

const getUploadFilesFn = async () => {
  isloading.value = true;
  const res = await getUploadFiles(props.frameWorkId, props.uploadType);
  isloading.value = false;
  if (res.result && res.data) {
    uploadedFileList.value = res.data;
  } else {
    uploadedFileList.value = [];
  }
};

const triggerFolderInput = () => {
  folderInput.value?.click();
};

const folderChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;

  if (!files || files.length === 0) return;

  // 过滤非.py文件
  const pythonFiles = Array.from(files).filter((file) =>
    file.name.toLowerCase().endsWith(".py")
  );

  if (pythonFiles.length === 0) {
    toast.add({
      severity: "error",
      summary: "文件类型错误",
      detail: "只能上传.py文件",
      life: 8000,
    });
    input.value = "";
    return;
  }

  if (pythonFiles.length > 100) {
    toast.add({
      severity: "error",
      summary: "选择文件夹失败",
      detail: "最多上传100个文件",
      life: 8000,
    });
    input.value = "";
    return;
  }

  const formData = new FormData();
  for (const file of pythonFiles) {
    const relPath = (file as any).webkitRelativePath;
    formData.append("files", file, relPath || file.name);
  }

  try {
    const res = await uploadFiles(
      props.frameWorkId,
      props.uploadType,
      formData
    );

    if (res.result && res.data?.saved_files) {
      toast.add({
        severity: "success",
        summary: "上传成功",
        detail: `已上传${res.data?.saved_files.join(", ")}`,
        life: 8000,
      });
      getUploadFilesFn();
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "上传失败",
      detail: error.message,
      life: 8000,
    });
  }

  input.value = "";
};
</script>

<style scoped>
:deep(.p-listbox-list) {
  padding: 0;
}

/* 将滚动条变窄 */
:deep(.p-listbox-list-container::-webkit-scrollbar) {
  width: 4px;
}

:deep(.p-listbox-list-container::-webkit-scrollbar-thumb) {
  background: #acacac;
  border-radius: 4px;
}
</style>
