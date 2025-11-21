<template>
  <Dialog
    v-model:visible="viewIsOpenEditDataDialog"
    header="数据配置"
    :closable="!isForceEdit"
    modal
    class="w-[90vw] sm:w-[600px] max-w-full"
  >
    <Form v-slot="$form" :resolver @submit="formSubmitAction">
      <!-- 分隔线 -->
      <div class="space-y-2 sm:space-y-4">
        <!-- 基础配置 -->
        <div class="text-sm text-gray-400">基础配置</div>
        <label for="klineCount" class="block text-sm font-medium"
          ><span class="text-red-500 mr-1">*</span>1h周期k线数量</label
        >
        <div>
          <InputNumber
            name="kline_count_1h"
            v-model="initialValues.kline_count_1h"
            showButtons
            buttonLayout="horizontal"
            placeholder="请填写k线数"
            :min="1"
            class="w-full"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
          <Inplace
            :closable="true"
            :pt="{
              display: {
                class: 'w-full flex justify-end hover:bg-transparent p-1',
              },
              content: {
                class: 'p-1',
              },
            }"
          >
            <template #display>
              <span
                class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
              >
                什么是1h周期k线数量？
              </span>
            </template>
            <template #content>
              <div
                class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
              >
                为了执行实盘选币策略，至少需要多少根K线的行情数据。这个参数来自浪淘沙轮动精心随机案例包中，config文件里的get_kline_num参数。如果有多个子账户，这里设置所有子账户get_kline_num的最大值。
              </div>
            </template>
          </Inplace>
        </div>
        <Message
          v-if="$form.kline_count_1h?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
          >{{ $form.kline_count_1h.error?.message }}</Message
        >

        <label for="error_webhook_url" class="block text-sm font-medium"
          ><span class="text-red-500 mr-1">*</span>企业微信机器人url</label
        >
        <div>
          <InputText
            v-model="initialValues.error_webhook_url"
            name="error_webhook_url"
            type="text"
            placeholder="请填写企业微信机器人url"
            class="w-full"
          />
          <Inplace
            :closable="true"
            :pt="{
              display: {
                class: 'w-full flex justify-end hover:bg-transparent p-1',
              },
              content: {
                class: 'p-1',
              },
            }"
          >
            <template #display>
              <span
                class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
              >
                什么是企业微信机器人url？
              </span>
            </template>
            <template #content>
              <div
                class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
              >
                数据中心运行报错时，信息发送给企业微信机器人的url地址。注意复制包括https的完整链接。
              </div>
            </template>
          </Inplace>
        </div>
        <Message
          v-if="$form.error_webhook_url?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
          >{{ $form.error_webhook_url.error?.message }}</Message
        >
        <!-- 高级配置 -->
        <div class="text-sm text-gray-400">高级配置</div>
        <CustomCheckboxTemplate
          :modelValue="initialValues.use_api.kline"
          title="使用API来更新K线"
          description="启用后使用彩虹额外提供的数据API，下载行情数据；"
          :mobIsHidden="false"
          @update:modelValue="(value:boolean) => (initialValues.use_api.kline = value)"
        />
        <CustomCheckboxTemplate
          :modelValue="initialValues.use_api.coin_cap"
          title="使用API来更新市值数据"
          description="启用后使用彩虹额外提供的数据API，下载市值全量数据，更新增量数据；需要使用市值数据的策略必须启用勾选；"
          :mobIsHidden="false"
          @update:modelValue="(value:boolean) => (initialValues.use_api.coin_cap = value)"
        />
        <CustomCheckboxTemplate
          :modelValue="initialValues.funding_rate"
          title="是否需要使用资金费数据"
          description="启用后会使用资金费数据"
          :mobIsHidden="false"
          @update:modelValue="(value:boolean) => (initialValues.funding_rate = value)"
        />

        <!-- 其他配置 -->
        <div class="text-sm text-gray-400">其他配置</div>
        <label for="enabled_hour_offsets" class="block text-sm font-medium"
          ><span class="text-red-500 mr-1">*</span>分钟偏移</label
        >
        <div>
          <MultiSelect
            v-model="initialValues.enabled_hour_offsets"
            name="enabled_hour_offsets"
            :options="hourOffsetList"
            filter
            placeholder="请选择分钟偏移"
            :minSelectedLabels="1"
            class="w-full"
          />
          <Inplace
            :closable="true"
            :pt="{
              display: {
                class: 'w-full flex justify-end hover:bg-transparent p-1',
              },
              content: {
                class: 'p-1',
              },
            }"
          >
            <template #display>
              <span
                class="max-h-[70px] overflow-auto text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
              >
                什么是分钟偏移？
              </span>
            </template>
            <template #content>
              <div
                class="text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
              >
                为分钟偏移的选币策略提供行情数据。多个分钟偏移行情数据可以支持多个子账户交易，选得越多下载的分钟偏移数据量越大，占用硬盘越多。
              </div>
            </template>
          </Inplace>
        </div>
        <Message
          v-if="$form.enabled_hour_offsets?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
          >{{ $form.enabled_hour_offsets.error?.message }}</Message
        >
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end pt-4">
        <Button
          type="submit"
          severity="primary"
          label="确定"
          class="px-6 py-2.5"
          :loading="viewFormLoading"
        />
      </div>
    </Form>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

import { hourOffsetList } from "@/common-module/defaultValues";
import CustomCheckboxTemplate from "@/common-module/components/customCheckbox.template.vue";
import {
  editDataCenterConfig,
  updataDataCenterConfig,
  dataCenterStatusEnum,
} from "@/common-module/services/service.provider";

const props = defineProps<{
  formValues: tDataCenterConfigParams;
  frameWorkId: string;
  isForceEdit: boolean;
}>();

const viewIsOpenEditDataDialog = ref<boolean>(false);

const initialValues = ref<tDataCenterConfigParams>({
  id: "",
  kline_count_1h: 2000,
  error_webhook_url: "",
  use_api: { kline: false, coin_cap: false },
  enabled_hour_offsets: hourOffsetList,
  funding_rate: true,
  is_first: false,
});

const $emit = defineEmits(["refreshDataCenterConfig", "operateDataCenter"]);

const viewFormLoading = ref<boolean>(false);

const openDialog = (formValues: tDataCenterConfigParams) => {
  viewIsOpenEditDataDialog.value = true;
  if (formValues !== null) {
    initialValues.value = { ...JSON.parse(JSON.stringify(formValues)) };
  }
};

const resolver = ({ values }: any) => {
  const errors: Record<string, any> = {};

  // 框架版本 必填
  if (!initialValues.value.id) {
    errors.id = [{ message: "请选择框架版本" }];
  }
  if (
    initialValues.value.kline_count_1h < 0 ||
    initialValues.value.kline_count_1h === null
  ) {
    errors.kline_count_1h = [{ message: "请填写k线数" }];
  }
  // 企业微信机器人url 必填+格式校验
  if (!initialValues.value.error_webhook_url) {
    errors.error_webhook_url = [{ message: "请填写企业微信机器人url" }];
  } else {
    // 简单url正则校验
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(initialValues.value.error_webhook_url)) {
      errors.error_webhook_url = [{ message: "请输入正确的URL格式" }];
    }
  }

  // 分钟偏移 必填
  if (
    !initialValues.value.enabled_hour_offsets ||
    initialValues.value.enabled_hour_offsets.length === 0
  ) {
    errors.enabled_hour_offsets = [{ message: "请选择分钟偏移" }];
  }

  return {
    values,
    errors,
  };
};

const formSubmitAction = async ({ valid }: any) => {
  if (valid) {
    let sendData = {
      ...initialValues.value,
      id: props.frameWorkId,
    };
    viewFormLoading.value = true;
    let res: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };

    if (initialValues.value.is_first === true) {
      // 首次保存数据
      res = await editDataCenterConfig(sendData);
    } else {
      // 更新数据
      res = await updataDataCenterConfig(sendData);
    }
    viewFormLoading.value = false;
    if (res.result === true) {
      toast.add({
        severity: "success",
        summary: "修改成功",
        detail: "表单已成功提交",
        life: 3000,
      });

      viewIsOpenEditDataDialog.value = false;
      $emit("refreshDataCenterConfig");
    } else {
      toast.add({
        severity: "error",
        summary: "修改失败",
        detail: res.msg,
        life: 3000,
      });
    }

    confirm.require({
      message: "是否要立即重启？",
      icon: "pi pi-exclamation-triangle",
      header: "提示",
      rejectProps: {
        label: "稍后重启",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "立即重启",
      },
      accept: () => {
        $emit("operateDataCenter", dataCenterStatusEnum.restart);
      },
      reject: () => {},
    });
  }
};

defineExpose({
  openDialog,
});
</script>
