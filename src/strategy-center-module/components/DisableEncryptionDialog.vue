<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    header="关闭加密确认"
    modal
    :draggable="false"
    class="w-[90vw] sm:w-[500px] max-w-full"
    :closable="false"
  >
    <template #default>
      <div class="space-y-4">
        <!-- 警告图标和标题 -->
        <div class="flex items-center gap-3">
          <i
            class="pi pi-exclamation-triangle text-2xl text-red-600 dark:text-red-400"
          ></i>
          <div class="text-lg font-semibold text-red-600 dark:text-red-400">
            确认关闭API KEY/密钥加密？
          </div>
        </div>

        <!-- 警告内容 -->
        <div
          class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400"
        >
          <div class="space-y-2 text-gray-600 dark:text-gray-300">
            <p class="font-bold text-red-600/90 dark:text-red-300">提示：</p>
            <ul class="list-disc list-inside space-y-1 ml-4 text-sm">
              <li class="text-red-600/90 dark:text-red-300 font-bold">
                关闭加密后，所有账户存储的API KEY和密钥将被清除!
              </li>
              <li>需要重新输入所有账户的API KEY和密钥</li>
              <li>此操作不可逆，请谨慎操作</li>
              <li>建议在关闭加密前备份重要信息</li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="取消"
          severity="secondary"
          variant="outlined"
          @click="cancelAction"
          size="small"
        />
        <Button
          :label="
            viewCountdown > 0
              ? `确认关闭加密 (${viewCountdown}s)`
              : '确认关闭加密'
          "
          severity="danger"
          @click="confirmAction"
          size="small"
          :disabled="viewCountdown > 0"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
const viewIsOpenDialog = ref<boolean>(false);
const viewCountdown = ref<number>(10);
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null);

const $emit = defineEmits(["confirmDecryption", "cancelDecryption"]);

const openDialog = () => {
  viewIsOpenDialog.value = true;
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

const confirmAction = () => {
  clearCountdownTimer();
  viewIsOpenDialog.value = false;
  $emit("confirmDecryption");
};

const cancelAction = () => {
  clearCountdownTimer();
  viewIsOpenDialog.value = false;
  $emit("cancelDecryption");
};

onUnmounted(() => {
  clearCountdownTimer();
});

defineExpose({
  openDialog,
});
</script>
