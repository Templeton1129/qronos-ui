<template>
  <Drawer
    v-model:visible="visible"
    position="full"
    :draggable="false"
    class="bg-slate-950 text-white"
    :pt="{
      header: 'py-1 sm:py-2 flex items-center justify-between',
      title: 'text-lg sm:text-xl',
      content: 'px-0 sm:px-2 py-0',
    }"
    @show="loadData"
  >
    <template #header>
      <div class="flex-1 flex gap-2 items-center justify-between pr-2">
        <div>分享海报预览</div>
        <div class="flex gap-2">
          <Button
            label="复制图片"
            icon="pi pi-copy"
            size="small"
            severity="secondary"
            class="hidden sm:inline-flex text-xs"
            :disabled="viewExporting || viewCopying"
            :loading="viewCopying"
            @click="copyPoster"
          />
          <Button
            label="下载图片"
            icon="pi pi-download"
            size="small"
            class="text-xs"
            :disabled="viewExporting || viewCopying"
            :loading="viewExporting"
            @click="downloadPoster"
          />
        </div>
      </div>
    </template>
    <div class="h-full flex flex-col text-gray-100 overflow-auto">
      <div class="flex-1 pb-3 w-full flex justify-center">
        <div
          ref="refPoster"
          class="flex-1 max-w-full sm:max-w-[480px] overflow-y-auto relative bg-slate-950 p-4 space-y-3"
        >
          <div
            v-if="mode === 'simulate'"
            class="absolute inset-0 pointer-events-none z-[8] overflow-hidden"
          >
            <div
              class="absolute inset-0 flex flex-wrap justify-center content-center gap-[60px] sm:gap-[120px] px-10 text-sm sm:text-base"
            >
              <span
                v-for="i in 30"
                :key="i"
                :style="{
                  transform: `rotate(-25deg) translateY(${(i % 6) * 4}px)`,
                  opacity: 0.04 + (i % 6) * 0.012,
                }"
              >
                XBX SIMULATION
              </span>
            </div>
          </div>

          <div
            class="absolute inset-0 opacity-30"
            style="
              background-image:
                radial-gradient(
                  circle at 20% 10%,
                  rgba(52, 211, 153, 0.35),
                  transparent 40%
                ),
                radial-gradient(
                  circle at 90% 20%,
                  rgba(59, 130, 246, 0.28),
                  transparent 35%
                ),
                linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0.06),
                  rgba(255, 255, 255, 0.01),
                  rgba(255, 255, 255, 0)
                );
            "
          ></div>
          <div v-if="viewInitLoading" class="relative z-10 space-y-3">
            <div class="flex items-center gap-4 py-3">
              <Skeleton
                shape="circle"
                width="46px"
                height="46px"
                class="!bg-stone-900/30"
              />
              <div class="flex-1 space-y-2">
                <Skeleton width="60%" height="16px" class="!bg-stone-900/30" />
                <Skeleton width="45%" height="14px" class="!bg-stone-900/30" />
              </div>
            </div>
            <Skeleton
              width="100%"
              height="120px"
              borderRadius="16px"
              class="!bg-stone-900/30"
            />
            <div class="grid grid-cols-3 gap-2">
              <Skeleton
                width="100%"
                height="110px"
                borderRadius="12px"
                class="!bg-stone-900/30"
              />
              <Skeleton
                width="100%"
                height="110px"
                borderRadius="12px"
                class="!bg-stone-900/30"
              />
              <Skeleton
                width="100%"
                height="110px"
                borderRadius="12px"
                class="!bg-stone-900/30"
              />
            </div>
            <Skeleton
              width="100%"
              height="140px"
              borderRadius="12px"
              class="!bg-stone-900/30"
            />
            <Skeleton
              width="100%"
              height="420px"
              borderRadius="12px"
              class="!bg-stone-900/30"
            />
            <Skeleton
              width="100%"
              height="220px"
              borderRadius="12px"
              class="!bg-stone-900/30"
            />
          </div>
          <div v-show="!viewInitLoading" class="relative z-10 space-y-3">
            <template v-if="viewPosterInfo && viewClonePosterInfo">
              <!-- header -->
              <div class="flex items-center gap-4 py-3">
                <img
                  class="h-[46px] w-auto shrink-0"
                  src="@/assets/header-img/xbx-logo.png"
                />
                <div class="flex-1 min-w-0 space-y-0.5">
                  <div class="flex items-center justify-between gap-2 min-w-0">
                    <!-- 编辑 -->
                    <template v-if="viewIsEditing">
                      <div class="flex-1 flex items-center gap-2 min-w-0">
                        <div
                          class="flex-1 min-w-0 border border-gray-400/60 rounded-lg border-dashed px-2 focus-within:border-gray-300 transition"
                        >
                          <input
                            v-model.trim="viewCustomTitle"
                            class="w-full text-[15px] font-semibold tracking-wide bg-transparent text-gray-100 border-0 outline-none placeholder:text-gray-500"
                            placeholder="名称"
                            @keyup.enter="saveNameAction"
                          />
                        </div>

                        <i
                          class="pi pi-check cursor-pointer px-1 hover:text-green-400 transition shrink-0"
                          @click="saveNameAction"
                        ></i>
                      </div>
                    </template>

                    <!-- 展示 -->
                    <template v-else>
                      <div class="flex-1 flex items-center gap-2 min-w-0">
                        <span
                          class="min-w-0 truncate text-[15px] font-semibold tracking-wide"
                          :title="viewCustomTitle"
                        >
                          {{ viewCustomTitle }}
                        </span>

                        <i
                          class="pi pi-pencil text-sm cursor-pointer px-1 shrink-0 hover:text-gray-300 transition"
                          @click="viewIsEditing = true"
                        ></i>
                      </div>
                    </template>

                    <span
                      v-if="mode === 'simulate'"
                      class="text-[11px] font-medium text-primary-300 px-3 py-1 rounded-full tracking-wider bg-primary-500/10 border border-primary-400/20 backdrop-blur-sm"
                    >
                      模拟盘
                    </span>
                  </div>

                  <!-- 状态 -->
                  <div
                    class="inline-flex items-center gap-2 text-[13px] px-2 py-0.5 rounded-lg w-fit"
                    :class="
                      viewClonePosterInfo.status_text === '运行中'
                        ? 'text-green-400 bg-emerald-400/10'
                        : 'text-amber-300 bg-amber-400/10'
                    "
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="
                        viewClonePosterInfo.status_text === '运行中'
                          ? 'bg-green-400 animate-pulse'
                          : 'bg-amber-300'
                      "
                    ></span>

                    <span>
                      <span>{{
                        viewClonePosterInfo.status_text || "已停止"
                      }}</span>
                      <span v-if="viewClonePosterInfo.running_days"
                        ><span class="px-1.5">·</span
                        ><span
                          >累计运行
                          {{ viewClonePosterInfo.running_days }} 天</span
                        >
                      </span>
                    </span>
                  </div>

                  <span
                    v-if="viewClonePosterInfo.status_text === '已停止'"
                    class="text-xs text-gray-500 pl-0 sm:pl-2 block sm:inline-block mt-0.5 sm:mt-0"
                    >{{
                      dayjs(viewClonePosterInfo.start_at).format("YYYY-MM-DD")
                    }}<span class="px-1">~</span
                    >{{
                      dayjs(viewClonePosterInfo.end_at).format("YYYY-MM-DD")
                    }}</span
                  >
                </div>
              </div>

              <!-- 累计收益率 -->
              <div
                class="relative rounded-2xl overflow-hidden border border-gray-800 bg-stone-900/30 px-6 py-5 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[linear-gradient(90deg,#2ECC71_0%,#5B8DEF_50%,#2ECC71_100%)] before:bg-[length:200%_100%] before:animate-shimmer"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                  ></div>
                  <div class="text-xs tracking-wider text-gray-400">
                    累计收益率 ( 累计 {{ viewClonePosterInfo.running_days }} 天
                    )
                  </div>
                </div>
                <div
                  class="mt-1 text-[44px] sm:text-[52px] leading-none font-semibold font-mono text-emerald-400"
                >
                  {{ viewClonePosterInfo.eq_pct }}%
                </div>
              </div>

              <!-- 数据展示 -->
              <div class="grid grid-cols-3 gap-2">
                <!-- 最大回撤 -->
                <div
                  class="rounded-xl border border-gray-800 bg-stone-900/30 px-1 py-3 flex flex-col items-center gap-2"
                >
                  <div class="text-xs text-gray-400">最大回撤</div>

                  <div
                    class="mt-1 text-xl sm:text-2xl leading-none font-medium text-rose-400 font-mono"
                  >
                    {{ viewClonePosterInfo.eq_drawdown }}%
                  </div>

                  <div
                    class="mt-1 text-xs text-gray-500 flex items-center gap-1"
                  >
                    <i :class="drawdownMeta.icon" />
                    {{ drawdownMeta.label }}
                  </div>
                </div>

                <!-- 年化 -->
                <div
                  class="rounded-xl border border-gray-800 bg-stone-900/30 px-1 py-3 flex flex-col items-center gap-2"
                >
                  <div class="text-xs text-gray-400">年化≈</div>

                  <div
                    class="mt-1 text-xl sm:text-2xl leading-none font-medium text-emerald-300 font-mono"
                  >
                    {{ viewClonePosterInfo.eq_annualized }}%
                  </div>

                  <div
                    class="mt-1 text-xs text-gray-500 flex items-center gap-1"
                  >
                    <i :class="annualMeta.icon" />
                    {{ annualMeta.label }}
                  </div>
                </div>

                <!-- 24H收益 -->
                <div
                  class="rounded-xl border border-gray-800 bg-stone-900/30 px-1 py-3 flex flex-col items-center gap-2"
                >
                  <div class="text-xs text-gray-400">最近24H收益率</div>

                  <div
                    class="mt-1 text-xl sm:text-2xl leading-none font-medium text-amber-300 font-mono"
                  >
                    {{ viewClonePosterInfo.eq_pct_24h }}%
                  </div>

                  <div
                    class="mt-1 text-xs text-gray-500 flex items-center gap-1"
                  >
                    <i :class="dailyMeta.icon" />
                    {{ dailyMeta.label }}
                  </div>
                </div>
              </div>

              <div
                v-if="
                  !(
                    viewClonePosterInfo?.long_ratio === 0 &&
                    viewClonePosterInfo?.short_ratio === 0 &&
                    viewClonePosterInfo?.empty_ratio === 0
                  )
                "
                class="rounded-xl border border-gray-800 bg-stone-900/30 p-3"
              >
                <!-- 当前持仓 -->
                <div class="space-y-3">
                  <div
                    class="text-sm text-gray-400 flex items-center gap-2 mb-4"
                  >
                    <div class="h-3 w-1 bg-primary-300/70 rounded-2xl"></div>
                    当前仓位结构
                  </div>
                  <div class="space-y-2">
                    <div
                      class="h-5 rounded-lg overflow-hidden flex cursor-pointer"
                    >
                      <div
                        class="h-full bg-emerald-500/80"
                        :style="{
                          width: `${percent(viewClonePosterInfo.long_ratio)}%`,
                        }"
                        v-tooltip.top="
                          `${percent(viewClonePosterInfo.long_ratio)}%`
                        "
                      ></div>

                      <div
                        class="h-full bg-rose-500/70"
                        :style="{
                          width: `${percent(viewClonePosterInfo.short_ratio)}%`,
                        }"
                        v-tooltip.top="
                          `${percent(viewClonePosterInfo.short_ratio)}%`
                        "
                      ></div>

                      <div
                        class="h-full bg-gray-500/80"
                        :style="{
                          width: `${percent(viewClonePosterInfo.empty_ratio)}%`,
                        }"
                        v-tooltip.top="
                          `${percent(viewClonePosterInfo.empty_ratio)}%`
                        "
                      ></div>
                    </div>
                    <div class="text-xs flex items-center justify-center gap-6">
                      <div class="flex items-center gap-2">
                        <div
                          class="bg-emerald-500/80 w-2 h-2 rounded-full"
                        ></div>
                        <div>
                          做多
                          <span class="font-mono text-sm"
                            >{{
                              percent(viewClonePosterInfo.long_ratio)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="bg-rose-500/70 w-2 h-2 rounded-full"></div>
                        <div>
                          做空
                          <span class="font-mono text-sm"
                            >{{
                              percent(viewClonePosterInfo.short_ratio)
                            }}%</span
                          >
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="bg-gray-500/80 w-2 h-2 rounded-full"></div>
                        <div>
                          空仓
                          <span class="font-mono text-sm"
                            >{{
                              percent(viewClonePosterInfo.empty_ratio)
                            }}%</span
                          >
                        </div>
                      </div>
                    </div>
                    <div
                      class="border-b border-gray-800 border-dashed mx-16 my-2"
                    ></div>
                    <div class="flex items-center justify-around px-3">
                      <div class="space-y-1 flex flex-col items-center">
                        <div class="text-gray-400 text-xs">多头选币数量</div>
                        <div class="text-emerald-400 font-semibold font-mono">
                          {{ viewClonePosterInfo.long_coin_num ?? "-" }}
                        </div>
                      </div>
                      <div class="space-y-1 flex flex-col items-center">
                        <div class="text-gray-400 text-xs">空头选币数量</div>
                        <div class="text-rose-400 font-semibold font-mono">
                          {{ viewClonePosterInfo.short_coin_num ?? "-" }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="rounded-xl border border-gray-800 bg-stone-900/30 pb-3 overflow-hidden mt-4"
              >
                <!-- 时间区间 -->
                <div
                  class="flex w-full justify-between items-center pl-4 pr-2 bg-gray-800/50 py-1.5"
                >
                  <div class="flex items-center gap-2">
                    <i class="pi pi-clock text-sm text-gray-400"></i>
                    <span class="text-xs text-gray-400">时间区间</span>
                  </div>
                  <div class="flex items-center gap-0 sm:gap-1">
                    <div
                      v-for="item in timeRangeOptions"
                      :key="item.value"
                      @click="changeTimeRange(item.value)"
                      class="text-xs tracking-wide rounded-lg transition-all duration-200 cursor-pointer py-1 px-4 sm:px-5"
                      :class="[
                        viewSelectedTimeRange === item.value
                          ? 'text-gray-300/90 bg-gray-800/90 rounded-lg'
                          : 'text-gray-400 hover:text-gray-300/90',
                      ]"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </div>

                <div class="px-3">
                  <div
                    class="mt-4 mb-3 text-sm text-center tracking-wider text-gray-300"
                  >
                    {{
                      viewSelectedTimeRange === 0
                        ? "全周期数据统计"
                        : `近 ${viewSelectedTimeRange} 天数据统计`
                    }}
                  </div>
                  <!-- 净值走势 -->
                  <div class="space-y-2">
                    <div class="text-sm text-gray-400 flex items-center gap-2">
                      <div class="h-3 w-1 bg-primary-300/70 rounded-2xl"></div>
                      净值走势
                    </div>
                    <template v-if="viewSectionLoading">
                      <div
                        class="h-[276px] flex flex-col items-center justify-center gap-4"
                      >
                        <ProgressSpinner
                          style="width: 42px; height: 42px"
                          strokeWidth="4"
                          animationDuration="1s"
                        />
                        <span class="text-xs text-gray-400 tracking-wide"
                          >数据加载中...</span
                        >
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-if="
                          viewEquityTime.length &&
                          viewPosterInfo?.equity?.net?.length
                        "
                        class="space-y-2"
                      >
                        <div class="h-[220px] overflow-hidden">
                          <v-chart
                            ref="refEquityChart"
                            :option="chartOption"
                            autoresize
                            class="w-full h-full"
                          />
                        </div>
                        <div
                          class="flex items-center justify-between px-3 mt-3"
                        >
                          <div class="space-y-1 flex flex-col items-center">
                            <div class="text-gray-400 text-xs">最新净值</div>
                            <div class="text-blue-400 font-semibold font-mono">
                              {{ viewPosterInfo?.equity?.net?.at(-1) ?? "--" }}%
                            </div>
                          </div>
                          <div class="space-y-1 flex flex-col items-center">
                            <div class="text-gray-400 text-xs">最高净值</div>
                            <div
                              class="text-emerald-400 font-semibold font-mono"
                            >
                              {{
                                viewPosterInfo?.equity?.net.length
                                  ? Math.max(...viewPosterInfo?.equity?.net)
                                  : "--"
                              }}%
                            </div>
                          </div>
                          <div class="space-y-1 flex flex-col items-center">
                            <div class="text-gray-400 text-xs">最低净值</div>
                            <div class="text-gray-100 font-semibold font-mono">
                              {{
                                viewPosterInfo?.equity?.net.length
                                  ? Math.min(
                                      ...(viewPosterInfo?.equity?.net || [])
                                    )
                                  : "--"
                              }}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="h-[276px] flex flex-col gap-4 items-center justify-center pb-5"
                      >
                        <img
                          src="@/assets/home-img/no-data.png"
                          class="w-20 h-auto opacity-35"
                        />
                        <div
                          class="flex justify-center items-center text-xs text-gray-400 tracking-wide"
                        >
                          <span v-if="viewSelectedTimeRange !== 0"
                            >最近{{ viewSelectedTimeRange }}天</span
                          >暂无净值数据
                        </div>
                      </div>
                    </template>
                  </div>
                  <!-- 分割线 -->
                  <div class="border-b border-gray-800 mx-4 my-6"></div>
                  <!-- 多空比例 -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-400 flex items-center gap-2"
                      >
                        <div
                          class="h-3 w-1 bg-primary-300/70 rounded-2xl"
                        ></div>
                        多空比例
                      </div>
                    </div>
                    <template v-if="viewSectionLoading">
                      <div
                        class="h-[120px] flex flex-col items-center justify-center gap-4"
                      >
                        <ProgressSpinner
                          style="width: 42px; height: 42px"
                          strokeWidth="4"
                          animationDuration="1s"
                        />
                        <span class="text-xs text-gray-400 tracking-wide"
                          >数据加载中...</span
                        >
                      </div>
                    </template>
                    <template v-else>
                      <div class="h-[120px] overflow-hidden">
                        <v-chart
                          v-if="
                            viewEquityTime.length &&
                            viewPosterInfo?.equity?.long_ratio?.length &&
                            viewPosterInfo?.equity?.short_ratio?.length &&
                            viewPosterInfo?.equity?.empty_ratio?.length
                          "
                          ref="refLongShortRatioChart"
                          :option="longShortRatioAreaOption"
                          autoresize
                          class="w-full h-full"
                        />
                        <div
                          v-else
                          class="h-full flex flex-col gap-4 items-center justify-center"
                        >
                          <img
                            src="@/assets/home-img/no-data.png"
                            class="w-20 h-auto opacity-35"
                          />
                          <div
                            class="flex justify-center items-center text-xs text-gray-400 tracking-wide"
                          >
                            <span v-if="viewSelectedTimeRange !== 0"
                              >最近{{ viewSelectedTimeRange }}天</span
                            >暂无多空比例数据
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <!-- 多空选币数量 -->
                  <template v-if="viewIsShowAll">
                    <!-- 分割线 -->
                    <div class="border-b border-gray-800 mx-4 my-6"></div>
                    <div class="space-y-3">
                      <div
                        class="text-sm text-gray-400 flex items-center gap-2"
                      >
                        <div
                          class="h-3 w-1 bg-primary-300/70 rounded-2xl"
                        ></div>
                        多空选币数量
                      </div>
                      <template v-if="viewSectionLoading">
                        <div
                          class="h-[180px] flex flex-col items-center justify-center gap-4"
                        >
                          <ProgressSpinner
                            style="width: 42px; height: 42px"
                            strokeWidth="4"
                            animationDuration="1s"
                          />
                          <span class="text-xs text-gray-400 tracking-wide"
                            >数据加载中...</span
                          >
                        </div>
                      </template>
                      <template v-else>
                        <div class="h-[180px] overflow-hidden">
                          <v-chart
                            v-if="
                              viewEquityTime.length &&
                              viewPosterInfo?.equity?.long_coin_num?.length &&
                              viewPosterInfo?.equity?.short_coin_num?.length
                            "
                            ref="refLongShortCountChart"
                            :option="longShortCountOption"
                            autoresize
                            class="w-full h-full"
                          />
                          <div
                            v-else
                            class="h-full flex flex-col gap-4 items-center justify-center"
                          >
                            <img
                              src="@/assets/home-img/no-data.png"
                              class="w-20 h-auto opacity-35"
                            />
                            <div
                              class="flex justify-center items-center text-xs text-gray-400 tracking-wide"
                            >
                              <span v-if="viewSelectedTimeRange !== 0"
                                >最近{{ viewSelectedTimeRange }}天</span
                              >暂无多空选币数量数据
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                    <!-- 分割线 -->
                    <div class="border-b border-gray-800 mx-4 my-6"></div>
                    <div class="space-y-3">
                      <div
                        class="text-sm text-gray-400 flex items-center gap-2"
                      >
                        <div
                          class="h-3 w-1 bg-primary-300/70 rounded-2xl"
                        ></div>
                        仓位敞口统计
                      </div>
                      <template v-if="viewSectionLoading">
                        <div
                          class="h-[180px] flex flex-col items-center justify-center gap-4"
                        >
                          <ProgressSpinner
                            style="width: 42px; height: 42px"
                            strokeWidth="4"
                            animationDuration="1s"
                          />
                          <span class="text-xs text-gray-400 tracking-wide"
                            >数据加载中...</span
                          >
                        </div>
                      </template>
                      <template v-else>
                        <div class="h-[180px] overflow-hidden">
                          <v-chart
                            v-if="
                              viewEquityTime.length &&
                              viewPosterInfo?.equity?.exposure_long?.length &&
                              viewPosterInfo?.equity?.exposure_short?.length
                            "
                            ref="refLongShortCountChart"
                            :option="exposureOption"
                            autoresize
                            class="w-full h-full"
                          />
                          <div
                            v-else
                            class="h-full flex flex-col gap-4 items-center justify-center"
                          >
                            <img
                              src="@/assets/home-img/no-data.png"
                              class="w-20 h-auto opacity-35"
                            />
                            <div
                              class="flex justify-center items-center text-xs text-gray-400 tracking-wide"
                            >
                              <span v-if="viewSelectedTimeRange !== 0"
                                >最近{{ viewSelectedTimeRange }}天</span
                              >暂无仓位敞口统计数据
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                  <!-- 展开更多详情 -->
                  <div
                    class="text-xs text-gray-300 text-center mt-8 rounded-lg flex justify-center"
                  >
                    <button
                      @click="viewIsShowAll = !viewIsShowAll"
                      class="flex justify-center items-center gap-2 p-2 cursor-pointer"
                    >
                      <span>{{
                        viewIsShowAll ? "收起详情数据" : "展开详情数据"
                      }}</span>
                      <i
                        :class="`${viewIsShowAll ? 'pi pi-arrow-up' : 'pi pi-arrow-down'} text-xs`"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="h-[180px] flex flex-col items-center justify-center gap-4"
              >
                <img
                  src="@/assets/home-img/no-data.png"
                  class="w-30 h-auto opacity-35"
                />
                <div
                  class="flex justify-center items-center text-xs text-gray-400 tracking-wide"
                >
                  <span v-if="viewSelectedTimeRange !== 0"
                    >最近{{ viewSelectedTimeRange }}天</span
                  >暂无仓位敞口数据
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import dayjs from "dayjs";
import html2canvas from "html2canvas-pro";
import { useToast } from "primevue/usetoast";
import { getSharePosterInfo } from "@/common-module/services/service.provider";
import { useRatingFn } from "@/home-module/hook/useRatingFn";
const { getDrawdownMeta, getAnnualMeta, getDailyMeta } = useRatingFn();
const drawdownMeta = computed(() =>
  getDrawdownMeta(viewClonePosterInfo.value?.eq_drawdown || 0)
);
const annualMeta = computed(() =>
  getAnnualMeta(viewClonePosterInfo.value?.eq_annualized || 0)
);
const dailyMeta = computed(() =>
  getDailyMeta(viewClonePosterInfo.value?.eq_pct_24h || 0)
);

const toast = useToast();

const props = defineProps<{
  modelValue: boolean;
  frameworkId: string;
  accountName: string;
  mode: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const refPoster = ref<HTMLElement | null>(null);
const refEquityChart = ref<any>(null);
const refLongShortRatioChart = ref<any>(null);
const refLongShortCountChart = ref<any>(null);
const viewPosterInfo = ref<tDbSharePosterInfo | null>(null);
const viewClonePosterInfo = ref<tDbSharePosterInfo | null>(null);
const viewEquityTime = ref<string[]>([]);
const viewExporting = ref(false);
const viewCopying = ref(false);
const viewInitLoading = ref(false);
const viewSectionLoading = ref(false);
const viewHasLoaded = ref(false);

const viewCustomTitle = ref<string>(props.accountName || "");
const viewIsEditing = ref<boolean>(false);

const viewSelectedTimeRange = ref<number>(0);
const timeRangeOptions = [
  { name: "全部", value: 0 },
  { name: "最近30天", value: 30 },
  { name: "最近7天", value: 7 },
];

const viewIsShowAll = ref<boolean>(false);
const percent = (val: number) => Math.round(val * 100);

const loadData = () => {
  viewCustomTitle.value = props.accountName || "";
  viewIsEditing.value = false;
  viewSelectedTimeRange.value = 0;
  viewIsShowAll.value = false;
  viewHasLoaded.value = false;
  getSharePosterInfoFn("initial");
};

const getSharePosterInfoFn = async (
  mode: "initial" | "section" = "section"
) => {
  const useInitLoading = mode === "initial" || !viewHasLoaded.value;
  if (useInitLoading) {
    viewInitLoading.value = true;
  } else {
    viewSectionLoading.value = true;
  }
  try {
    const res = await getSharePosterInfo(
      props.frameworkId || "",
      props.accountName || "",
      viewSelectedTimeRange.value
    );
    if (res.result === true && res.data) {
      viewPosterInfo.value = JSON.parse(JSON.stringify(res.data));
      viewClonePosterInfo.value = JSON.parse(JSON.stringify(res.data));
      viewEquityTime.value = viewPosterInfo.value?.equity?.time || [];
    } else {
      viewPosterInfo.value = null;
      viewClonePosterInfo.value = null;
      viewEquityTime.value = [];
    }
    viewHasLoaded.value = true;
  } finally {
    viewInitLoading.value = false;
    viewSectionLoading.value = false;
  }
};

const saveNameAction = () => {
  viewIsEditing.value = false;
  viewCustomTitle.value =
    viewCustomTitle.value?.trim() || props.accountName || "";
};

const changeTimeRange = (val: number) => {
  if (viewSelectedTimeRange.value === val) return;
  viewSelectedTimeRange.value = val;
  getSharePosterInfoFn("section");
};

const chartOption = computed(() => {
  return {
    grid: { top: 26, left: 0, right: 0, bottom: 0, containLabel: true },
    color: ["#34D399"],
    tooltip: {
      z: 1000,
      appendToBody: true,
      trigger: "axis",
      backgroundColor: "#0a111a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0", fontSize: 11 },
      formatter: (params: any[]) => {
        return `${params[0].axisValue}<br/>${params[0].marker}净值: ${params[0].value}%`;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: viewEquityTime.value,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: true, lineStyle: { color: "#94A3B81F" } },
    },
    series: [
      {
        name: "净值",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.net || [],
        lineStyle: { width: 3 },
        areaStyle: { color: "#34D3991A" },
        markPoint: {
          symbol: "circle",
          symbolSize: "10",
          label: {
            formatter: "{c}%",
            fontSize: "12",
            color: "#e2e8f0",
            fontWeight: "bold",
            offset: [-10, -12],
          },
          data: [
            { type: "max", name: "Max", itemStyle: { color: "#22c55e" } },
            { type: "min", name: "Min", itemStyle: { color: "#ff637e" } },
          ],
        },
      },
    ],
  };
});

const longShortRatioAreaOption = computed(() => {
  return {
    grid: { top: 28, left: 0, right: 0, bottom: 0, containLabel: true },
    color: ["#22c55e", "#ef4444", "#9ca3af"],
    tooltip: {
      trigger: "axis",
      z: 1000,
      appendToBody: true,
      backgroundColor: "#0a111a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0", fontSize: 11 },
    },
    legend: {
      data: ["Long", "Short", "Empty"],
      top: 0,
      textStyle: {
        fontSize: 10,
        color: "#e2e8f0",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: viewEquityTime.value,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: true, lineStyle: { color: "#94A3B81F" } },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "Long",
        type: "line",
        stack: "ratio",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.long_ratio || [],
        areaStyle: {
          color: "#22c55e",
          opacity: 0.6,
        },
      },
      {
        name: "Short",
        type: "line",
        stack: "ratio",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.short_ratio || [],
        areaStyle: {
          color: "#ef4444",
          opacity: 0.6,
        },
      },
      {
        name: "Empty",
        type: "line",
        stack: "ratio",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.empty_ratio || [],
        areaStyle: {
          color: "#9ca3af",
          opacity: 0.6,
        },
      },
    ],
  };
});

const longShortCountOption = computed(() => {
  return {
    grid: { top: 28, left: 0, right: 0, bottom: 0, containLabel: true },
    color: ["#22c55e", "#ef4444"],
    tooltip: {
      trigger: "axis",
      z: 1000,
      appendToBody: true,
      backgroundColor: "#0a111a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0", fontSize: 11 },
    },
    legend: {
      data: ["多头选币", "空头选币"],
      top: 0,
      textStyle: { fontSize: 10, color: "#e2e8f0" },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: viewEquityTime.value,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: true, lineStyle: { color: "#94A3B81F" } },
    },
    dataZoom: [{ type: "inside", xAxisIndex: 0, start: 0, end: 100 }],
    series: [
      {
        name: "多头选币",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.long_coin_num || [],
        lineStyle: { color: "#22c55e", width: 2.5 },
      },
      {
        name: "空头选币",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: viewPosterInfo.value?.equity?.short_coin_num || [],
        lineStyle: { color: "#ef4444", width: 2.5 },
      },
    ],
  };
});

const exposureOption = computed(() => {
  return {
    grid: { top: 28, left: 0, right: 0, bottom: 0, containLabel: true },
    color: ["#22c55e", "#ef4444"],
    legend: {
      data: ["多头敞口", "空头敞口"],
      top: 0,
      textStyle: {
        fontSize: 10,
        color: "#e2e8f0",
      },
    },
    tooltip: {
      trigger: "axis",
      z: 1000,
      appendToBody: true,
      backgroundColor: "#0a111a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0", fontSize: 11 },
      formatter: (params: any[]) => {
        let res = params[0].axisValue + "<br/>";
        params.forEach((item) => {
          res += `${item.marker}${item.seriesName}: ${item.value}%<br/>`;
        });
        return res;
      },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: viewEquityTime.value,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: "value",
      position: "left",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: true, lineStyle: { color: "#94A3B81F" } },
    },
    series: [
      {
        name: "多头敞口",
        type: "line",
        stack: "ratio",
        data: viewPosterInfo.value?.equity?.exposure_long || [],
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: "#22c55e",
        },
        lineStyle: {
          color: "#22c55e",
          width: 0.1,
        },
        markLine: {
          symbol: "none",
          silent: true,
          lineStyle: { color: "#22c55e", width: 1 },
          data: [{ yAxis: 0 }],
        },
      },
      {
        name: "空头敞口",
        type: "line",
        data: viewPosterInfo.value?.equity?.exposure_short || [],
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: "#ef4444",
        },
        lineStyle: {
          color: "#ef4444",
          width: 0.1,
        },
      },
    ],
  };
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const resizeChart = (chartRef: any) => {
  const instance = chartRef?.chart || chartRef?.getEchartsInstance?.();
  const host = chartRef?.$el as HTMLElement | undefined;
  const width = host?.clientWidth;
  const height = host?.clientHeight;
  if (!instance || !width || !height) return;
  instance.resize({ width, height, silent: true });
};

const redrawChartsBeforeCapture = async () => {
  await nextTick();
  resizeChart(refEquityChart.value);
  resizeChart(refLongShortRatioChart.value);
  resizeChart(refLongShortCountChart.value);
  await nextTick();
  await wait(80);
};

const renderCanvas = async () => {
  if (!refPoster.value) return null;
  await redrawChartsBeforeCapture();
  return await html2canvas(refPoster.value, {
    scale: Math.min((window.devicePixelRatio || 1) * 2, 3),
    backgroundColor: "#070b12",
    useCORS: true,
    logging: false,
    allowTaint: false,
    scrollX: 0,
    scrollY: 0,
  });
};

const downloadPoster = async () => {
  viewCustomTitle.value = viewCustomTitle.value || props.accountName || "";
  viewIsEditing.value = false;
  if (viewExporting.value) return;
  viewExporting.value = true;
  try {
    const canvas = await renderCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `分享海报_${dayjs().format("YYYYMMDD_HHmmss")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    viewExporting.value = false;
  }
};

const copyPoster = async () => {
  viewCustomTitle.value = viewCustomTitle.value || props.accountName || "";
  viewIsEditing.value = false;
  if (viewCopying.value) return;
  viewCopying.value = true;
  try {
    const canvas = await renderCanvas();
    if (!canvas) return;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1)
    );
    if (!blob) return;

    const ClipboardItemCtor = (window as any).ClipboardItem;
    const canWriteImage =
      window.isSecureContext &&
      !!navigator.clipboard?.write &&
      !!ClipboardItemCtor;

    if (canWriteImage) {
      await navigator.clipboard.write([
        new ClipboardItemCtor({ "image/png": blob }),
      ]);
      toast.add({
        severity: "success",
        summary: "复制成功",
        detail: "图片已复制到剪贴板",
        life: 2200,
      });
      return;
    }

    await downloadPoster();
    toast.add({
      severity: "warn",
      summary: "当前环境不支持图片复制",
      detail: "已自动下载图片",
      life: 2800,
    });
  } catch (error: any) {
    toast.add({
      severity: "warn",
      summary: "复制失败",
      detail: error?.message || "浏览器限制导致复制失败，建议直接下载图片",
      life: 3200,
    });
  } finally {
    viewCopying.value = false;
  }
};
</script>
