<template>
  <div class="h-full w-full p-2 sm:p-6 flex flex-col items-center">
    <div class="w-full max-w-6xl space-y-6">
      <div class="w-full space-y-6 sm:space-y-2">
        <div class="flex justify-between items-end">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            设备管理
          </h2>
          <Button
            icon="pi pi-refresh"
            label="刷新"
            size="small"
            @click="refreshDeviceList"
            :loading="viewIsLoading"
            class="mr-20"
          />
        </div>
        <div class="hidden sm:block text-sm text-gray-500 dark:text-gray-300">
          本系统最多允许5台设备登录使用，若新增登录设备数量超过限制，系统会自动将此前登录的设备依次剔除，保证当前仅5台设备有效
        </div>
        <Message
          severity="secondary"
          :closable="false"
          class="block sm:hidden mt-2"
        >
          本系统最多允许5台设备登录使用，若新增登录设备数量超过限制，系统会自动将此前登录的设备依次剔除，保证当前仅5台设备有效
        </Message>
      </div>

      <Card>
        <template #content>
          <DataTable
            :value="viewDeviceList"
            :loading="viewIsLoading"
            :rows="5"
            responsiveLayout="scroll"
            class="sm:px-4 text-sm"
          >
            <Column field="device_type" header="设备类型" class="min-w-20">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <i :class="getDeviceIcon(data.device_type)" class="text-lg" />
                  <span>{{ data.device_type }}</span>
                </div>
              </template>
            </Column>

            <Column field="browser_info" header="浏览器" class="min-w-55">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <span :class="data.is_current ? 'font-bold' : ''">{{
                    data.browser_info
                  }}</span>
                  <Tag
                    v-if="data.is_current"
                    class="text-xs font-semibold"
                    value="当前设备"
                  />
                </div>
              </template>
            </Column>

            <Column field="ip_address" header="IP地址" class="min-w-30">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span>{{ data.ip_address }}</span>
                </div>
              </template>
            </Column>

            <Column
              field="last_active_time"
              header="最后活跃时间"
              class="min-w-45"
            >
              <template #body="{ data }">
                <div class="flex items-center gap-1">
                  <span>{{
                    dayjs(data.last_active_time).format("YYYY-MM-DD HH:mm:ss")
                  }}</span>
                </div>
              </template>
            </Column>

            <Column header="操作" :exportable="false" style="min-width: 8rem">
              <template #body="{ data }">
                <!-- 点击后要触发用户输入GA验证码，输入后才能强制下线设备 -->
                <Button
                  v-if="!data.is_current"
                  icon="pi pi-power-off"
                  severity="danger"
                  text
                  @click="confirmForceLogout(data)"
                  v-tooltip="'强制下线设备'"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <Dialog
      v-model:visible="viewIsOpenConfirmDialog"
      header="确认强制下线"
      :modal="true"
      :closable="false"
      class="max-w-[90vw] min-w-[80vw] sm:min-w-[35vw]"
    >
      <div class="flex flex-col gap-4">
        <p class="text-gray-700 dark:text-gray-300">
          确定要将以下设备强制下线吗？
        </p>

        <ul
          role="list"
          class="list-disc space-y-2 text-sm bg-gray-100 dark:bg-neutral-800 rounded-xl p-3 pl-8"
        >
          <li>
            <span class="font-semibold">设备：</span
            >{{ viewSelectedDevice?.device_type }}
          </li>
          <li>
            <span class="font-semibold">浏览器：</span
            >{{ viewSelectedDevice?.browser_info }}
          </li>
          <li>
            <span class="font-semibold">IP地址：</span
            >{{ viewSelectedDevice?.ip_address }}
          </li>
        </ul>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300"
            >谷歌验证码</label
          >
          <InputText
            v-model="viewGaCode"
            placeholder="请输入谷歌验证码校验身份"
            class="w-full rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-800"
            :class="{ 'p-invalid': viewGaCodeError }"
            :maxlength="6"
            @keyup.enter="forceLogoutDevice"
          />
          <small class="text-red-500" v-if="viewGaCodeError">{{
            viewGaCodeError
          }}</small>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="取消"
            severity="secondary"
            outlined
            @click="closeConfirmDialog"
            class="rounded-lg"
          />
          <Button
            label="确认"
            @click="forceLogoutDevice"
            :loading="viewIsSubmitting"
            :disabled="viewGaCode.length < 6"
            class="rounded-lg"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getDeviceList,
  deleteDevice,
} from "@/common-module/services/service.provider";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import dayjs from "dayjs";

const viewDeviceList = ref<tDbDeviceInfo[]>([]);
const viewIsLoading = ref(false);
const viewIsOpenConfirmDialog = ref(false);
const viewSelectedDevice = ref<tDbDeviceInfo | null>();
const viewIsSubmitting = ref(false);
const viewGaCode = ref("");
const viewGaCodeError = ref<string>("");

// 组件挂载时获取设备列表
onMounted(() => {
  refreshDeviceList();
});

// 获取设备图标
const getDeviceIcon = (deviceType: string): string => {
  switch (deviceType.toLowerCase()) {
    case "pc":
      return "pi pi-desktop";
    case "mobile":
      return "pi pi-mobile";
    case "tablet":
      return "pi pi-tablet";
    default:
      return "pi pi-device";
  }
};

// 刷新设备列表
const refreshDeviceList = async () => {
  viewIsLoading.value = true;
  const res = await getDeviceList();
  viewIsLoading.value = false;
  if (res.result === true) {
    viewDeviceList.value = res.data;
  }
};

const confirmForceLogout = (device: tDbDeviceInfo) => {
  viewSelectedDevice.value = device;
  viewIsOpenConfirmDialog.value = true;
};

const closeConfirmDialog = () => {
  viewIsOpenConfirmDialog.value = false;
  viewSelectedDevice.value = null;
  viewGaCode.value = "";
  viewGaCodeError.value = "";
};

// 强制下线
const forceLogoutDevice = async () => {
  // 验证必要参数
  if (!viewSelectedDevice.value) return;
  if (!viewGaCode.value) {
    viewGaCodeError.value = "请输入谷歌验证码";
    return;
  }
  viewIsSubmitting.value = true;
  viewGaCodeError.value = "";
  // 验证谷歌验证码,执行强制下线
  const res = await deleteDevice(viewSelectedDevice.value.id, viewGaCode.value);
  viewIsSubmitting.value = false;
  if (res.result === true) {
    toast.add({
      severity: "success",
      summary: "操作成功",
      detail: "设备已被强制下线",
      life: 3000,
    });
    closeConfirmDialog();
    refreshDeviceList();
  }
};
</script>
