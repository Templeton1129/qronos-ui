<template>
  <!-- 二次确认对话框 -->
  <Dialog
    v-model:visible="viewIsOpenDialog"
    :modal="true"
    class="max-w-[90vw] min-w-[50vw]"
    :closable="false"
  >
    <template #header>
      <div class="text-center text-lg font-bold">{{ inputType }}配置</div>
    </template>
    <div class="flex flex-col gap-4">
      <label for="apiKey" class="text-sm text-green-500">
        输入{{
          inputType
        }}和分段数量后我们会将该字符串按照填写的分段数量间隔5s随机顺序进行存储
      </label>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium"
          >分段数量<span class="text-xs text-gray-400"
            >(最小分4段，最大分32段)</span
          ></label
        >
        <InputNumber
          v-model="viewUserSplitNumber"
          :min="4"
          :max="32"
          showButtons
          class="w-full"
        />
        <label class="text-sm font-medium">{{ inputType }}</label>
        <InputText
          v-model.trim="viewValue"
          name="account_name"
          :placeholder="`请输入${inputType}`"
          class="w-full"
        />
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
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { maskString } from "@/common-module/utils";
import { splitSendApikeyOrSecret } from "@/common-module/services/service.provider";

const viewIsOpenDialog = ref<boolean>(false);
const viewValue = ref<string>("");
const cloneValue = ref<string>("");
const viewUserSplitNumber = ref<number>(4); // 默认4段，用户可修改
const props = defineProps<{
  inputType: string; //API KEY|密钥
  frameworkId: string;
  accountName: string;
}>();
const viewIsLoading = ref<boolean>(false);

const openDialog = (value: string) => {
  viewValue.value = value;
  cloneValue.value = viewValue.value;
  viewIsOpenDialog.value = true;
};

const sendApikeyOrSecretParams = ref<tSendApikeyOrSecretParams>({
  framework_id: "",
  account_name: "",
  keyword: "apiKey",
  sort_id: 1,
  content: "",
  total: 4,
});

const confirmSaveData = async () => {
  if (!viewValue.value) {
    toast.add({
      severity: "warn",
      summary: "请输入内容",
      life: 3000,
    });
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

const $emit = defineEmits(["refreshApikeyOrSecretValue"]);
defineExpose({
  openDialog,
});
</script>
