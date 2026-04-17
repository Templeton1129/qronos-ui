<template>
  <div
    class="flex sm:gap-8 justify-between sm:justify-start"
    v-if="viewData.length > 0"
  >
    <div class="flex gap-2">
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
    <div class="flex items-center">
      <span class="text-gray-500 text-sm dark:text-gray-300">时间范围：</span>
      <Select
        v-model="viewSelectedTimeRange"
        :options="allTimeRangeOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="时间范围"
        size="small"
        :pt="{
          label: 'text-xs py-1',
          list: 'text-xs',
        }"
        @value-change="loadData"
      />
    </div>
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
                <span class="text-lg font-bold">{{ item.account_name }}</span>
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
            <template #icons>
              <Button
                icon="pi pi-share-alt"
                label="分享海报"
                outlined
                size="small"
                @click="openSharePoster(item)"
                class="hidden sm:inline-flex text-xs mr-2 py-1"
              />
              <Button
                icon="pi pi-share-alt"
                text
                size="small"
                @click="openSharePoster(item)"
                class="inline-flex sm:hidden text-xs"
              />
              <template v-if="expandedPanels.includes(item.id)">
                <Button
                  v-if="viewfullscreenId !== item.id"
                  icon="pi pi-window-maximize"
                  text
                  rounded
                  severity="secondary"
                  size="small"
                  @click="viewfullscreenId = item.id"
                  v-tooltip="'全屏显示'"
                  class="hidden sm:inline-flex"
                />
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
                />
              </template>
            </template>
            <div
              class="flex gap-2 sm:gap-3 px-2 sm:px-4 pb-1"
              :class="[
                viewfullscreenId === item.id
                  ? `grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3`
                  : `overflow-x-auto flex-nowrap scrollbar-thin max-h-120 box-content`,
              ]"
            >
              <!-- 1.账户净值 -->
              <div
                class="px-4 py-3 flex flex-col gap-4 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120'
                    : 'min-w-full sm:min-w-100',
                ]"
              >
                <div class="text-md flex items-center justify-center gap-2">
                  账户净值
                  <i
                    :class="[
                      !viewAccountValueHiddenIdList.includes(item.id)
                        ? `pi pi-eye`
                        : `pi pi-eye-slash`,
                    ]"
                    class="hover:text-gray-500 hover:dark:text-gray-300 cursor-pointer text-[18px]"
                    @click="showOrHiddenAction(item.id)"
                  ></i>
                </div>

                <div class="flex-1 flex justify-center items-center">
                  <div
                    class="flex flex-row flex-wrap justify-center gap-2"
                    :class="[
                      !viewAccountValueHiddenIdList.includes(item.id)
                        ? 'items-end'
                        : 'items-center',
                    ]"
                  >
                    <div
                      class="font-bold text-primary-500 font-mono"
                      :class="[
                        item?.equity?.equity_amount &&
                        item?.equity?.equity_amount?.length > 0 &&
                        item?.equity?.equity_amount[
                          item?.equity?.equity_amount?.length - 1
                        ] < 1000
                          ? 'text-6xl sm:text-7xl'
                          : item?.equity?.equity_amount &&
                              item?.equity?.equity_amount?.length > 0 &&
                              item?.equity?.equity_amount[
                                item?.equity?.equity_amount?.length - 1
                              ] < 100000
                            ? 'text-5xl sm:text-6xl'
                            : 'text-4xl sm:text-5xl',
                      ]"
                      v-if="
                        !viewAccountValueHiddenIdList.includes(item.id) &&
                        item?.equity?.equity_amount &&
                        item?.equity?.equity_amount?.length > 0
                      "
                    >
                      {{
                        Number(
                          item?.equity?.equity_amount[
                            item?.equity?.equity_amount?.length - 1
                          ]
                        )
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }}
                    </div>
                    <div
                      v-else-if="viewAccountValueHiddenIdList.includes(item.id)"
                      class="font-bold text-primary-500 font-mono text-4xl sm:text-5xl"
                    >
                      ****
                    </div>
                    <div
                      v-else
                      class="text-7xl font-bold text-primary-500 font-mono"
                    >
                      --
                    </div>
                    <div class="text-sm text-gray-500">USDT</div>
                  </div>
                </div>
                <div
                  v-if="
                    (!item ||
                      !item?.equity?.equity_amount ||
                      item?.equity?.equity_amount?.length === 0) &&
                    viewSelectedTimeRange !== 0
                  "
                  class="flex justify-center items-center"
                >
                  <span class="text-xs text-gray-400">
                    最近 {{ viewSelectedTimeRange }} 天暂无账户净值数据
                  </span>
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
                      <span>24H盈亏</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        viewAccountValueHiddenIdList.includes(item.id)
                          ? "****"
                          : item?.eq_pnl_24h || "--"
                      }}</Tag>
                    </div>
                    <Divider layout="vertical" />
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H收益率</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm"
                        >{{
                          viewAccountValueHiddenIdList.includes(item.id)
                            ? "****"
                            : item?.eq_pct_24h || "--"
                        }}%</Tag
                      >
                    </div>
                  </div>
                  <div
                    class="flex justify-between w-full bg-gray-100 dark:bg-neutral-800 p-2 rounded-md"
                  >
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H最大净值</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        viewAccountValueHiddenIdList.includes(item.id)
                          ? "****"
                          : item?.eq_max_24h || "--"
                      }}</Tag>
                    </div>
                    <Divider layout="vertical" />
                    <div class="flex flex-1 flex-col items-center gap-2">
                      <span>24H最小净值</span>
                      <Tag class="font-medium w-30 font-mono rounded-sm">{{
                        viewAccountValueHiddenIdList.includes(item.id)
                          ? "****"
                          : item?.eq_min_24h || "--"
                      }}</Tag>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 2.策略净值曲线图 -->
              <div
                class="box-border flex flex-col justify-end gap-4 bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 min-h-100'
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
                    :dateTime="item.equity.time"
                    :equity="item.equity.net"
                    :dd2here="item.equity.dd2here"
                    :sub_stg_eqs="item.sub_stg_eqs"
                    :isShowFullscreen="true"
                  />
                </template>
                <template v-else>
                  <div class="flex-1 flex flex-col items-center px-4 py-3">
                    <div class="text-md text-center">策略净值曲线图</div>
                    <div
                      class="flex-1 flex flex-col gap-2 items-center justify-center"
                    >
                      <img
                        src="@/assets/home-img/no-data.png"
                        class="w-40 h-auto"
                      />
                      <div
                        v-if="viewSelectedTimeRange !== 0"
                        class="flex justify-center items-center"
                      >
                        <span class="text-xs text-gray-400">
                          最近 {{ viewSelectedTimeRange }} 天暂无策略净值数据
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- 3.多空统计(多空比例，仓位敞口，多空数量) -->
              <div
                class="flex bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120 min-h-100'
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
                    :dateTime="item.equity.time"
                    :long="item.equity.long_ratio"
                    :short="item.equity.short_ratio"
                    :empty="item.equity.empty_ratio"
                    :long_coin_num="item.equity.long_coin_num"
                    :short_coin_num="item.equity.short_coin_num"
                    :exposure_short="item.equity.exposure_short || []"
                    :exposure_long="item.equity.exposure_long || []"
                    :isShowFullscreen="true"
                  />
                </template>
                <template v-else>
                  <div class="flex-1 flex flex-col items-center px-4 py-3">
                    <div class="text-md text-center">多空统计</div>
                    <div
                      class="flex-1 flex flex-col gap-2 items-center justify-center"
                    >
                      <img
                        src="@/assets/home-img/no-data.png"
                        class="w-40 h-auto"
                      />
                      <div
                        v-if="viewSelectedTimeRange !== 0"
                        class="flex justify-center items-center"
                      >
                        <span class="text-xs text-gray-400">
                          最近 {{ viewSelectedTimeRange }} 天暂无多空统计数据
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- 4.持仓模块表格 -->
              <div
                class="pt-3 flex flex-col content-between bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120'
                    : item?.pos_swap || item?.pos_spot
                      ? ''
                      : 'min-w-full sm:min-w-100',
                ]"
              >
                <SelectButton
                  v-model="item.selectValue"
                  :options="viewPostSelectOptions"
                  size="small"
                  class="pl-4"
                  :allowEmpty="false"
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
                    v-model:filters="tableFilters"
                    filterDisplay="menu"
                    :globalFilterFields="['side']"
                  >
                    <Column field="symbol" header="币种" class="min-w-20">
                      <template #body="{ data }">
                        <div class="w-20">
                          {{ data.symbol || "--" }}
                        </div>
                      </template>
                    </Column>
                    <Column
                      field="change"
                      header="涨幅"
                      sortable
                      class="min-w-20"
                    >
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
                    <Column
                      field="side"
                      header="方向"
                      class="min-w-22"
                      :showFilterMatchModes="false"
                      :showApplyButton="false"
                      :filterMenuClass="'w-10'"
                      :pt="{
                        filter: {
                          class: 'w-6 h-6  justify-center items-center ml-0',
                        },
                      }"
                    >
                      <template #body="{ data }">
                        <Tag
                          :severity="data.side === 1 ? `success` : `danger`"
                          class="text-xs w-6 h-6 font-medium"
                          size="small"
                          variant="simple"
                          rounded
                        >
                          {{ data.side === 1 ? "多" : "空" }}
                        </Tag>
                      </template>
                      <template #filter="{ filterModel, filterCallback }">
                        <Select
                          v-model="filterModel.value"
                          :options="sideFilterOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="选择方向"
                          showClear
                          @change="filterCallback()"
                        >
                          <template #option="slotProps">
                            <Tag
                              :value="slotProps.option.label"
                              :severity="
                                slotProps.option.value === 1
                                  ? `success`
                                  : `danger`
                              "
                              rounded
                            />
                          </template>
                        </Select>
                      </template>
                    </Column>
                    <Column
                      field="pos_u"
                      header="仓位价值"
                      sortable
                      class="min-w-28"
                    ></Column>
                    <Column
                      field="pnl_u"
                      header="未实现盈亏"
                      sortable
                      class="min-w-30"
                    ></Column>
                    <Column
                      field="avg_price"
                      header="均价"
                      class="min-w-15"
                    ></Column>
                    <Column
                      field="cur_price"
                      header="当前价格"
                      class="min-w-20"
                    ></Column>
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
                  <div
                    class="flex-1 flex flex-col gap-2 items-center justify-center"
                  >
                    <img
                      src="@/assets/home-img/no-data.png"
                      class="w-40 h-auto"
                    />
                    <div
                      v-if="viewSelectedTimeRange !== 0"
                      class="flex justify-center items-center"
                    >
                      <span class="text-xs text-gray-400">
                        最近 {{ viewSelectedTimeRange }} 天暂无持仓数据
                      </span>
                    </div>
                  </div>
                </template>
              </div>
              <!-- 5.盈利/亏损币排名 -->
              <div
                class="px-4 py-3 flex flex-col gap-3 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[
                  viewfullscreenId === item.id
                    ? 'max-h-120'
                    : 'min-w-full sm:min-w-100',
                ]"
              >
                <div class="flex justify-center text-md">盈利/亏损币前五名</div>

                <div class="flex justify-between items-center gap-2">
                  <SelectButton
                    v-model="item.coinSortType"
                    :options="coinSortTypeOptions"
                    size="small"
                    :allowEmpty="false"
                  />
                  <Select
                    v-model="pnlSelectedTimeRange"
                    :options="pnlTimeRangeOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="时间范围"
                    size="small"
                  />
                </div>

                <template v-if="getTop5Coins(item).length > 0">
                  <div class="flex-1 flex flex-col px-2 w-full">
                    <div
                      class="divide-y divide-gray-100 dark:divide-neutral-700"
                    >
                      <div
                        v-for="(coin, index) in getTop5Coins(item)"
                        :key="coin.symbol"
                        class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div
                          :class="[
                            'w-2 h-2 rounded-full',
                            colorList[Number(index)] || 'bg-gray-500',
                          ]"
                        ></div>
                        <div class="flex-1 flex flex-col justify-center gap-1">
                          <span
                            class="font-semibold text-gray-800 dark:text-gray-200"
                            >{{ coin.symbol }}</span
                          >
                          <div
                            class="text-xs text-gray-500 dark:text-gray-300 text-left"
                          >
                            {{ coin.type === "swap" ? "合约持仓" : "现货持仓" }}
                          </div>
                        </div>
                        <div class="font-mono text-xl text-right">
                          <span
                            :class="
                              coin.total_pnl > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            "
                            >{{
                              Number(coin.total_pnl).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            }}</span
                          >
                          <span
                            class="text-xs text-gray-500 dark:text-gray-300"
                          >
                            USDT
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="flex-1 flex flex-col gap-2 items-center justify-center"
                  >
                    <img
                      src="@/assets/home-img/no-data.png"
                      class="w-40 h-auto"
                    />
                    <div
                      v-if="viewSelectedTimeRange !== 0"
                      class="flex justify-center items-center"
                    >
                      <span class="text-xs text-gray-400">
                        暂无盈利/亏损币数据
                      </span>
                    </div>
                  </div>
                </template>
                <div
                  class="text-xs text-gray-500 dark:text-gray-300 text-center"
                >
                  开平仓币种数据可能还不准确，后续会优化
                </div>
              </div>
              <!-- 6.策略配置信息表格-->
              <div
                class="pt-3 flex flex-col gap-2 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                :class="[viewfullscreenId === item.id ? 'max-h-120' : '']"
              >
                <StrategyConfigInfo :item="item" />
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
  <SharePosterDialog
    v-model="sharePosterVisible"
    :frameworkId="sharePosterAccount?.framework_id || ''"
    :accountName="sharePosterAccount?.account_name || ''"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { FilterMatchMode } from "@primevue/core/api";
import StrategicNetValueChart from "@/home-module/components/strategicNetValueChart.template.vue";
import LongChart from "@/home-module/components/longChart.template.vue";
import SharePosterDialog from "@/home-module/components/sharePosterDialog.template.vue";
import StrategyConfigInfo from "@/home-module/components/strategyConfigInfo.template.vue";
import { getHomeAccountInfo } from "@/common-module/services/service.provider";

const viewfullscreenId = ref<number | null>(null);
const viewIsLoading = ref<boolean>(false);
const viewData = ref<tDbHomeAccountInfoRes[]>([]);

const viewPostSelectOptions = ref<string[]>(["持仓合约", "持仓现货"]);

// 定义方向筛选器
const sideFilterOptions = ref([
  { label: "多", value: 1 },
  { label: "空", value: -1 },
]);
const tableFilters = ref({
  side: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const pnlSelectedTimeRange = ref<string>("1h");
const pnlTimeRangeOptions = [
  { label: "最近1小时", value: "1h" },
  { label: "最近24小时", value: "24h" },
];

const viewSelectedTimeRange = ref<number>(7);
const allTimeRangeOptions = [
  { label: "最近7天", value: 7 },
  { label: "最近30天", value: 30 },
  { label: "全部时间", value: 0 },
];

const coinSortTypeOptions = ref<string[]>(["盈利", "亏损"]);
const colorList = ref<string[]>([
  "bg-green-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-teal-500",
]);

const viewAccountValueHiddenIdList = ref<number[]>([]);
const sharePosterVisible = ref(false);
const sharePosterAccount = ref<any>(null);

onMounted(() => {
  loadData();
});

// 获取图表数据
const loadData = async () => {
  viewIsLoading.value = true;
  const res = await getHomeAccountInfo(viewSelectedTimeRange.value);
  viewData.value = res.data;
  viewData.value.forEach((item) => {
    item.selectValue = "持仓合约";
    item.coinSortType = "盈利";
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

const getTop5Coins = (item: any) => {
  if (
    item?.pnl_history &&
    pnlSelectedTimeRange.value &&
    item.pnl_history[pnlSelectedTimeRange.value] &&
    item.pnl_history[pnlSelectedTimeRange.value].length > 0
  ) {
    // 根据coinSortType取total_pnl>0/<0的币排序,截取前五名展示
    if (item.coinSortType === "盈利") {
      return item.pnl_history[pnlSelectedTimeRange.value]
        .filter((coin: any) => coin.total_pnl > 0)
        .sort((a: any, b: any) => b.total_pnl - a.total_pnl)
        .slice(0, 5);
    } else {
      return item.pnl_history[pnlSelectedTimeRange.value]
        .filter((coin: any) => coin.total_pnl < 0)
        .sort((a: any, b: any) => a.total_pnl - b.total_pnl)
        .slice(0, 5);
    }
  }
  return [];
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

const openSharePoster = (item: any) => {
  sharePosterAccount.value = item;
  sharePosterVisible.value = true;
};

const showOrHiddenAction = (itemId: number) => {
  if (viewAccountValueHiddenIdList.value.includes(itemId)) {
    viewAccountValueHiddenIdList.value =
      viewAccountValueHiddenIdList.value.filter((id: number) => id !== itemId);
  } else {
    viewAccountValueHiddenIdList.value.push(itemId);
  }
};
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
