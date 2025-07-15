<template>
  <div
    class="h-full w-full flex justify-center items-center p-4"
    v-if="viewIsFirstLogin !== null && viewIsDeclaration !== null"
  >
    <safetyDisclaimerTemplate
      @refreshIsFirstLogin="getIsFirstLoginFn"
      v-if="viewIsDeclaration === false"
    />
    <!-- 谷歌2fa 首次绑定 -->
    <Card
      v-if="viewIsDeclaration === true && viewIsFirstLogin === true"
      class="w-full max-w-sm sm:max-w-md shadow-lg"
      key="first-bind"
    >
      <template #header>
        <div class="text-2xl font-semibold text-center mt-5">谷歌登录</div>
      </template>

      <template #content>
        <div class="space-y-2 text-sm">
          <!-- 1: 下载应用 -->
          <div class="space-y-1 sm:space-y-2">
            <div class="font-semibold">1. 请下载Google Authenticator</div>
            <p class="text-xs">
              &nbsp;&nbsp;&nbsp;&nbsp;Google
              Authenticator是一个动态密码工具，绑定后每次生成一个30秒更新一次的动态验证码，
              用于登录安全验证。iOS用户登录AppStore，搜索"Authenticator"即可下载，而对于Android用户登录Google
              Play或使用手机浏览器搜索“Google Authenticator”下载。
            </p>
            <div class="h-10 flex justify-center items-center space-x-8">
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                class="h-full"
              >
                <img
                  src="@/assets/login-img/google_play.png"
                  alt="Google Play"
                  class="h-full"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                target="_blank"
                class="h-full"
              >
                <img
                  src="@/assets/login-img/app-store.png"
                  alt="App Store"
                  class="h-full"
                />
              </a>
            </div>
          </div>

          <!-- 2: 扫描二维码或复制密钥-->
          <div class="space-y-1 sm:space-y-2">
            <div class="font-semibold">2. 扫描二维码或手动输入密钥</div>
            <p class="text-xs">
              &nbsp;&nbsp;&nbsp;&nbsp;打开Google
              Authenticator，扫描下方二维码或手动输入下方密钥添加验证令牌。密钥可用于在手机更换或丢失时验证Google
              Authenticator。请务必在绑定前备份以下密钥。
            </p>
            <div class="flex justify-center">
              <QrcodeVue
                class="w-35 h-35 p-2 border border-gray-200 rounded-lg bg-white"
                :value="viewGAQrcodeUrl"
                level="H"
                render-as="svg"
              />
            </div>
            <div class="flex items-center justify-center space-x-2">
              <span class="text-sm font-mediu">密钥:</span>
              <span
                class="px-3 py-1 bg-gray-100 dark:bg-neutral-800 rounded text-sm font-mono tracking-wider"
              >
                {{ viewGASecretKey }}
              </span>
              <Button
                icon="pi pi-copy"
                size="small"
                aria-label="复制"
                @click="copySecretKeyAction"
              />
            </div>
          </div>

          <!-- 3: 输入验证码 -->
          <div class="space-y-1 sm:space-y-2">
            <div class="font-semibold">3.请输入谷歌验证器中的验证码</div>
            <div class="relative flex justify-center items-center">
              <InputOtp
                v-model="viewGAVerificationCode"
                integerOnly
                :length="6"
                @keydown.enter="bindGaAction1"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          label="确认绑定"
          class="w-full"
          :disabled="!isGAVerificationCodeValid"
          @click="bindGaAction1"
        />
      </template>
    </Card>

    <!-- 谷歌2fa 二次登录 验证码验证 -->
    <Card
      v-if="viewIsDeclaration === true && viewIsFirstLogin === false"
      class="w-full max-w-sm sm:max-w-md shadow-lg"
      key="second-verify"
    >
      <template #header>
        <div class="text-2xl font-semibold text-center mt-5">谷歌登录</div>
      </template>
      <template #content>
        <div>
          <div class="text-center mb-2">请输入谷歌验证器中的验证码</div>
          <div class="relative flex justify-center items-center mb-2">
            <InputOtp
              v-model="viewGAVerificationCode"
              integerOnly
              :length="6"
              @keydown.enter="bindGaAction2"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <Button
          label="登录"
          severity="primary"
          class="w-full"
          :disabled="!isGAVerificationCodeValid"
          @click="bindGaAction2"
          :loading="viewIsLoading"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

import { useToast } from "primevue/usetoast";
const toast = useToast();
import QrcodeVue from "qrcode.vue";
import clipboardCopy from "copy-to-clipboard";
import {
  bindGA,
  isFirstLogin,
  getUserInfoData,
} from "@/common-module/services/service.provider";
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
import safetyDisclaimerTemplate from "@/login-module/components/safetyDisclaimer.template.vue";
import { useUserStore } from "@/store/user";
const store = useUserStore();

const { gaToken, sessionGAtoken, userInfo, localStorageWxtoken } =
  useStorageValueOrFn();

const viewGASecretKey = ref<string>("");
const viewGAQrcodeUrl = ref<string>("");
const viewGAVerificationCode = ref<string>("");
const viewIsFirstLogin = ref<boolean | null>(null);
const viewIsDeclaration = ref<boolean | null>(null);
const viewIsLoading = ref<boolean>(false);

onMounted(() => {
  getIsFirstLoginFn();
  getSecretKeyFn();
});

const getIsFirstLoginFn = async () => {
  const res = await isFirstLogin();
  if (res.result === true && res.data !== null) {
    viewIsFirstLogin.value = res.data.is_first_use;
    store.setIsBoundGA(!res.data.is_first_use);
    viewIsDeclaration.value = res.data.is_declaration;
    if (res.data.is_first_use === true) {
      clearStorageFn();
    }
    localStorageWxtoken.value = null;
  }
};

const clearStorageFn = () => {
  gaToken.value = null;
  sessionGAtoken.value = null;
  localStorageWxtoken.value = null;
  userInfo.value = null;
};

const getSecretKeyFn = () => {
  if (viewIsFirstLogin.value === false) return;

  const savedKey = localStorage.getItem("ga-secret-key");
  if (savedKey) {
    viewGASecretKey.value = savedKey;
  } else {
    let result = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    viewGASecretKey.value = result;
    localStorage.setItem("ga-secret-key", result);
  }

  // 生成二维码URL
  const encodedKey = encodeURIComponent(viewGASecretKey.value);
  viewGAQrcodeUrl.value = `otpauth://totp/QRONOSUI:${encodedKey}?secret=${encodedKey}&issuer=QRONOSUI`;
};

// 复制密钥
const copySecretKeyAction = () => {
  clipboardCopy(viewGASecretKey.value);
  toast.add({
    severity: "success",
    summary: "复制成功",
    life: 3000,
  });
};

const isGAVerificationCodeValid = computed(() => {
  return viewGAVerificationCode.value.length === 6;
});

// 首次登录传 viewGASecretKey和code
const bindGaAction1 = async () => {
  // [mk] 1.发送验证码和viewGASecretKey,获取GAtoken 接口2 ga-bind
  if (viewGASecretKey.value && isGAVerificationCodeValid.value) {
    viewIsLoading.value = true;
    const res = await bindGA(
      viewGAVerificationCode.value,
      viewGASecretKey.value
    );
    if (res.result === true) {
      let resData = res.data;
      localStorage.removeItem("ga-secret-key");
      storageGAtokenAndGoHome(resData);
    }
  }
};
// 二次登录 只传 code
const bindGaAction2 = async () => {
  if (isGAVerificationCodeValid.value) {
    viewIsLoading.value = true;
    const res = await bindGA(viewGAVerificationCode.value);
    if (res.result === true) {
      let resData = res.data;
      localStorage.removeItem("ga-secret-key");
      storageGAtokenAndGoHome(resData);
    }
  }
};

const storageGAtokenAndGoHome = async (resData: any) => {
  if (resData) {
    gaToken.value = resData?.access_token || "";
    sessionGAtoken.value = resData?.access_token || "";
    // [mk] 3.判断微信是否绑定过微信
    if (resData?.is_bind === true) {
      const userInfoData = await getUserInfoData();
      viewIsLoading.value = false;

      if (userInfoData.result === true) {
        userInfo.value = JSON.stringify(userInfoData.data);
        router.replace("/home");
      }
      viewGAVerificationCode.value = "";
    } else {
      viewIsLoading.value = false;
      userInfo.value = null;
      router.replace("/bindWx");
    }
  }
};
</script>
