<template>
  <div class="flex gap-2" v-if="viewData.length > 0">
    <Button
      type="button"
      icon="pi pi-plus"
      icon-class="text-xs"
      class="text-xs shadow-sm bg-white dark:bg-neutral-800 border-0 text-gray-500 dark:text-gray-200"
      label="展开"
      size="small"
      @click="expandAll"
      :disabled="expandedPanels.length === viewData.length"
    />
    <Button
      type="button"
      variant="outlined"
      icon-class="text-xs"
      icon="pi pi-minus"
      label="折叠"
      class="text-xs shadow-sm bg-white dark:bg-neutral-800 border-0 text-gray-500 dark:text-gray-200"
      size="small"
      @click="collapseAll"
      :disabled="expandedPanels.length === 0"
    />
  </div>
  <!-- 操作器 -->
  <div class="space-y-3 flex-1">
    <template v-if="viewIsLoading">
      <div v-for="i in 2" :key="i" class="flex flex-col">
        <Skeleton width="100%" height="40px" class="mb-2" />
        <div class="gap-3 pb-2 hidden sm:flex">
          <Skeleton class="flex-2" height="250px" />
          <Skeleton class="flex-1" height="250px" />
          <Skeleton class="flex-1" height="250px" />
        </div>
        <div class="gap-3 pb-2 flex sm:hidden">
          <Skeleton class="flex-2" height="250px" />
          <Skeleton class="flex-1" height="250px" />
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="viewData.length > 0">
        <template v-for="item of viewData" :key="item.id">
          <Panel
            class="flex flex-col rounded-xl overflow-hidden border-none shadow-sm"
            :class="[
              viewfullscreenId === item.id
                ? 'w-screen h-screen fixed inset-0 z-50 p-4 flex flex-col overflow-y-auto rounded-none'
                : 'h-auto',
            ]"
            :pt="{
              contentContainer: {
                class: 'p-0 flex-1 flex flex-col',
              },
              content: {
                class: 'p-0 flex-1',
              },
            }"
            :collapsed="!expandedPanels.includes(item.id)"
            @update:collapsed="() => togglePanel(item.id)"
            :toggleable="viewfullscreenId !== item.id"
          >
            <template #header>
              <div class="flex items-center gap-1 sm:gap-2">
                <span class="text-lg font-bold">账户1</span>
                <span class="text-xs text-gray-500 dark:text-gray-200">{{
                  item.framework_name
                }}</span>
                <Tag v-tooltip="'分钟偏移'" class="text-xs font-medium">{{
                  item.hour_offset
                }}</Tag>
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  size="small"
                  @click="goToFrameWorkPage(item.edit_id)"
                />
                <div class="text-xs text-center hidden sm:block">
                  更新时间：<span
                    class="text-gray-500 dark:text-gray-300 font-medium"
                    >{{
                      item?.equity?.time[item?.equity?.time?.length - 1] || "--"
                    }}</span
                  >
                </div>
              </div>
            </template>
            <template #icons
              ><Button
                v-if="viewfullscreenId !== item.id"
                icon="pi pi-window-maximize"
                text
                rounded
                severity="secondary"
                size="small"
                @click="viewfullscreenId = item.id"
                v-tooltip="'全屏显示'"
                class="hidden sm:inline-flex" />
              <Button
                v-else
                icon="pi pi-window-minimize"
                text
                rounded
                severity="secondary"
                size="small"
                @click="viewfullscreenId = null"
                v-tooltip="'退出全屏'"
                class="hidden sm:inline-flex"
            /></template>
            <div
              class="flex gap-3 px-4 pb-1"
              :class="[
                viewfullscreenId === item.id
                  ? `flex-wrap justify-center min-h-full`
                  : `overflow-x-auto flex-nowrap scrollbar-thin max-h-120`,
              ]"
            >
              <!-- 账户净值 -->
              <div
                class="px-4 py-3 flex flex-col gap-4 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'min-w-full sm:min-w-100',
                ]"
              >
                <div class="text-md text-center">账户净值</div>
                <div class="flex-1 flex justify-center items-center">
                  <div class="flex flex-row items-end justify-center gap-2">
                    <div class="text-7xl font-bold text-primary-500 font-mono">
                      {{
                        item?.equity?.equity_amount[
                          item?.equity?.equity_amount?.length - 1
                        ] || "--"
                      }}
                    </div>
                    <div class="text-sm text-gray-500">USDT</div>
                  </div>
                </div>
                <Divider class="m-0" />
                <div class="text-xs text-center sm:hidden">
                  更新时间：<span
                    class="text-gray-500 dark:text-gray-300 font-medium"
                    >{{
                      item?.equity?.time[item?.equity?.time?.length - 1] || "--"
                    }}</span
                  >
                </div>
                <div class="text-sm space-y-4 flex-row justify-around">
                  <div
                    class="flex justify-between w-full bg-gray-100 dark:bg-neutral-800 p-2 rounded-md"
                  >
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H盈亏:</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        item?.eq_pnl_24h || "--"
                      }}</Tag>
                    </div>
                    <Divider layout="vertical" />
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H收益率:</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm"
                        >{{ item?.eq_pct_24h || "--" }}%</Tag
                      >
                    </div>
                  </div>
                  <div
                    class="flex justify-between w-full bg-gray-100 dark:bg-neutral-800 p-2 rounded-md"
                  >
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H最大净值:</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        item?.eq_max_24h || "--"
                      }}</Tag>
                    </div>
                    <Divider layout="vertical" />
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H最小净值:</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        item?.eq_min_24h || "--"
                      }}</Tag>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 策略净值曲线图 -->
              <div
                class="box-border flex flex-col justify-end gap-4 bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'min-w-full sm:min-w-110',
                ]"
              >
                <template
                  v-if="
                    item?.equity &&
                    item?.equity?.time &&
                    item?.equity?.net &&
                    item?.equity?.dd2here &&
                    item?.sub_stg_eqs
                  "
                >
                  <StrategicNetValueChart
                    ref="strategicNetValueChartRefs"
                    :dateTime="item.equity.time"
                    :equity="item.equity.net"
                    :dd2here="item.equity.dd2here"
                    :sub_stg_eqs="item.sub_stg_eqs"
                  />
                </template>
                <template v-else>
                  <div class="flex-1 flex flex-col items-center justify-center">
                    <div class="text-md text-center">策略净值曲线图</div>
                    <img
                      src="@/assets/home-img/no-data.png"
                      class="w-40 h-auto"
                    />
                  </div>
                </template>
              </div>
              <!-- 多空统计 -->
              <div
                class="flex bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'min-w-full sm:min-w-110',
                ]"
              >
                <template
                  v-if="
                    item?.equity &&
                    item?.equity?.time &&
                    item?.equity?.long_ratio &&
                    item?.equity?.short_ratio &&
                    item?.equity?.empty_ratio &&
                    item?.equity?.long_coin_num &&
                    item?.equity?.short_coin_num
                  "
                >
                  <LongChart
                    ref="longChartRefs"
                    :dateTime="item.equity.time"
                    :long="item.equity.long_ratio"
                    :short="item.equity.short_ratio"
                    :empty="item.equity.empty_ratio"
                    :long_coin_num="item.equity.long_coin_num"
                    :short_coin_num="item.equity.short_coin_num"
                  />
                </template>
                <template v-else>
                  <div class="flex-1 flex flex-col items-center justify-center">
                    <div class="text-md text-center">多空统计</div>
                    <img
                      src="@/assets/home-img/no-data.png"
                      class="w-40 h-auto"
                    />
                  </div>
                </template>
              </div>
              <!-- 持仓模块 表格 -->
              <div
                class="pt-4 flex flex-col content-between bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'min-w-130',
                ]"
              >
                <SelectButton
                  v-model="item.selectValue"
                  :options="viewPostSelectOptions"
                  size="small"
                  class="pl-4"
                />
                <template v-if="item?.pos_swap || item?.pos_spot">
                  <DataTable
                    :value="
                      item.selectValue === '持仓合约'
                        ? item.pos_swap || []
                        : item.pos_spot || []
                    "
                    paginator
                    :rows="6"
                    class="!bg-transparent flex-1 flex flex-col"
                    :pt="{
                      tableContainer: {
                        class: 'flex-1',
                      },
                      table: {
                        class: 'text-xs !bg-transparent h-full',
                      },
                    }"
                  >
                    <Column field="symbol" header="币种">
                      <template #body="{ data }">
                        <div class="w-20">
                          {{ data.symbol || "--" }}
                        </div>
                      </template>
                    </Column>
                    <Column field="change" header="涨幅">
                      <template #body="{ data }">
                        <Tag
                          :severity="
                            Number(data.change.split(`%`)[0]) > 0
                              ? 'success'
                              : 'danger'
                          "
                          class="text-xs"
                          >{{ data.change }}</Tag
                        >
                      </template>
                    </Column>
                    <Column field="side" header="方向">
                      <template #body="{ data }">
                        <Tag
                          :severity="data.side > 0 ? `success` : `danger`"
                          class="text-xs w-6 h-6 font-medium"
                          size="small"
                          variant="simple"
                          rounded
                        >
                          {{ data.side > 0 ? "多" : "空" }}
                        </Tag>
                      </template>
                    </Column>
                    <Column field="pos_u" header="仓位价值"></Column>
                    <Column field="pnl_u" header="未实现盈亏"></Column>
                    <Column field="avg_price" header="均价"></Column>
                    <Column field="cur_price" header="当前价格"></Column>
                    <template #empty>
                      <div class="flex items-center justify-center h-full">
                        <img
                          src="@/assets/home-img/no-data.png"
                          class="w-40 h-auto"
                        />
                      </div>
                    </template>
                  </DataTable>
                </template>
                <template v-else>
                  <div class="flex-1 flex items-center justify-center">
                    <img
                      src="@/assets/home-img/no-data.png"
                      class="w-40 h-auto"
                    />
                  </div>
                </template>
              </div>
              <!-- 盈利亏损币排名 -->
              <div
                class="px-4 py-3 flex flex-col items-center bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'min-w-full sm:min-w-100',
                ]"
              >
                <span class="text-md">盈利/亏损币排名即将上线</span>
                <div class="flex-1 flex items-center justify-center">
                  <img
                    src="@/assets/home-img/no-data.png"
                    class="w-40 h-auto"
                  />
                </div>
              </div>
              <!-- 策略配置信息 -->
              <div
                class="pt-4 flex flex-col gap-2 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 w-110'
                    : 'sm:min-w-140',
                ]"
              >
                <div class="flex px-4 justify-between">
                  <span class="text-md hidden sm:block"> 策略配置信息 </span>
                  <div
                    v-if="item?.strategy_name"
                    class="flex items-center justify-center gap-2 text-xs text-gray-500"
                  >
                    当前使用的策略是
                    <Tag class="text-xs" severity="secondary">{{
                      item.strategy_name || "--"
                    }}</Tag>
                  </div>
                </div>
                <div v-if="item?.strategy_name" class="flex flex-col">
                  <DataTable
                    :value="item?.strategy_pool || []"
                    paginator
                    :rows="5"
                    class="!bg-transparent flex-1 flex flex-col"
                    :pt="{
                      tableContainer: {
                        class: 'flex-1',
                      },
                      table: {
                        class: 'text-xs !bg-transparent h-full',
                      },
                    }"
                    rowGroupMode="rowspan"
                    groupRowsBy="name"
                    :center="true"
                  >
                    <Column field="name" header="策略">
                      <template #body="{ data }">
                        <div class="w-20 flex">
                          <Tag class="font-medium text-xs">{{ data.name }}</Tag>
                        </div>
                      </template>
                    </Column>
                    <Column field="strategy" header="子策略权重">
                      <template #body="{ data }">
                        <div class="w-20 text-center">
                          {{ data.cap_weight.toFixed(2) * 100 }}%{{
                            data.strategy
                          }}
                        </div>
                      </template>
                    </Column>
                    <Column field="hold_period" header="持仓周期">
                      <template #body="{ data }">
                        <div class="w-12 text-center">
                          {{ data.hold_period }}
                        </div>
                      </template>
                    </Column>
                    <Column field="offset_list" header="offset_list">
                      <template #body="{ data }">
                        <div class="flex justify-center gap-1">
                          <Tag
                            class="font-medium text-xs"
                            severity="secondary"
                            v-for="item of data.offset_list"
                            :key="item"
                            >{{ item }}</Tag
                          >
                        </div>
                      </template>
                    </Column>
                    <!-- true 现货 -->
                    <Column field="is_use_spot" header="现货/合约模式">
                      <template #body="{ data }">
                        <Tag
                          class="font-medium text-xs w-11"
                          :severity="data.is_use_spot ? 'success' : 'info'"
                          >{{ data.is_use_spot ? "现货" : "合约" }}</Tag
                        >
                      </template>
                    </Column>
                    <Column field="long_cap_weight" header="多头权重">
                      <template #body="{ data }">
                        <div class="w-12 text-center">
                          {{ data.long_cap_weight.toFixed(2) * 100 }}%
                        </div>
                      </template></Column
                    >
                    <Column field="short_cap_weight" header="空头权重">
                      <template #body="{ data }">
                        <div class="w-12 text-center">
                          {{ data.short_cap_weight.toFixed(2) * 100 }}%
                        </div>
                      </template>
                    </Column>
                    <Column field="long_select_coin_num" header="多头选币数量">
                      <template #body="{ data }">
                        <div class="w-12 text-center">
                          {{ data.long_select_coin_num }}
                        </div>
                      </template>
                    </Column>
                    <Column field="short_select_coin_num" header="空头选币数量">
                      <template #body="{ data }">
                        <div class="w-12 text-center">
                          {{ data.short_select_coin_num }}
                        </div>
                      </template>
                    </Column>
                    <Column field="factor_list" header="因子/过滤因子/后置因子">
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                          <Button
                            class="text-xs w-34"
                            size="small"
                            variant="text"
                            severity="secondary"
                            @click="
                              showFactorDialog(
                                data.factor_list,
                                data.filter_list,
                                data.filter_list_post
                              )
                            "
                          >
                            查看因子信息
                          </Button>
                        </div>
                      </template></Column
                    >
                    <template #empty>
                      <div class="flex items-center justify-center h-full">
                        <img
                          src="@/assets/home-img/no-data.png"
                          class="w-40 h-full"
                        />
                      </div>
                    </template>
                  </DataTable>
                </div>
                <div v-else class="flex-1 flex items-center justify-center">
                  <img
                    src="@/assets/home-img/no-data.png"
                    class="w-40 h-auto"
                  />
                </div>
              </div>
            </div>
          </Panel>
        </template>
      </template>
      <!--最先进来无数据的情况 -->
      <template v-else>
        <div
          class="h-full flex-1 flex flex-col items-center justify-center gap-4"
        >
          <div class="text-center text-sm">
            实盘交易暂时未启动，请去
            <Button
              label="策略中心"
              variant="text"
              class="py-1 px-0"
              @click="goToFrameWorkPage(0)"
            />启动实盘
          </div>
          <img src="@/assets/home-img/no-data.png" class="w-60 h-auto" />
        </div>
      </template>
    </template>
  </div>
  <Dialog
    v-model:visible="viewFactorDialogVisible"
    :closable="false"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
  >
    <div class="flex flex-col gap-4">
      <SelectButton
        v-model="viewFactorSelect"
        :options="viewFactorOptions"
        size="small"
        @value-change="viewFactorSelectChange"
      />
      <DataTable :value="viewFactorList" paginator :rows="5" class="text-sm">
        <Column
          :header="
            viewFactorSelect === '因子'
              ? '因子'
              : viewFactorSelect === '过滤因子'
              ? '过滤因子'
              : '后置因子'
          "
          :style="{ width: '100px' }"
        >
          <template #body="{ data }">
            <Tag class="font-medium text-xs">{{ data[0] }}</Tag>
          </template>
        </Column>
        <Column
          :header="viewFactorSelect === '因子' ? '排序方式' : '因子参数'"
          :style="{ width: '100px' }"
        >
          <template #body="{ data }">
            <div class="font-medium text-xs" v-if="viewFactorSelect === '因子'">
              <div v-if="data[1]" class="space-x-2">
                <span>升序</span><i class="pi pi-arrow-up text-xs"></i>
              </div>
              <div v-else class="space-x-2">
                <span>降序</span><i class="pi pi-arrow-down text-xs"></i>
              </div>
            </div>
            <div v-else class="font-medium text-xs">
              {{ data[1] }}
            </div>
          </template>
        </Column>
        <Column
          :header="viewFactorSelect === '因子' ? '因子参数' : '因子使用条件'"
          :style="{ width: '140px' }"
        >
          <template #body="{ data }">
            <div class="font-medium text-xs">{{ data[2] }}</div>
          </template></Column
        >
        <Column
          :header="viewFactorSelect === '因子' ? '因子权重' : '排序方式'"
          :style="{ width: '100px' }"
        >
          <template #body="{ data }">
            <div v-if="viewFactorSelect === '因子'">
              <div class="font-medium text-xs">{{ data[3] }}</div>
            </div>
            <div v-else class="font-medium text-xs">
              <div v-if="data.length === 4">
                <div v-if="data[1]" class="space-x-2">
                  <span>升序</span><i class="pi pi-arrow-up text-xs"></i>
                </div>
                <div v-else class="space-x-2">
                  <span>降序</span><i class="pi pi-arrow-down text-xs"></i>
                </div>
              </div>
            </div>
            <div v-else class="font-medium text-xss">
              <div class="space-x-2">
                <span>升序</span><i class="pi pi-arrow-up text-xs"></i>
              </div>
            </div> </template
        ></Column>
        <template #empty>
          <div class="flex items-center justify-center h-full">
            <img src="@/assets/home-img/no-data.png" class="w-40 h-auto" />
          </div>
        </template>
      </DataTable>
    </div>
    <template #footer>
      <Button
        label="关闭"
        size="small"
        severity="secondary"
        variant="outlined"
        @click="viewFactorDialogVisible = false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const viewfullscreenId = ref<number | null>(null);

import StrategicNetValueChart from "@/home-module/components/strategicNetValueChart.template.vue";
const strategicNetValueChartRefs = ref<
  InstanceType<typeof StrategicNetValueChart>[]
>([]);
import LongChart from "@/home-module/components/longChart.template.vue";
const longChartRefs = ref<InstanceType<typeof LongChart>[]>([]);
import { getHomeAccountInfo } from "@/common-module/services/service.provider";
const viewIsLoading = ref<boolean>(false);
const viewData = ref<tDbHomeAccountInfoRes[]>([]);

const viewPostSelectOptions = ref(["持仓合约", "持仓现货"]);
const viewFactorDialogVisible = ref(false);

const viewFactorSelect = ref<string>("因子");
const viewFactorOptions = ref<string[]>(["因子", "过滤因子", "后置因子"]);
const viewFactorList = ref<string[]>([]);
const viewCurrentFactorList = ref<{
  factorList: string[];
  filterList: string[];
  filterListPost: string[];
}>({
  factorList: [],
  filterList: [],
  filterListPost: [],
});

onMounted(() => {
  loadData();
});

// 获取图表数据
const loadData = async () => {
  viewIsLoading.value = true;
  const res = await getHomeAccountInfo();
  viewData.value = res.data;
  viewData.value.forEach((item) => {
    item.selectValue = "持仓合约";
  });
  formatStrategyPool();
  viewIsLoading.value = false;
  expandAll();
};
const expandedPanels = ref<number[]>([]);

const formatStrategyPool = () => {
  viewData.value.forEach((item, index) => {
    if (item.strategy_pool && Array.isArray(item.strategy_pool)) {
      // 扁平化处理
      item.strategy_pool = item.strategy_pool.flatMap((pool: any) => {
        return pool.strategy_list.map((strategy: any) => ({
          ...strategy,
          name: pool.name,
        }));
      });
    }
  });
};

const expandAll = () => {
  expandedPanels.value = viewData.value.map((acc) => acc.id);
};

const collapseAll = () => {
  expandedPanels.value = [];
};

// 单个Panel切换
const togglePanel = (id: number) => {
  if (expandedPanels.value.includes(id)) {
    expandedPanels.value = expandedPanels.value.filter((acc) => acc !== id);
  } else {
    expandedPanels.value.push(id);
  }
};

const goToFrameWorkPage = (id: number = 0) => {
  router.push({
    path: `/strategyCenter/${id}`,
  });
};

const showFactorDialog = (
  factorList: string[],
  filterList: string[],
  filterListPost: string[]
) => {
  viewFactorDialogVisible.value = true;
  viewCurrentFactorList.value = {
    factorList: factorList || [],
    filterList: filterList || [],
    filterListPost: filterListPost || [],
  };
  viewFactorSelect.value = "因子";
  viewFactorList.value = [...viewCurrentFactorList.value.factorList];
};

const viewFactorSelectChange = () => {
  if (viewFactorSelect.value === "因子") {
    viewFactorList.value = [...viewCurrentFactorList.value.factorList];
  } else if (viewFactorSelect.value === "过滤因子") {
    viewFactorList.value = [...viewCurrentFactorList.value.filterList];
  } else if (viewFactorSelect.value === "后置因子") {
    viewFactorList.value = [...viewCurrentFactorList.value.filterListPost];
  }
};

const handleResizeFn = () => {
  if (strategicNetValueChartRefs.value) {
    strategicNetValueChartRefs.value.forEach((item) => {
      item?.handleResize();
    });
  }

  if (longChartRefs.value) {
    longChartRefs.value.forEach((item) => {
      item?.handleResize();
    });
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResizeFn);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResizeFn);
});
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
  background: #fdfdff;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #a3a3a3;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* 确保表格完全透明 */

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: transparent !important;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent !important;
}

:deep(.p-paginator) {
  background: transparent !important;
}

:deep(.p-datatable-paginator-bottom) {
  border: none !important;
}
</style>
