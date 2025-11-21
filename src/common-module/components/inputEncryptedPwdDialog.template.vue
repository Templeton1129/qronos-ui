<template>
  <!-- 加密模式开启 实盘/监控/启动/停止前需要输入密码 -->
  <Dialog
    header="输入加密密码"
    :visible="viewIsOpenDialog"
    :closable="false"
    :draggable="false"
    :modal="true"
    @hide="viewIsOpenDialog = false"
    class="min-w-[90vw] max-w-[90vw] sm:min-w-[40vw]"
    :pt="{
      footer: 'justify-between items-center',
    }"
  >
    <template #default>
      <div class="pt-1 space-y-4">
        <!-- AES加密算法介绍 -->
        <Card class="bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:max-w-145">
          <template #title>
            <div class="text-lg font-semibold text-blue-800 dark:text-blue-300">
              <i class="pi pi-info-circle text-md"></i>
              提示
            </div>
          </template>
          <template #content>
            <div class="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <ul
                class="list-disc list-inside space-y-1 ml-4 tracking-wide leading-relaxed"
              >
                <li>
                  系统需要你输入加密API
                  KEY和密钥时使用的密码，以便解密并启动实盘交易。
                </li>
                <li>
                  解密用的密码只是临时放在内存中撑个场子，程序一关闭就会自动清除，像阅后即焚一样，确保不会在实盘电脑里留下任何记录。
                </li>
              </ul>
            </div>
          </template>
        </Card>
        <!-- 密码输入表单 -->
        <div class="space-y-3">
          <div class="flex items-center gap-1">
            <span class="text-red-500">*</span><span> 加密密码</span>
          </div>
          <Password
            v-model="viewPassword"
            placeholder="请输入加密密码"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="space-x-3 w-full flex justify-end">
        <Button label="取消" severity="secondary" @click="cancelPassword" />
        <Button
          label="确定"
          class="p-button-primary"
          :disabled="!viewPassword"
          @click="confirmPassword"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const viewIsOpenDialog = ref<boolean>(false);
const viewPassword = ref<string>("");

const emit = defineEmits<{
  confirm: [password: string];
  cancel: [];
}>();

const openDialog = () => {
  viewPassword.value = "";
  viewIsOpenDialog.value = true;
};

const confirmPassword = () => {
  if (!viewPassword.value) {
    toast.add({
      severity: "warn",
      summary: "请输入密码",
      life: 3000,
    });
    return;
  }

  viewIsOpenDialog.value = false;
  emit("confirm", viewPassword.value);
};

const cancelPassword = () => {
  viewPassword.value = "";
  viewIsOpenDialog.value = false;
  emit("cancel");
};

defineExpose({
  openDialog,
});
</script>
