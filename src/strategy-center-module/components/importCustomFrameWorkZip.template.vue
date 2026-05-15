<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    modal
    :closable="true"
    :draggable="false"
    class="min-w-[92vw] max-w-[92vw] sm:min-w-[560px] sm:max-w-[640px]"
    :pt="{
      header: 'pb-3',
    }"
    :hide="clearDeclarationTimer"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-file-import text-lg"></i>
        <span class="font-semibold">导入自研框架</span>
      </div>
    </template>

    <div class="flex flex-col gap-4 text-gray-700 dark:text-gray-200">
      <div
        class="rounded-xl border border-amber-300/45 dark:border-amber-700/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-neutral-900 p-4"
      >
        <h4
          class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2"
        >
          <i class="pi pi-exclamation-triangle"></i>
          用户声明（必读）
        </h4>
        <div class="text-xs leading-6">
          <p>该功能属于高级功能，非专业人士请勿使用。</p>
          <ul>
            <li>
              1.
              上传的自定义框架，需要基于<strong>官方实盘框架</strong>的魔改版本，尽量保持框架是最新版
            </li>
            <li>2. 要求必须要有启动函数：<strong>`startup.py`</strong></li>
            <li>
              3.
              要求<strong>不能在`config.py`</strong>中增加新配置，网页版不会自动适配，新配置会失效
            </li>
            <li>
              4.
              可以在`accounts/账户.py`中的'account_config'，'strategy_config',
              strategy_pool'增加新配置
            </li>
          </ul>
        </div>
        <div class="pt-2 flex items-center gap-2">
          <Checkbox
            v-model="viewDeclarationChecked"
            inputId="import-declare"
            binary
            :disabled="viewDeclarationCountdown > 0"
          />
          <label
            for="import-declare"
            class="text-sm cursor-pointer select-none"
            :class="
              viewDeclarationCountdown > 0
                ? 'text-gray-400'
                : 'text-amber-800 dark:text-amber-200'
            "
          >
            {{
              viewDeclarationCountdown > 0
                ? `请阅读 ${viewDeclarationCountdown}s 后确认`
                : "我已阅读并理解风险"
            }}
          </label>
        </div>
      </div>

      <div class="text-xs text-gray-500 dark:text-neutral-400 px-1">
        勾选以上声明后，即可导入自研框架。
      </div>

      <Card class="border border-gray-200 dark:border-neutral-700">
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="w-full space-y-2">
              <div class="text-sm font-semibold">1. 输入框架名称</div>
              <InputGroup>
                <InputGroupAddon size="small">
                  {{ frameworkNamePrefix }}
                </InputGroupAddon>
                <InputText
                  v-model="viewFrameworkNameInput"
                  placeholder="请输入自研框架名称"
                  :disabled="!canStartImport"
                />
              </InputGroup>
              <div class="text-xs text-gray-500" v-if="viewFrameworkNameInput">
                最终名称：{{ fullFrameworkName || "--" }}
              </div>
              <span
                v-if="viewFrameworkNameError"
                class="text-red-500 text-xs"
                >{{ viewFrameworkNameError }}</span
              >
              <span v-if="viewWarningMessage" class="text-yellow-600 text-xs">
                {{ viewWarningMessage }}
              </span>
            </div>

            <div class="w-full space-y-2">
              <div class="text-sm font-semibold">2. 选择压缩包</div>

              <FileUpload
                ref="refFileUpload"
                mode="basic"
                :multiple="false"
                accept=".zip"
                :maxFileSize="maxFileSize"
                chooseLabel="选择压缩包"
                customUpload
                :showUploadButton="false"
                :showCancelButton="false"
                :disabled="!canStartImport"
                @select="fileSelectAction"
                :pt="{
                  root: {
                    class: 'justify-start text-xs',
                  },
                }"
              />

              <!-- 已选择的文件信息 -->
              <div v-if="viewSelectedFile" class="w-full">
                <div
                  class="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800/80 shadow-sm"
                >
                  <i class="pi pi-file-zip text-2xl text-blue-500"></i>
                  <div class="flex-1">
                    <div class="font-medium text-sm">
                      {{ viewSelectedFile.name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatFileSize(viewSelectedFile.size) }}
                    </div>
                  </div>
                  <Button
                    icon="pi pi-times"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    @click="removeFile"
                  />
                </div>
              </div>

              <!-- 错误信息 -->
              <span v-if="viewErrorMessage" class="text-red-500 text-xs">
                {{ viewErrorMessage }}
              </span>

              <div
                class="w-full text-sm text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-neutral-800/80 p-3 rounded-xl"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-info-circle text-primary-500"></i>
                    <div class="font-semibold">导入说明：</div>
                  </div>
                  <ul class="text-xs space-y-1 list-disc pl-6 tracking-wider">
                    <li>只支持ZIP格式压缩包</li>
                    <li>
                      <strong
                        >压缩包名称只能包含英文、数字、下划线或中划线</strong
                      >
                    </li>
                    <li>
                      上传前会自动添加<strong>“{{ zipPrefix }}”前缀</strong
                      >，避免与系统框架冲突
                    </li>
                    <li>
                      建议文件大小不超过 {{ formatFileSize(maxFileSize) }}
                    </li>
                    <li>上传后将自动解压并完成导入</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="取消"
          severity="secondary"
          outlined
          size="small"
          @click="viewIsOpenDialog = false"
        />
        <Button
          label="导入"
          size="small"
          :disabled="!canStartImport"
          :loading="viewIsloading"
          @click="uploadAction"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { importCustomFrameWorkZip } from "@/common-module/services/service.provider";
const toast = useToast();

const props = withDefaults(
  defineProps<{
    maxFileSize: number;
    zipPrefix: string;
    frameworkNamePrefix: string;
    existingFrameworkNames?: string[];
    existingZipNames?: string[];
  }>(),
  {
    frameworkNamePrefix: "usr_",
    zipPrefix: "usr_",
    existingFrameworkNames: () => [],
    existingZipNames: () => [],
  }
);

const $emit = defineEmits(["onImportSuccess"]);
const viewIsOpenDialog = ref<boolean>(false);
const refFileUpload = ref();
const viewSelectedFile = ref<File | null>(null);
const viewErrorMessage = ref<string>("");
const viewIsloading = ref<boolean>(false);
const viewFrameworkNameInput = ref<string>("");
const viewFrameworkNameError = ref<string>("");
const viewDeclarationChecked = ref<boolean>(false);
const viewDeclarationCountdown = ref<number>(10);
let viewDeclarationTimer: ReturnType<typeof setInterval> | null = null;

const frameworkNamePrefix = computed(() => props.frameworkNamePrefix || "");
const fullFrameworkName = computed(() => {
  const name = viewFrameworkNameInput.value?.trim() || "";
  if (!name) return "";
  return `${frameworkNamePrefix.value}${name}`;
});
const canStartImport = computed(
  () => viewDeclarationCountdown.value === 0 && viewDeclarationChecked.value
);

const clearDeclarationTimer = () => {
  if (viewDeclarationTimer) {
    clearInterval(viewDeclarationTimer);
    viewDeclarationTimer = null;
  }
};

const startDeclarationCountdown = () => {
  clearDeclarationTimer();
  viewDeclarationCountdown.value = 10;
  viewDeclarationChecked.value = false;
  viewDeclarationTimer = setInterval(() => {
    if (viewDeclarationCountdown.value <= 1) {
      viewDeclarationCountdown.value = 0;
      clearDeclarationTimer();
      return;
    }
    viewDeclarationCountdown.value -= 1;
  }, 1000);
};

// 重置表单
const resetForm = () => {
  viewSelectedFile.value = null;
  viewErrorMessage.value = "";
  viewIsloading.value = false;
  viewFrameworkNameInput.value = "";
  viewFrameworkNameError.value = "";
  startDeclarationCountdown();
  if (refFileUpload.value) {
    refFileUpload.value.clear();
  }
};

const openDialog = () => {
  resetForm();
  viewIsOpenDialog.value = true;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateFileType = (file: File): boolean => {
  const allowedTypes = [".zip"];
  const fileName = file.name.toLowerCase();
  return allowedTypes.some((type) => fileName.endsWith(type));
};

const fileSelectAction = (event: any) => {
  const files = event.files;
  if (files && files.length > 0) {
    const file = files[0];

    // 验证文件类型
    if (!validateFileType(file)) {
      viewErrorMessage.value = "请选择 .zip 格式的压缩包";
      return;
    }

    // 验证文件大小
    if (file.size > props.maxFileSize) {
      viewErrorMessage.value = `文件大小不能超过 ${formatFileSize(
        props.maxFileSize
      )}`;
      return;
    }

    // 压缩包名称只能包含：英文、数字、下划线或中划线（不要求必须包含）
    const pureName = file.name.replace(/\.zip$/i, "");
    if (!/^[A-Za-z0-9_-]+$/.test(pureName)) {
      viewErrorMessage.value = "压缩包名称只能包含英文、数字、下划线或中划线";
      return;
    }

    viewSelectedFile.value = file;
    viewErrorMessage.value = "";
  }
};

const removeFile = () => {
  viewSelectedFile.value = null;
  viewErrorMessage.value = "";
  if (refFileUpload.value) {
    refFileUpload.value.clear();
  }
};

const viewWarningMessage = computed(() => {
  const duplicated = (props.existingFrameworkNames || []).some(
    (n) => n?.trim().toLowerCase() === fullFrameworkName.value.toLowerCase()
  );
  if (duplicated) {
    return "该框架名称已存在，再次导入会覆盖旧版本";
  }
  return "";
});

// 处理上传
const uploadAction = async () => {
  if (!viewFrameworkNameInput.value?.trim()) {
    viewFrameworkNameError.value = "请输入框架名称";
    return;
  }

  // 禁止特殊字符
  const invalidChars = /[\/\\?%*:|"<>]/;
  if (invalidChars.test(fullFrameworkName.value)) {
    viewFrameworkNameError.value =
      '框架名称不能包含特殊字符 / \\ ? % * : | " < >';
    return false;
  }

  if (!viewSelectedFile.value) {
    viewErrorMessage.value = "请选择要上传的文件";
    return;
  }

  viewIsloading.value = true;
  viewErrorMessage.value = "";
  viewFrameworkNameError.value = "";

  try {
    const formData = new FormData();
    const fileName = viewSelectedFile.value.name;
    const uploadName = `${props.zipPrefix}${fileName}`;
    formData.append("file", viewSelectedFile.value, uploadName);

    const res = await importCustomFrameWorkZip(
      formData,
      fullFrameworkName.value
    );

    if (res.result === true) {
      toast.add({
        severity: "success",
        summary: "导入成功",
        life: 3000,
      });
      viewIsOpenDialog.value = false;
      $emit("onImportSuccess");
      return;
    }
  } finally {
    viewIsloading.value = false;
  }
};

defineExpose({
  openDialog,
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

:deep(.p-fileupload-basic .p-fileupload-choose-button) {
  font-size: 14px;
}
</style>
