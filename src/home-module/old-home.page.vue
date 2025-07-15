<template>
  <div class="h-full w-full p-2 sm:p-6 space-y-3">
    <!-- 跑马灯 -->
    <MarqueeTemplate
      content="当前页面展示数据为模拟交易环境，实际功能正在开发中，预计下一版发布！"
    />
    <!-- 钱多警告 -->
    <AlertMessageTemplate />
    <template v-if="isLoading">
      <card class="rounded-lg overflow-hidden space-y-6">
        <template #header>
          <div class="p-3 bg-gray-100 dark:bg-neutral-700 text-white">
            <Skeleton
              width="40%"
              height="1.5rem"
              class="mx-auto rounded"
            ></Skeleton>
          </div>
        </template>
        <template #content>
          <div class="p-2">
            <div class="flex space-x-4 overflow-hidden">
              <div
                v-for="j in 3"
                :key="j"
                class="min-w-[calc(33.33%-1rem)] flex-shrink-0"
              >
                <div
                  class="border border-gray-200 dark:border-[#3d3d3d] rounded-lg overflow-hidden flex flex-col"
                >
                  <Skeleton
                    width="100%"
                    height="120px"
                    class="block"
                  ></Skeleton>

                  <div class="p-3 space-y-4">
                    <Skeleton
                      width="100%"
                      height="1.25rem"
                      class="mx-auto rounded"
                    ></Skeleton>

                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-2">
                        <Skeleton
                          v-for="i in 4"
                          width="100%"
                          height="1rem"
                          class="rounded"
                        ></Skeleton>
                      </div>
                      <div class="space-y-2">
                        <Skeleton
                          v-for="i in 4"
                          width="100%"
                          height="1rem"
                          class="rounded"
                        ></Skeleton>
                      </div>
                    </div>
                    <Skeleton
                      width="50%"
                      height="1rem"
                      class="rounded"
                    ></Skeleton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </card>
    </template>

    <template v-else>
      <card
        v-for="frameworkItem in viewFramworkDataList"
        :key="frameworkItem.frameName"
        class="rounded-lg overflow-hidden space-y-6"
        :pt="{
          body: {
            class: 'p-2',
          },
        }"
      >
        <template #header>
          <!-- 框架标题 -->
          <div class="p-3 bg-primary-400 text-white">
            <h2 class="text-md font-bold text-center">
              {{ frameworkItem.frameName }}
            </h2>
          </div>
        </template>

        <template #content>
          <!-- 账户轮播 -->
          <Carousel
            :value="frameworkItem.accountList"
            :numVisible="3"
            :numScroll="1"
            :responsiveOptions="responsiveOptions"
            :prevButtonProps="{
              severity: 'primary',
              text: true,
              rounded: true,
            }"
            :nextButtonProps="{
              severity: 'primary',
              text: true,
              rounded: true,
            }"
            :pt="{
              pcPrevButton: {
                class: 'hidden sm:inline-flex',
              },
              pcNextButton: {
                class: 'hidden sm:inline-flex',
              },
            }"
          >
            <template #item="slotProps">
              <div
                class="sm:m-2 border border-gray-200 dark:border-[#3d3d3d] rounded-lg overflow-hidden flex flex-col"
              >
                <Image
                  :src="dataImg"
                  class="w-full h-auto object-cover"
                  :alt="slotProps.data.账户"
                  preview
                />

                <!-- 账户内容 -->
                <div class="px-2 sm:px-4 flex flex-col gap-1 sm:gap-2">
                  <h3 class="font-semibold text-md text-center">
                    {{ slotProps.data.账户 }}
                  </h3>

                  <!-- 两列数据网格 -->
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm flex-1"
                  >
                    <!-- 第一列 -->
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >账户净值:</span
                        >
                        <span class="font-medium"
                          >${{ slotProps.data.账户净值 }}</span
                        >
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >最近盈亏:</span
                        >
                        <span
                          :class="
                            slotProps.data.最近1小时盈亏 >= 0
                              ? 'text-green-500 font-medium'
                              : 'text-red-500 font-medium'
                          "
                        >
                          ${{ slotProps.data.最近1小时盈亏 }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >最高净值:</span
                        >
                        <span class="font-medium"
                          >${{ slotProps.data.历史最高账户总净值 }}</span
                        >
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >现货余额:</span
                        >
                        <span class="font-medium"
                          >${{ slotProps.data.现货USDT余额 }}</span
                        >
                      </div>
                    </div>

                    <!-- 第二列 -->
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >最低净值:</span
                        >
                        <span class="font-medium"
                          >${{ slotProps.data.历史最低账户总净值 }}</span
                        >
                      </div>

                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >空头仓位:</span
                        >
                        <span class="font-medium">{{
                          slotProps.data.空头仓位
                        }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-500 dark:text-gray-300"
                          >杠杆/MMR:</span
                        >
                        <span class="font-medium"
                          >{{ slotProps.data.杠杆 }}x /
                          {{ slotProps.data.账户的UniMMR }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-between items-center mb-3">
                    <span class="text-gray-500 dark:text-gray-300"
                      >多头仓位:</span
                    >
                    <span class="font-medium">{{
                      slotProps.data.多头仓位
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </Carousel>
        </template>
      </card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dataImg from "@/assets/home-img/data.jpg";
import AlertMessageTemplate from "@/common-module/components/alertMessage.template.vue";
import MarqueeTemplate from "@/common-module/components/marquee.template.vue";
const isLoading = ref<boolean>(false);
const viewFramworkDataList = ref([
  {
    frameName: "仓位管理实盘框架v1.3.2",
    accountList: [
      {
        账户净值: 50000,
        账户: "账户1",
        账户类型: "统一账户",
        最近1小时盈亏: 1000,
        历史最高账户总净值: 50000,
        历史最低账户总净值: 49000,
        现货USDT余额: 45000,
        多头仓位: "25000(spot 20000, swap 5000)",
        空头仓位: -25000,
        杠杆: 1.0,
        账户的UniMMR: 188,
      },
      // 其他账户数据...
      {
        账户净值: 50000,
        账户: "账户2",
        账户类型: "统一账户",
        最近1小时盈亏: 1000,
        历史最高账户总净值: 50000,
        历史最低账户总净值: 49000,
        现货USDT余额: 45000,
        多头仓位: "25000(spot 20000, swap 5000)",
        空头仓位: -25000,
        杠杆: 1.0,
        账户的UniMMR: 188,
      },
      {
        账户净值: 50000,
        账户: "账户3",
        账户类型: "统一账户",
        最近1小时盈亏: 1000,
        历史最高账户总净值: 50000,
        历史最低账户总净值: 49000,
        现货USDT余额: 45000,
        多头仓位: "25000(spot 20000, swap 5000)",
        空头仓位: -25000,
        杠杆: 1.0,
        账户的UniMMR: 188,
      },
      {
        账户净值: 50000,
        账户: "账户4",
        账户类型: "统一账户",
        最近1小时盈亏: 1000,
        历史最高账户总净值: 50000,
        历史最低账户总净值: 49000,
        现货USDT余额: 45000,
        多头仓位: "25000(spot 20000, swap 5000)",
        空头仓位: -25000,
        杠杆: 1.0,
        账户的UniMMR: 188,
      },
    ],
  },
]);

const responsiveOptions = ref([
  {
    breakpoint: "2000px",
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: "1536px",
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: "1280px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "970px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "640px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>

<style scoped>
/* 更平滑的动画效果 */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-80%);
  }
}
.animate-marquee {
  animation: marquee 14s linear infinite;
  animation-delay: 1s; /* 初始延迟避免页面加载时突兀 */
  cursor: pointer;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* 暗黑模式适配 */
.dark .pi {
  filter: brightness(1.2);
}
</style>
