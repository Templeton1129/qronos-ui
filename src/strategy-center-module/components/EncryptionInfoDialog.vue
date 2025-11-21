<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    header="API KEY/密钥加密说明"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
    :closable="false"
    :pt="{
      footer: 'w-full justify-between',
    }"
  >
    <template #default>
      <div class="space-y-4">
        <!-- AES加密算法介绍 -->
        <Card class="bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <template #title>
            <div class="text-lg font-semibold text-blue-800 dark:text-blue-300">
              <i class="pi pi-shield mr-2"></i>加密采用「AES加密算法」
            </div>
          </template>
          <template #content>
            <div class="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <p>
                <strong>AES (Advanced Encryption Standard)</strong>
                是一种对称加密算法，
                被广泛认为是目前最安全、最高效的加密标准之一。
              </p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>采用256位密钥长度，提供军用级别的安全性</li>
                <li>CBC模式加密，每次加密都使用随机初始化向量</li>
                <li>PKCS#7填充，确保数据完整性</li>
                <li>Base64编码输出，便于存储和传输</li>
              </ul>
            </div>
          </template>
        </Card>

        <!-- 重要提示 -->
        <div
          class="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border-l-4 border-yellow-500/40"
        >
          <h4
            class="text-md font-semibold text-yellow-800 dark:text-yellow-300 mb-2"
          >
            <i class="pi pi-exclamation-triangle mr-2"></i>重要提示
          </h4>
          <div class="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
            <p>
              <strong>密码统一性：</strong>每个子账户的API
              KEY和密钥都必须使用同一个密码进行加密， 否则无法启动实盘交易。
            </p>
            <p>
              <strong>密码保管：</strong
              >请妥善保管你的加密密码，在实盘启动时需要输入此密码。
              如果忘记密码，将无法解密已加密的API KEY和密钥。
            </p>
          </div>
        </div>

        <!-- 加密工具下载 -->
        <Card class="bg-green-50 dark:bg-green-900/20 rounded-lg">
          <template #title>
            <div
              class="text-md font-semibold text-green-800 dark:text-green-300"
            >
              <i class="pi pi-download mr-2"></i>加密工具下载
            </div>
          </template>
          <template #content>
            <div class="text-sm text-green-700 dark:text-green-400 space-y-2">
              <p>我们提供了本地加密/解密工具，你可以在本地运行脚本进行加密：</p>
              <div class="flex items-center gap-2 mt-3">
                <Button
                  label="下载加密工具"
                  icon="pi pi-download"
                  size="small"
                  severity="success"
                  @click="downloadEncryptor"
                />
                <span class="text-xs text-gray-500 dark:text-gray-300">
                  （ 包含完整的加密/解密脚本和使用说明 ）
                </span>
              </div>
            </div>
          </template>
        </Card>

        <!-- 使用说明 -->
        <Card class="bg-gray-50 dark:bg-neutral-800 rounded-lg">
          <template #title>
            <div class="text-md font-semibold text-gray-800 dark:text-gray-300">
              <i class="pi pi-info-circle mr-2"></i>使用说明
            </div>
          </template>
          <template #content>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>下载并安装Python环境（如果尚未安装）</li>
                <li>运行加密工具脚本</li>
                <li>输入你的API KEY和密钥</li>
                <li>设置统一的加密密码</li>
                <li>
                  将加密后的结果保存下来，复制到账户信息配置里（API KEY和密钥）
                </li>
              </ol>
            </div>
          </template>
        </Card>
      </div>
    </template>

    <template #footer>
      <div
        class="w-full flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 pt-1"
      >
        <!-- 左侧确认框 -->
        <div class="flex items-center gap-2">
          <Checkbox v-model="viewIsConfirmed" :binary="true" />
          <label
            class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            @click="toggleConfirm"
          >
            我已充分了解并确认以上加密说明
          </label>
        </div>

        <!-- 右侧按钮组 -->
        <div class="flex gap-2">
          <Button
            label="取消"
            severity="secondary"
            variant="outlined"
            size="small"
            @click="cancelAction"
          />
          <Button
            :label="
              viewCountdown > 0 ? `确认开启 (${viewCountdown}s)` : '确认开启'
            "
            severity="primary"
            size="small"
            :disabled="viewCountdown > 0 || !viewIsConfirmed"
            @click="confirmAction"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { downloadEncryptor } from "@/common-module/utils";
const viewIsOpenDialog = ref<boolean>(false);
const viewCountdown = ref<number>(10);
const viewIsConfirmed = ref<boolean>(false);
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null);

const $emit = defineEmits(["confirmEncryption", "cancelEncryption"]);

const openDialog = () => {
  viewIsOpenDialog.value = true;
  viewIsConfirmed.value = false;
  startCountdownTimer();
};

const startCountdownTimer = () => {
  viewCountdown.value = 10;
  if (countdownTimer.value) {
    clearCountdownTimer();
  }
  countdownTimer.value = setInterval(() => {
    viewCountdown.value--;
    if (viewCountdown.value <= 0) {
      clearCountdownTimer();
    }
  }, 1000);
};

const clearCountdownTimer = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
};

const toggleConfirm = () => {
  if (viewCountdown.value <= 0) {
    viewIsConfirmed.value = !viewIsConfirmed.value;
  }
};

const confirmAction = () => {
  clearCountdownTimer();
  viewIsOpenDialog.value = false;
  $emit("confirmEncryption");
};

const cancelAction = () => {
  clearCountdownTimer();
  viewIsOpenDialog.value = false;
  $emit("cancelEncryption");
};

onUnmounted(() => {
  clearCountdownTimer();
});

defineExpose({
  openDialog,
});
</script>
