<template>
  <Card class="w-[600px]" v-if="isMobileByRegExp() === false">
    <template #content>
      <Stepper value="1" class="basis-[50rem]">
        <StepList class="flex justify-center gap-4">
          <Step :value="1" asChild>
            <div class="flex gap-2 items-center">
              <Button
                icon="pi pi-volume-down"
                severity="secondary"
                rounded
                variant="outlined"
              />
              <div>软件使用协议</div>
            </div>
          </Step>
          <Divider class="w-1/5" />
          <Step :value="2" asChild>
            <div class="flex gap-2 items-center">
              <Button
                icon="pi pi-pen-to-square"
                severity="secondary"
                rounded
                variant="outlined"
              />
              <div>开源披露</div>
            </div>
          </Step>
        </StepList>
        <StepPanels class="h-[605px] p-0 pt-4">
          <StepPanel
            v-slot="{ activateCallback }"
            value="1"
            class="h-full flex flex-col justify-between"
          >
            <div class="flex flex-col gap-4 flex-1">
              <div
                class="flex-1 p-5 gap-2 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between items-center font-medium"
              >
                <div class="flex-1 flex flex-col gap-3">
                  <div class="text-lg font-semibold text-center">
                    <i class="pi pi-volume-down mr-2"></i>软件使用协议
                  </div>
                  <div
                    class="space-y-2 text-gray-600 dark:text-neutral-200 leading-relaxed text-sm"
                  >
                    <p>
                      感谢您使用本产品。本软件本质上是一个实盘控制与管理器，用于简化和优化您在服务器上的实盘部署与操作体验。请您在继续使用前仔细阅读以下免责声明：
                    </p>
                    <p>
                      <span class="font-semibold">1. 风险自担：</span
                      >我们不对您因使用本系统而造成的任何资金损失、交易错误或其他后果承担责任。数字资产交易具有高度风险，请谨慎操作。
                    </p>
                    <p>
                      <span class="font-semibold">2. 核心逻辑完全开源：</span
                      >本软件的前端、后端、部署脚本以及核心交易策略和实盘逻辑全部开源，您可完全自行审查与控制。
                    </p>
                    <p>
                      <span class="font-semibold"
                        >3. 部署安全性取决于用户自身：</span
                      >本软件的功能相当于一个控制面板，核心执行逻辑仍然依赖于您服务器上的实盘代码。如您有隐私顾虑、实盘金额较大，<span
                        class="text-primary-500"
                        >强烈建议您下载完整的源码，自行审查并部署到独立服务器</span
                      >。我们论坛提供了完整的部署方案供您参考。
                    </p>
                    <p>
                      <span class="font-semibold">4. 无数据收集：</span
                      >本软件<span class="text-primary-500"
                        >不会收集任何用户数据</span
                      >，您所有的账户信息、密钥与配置均保存在您自己的服务器上。
                    </p>
                    <p>
                      <span class="font-semibold">5. 知情同意：</span
                      >继续使用即表示您已充分理解并同意以上所有条款。
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 items-center self-start">
                <Checkbox v-model="viewIsCheck" binary />
                <label class="font-semibold text-sm"
                  >我已充分理解并同意以上所有条款</label
                >
              </div>
            </div>
            <div class="flex pt-6 justify-end">
              <Button
                label="下一步"
                icon="pi pi-arrow-right"
                @click="activateCallback('2')"
                :disabled="!viewIsCheck"
              />
            </div>
          </StepPanel>
          <StepPanel
            v-slot="{ activateCallback }"
            value="2"
            class="h-full flex flex-col justify-between"
          >
            <div
              class="my-class overflow-auto p-5 gap-2 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex-1 flex flex-col font-medium"
            >
              <div
                class="flex-1 flex flex-col gap-3 text-gray-600 dark:text-neutral-200 leading-relaxed"
              >
                <div class="text-lg font-semibold text-center">开源披露</div>
                <div class="space-y-2 text-sm">
                  <p>
                    为了确保您完全了解本软件的运行方式，并确保您的实盘部署在您自己掌控之下，我们强烈建议您认真查看以下两个核心开源项目。
                  </p>
                  <p>
                    本软件只是一个控制与交互界面，实际的交易执行与资金控制逻辑，全部依赖于以下开源代码库。请您务必自行阅读、理解，并确认是否接受相关实现方式再继续使用。
                  </p>
                </div>
                <div class="font-semibold text-sm">请完成以下操作</div>
                <div class="flex gap-2 items-start text-sm">
                  <Badge value="1"></Badge>
                  <span class="leading-relaxed">
                    1. 点击下方GitHub链接（前端/后端代码）<br />2.
                    在仓库中找到「code.txt」文件<br />3. 复制文件中的声明码<br />4.
                    返回本页面粘贴提交
                  </span>
                </div>
                <div class="font-semibold text-sm">后端github代码地址:</div>
                <Message severity="secondary" class="py-2 text-sm"
                  ><a
                    href="https://github.com/Templeton1129/qronos"
                    target="_blank"
                    class="text-blue-500 text-sm"
                    >https://github.com/Templeton1129/qronos</a
                  >
                </Message>
                <div class="font-semibold text-sm">前端github代码地址:</div>
                <Message severity="secondary" class="py-2 text-sm"
                  ><a
                    href="https://github.com/Templeton1129/qronos-ui"
                    target="_blank"
                    class="text-blue-500 text-sm"
                    >https://github.com/Templeton1129/qronos-ui</a
                  >
                </Message>
                <div class="space-y-3 text-sm">
                  <div class="flex gap-2 items-start">
                    <Badge value="2"></Badge>
                    <span> 请粘贴从 GitHub 获取的声明码进行验证 </span>
                  </div>
                  <div>
                    <InputGroup class="w-[400px]">
                      <InputGroupAddon>code</InputGroupAddon>
                      <InputText
                        v-model.trim="viewCodeValue"
                        placeholder="请输入声明码"
                        @keyup.enter="sendCodeDeclarationFn"
                        :class="{
                          '!border-green-500': viewIsValid,
                          '!border-red-500': showErrorIcon,
                        }"
                        @input="resetValidation"
                      />
                      <InputGroupAddon>
                        <!-- 成功状态 -->
                        <i
                          v-if="viewIsValid"
                          class="pi pi-check text-green-500"
                        ></i>
                        <!-- 错误状态 -->
                        <i
                          v-else-if="showErrorIcon"
                          class="pi pi-times text-red-500"
                        ></i>
                        <Button
                          v-else
                          :loading="viewIsLoading"
                          variant="text"
                          @click="sendCodeDeclarationFn"
                          :disabled="!viewCodeValue"
                          >确定</Button
                        >
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </div>
              <Divider />
              <div
                class="space-y-2 leading-relaxed text-gray-600 dark:text-neutral-200 text-sm"
              >
                <div class="font-semibold flex items-center gap-2">
                  <i class="pi pi-volume-down text-green-400"></i>
                  <span>为什么这么做？</span>
                </div>
                <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                  <li>我们希望您不是“盲用”本软件，而是真正清楚它做了什么。</li>
                  <li>
                    本质上，您掌握的不是一个黑盒，而是完整透明的、可自审计的实盘系统。
                  </li>
                  <li>只有理解代码，才能真正控制自己的资金与交易风险。</li>
                </ul>
              </div>
            </div>
            <div class="flex justify-between pt-6">
              <Button
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback('1')"
              />
              <div class="text-right">
                <Button :disabled="!viewIsValid" @click="startAction">
                  开始使用
                </Button>
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </template>
  </Card>
  <div v-else class="text-center">
    请使用PC端电脑完成初始化操作，移动端设备暂不支持此功能
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { isMobileByRegExp } from "@/common-module/utils";
import { sendCodeDeclaration } from "@/common-module/services/service.provider";
const viewIsCheck = ref<boolean>(false);
const viewCodeValue = ref("");
const viewIsValid = ref(false);
const viewIsLoading = ref(false);
const showErrorIcon = ref(false); // 新增错误状态标志

const $emit = defineEmits(["refreshIsFirstLogin"]);

// 重置验证状态
const resetValidation = () => {
  if (viewIsValid.value || showErrorIcon.value) {
    viewIsValid.value = false;
    showErrorIcon.value = false;
  }
};

const sendCodeDeclarationFn = async () => {
  if (!viewCodeValue.value || viewIsLoading.value) return;

  viewIsLoading.value = true;
  try {
    const res = await sendCodeDeclaration(viewCodeValue.value);
    viewIsLoading.value = false;
    if (res.result === true && res.data === true) {
      viewIsValid.value = true;
      toast.add({
        severity: "success",
        summary: "提交成功！",
        life: 3000,
      });
    } else {
      showErrorIcon.value = true; // 显示错误图标
      toast.add({
        severity: "error",
        summary: "输入的声明码不正确",
        life: 3000,
      });
    }
  } catch (error) {
    showErrorIcon.value = true;
  } finally {
    viewIsLoading.value = false;
  }
};

const startAction = () => {
  $emit("refreshIsFirstLogin");
};
</script>

<style scoped>
/* 将滚动条变窄 */
.my-class::-webkit-scrollbar {
  width: 4px;
}

.my-class::-webkit-scrollbar-thumb {
  background: #acacac;
  border-radius: 4px;
}
</style>
