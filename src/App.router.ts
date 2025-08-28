import { createRouter, createWebHistory } from "vue-router";
const LayoutPage = () => import("@/layout-module/layout.page.vue");
const LoginPage = () => import("@/login-module/login.page.vue");
const HomePage = () => import("@/home-module/home.page.vue");
const DataCenterPage = () =>
  import("@/data-center-module/data-center.page.vue");
const StrategyCenterPage = () =>
  import("@/strategy-center-module/strategy-center.page.vue");
const BindWxPage = () => import("@/common-module/page/bind-wx.page.vue");
const DeviceManagementPage = () =>
  import("@/common-module/page/device-management.page.vue");

import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { sessionGAtoken, userInfo } = useStorageValueOrFn();

// 动态获取 base URL
const getBaseUrl = (): string => {
  // 首先尝试从 HTML base 标签获取（nginx 会动态设置）
  const baseElement = document.querySelector("base");
  if (baseElement && baseElement.href) {
    const url = new URL(baseElement.href);
    return url.pathname;
  }

  // fallback 到 Vite 的 BASE_URL
  return import.meta.env.BASE_URL || "/";
};

import { syncDarkClass } from "@/main";

const appRouter = createRouter({
  history: createWebHistory(getBaseUrl()), // [mk] use history mode
  routes: [
    {
      path: "/",
      component: LayoutPage,
      children: [
        {
          path: "/",
          redirect: { path: "/login" },
        },
        {
          path: "/login",
          component: LoginPage,
          meta: {
            title: "login",
            auth: false,
            header: true,
          },
        },
        {
          path: "/bindWx",
          component: BindWxPage,
          meta: {
            title: "bindWx",
            auth: false,
            header: true,
          },
        },
        {
          path: "/home",
          component: HomePage,
          meta: {
            title: "首页",
            auth: true,
            header: true,
          },
        },
        {
          path: "/dataCenter",
          component: DataCenterPage,
          meta: {
            title: "数据中心",
            auth: true,
            header: true,
          },
        },
        {
          path: "/strategyCenter/:id?",
          component: StrategyCenterPage,
          meta: {
            title: "策略中心",
            auth: true,
            header: true,
          },
        },
        {
          path: "/deviceManagement",
          component: DeviceManagementPage,
          meta: {
            title: "设备管理",
            auth: true,
            header: true,
          },
        },
      ],
    },
  ],
});

export default appRouter;

appRouter.beforeEach(async (to, from, next) => {
  if (to.meta.auth) {
    if (!sessionGAtoken.value) {
      // 如果没有GA Token，重定向到登录页面
      next("/login");
      return;
    }
  }

  // 已登录过微信
  if (to.path === "/bindWx" && userInfo.value !== null) {
    next("/dataCenter"); // 跳转到数据中心
    return;
  }

  // 当输入不存在的页面跳回/dataCenter
  if (to.matched.length === 0) {
    // next("/dataCenter");
    next("/home");
    return;
  }

  next();
});

appRouter.afterEach((to, from) => {
  syncDarkClass();
});
