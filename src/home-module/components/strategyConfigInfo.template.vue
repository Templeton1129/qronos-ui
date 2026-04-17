<template>
  <div class="flex px-4 justify-between">
    <span class="text-md hidden sm:block">策略配置信息</span>
    <div
      v-if="item?.strategy_name"
      class="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-300"
    >
      当前使用的策略是
      <Tag class="text-xs" severity="secondary">
        {{ item.strategy_name || "--" }}
      </Tag>
    </div>
  </div>

  <div v-if="item?.strategy_name" class="flex flex-col">
    <DataTable
      :value="item?.strategy_pool || []"
      paginator
      :rows="5"
      class="!bg-transparent flex-1 flex flex-col"
      :pt="{
        tableContainer: { class: 'flex-1' },
        table: { class: 'text-xs !bg-transparent h-full' },
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
            {{ data.cap_weight.toFixed(2) * 100 }}%{{ data.strategy }}
          </div>
        </template>
      </Column>
      <Column field="hold_period" header="持仓周期">
        <template #body="{ data }">
          <div class="w-12 text-center">{{ data.hold_period }}</div>
        </template>
      </Column>
      <Column field="offset_list" header="offset_list" class="min-w-25">
        <template #body="{ data }">
          <div
            v-if="data.offset_list && data.offset_list.length"
            class="flex items-center gap-1 flex-wrap"
          >
            <template
              v-for="offset in data.offset_list.slice(0, 3)"
              :key="offset"
            >
              <Tag class="font-medium text-xs" severity="secondary">
                {{ offset }}
              </Tag>
            </template>
            <template v-if="data.offset_list.length > 3">
              <span
                class="cursor-pointer text-xs text-primary-500 dark:text-primary-300"
                v-tooltip.bottom="{
                  value: `所有的offset：${data.offset_list.join(', ')}`,
                  autoHide: false,
                }"
              >
                +{{ data.offset_list.length - 3 }}
              </span>
            </template>
          </div>
        </template>
      </Column>
      <Column field="is_use_spot" header="现货/合约模式" class="min-w-20">
        <template #body="{ data }">
          <template v-if="data?.market">
            <Tag
              class="font-medium text-[10px] px-1.5"
              severity="info"
              v-tooltip="{
                value:
                  marketOptionMapDesc[
                    data.market as keyof typeof marketOptionMapDesc
                  ] ?? '-',
                class: 'min-w-55',
              }"
            >
              {{
                marketOptionMap[data.market as keyof typeof marketOptionMap] ??
                "-"
              }}
            </Tag>
          </template>
          <template
            v-else-if="
              data.is_use_spot !== undefined || data.is_use_spot !== null
            "
          >
            <Tag
              class="font-medium text-xs w-11"
              :severity="data.is_use_spot ? 'success' : 'info'"
            >
              {{ data.is_use_spot ? "现货" : "合约" }}
            </Tag>
          </template>
          <template v-else>--</template>
        </template>
      </Column>
      <Column field="long_cap_weight" header="多头权重">
        <template #body="{ data }">
          <div class="w-12 text-center">
            {{ data.long_cap_weight.toFixed(2) * 100 }}%
          </div>
        </template>
      </Column>
      <Column field="short_cap_weight" header="空头权重">
        <template #body="{ data }">
          <div class="w-12 text-center">
            {{ data.short_cap_weight.toFixed(2) * 100 }}%
          </div>
        </template>
      </Column>
      <Column field="long_select_coin_num" header="多头选币数量">
        <template #body="{ data }">
          <div class="w-12 text-center">{{ data.long_select_coin_num }}</div>
        </template>
      </Column>
      <Column field="short_select_coin_num" header="空头选币数量">
        <template #body="{ data }">
          <div class="w-12 text-center">{{ data.short_select_coin_num }}</div>
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
                openFactorDialog(
                  data.factor_list,
                  data.filter_list,
                  data.filter_list_post
                )
              "
            >
              查看因子信息
            </Button>
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="flex items-center justify-center h-full">
          <img src="@/assets/home-img/no-data.png" class="w-40 h-full" />
        </div>
      </template>
    </DataTable>
  </div>

  <div v-else class="flex-1 flex items-center justify-center">
    <img src="@/assets/home-img/no-data.png" class="w-40 h-auto" />
    <div class="flex justify-center items-center">
      <span class="text-xs text-gray-400">暂无策略配置数据</span>
    </div>
  </div>

  <Dialog
    v-model:visible="viewFactorDialogVisible"
    :closable="false"
    :draggable="false"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
  >
    <div class="flex flex-col gap-4">
      <SelectButton
        v-model="viewFactorSelect"
        :options="viewFactorOptions"
        size="small"
        @value-change="viewFactorSelectChange"
        :allowEmpty="false"
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
            <div v-else class="font-medium text-xs">{{ data[1] }}</div>
          </template>
        </Column>
        <Column
          :header="viewFactorSelect === '因子' ? '因子参数' : '因子使用条件'"
          :style="{ width: '140px' }"
        >
          <template #body="{ data }">
            <div class="font-medium text-xs">{{ data[2] }}</div>
          </template>
        </Column>
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
              <div v-else class="font-medium text-xss">
                <div class="space-x-2">
                  <span>升序</span><i class="pi pi-arrow-up text-xs"></i>
                </div>
              </div>
            </div>
          </template>
        </Column>
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
import { ref } from "vue";

const props = defineProps<{
  item: any;
}>();

const marketOptionMap = {
  spot_spot: "纯现货",
  swap_swap: "纯合约",
  mix_spot: "现货与合约-现货优先",
  mix_swap: "现货与合约-合约优先",
  spot_swap: "现货选币合约优先",
};

const marketOptionMapDesc = {
  spot_spot: "纯现货(spot_spot)",
  swap_swap: "纯合约(swap_swap)",
  mix_spot: "现货与合约-现货优先(mix_spot)",
  mix_swap: "现货与合约-合约优先(mix_swap)",
  spot_swap: "现货选币合约优先(spot_swap)",
};

const viewFactorDialogVisible = ref(false);
const viewFactorSelect = ref<string>("因子");
const viewFactorOptions = ref<string[]>(["因子", "过滤因子", "后置因子"]);
const viewFactorList = ref<any[]>([]);
const viewCurrentFactorList = ref<{
  factorList: any[];
  filterList: any[];
  filterListPost: any[];
}>({
  factorList: [],
  filterList: [],
  filterListPost: [],
});

const openFactorDialog = (
  factorList: any[],
  filterList: any[],
  filterListPost: any[]
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
  } else {
    viewFactorList.value = [...viewCurrentFactorList.value.filterListPost];
  }
};
</script>
