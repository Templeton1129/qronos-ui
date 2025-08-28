<template>
  <Disclosure
    as="nav"
    class="block sm:hidden bg-gray-800 w-full z-1000"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-2 lg:px-8">
      <div class="relative flex h-12 items-center justify-between">
        <!-- mobile nav button-->
        <div
          class="absolute inset-y-0 left-0 flex items-center"
          v-if="store.isBoundGA === true"
        >
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
          >
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <!-- center -->
        <div class="flex flex-1 items-center justify-center">
          <!-- logo -->
          <div class="flex shrink-0 items-center mr-2">
            <img
              class="h-8 w-auto"
              src="@/assets/header-img/xbx-logo.png"
              alt="Your Company"
            />
          </div>
          <!-- title -->
          <title class="flex items-center text-white font-mono">
            实盘网页版
          </title>
        </div>
        <!-- 主题色配置器 -->
        <div class="absolute inset-y-0 right-10 flex items-center pr-2">
          <PrimaryConfiguratorTemplate />
        </div>
        <!-- user -->
        <div
          v-if="getIsLoggedInWX === true"
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <!-- mobile profile-->
          <img
            v-if="userInfoObj && userInfoObj?.headimgurl"
            class="size-8 rounded-full"
            :src="userInfoObj?.headimgurl"
            loading="lazy"
            alt=""
            @click="gotoProfileAction"
          />

          <img
            v-else
            class="size-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            loading="lazy"
            alt=""
            @click="gotoProfileAction"
          />
        </div>
      </div>
    </div>

    <!-- mobile nav and usernav -->
    <DisclosurePanel>
      <div class="divide-y divide-gray-500 space-y-1 px-2 pt-2 pb-3">
        <div class="pb-2">
          <DisclosureButton
            v-for="navItem in navList"
            :key="navItem.name"
            as="a"
            @click="navigateTo(navItem.href)"
            :class="[
              route.path.startsWith(navItem.href)
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'flex items-center rounded-md px-3 py-2 text-base font-medium',
            ]"
            ><i :class="['pi  mr-2', navItem.icon]"></i
            >{{ navItem.name }}</DisclosureButton
          >
        </div>
        <div class="pt-2">
          <DisclosureButton
            v-for="userNavItem in userNavList"
            :key="userNavItem.name"
            as="a"
            :class="[
              ViewCurrentUserNavigationId === userNavItem.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'flex items-center rounded-md px-3 py-2 text-base font-medium',
            ]"
            @click="clickNavItemAction(userNavItem.id)"
            ><i :class="['pi  mr-2', userNavItem.icon]"></i
            >{{ userNavItem.name }}</DisclosureButton
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { useRouter } from "vue-router";
const router = useRouter();
import { useUserStore } from "@/store/user";
const store = useUserStore();

import { useToast } from "primevue/usetoast";
const toast = useToast();
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import PrimaryConfiguratorTemplate from "@/layout-module/components/primaryConfigurator.template.vue";

const ViewCurrentUserNavigationId = ref<number>(0);

import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";

const { getIsLoggedInWX, userInfo, sessionGAtoken } = useStorageValueOrFn();
import { logout } from "@/common-module/services/service.provider";

const userInfoObj = computed(() => {
  if (userInfo.value !== null) {
    return JSON.parse(userInfo.value);
  }
});

const navList = [
  { name: "首页", icon: "pi-home", href: "/home" },
  { name: "数据中心", icon: "pi-database", href: "/dataCenter" },
  { name: "策略中心", icon: "pi-chart-scatter", href: "/strategyCenter" },
  { name: "设备管理", icon: "pi-desktop", href: "/deviceManagement" },
];

const userNavList = [
  { id: 1, name: "锁定", icon: "pi-lock" },
  { id: 2, name: "退出登录", icon: "pi-sign-out" },
];

const gotoProfileAction = () => {};

const clickNavItemAction = async (id: number) => {
  ViewCurrentUserNavigationId.value = id;
  if (id === 2) {
    // const res = await logout();
    // if (res.result === true) {
    //   sessionStorage.clear();
    //   sessionGAtoken.value = null;
    //   localStorageWxtoken.value = null;
    //   userInfo.value = null;
    //   router.push("/login");
    //   toast.add({
    //     severity: "success",
    //     summary: "退出登录成功",
    //     detail: res.msg,
    //     life: 3000,
    //   });
    // }
    // 弹窗提示目前不支持该功能
    toast.add({
      severity: "warn",
      summary: "退出登录",
      detail:
        "退出登录需要重新输入GA验证码，扫码绑定微信，重新下载数据中心的数据和框架(目前该功能还在开发中！)",
      life: 6000,
    });
  } else if (id === 1) {
    const res = await logout();
    if (res.result === true) {
      sessionStorage.clear();
      sessionGAtoken.value = null;
      router.push("/login");
    }
  }
};

const navigateTo = (href: string) => {
  router.push(href);
};
</script>
