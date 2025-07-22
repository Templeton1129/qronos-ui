<template>
  <div
    class="w-full h-screen max-h-screen flex items-start bg-neutral-100 dark:bg-neutral-950 box-border overflow-hidden"
  >
    <SidebarTemplate />
    <div class="flex-1 h-full overflow-y-auto flex flex-col">
      <HeaderTemplate />
      <div class="flex-1">
        <RouterView />
      </div>
      <footer
        class="py-2 bg-neutral-100 dark:bg-neutral-950 text-center text-sm text-neutral-500 dark:text-neutral-400"
      >
        <div class="flex items-center justify-center">
          实盘网页版<Divider layout="vertical" />公测版本
          <Message severity="secondary" size="small" class="h-6 font-mono mx-2"
            >v0.3.0</Message
          >© 2025
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SidebarTemplate from "@/layout-module/components/sidebar.template.vue";
import HeaderTemplate from "@/layout-module/components/header.template.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
