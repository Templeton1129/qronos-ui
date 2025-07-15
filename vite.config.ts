import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = env.VITE_APP_ENV === "development";

  // 获取 API 前缀，开发环境使用环境变量或默认值，生产环境由 nginx 动态设置
  const API_PREFIX = isDev ? env.VITE_API_PREFIX || "" : "";

  console.log("VITE_APP_ENV:", env.VITE_API_BASE_URL, env.VITE_FLASK_BASE_URL);
  console.log("API_PREFIX:", API_PREFIX);

  // 构建 proxy 配置
  const proxyConfig: Record<string, any> = {};

  if (isDev) {
    // 动态前缀的 API 路径
    if (API_PREFIX) {
      proxyConfig[`/${API_PREFIX}/api`] = {
        target: env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path: string) =>
          path.replace(new RegExp(`^/${API_PREFIX}/api`), ""),
      };
      proxyConfig[`/${API_PREFIX}/flask`] = {
        target: env.VITE_FLASK_BASE_URL,
        changeOrigin: true,
        rewrite: (path: string) =>
          path.replace(new RegExp(`^/${API_PREFIX}/flask`), ""),
      };
    }

    // 兼容原有的 /api 和 /flask 路径（向后兼容）
    proxyConfig["/api"] = {
      target: env.VITE_API_BASE_URL,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ""),
    };
    proxyConfig["/flask"] = {
      target: env.VITE_FLASK_BASE_URL,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/flask/, ""),
    };
  }

  return {
    // 设置 base 路径，生产环境使用相对路径，开发环境使用根路径
    base: isDev ? "/" : "./",
    plugins: [
      vue(),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"), // 将 @ 映射到 src 目录
      },
    },
    build: {
      // 确保输出目录正确
      outDir: "dist",
      // 确保静态资源使用相对路径
      assetsDir: "assets",
      // 生成 source map 用于调试（可选）
      sourcemap: false,
      // 禁用文件名 hash（可选，用于调试）
      rollupOptions: {
        output: {
          // 确保 chunk 文件名不包含绝对路径
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: proxyConfig,
    },
    // 定义全局常量，可以在代码中使用
    define: {
      __API_PREFIX__: JSON.stringify(API_PREFIX),
    },
  };
});
