<template>
  <Dialog
    v-model:visible="viewIsOpenDialog"
    :closable="false"
    :modal="true"
    class="max-w-[90vw]"
  >
    <template #header>
      <div class="flex items-center gap-2 text-lg font-bold">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-lg"></i>
        <span>确认杠杆数</span>
      </div>
    </template>
    <div class="mb-3">
      杠杆数超过1有<span class="text-red-500">较高风险</span>，确定要设置为
      {{ leverage }} 吗？
    </div>
    <div class="flex justify-end gap-2">
      <Button
        label="我充分了解风险，继续"
        severity="secondary"
        @click="confrimLeverageChange"
      />
      <Button label="取消" severity="primary" @click="cancelLeverageChange" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
defineProps<{
  leverage: number | string;
}>();
const viewIsOpenDialog = ref<boolean>(false);
const leverageDialogTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const openDialog = () => {
  viewIsOpenDialog.value = true;
  clearLeverageTimeout();
  leverageDialogTimer.value = setTimeout(() => {
    viewIsOpenDialog.value = false;
    $emit("cancel");
  }, 3000);
};

const confrimLeverageChange = () => {
  clearLeverageTimeout();
  viewIsOpenDialog.value = false;
  $emit("confirm");
};

const cancelLeverageChange = () => {
  clearLeverageTimeout();
  viewIsOpenDialog.value = false;
  $emit("cancel");
};

const clearLeverageTimeout = () => {
  if (leverageDialogTimer.value) {
    clearTimeout(leverageDialogTimer.value);
    leverageDialogTimer.value = null;
  }
};
const $emit = defineEmits(["cancel", "confirm"]);

onUnmounted(() => {
  clearLeverageTimeout();
});

defineExpose({
  openDialog,
});
</script>
