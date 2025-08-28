<template>
  <div class="h-full w-full flex justify-center items-center p-4 flex-col">
    <Card class="w-full max-w-sm sm:max-w-md py-4 sm:py-8 shadow-lg">
      <template #header>
        <div class="text-2xl font-semibold text-center">微信登录</div>
      </template>

      <template #content>
        <div class="flex flex-col items-center justify-center">
          <div class="relative inline-block mb-2">
            <QrcodeVue
              class="w-50 h-50 sm:w-60 sm:h-60 p-2 rounded-lg bg-white"
              :value="viewWXQrcodeUrl"
              level="H"
              render-as="svg"
            />
            <Button
              v-if="viewIsQrcodeInvalid"
              class="absolute inset-0 bg-black/50 backdrop-blur-sm hover:bg-black/60 focus:ring-2 focus:ring-offset-2 focus:ring-black border-0"
              @click="getWXQrcodeUrlFn()"
            >
              <div className="text-white">
                <i class="pi pi-refresh text-3xl mx-auto mb-4"></i>
                <div>二维码失效</div>
                <div>请点击刷新</div>
              </div>
            </Button>
          </div>
          <div
            v-if="isMobileByRegExp() === true"
            class="text-center ml-4 mr-4 text-sm"
          >
            截图二维码打开微信扫一扫，授权登录后，返回浏览器
          </div>
          <div v-else class="text-sm">打开微信，扫描上方二维码登录</div>
        </div>
      </template>
    </Card>
    <div v-if="isWeixinOpen() === true" class="text-center mt-2">
      请在pc浏览器或手机浏览器打开该页面
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
const router = useRouter();

import {
  wxLoginApi,
  getUserInfoData,
} from "@/common-module/services/service.provider";
import { uuidV4, isMobileByRegExp, isWeixinOpen } from "@/common-module/utils";
import QrcodeVue from "qrcode.vue";

const viewWXQrcodeUrl = ref<string>("");
const viewIsQrcodeInvalid = ref<boolean>(false);
const qrcodeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const minitorUserLoginTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const clientId = ref<string>("");
const nonce = ref<string>("");
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { localStorageWxtoken, userInfo } = useStorageValueOrFn();

onMounted(() => {
  // [mk] 1.未登录
  if (isWeixinOpen() === false) {
    // [mk] 2.使用uuidV4生成clientId 存储到localStorage中 若找不到则生成新的
    if (localStorage.getItem("xbx-client-uuid") !== null) {
      clientId.value = localStorage.getItem("xbx-client-uuid") || "";
    } else {
      clientId.value = uuidV4();
      localStorage.setItem("xbx-client-uuid", clientId.value);
    }
    nonce.value = uuidV4();
    getWXQrcodeUrlFn();
  }
});

const getWXQrcodeUrlFn = () => {
  viewIsQrcodeInvalid.value = false;
  if (clientId && nonce) {
    // [mk] 1 生成扫码url
    viewWXQrcodeUrl.value = `${
      import.meta.env.VITE_API_BASE_URL
    }/user/authorize?client_id=${clientId.value}&nonce=${
      nonce.value
    }&action=&ignore=0&r=${Math.random()}`;
    // [mk] 2 开启过期定时器
    startQrCodeExpiryTimer();
    // [mk] 3 使用定时器监听用户扫码
    startMonitorUserLoginTimer();
  }
};

const startQrCodeExpiryTimer = () => {
  clearQrCodeExpiryTimer();

  qrcodeTimer.value = setTimeout(() => {
    viewIsQrcodeInvalid.value = true;
    clearMonitorUserLoginTimer();
  }, 5 * 60 * 1000);
};

const clearQrCodeExpiryTimer = () => {
  if (qrcodeTimer.value) {
    clearTimeout(qrcodeTimer.value);
    qrcodeTimer.value = null;
  }
};

const startMonitorUserLoginTimer = () => {
  clearMonitorUserLoginTimer(); // 先清除可能的旧定时器
  executeUserLoginStatusCheck();
};

const executeUserLoginStatusCheck = async () => {
  try {
    // 1. 获取微信登录token
    const res = await wxLoginApi(clientId.value, nonce.value);

    if (res.result === true && res?.data?.token) {
      const wxToken = res.data.token;
      localStorageWxtoken.value = wxToken;

      // 2. 获取用户信息
      const userInfoData = await getUserInfoData();
      if (userInfoData.result === true) {
        userInfo.value = JSON.stringify(userInfoData.data);

        // 3. 登录成功，跳转页面
        router.replace("/home");
        return; // 成功则停止轮询
      }
    }
  } catch (error) {
    console.error("轮询请求失败:", error);
    return;
  }

  // 继续轮询
  minitorUserLoginTimer.value = setTimeout(executeUserLoginStatusCheck, 3000);
};

const clearMonitorUserLoginTimer = () => {
  if (minitorUserLoginTimer.value) {
    clearTimeout(minitorUserLoginTimer.value);
    minitorUserLoginTimer.value = null;
  }
};

onUnmounted(() => {
  clearQrCodeExpiryTimer();
  clearMonitorUserLoginTimer();
});

onBeforeRouteLeave(() => {
  clearQrCodeExpiryTimer();
  clearMonitorUserLoginTimer();
});
</script>
