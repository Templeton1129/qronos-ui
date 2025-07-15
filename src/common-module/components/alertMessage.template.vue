<template>
  <Panel
    :toggleable="true"
    :collapsed.sync="isCollapsed"
    class="security-alert"
  >
    <template #header>
      <div class="flex items-center gap-2 text-blue-500">
        <i
          class="pi cursor-pointer"
          :class="isCollapsed ? 'pi-chevron-right' : 'pi-chevron-down'"
          @click="toggleCollapse"
        ></i>
        <div class="font-medium flex gap-2 items-center">
          <i class="pi pi-bell"></i
          ><span class="font-semibold"
            >温馨提示：如资金较大，建议使用自建部署方式</span
          >
        </div>
      </div>
    </template>

    <div>
      <p class="mb-3 leading-relaxed text-sm">
        若您的账户资金较多，建议不要直接使用本控制面板进行实盘交易。
        本软件为开源的可视化控制器，核心交易逻辑全部在本地服务器运行。
      </p>

      <div class="flex flex-wrap gap-3">
        <Button
          label="查看部署指南"
          icon="pi pi-book"
          size="small"
          class="p-button-outlined p-button-secondary"
          @click="openGuide"
        />
        <Button
          label="访问开源地址"
          icon="pi pi-github"
          size="small"
          class="p-button-outlined"
          @click="openGithub"
        />
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const openGuide = () => {
  window.open("https://bbs.quantclass.cn/thread/61054", "_blank");
};

const openGithub = () => {
  window.open("https://github.com/Templeton1129/qronos", "_blank");
};
</script>
