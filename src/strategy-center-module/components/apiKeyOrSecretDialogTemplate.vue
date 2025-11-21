<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    :modal="true"
    class="max-w-[90vw] min-w-[50vw]"
    :closable="false"
  >
    <template #header>
      <div class="text-center text-lg font-bold">{{ inputType }}配置</div>
    </template>
    <div class="space-y-4 pt-1">
      <div class="space-y-2">
        <!-- 加密模式提示 -->
        <Message v-if="viewIsEncryption">
          <div class="flex flex-col gap-2 text-sm">
            <div
              class="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold"
            >
              <i class="pi pi-info-circle text-md"></i>
              <p>加密模式提示</p>
            </div>

            <div class="text-sm">
              <p class="mb-2">
                当前已开启API KEY/密钥加密，请在此处输入<span class="font-bold"
                  >加密后的密文</span
                >，而不是原始明文。
              </p>
              <ul class="list-disc text-xs space-y-2 pl-6">
                <li class="space-y-2">
                  <div>请使用下载的加密工具对原始{{ inputType }}进行加密</div>
                  <Button
                    label="下载加密工具"
                    icon="pi pi-download"
                    size="small"
                    severity="success"
                    class="px-1.5 py-0.5 text-xs w-fit"
                    @click="downloadEncryptor"
                  />
                </li>
                <li>确保使用与其他子账户相同的加密密码</li>
                <li>密文格式要求：Base64编码，长度至少32位且为4的倍数</li>
                <li>加密后的密文将按分段数量进行安全存储</li>
              </ul>
            </div>
          </div>
        </Message>

        <!-- 明文模式提示 -->
        <Message severity="warn">
          <div class="space-y-1 text-sm">
            <div
              class="flex items-center gap-2 font-bold text-yellow-700 dark:text-yellow-400"
            >
              <i class="pi pi-exclamation-triangle text-md"></i>
              <span> 明文模式提醒 </span>
            </div>
            <p>当前为明文模式，建议开启API KEY/密钥加密以增强安全性</p>
          </div>
        </Message>

        <!-- 操作说明 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-info-circle text-gray-600 dark:text-gray-400"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >操作说明</span
            >
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              1. 请输入{{ inputType }}（{{
                viewIsEncryption ? "密文" : "明文"
              }}）并设置分段数量
            </p>
            <p>
              2. 系统会将其分割为指定数量的片段，并在5秒延迟窗口内随机化存储
            </p>
          </div>
        </div>
      </div>

      <!-- 输入表单 -->
      <div class="space-y-4">
        <!-- 分段数量设置 -->
        <div class="space-y-2">
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-red-500">*</span><span> 分段数量 </span>
            </div>
            <Tag
              severity="secondary"
              :pt="{
                root: 'text-xs font-medium',
              }"
            >
              4-32段
            </Tag>
          </label>
          <InputNumber
            v-model="viewUserSplitNumber"
            :min="4"
            :max="32"
            showButtons
            class="w-full"
            :pt="{
              input: 'text-center font-mono',
              buttonGroup: 'border-gray-300 dark:border-gray-600',
            }"
          />
          <!-- 加密模式下的格式提示 -->
          <Message
            v-if="viewUserSplitNumber === null"
            severity="error"
            variant="simple"
            size="small"
            >请输入分段数量</Message
          >
        </div>

        <!-- API KEY/密钥输入 -->
        <div class="space-y-2">
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-red-500">*</span><span> {{ inputType }} </span>
            </div>
            <Tag
              :severity="viewIsEncryption ? 'info' : 'secondary'"
              :pt="{
                root: 'text-xs font-medium',
              }"
            >
              {{ viewIsEncryption ? "密文" : "明文" }}
            </Tag>
          </label>
          <InputText
            v-model.trim="viewValue"
            name="account_name"
            :placeholder="
              viewIsEncryption
                ? `请输入加密后的${inputType}密文`
                : `请输入${inputType}`
            "
            class="w-full"
            :pt="{
              input: 'font-mono text-sm',
            }"
          />
          <Message
            v-if="viewIsEncryption && valueErrorLabel && !viewIsLoading"
            severity="error"
            variant="simple"
            size="small"
            >密文长度至少32位且为4的倍数</Message
          >
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          label="取消"
          severity="secondary"
          v-if="viewIsLoading === false"
          @click="viewIsOpenDialog = false"
        />
        <Button
          label="保存"
          severity="primary"
          @click="confirmSaveData"
          :loading="viewIsLoading"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { maskString, downloadEncryptor } from "@/common-module/utils";
import { splitSendApikeyOrSecret } from "@/common-module/services/service.provider";
import { useStrategyStore } from "@/store/strategy";
const strategyStore = useStrategyStore();

const viewIsOpenDialog = ref<boolean>(false);
const viewIsLoading = ref<boolean>(false);
const viewValue = ref<string>("");
const cloneValue = ref<string>("");
const viewIsEncryption = computed(() => strategyStore.isEncryption);
const viewUserSplitNumber = ref<number>(4); // 默认4段，用户可修改
const sendApikeyOrSecretParams = ref<tSendApikeyOrSecretParams>({
  framework_id: "",
  account_name: "",
  keyword: "apiKey",
  sort_id: 1,
  content: "",
  total: 4,
});

const props = defineProps<{
  inputType: string; //API KEY|密钥
  frameworkId: string;
  accountName: string;
}>();
const $emit = defineEmits(["refreshApikeyOrSecretValue"]);

const openDialog = (value: string) => {
  viewValue.value = value;
  cloneValue.value = viewValue.value;
  viewIsOpenDialog.value = true;
};

// 验证加密格式的函数
const valueErrorLabel = computed(() => {
  // 长度校验：至少32位且为4的倍数
  if (
    !viewValue.value ||
    viewValue.value.length < 32 ||
    viewValue.value.length % 4 !== 0
  ) {
    return "密文长度至少32位且为4的倍数";
  }

  // Base64字符校验
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(viewValue.value)) {
    return "密文应包含有效的Base64编码字符（A-Z, a-z, 0-9, +, /, =）";
  }

  return "";
});

const confirmSaveData = async () => {
  if (!viewValue.value || (viewIsEncryption.value && valueErrorLabel.value)) {
    return;
  }

  if (viewValue.value.length < viewUserSplitNumber.value) {
    toast.add({
      severity: "warn",
      summary: "输入的字符串长度需大于分段数量！",
      life: 3000,
    });
    return;
  }

  let tempsplitNumber = viewUserSplitNumber.value;
  cloneValue.value = viewValue.value;
  viewValue.value = maskString(viewValue.value);
  viewIsLoading.value = true;

  try {
    // 1. 分割数据
    const segmentLength = Math.ceil(
      cloneValue.value.length / viewUserSplitNumber.value
    );
    const segments = [];

    for (let i = 0; i < viewUserSplitNumber.value; i++) {
      const start = i * segmentLength;
      const end = start + segmentLength;
      segments.push({
        content: cloneValue.value.slice(start, end),
        index: i + 1, // 保留原始分段序号
      });
    }

    // 2. 随机打乱分段顺序
    const shuffledSegments = [...segments].sort(() => Math.random() - 0.5);

    // 3. 顺序发送请求（间隔5秒）
    const results = [];
    for (let i = 0; i < shuffledSegments.length; i++) {
      try {
        const segment = shuffledSegments[i];

        // 显示当前发送进度（显示原始序号）
        toast.add({
          severity: "info",
          summary: `正在发送${props.inputType}分段 (${i + 1}/${
            segments.length
          })`,
          life: 3000,
        });

        // 更新请求参数
        sendApikeyOrSecretParams.value = {
          framework_id: props.frameworkId,
          account_name: props.accountName,
          keyword: props.inputType === "API KEY" ? "apiKey" : "secret",
          sort_id: segment.index,
          content: segment.content,
          total: tempsplitNumber,
        };

        // 发送请求
        const res = await splitSendApikeyOrSecret(
          sendApikeyOrSecretParams.value
        );
        results[segment.index - 1] = res; // 按原始顺序存储结果

        // 如果不是最后一段，等待5秒
        if (i < shuffledSegments.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        results[shuffledSegments[i].index - 1] = new Error(
          `分段 ${shuffledSegments[i].index} 发送失败`
        );
        throw error; // 可以选择继续或终止
      }
    }

    // 4. 检查结果
    const allSuccess = results.every((result: any) => {
      return result.result === true;
    });

    if (allSuccess) {
      toast.add({
        severity: "success",
        summary: "保存成功",
        detail: `数据已分成 ${viewUserSplitNumber.value} 段随机顺序保存`,
        life: 3000,
      });
      $emit(`refreshApikeyOrSecretValue`, cloneValue.value);
      viewIsOpenDialog.value = false;
    } else {
      const failedSegments = results
        .map((result, index) => (result instanceof Error ? index + 1 : null))
        .filter(Boolean);

      throw new Error(`分段 ${failedSegments.join(", ")} 保存失败`);
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "保存失败",
      detail: error.message,
      life: 3000,
    });
    viewValue.value = cloneValue.value;
  } finally {
    viewIsLoading.value = false;
  }
};

defineExpose({
  openDialog,
});
</script>
