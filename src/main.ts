import { createApp } from "vue";
import App from "./App.vue";
import AppRouter from "@/App.router";
import { createPinia } from "pinia";
import "@/common-module/styles/reset.css";

import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
const { themeMode } = useStorageValueOrFn();

const app = createApp(App);
app.use(AppRouter);

import vue3LazyLoad from "vue3-lazy";
app.use(vue3LazyLoad, {
  loading: new URL("@/assets/images/v-lazy/loading.png", import.meta.url).href,
  error: new URL("@/assets/images/v-lazy/err.png", import.meta.url).href,
});

import PrimeVue from "primevue/config";
import { usePreset } from "@primeuix/themes";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VueECharts from "vue-echarts";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  DataZoomComponent,
} from "echarts/components";

let currentPrimary = "violet"; // 默认色

let MyPreset;
export const setPrimaryTheme = () => {
  const color = localStorage.getItem("theme") || currentPrimary;
  MyPreset = definePreset(Aura, {
    semantic: {
      primary: {
        50: `{${color}.50}`,
        100: `{${color}.100}`,
        200: `{${color}.200}`,
        300: `{${color}.300}`,
        400: `{${color}.400}`,
        500: `{${color}.500}`,
        600: `{${color}.600}`,
        700: `{${color}.700}`,
        800: `{${color}.800}`,
        900: `{${color}.900}`,
        950: `{${color}.950}`,
      },
    },
  });
  usePreset(MyPreset);
};
setPrimaryTheme();

export const syncDarkClass = () => {
  const currentThemeMode = themeMode.value || "system";
  if (currentThemeMode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

syncDarkClass();

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      prefix: "p",
      darkModeSelector: ".dark",
      cssLayer: {
        name: "primevue",
        order: "theme, base, primevue",
      },
    },
  },
});

app.use(ConfirmationService);
app.use(ToastService);

const pinia = createPinia();

app.use(pinia);

echarts.use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
  MarkPointComponent,
  DataZoomComponent,
]);
app.component("v-chart", VueECharts);

app.mount("#app");
