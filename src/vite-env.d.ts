/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 声明 Vite 定义的全局常量
declare const __API_PREFIX__: string;
