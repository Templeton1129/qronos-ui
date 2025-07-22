<template>
  <Dialog
    v-model:visible="viewIsOpenAccountDialog"
    :header="type === `新增` ? `新增账户` : initialValues.account_name"
    :closable="!isForceAddAccount"
    modal
    appendTo="self"
    class="w-[90vw] sm:w-150 max-w-full z-200"
  >
    <template #default>
      <Form
        v-slot="$form"
        class="space-y-2"
        :resolver
        @submit="formSubmitAction"
      >
        <!-- 主要配置区域 -->
        <div class="space-y-3">
          <!-- 账户名称 (新增模式) -->
          <div v-if="type === `新增`">
            <label
              for="account_name"
              class="hidden sm:block text-sm font-medium mb-1"
              ><span class="text-red-500 mr-1">*</span>账户名称</label
            >
            <InputText
              :size="formItemSize || 'normal'"
              v-model.trim="initialValues.account_name"
              name="account_name"
              placeholder="请输入账户名称"
              class="hidden sm:inline-block w-full"
            />
            <Message
              v-if="$form.account_name?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.account_name.error?.message }}</Message
            >
          </div>

          <!-- 账户类型 -->
          <div class="hidden sm:block">
            <label for="account_type" class="text-sm font-medium mb-1"
              ><span class="text-red-500 mr-1">*</span>账户类型</label
            >
            <Select
              :size="formItemSize || 'normal'"
              v-model="initialValues.account_config.account_type"
              :options="accountTypeList"
              placeholder="请选择账户类型"
              checkmark
              :highlightOnSelect="false"
              class="w-full"
            />
            <Message
              v-if="$form.account_type?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.account_type.error?.message }}</Message
            >
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
                  什么是账户类型？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  账户类型可以选择普通账户和统一账户两种类型，统一账户的介绍请参考预备课程。
                </div>
              </template>
            </Inplace>
          </div>

          <!-- API KEY (修改模式) -->
          <div v-if="type === `修改`" class="hidden sm:block">
            <label for="apiKey" class="text-sm font-medium mb-1">API KEY</label>
            <InputText
              :size="formItemSize || 'normal'"
              :value="maskString(initialValues.account_config.apiKey)"
              name="apiKey"
              placeholder="请输入API KEY"
              class="w-full cursor-pointer"
              type="text"
              readonly
              @click="
                openInputApiKeyOrSecretDialog(
                  initialValues.account_config.apiKey,
                  `API KEY`
                )
              "
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
                  什么是API KEY？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  与BN服务器通讯的密钥。创建和设置请参考：<a
                    href="https://bbs.quantclass.cn/thread/9521"
                    target="_blank"
                    class="text-xs text-primary-500 dark:text-primary-300 hover:text-primary-400"
                  >
                    币安子账户开通及测试流程。
                  </a>
                </div>
              </template>
            </Inplace>
            <Message
              v-if="$form.apiKey?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.apiKey.error?.message }}</Message
            >
          </div>
          <!-- 密钥 (修改模式) -->
          <div v-if="type === `修改`">
            <label for="secret" class="hidden sm:block text-sm font-medium mb-1"
              >密钥</label
            >
            <InputText
              :size="formItemSize || 'normal'"
              :value="maskString(initialValues.account_config.secret)"
              name="secret"
              placeholder="请输入密钥"
              class="hidden sm:block w-full cursor-pointer"
              type="text"
              readonly
              @click="
                openInputApiKeyOrSecretDialog(
                  initialValues.account_config.secret,
                  `密钥`
                )
              "
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
                  什么是密钥？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  子账户转账的密钥。创建和设置请参考：<a
                    href="https://bbs.quantclass.cn/thread/46812"
                    target="_blank"
                    class="text-xs text-primary-500 dark:text-primary-300 hover:text-primary-400"
                  >
                    币安子账户开通及测试流程
                  </a>
                </div>
              </template>
            </Inplace>
            <Message
              v-if="$form.secret?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.secret.error?.message }}</Message
            >
          </div>

          <!-- 分钟偏移 -->
          <div class="hidden sm:block">
            <label
              for="enabled_hour_offsets"
              class="hidden sm:block text-sm font-medium mb-1"
              ><span class="text-red-500 mr-1">*</span>分钟偏移</label
            >
            <Select
              :size="formItemSize || 'normal'"
              v-model="initialValues.account_config.hour_offset"
              name="hour_offset"
              :options="hourOffsetList"
              filter
              placeholder="请选择分钟偏移"
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
                  什么是分钟偏移？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  实盘框架支持在非整点时间下单，错开整点交易的拥堵。可以选择的参数范围是整点（0m）到55分（55m），每隔5分钟一个参数。如整点交易是08:00下单，分钟偏移可以设置为08：15下单。<a
                    href="https://bbs.quantclass.cn/thread/46812"
                    target="_blank"
                    class="text-xs text-primary-500 dark:text-primary-300 hover:text-primary-400"
                  >
                    详细介绍
                  </a>
                </div>
              </template>
            </Inplace>
            <Message
              v-if="$form.hour_offset?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.hour_offset.error?.message }}</Message
            >
          </div>

          <!-- k线数 -->
          <div class="hidden sm:block">
            <label for="get_kline_num" class="text-sm font-medium mb-1"
              ><span class="text-red-500 mr-1">*</span>k线数</label
            >
            <InputNumber
              name="get_kline_num"
              :size="formItemSize || 'normal'"
              v-model.trim="initialValues.get_kline_num"
              mode="decimal"
              showButtons
              :min="1"
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
                  什么是k线数？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  为了执行实盘选币策略，至少需要多少根K线的行情数据。这个参数来自浪淘沙轮动精心随机案例包中，config文件里的get_kline_num参数。
                </div>
              </template>
            </Inplace>
            <Message
              v-if="$form.get_kline_num?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.get_kline_num.error?.message }}</Message
            >
          </div>

          <!-- 黑名单 -->
          <div>
            <label for="black_list" class="block text-sm font-medium mb-1"
              >黑名单</label
            >
            <AutoComplete
              :size="formItemSize || 'normal'"
              v-model="initialValues.black_list"
              :suggestions="suggestions"
              multiple
              forceSelection
              @complete="formatSuggestions"
              @keydown.enter.prevent
              placeholder="输入后点击提示标签添加黑名单"
              emptySearchMessage="重复的输入"
              class="w-full"
            />
            <Inplace
              :closable="true"
              class="hidden sm:block"
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
                  什么是黑名单？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  策略不交易的币种。输入字母大小写都行，输入后需要鼠标点击下方自动显示的币对名称。
                </div>
              </template>
            </Inplace>
          </div>

          <!-- 杠杆数 -->
          <div>
            <label for="leverage" class="block text-sm font-medium mb-1"
              ><span class="text-red-500 mr-1">*</span>杠杆数</label
            >
            <div class="w-full flex items-center gap-2">
              <InputText
                name="leverage"
                :size="formItemSize || 'normal'"
                :value="initialValues.leverage"
                disabled
                class="w-1/4"
              />
              <Slider
                name="leverage"
                :size="formItemSize || 'normal'"
                v-model="initialValues.leverage"
                :min="0"
                :max="2"
                :step="0.1"
                class="w-3/4"
                @value-change="leverageChangeAction"
              />
            </div>
            <Inplace
              :closable="true"
              class="hidden sm:block"
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
                  什么是杠杆数？
                </span>
              </template>
              <template #content>
                <div
                  class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                >
                  1，合约账户允许在保证金充足的情况下，放大本金下单交易。如合约账户里有100U，杠杆设置为1.1，即可使用110U下单交易。警告：杠杆大于1时，收益和风险同时增加。请看看这些血的教训：<a
                    href="https://bbs.quantclass.cn/thread/54140"
                    target="_blank"
                    class="text-xs text-primary-500 dark:text-primary-300 hover:text-primary-400"
                  >
                    【风险警示录】 </a
                  ><br />
                  2，当杠杆设置小于1就是不满仓交易，杠杆设置为0就是清仓；<br />
                  3，杠杆数以0.1为最小调整单位；<br />
                </div>
              </template>
            </Inplace>
            <Message
              v-if="$form.leverage?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
              >{{ $form.leverage.error?.message }}</Message
            >
          </div>
        </div>

        <!-- 更多高级配置 -->
        <Inplace
          :closable="true"
          class="mt-3 hidden sm:block"
          :pt="{
            display: {
              class: 'flex justify-center hover:bg-transparent',
            },
          }"
        >
          <template #display>
            <Button variant="outlined" size="small" severity="secondary">
              更多高级配置
            </Button>
          </template>
          <template #content>
            <div class="space-y-3">
              <!-- 企业微信机器人url -->
              <div>
                <label
                  for="wechat_webhook_url"
                  class="hidden sm:block text-sm font-medium mb-1"
                  >企业微信机器人url</label
                >
                <InputText
                  :size="formItemSize || 'normal'"
                  v-model.trim="initialValues.account_config.wechat_webhook_url"
                  name="wechat_webhook_url"
                  type="text"
                  placeholder="请填写企业微信机器人url"
                  class="hidden sm:block w-full"
                />
                <Message
                  v-if="$form.wechat_webhook_url?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                  >{{ $form.wechat_webhook_url.error?.message }}</Message
                >
              </div>

              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >最小k线数量</label
                >
                <InputNumber
                  v-model="initialValues.min_kline_num"
                  :min="0"
                  mode="decimal"
                  showButtons
                  class="w-full"
                  placeholder="最小k线数量"
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是最小k线数量？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      最小上市多久，不满该k线根数的币剔除，即剔除刚刚上市的新币。例如：168：标识168个小时，即7*24。
                    </div>
                  </template>
                </Inplace>
              </div>

              <!-- BNB燃烧配置 -->
              <div
                class="hidden sm:flex justify-between items-center text-gray-600 bg-primary-50 p-4 rounded-xl shadow-sm border border-gray-300"
                :class="
                  initialValues.account_config.if_use_bnb_burn
                    ? 'text-primary border border-primary bg-primary-100 dark:bg-primary-900 dark:text-primary-300 shadow-lg'
                    : 'dark:bg-primary-200'
                "
              >
                <div class="space-y-2">
                  <label class="block font-semibold text-sm"
                    >是否开启BNB燃烧</label
                  >
                  <div class="text-xs">是否使用使用BNB支付交易手续费</div>
                </div>
                <Checkbox
                  v-model="initialValues.account_config.if_use_bnb_burn"
                  binary
                  size="large"
                />
              </div>

              <!-- 买多少U的bnb -->
              <div v-if="initialValues.account_config.if_use_bnb_burn === true">
                <label
                  for="buy_bnb_value"
                  class="hidden sm:block text-sm font-medium mb-1"
                  >买多少U的bnb来抵扣手续费<span class="text-xs text-gray-400"
                    >（建议最低11U，现货最小单量限制10U）</span
                  ></label
                >
                <InputNumber
                  name="buy_bnb_value"
                  :size="formItemSize || 'normal'"
                  v-model.trim="initialValues.account_config.buy_bnb_value"
                  mode="decimal"
                  showButtons
                  :min="11"
                  class="hidden sm:inline-flex w-full"
                />
                <Message
                  v-if="$form.buy_bnb_value?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  class="mt-1"
                  >{{ $form.buy_bnb_value.error?.message }}</Message
                >
              </div>

              <!-- 小额资产兑换BNB功能 -->
              <div
                v-if="initialValues.account_config.if_use_bnb_burn === true"
                class="hidden sm:flex gap-2 justify-between items-center text-gray-600 bg-primary-50 p-4 rounded-xl shadow-sm border border-gray-300"
                :class="
                  initialValues.account_config.if_transfer_bnb
                    ? 'text-primary border border-primary bg-primary-100 dark:bg-primary-900 dark:text-primary-300 shadow-lg'
                    : 'dark:bg-primary-200'
                "
              >
                <div class="space-y-2">
                  <label class="block font-semibold text-sm"
                    >是否开启小额资产兑换BNB功能</label
                  >
                  <div class="text-xs">
                    现货账户交易时，每隔15天将无法卖掉的现货小额资产兑换成BNB。通常只在交易现货策略中设置该参数，只交易合约的策略可以关闭。
                  </div>
                </div>
                <Checkbox
                  v-model="initialValues.account_config.if_transfer_bnb"
                  binary
                  size="large"
                />
              </div>

              <!-- 白名单 -->
              <div>
                <label
                  for="white_list"
                  class="hidden sm:block text-sm font-medium mb-1"
                  >白名单</label
                >
                <AutoComplete
                  :size="formItemSize || 'normal'"
                  v-model="initialValues.white_list"
                  :suggestions="suggestions1"
                  multiple
                  forceSelection
                  @complete="formatSuggestions($event, 'white_list')"
                  @keydown.enter.prevent
                  placeholder="输入后点击提示标签添加白名单"
                  emptySearchMessage="重复的输入"
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
                      什么是白名单？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      策略只交易的币种
                    </div>
                  </template>
                </Inplace>
              </div>

              <!-- seed_coins -->
              <div
                v-if="initialValues.account_config.account_type === `统一账户`"
              >
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >套利底仓</label
                >
                <AutoComplete
                  :size="formItemSize || 'normal'"
                  v-model="initialValues.account_config.seed_coins"
                  :suggestions="seedCoinSuggestions"
                  multiple
                  forceSelection
                  @complete="formatSeedCoinSuggestions"
                  @keydown.enter.prevent
                  placeholder="输入币种后点击提示标签添加底仓（自动加USDT后缀）"
                  emptySearchMessage="重复的输入"
                  class="w-full"
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是套利底仓？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      1，<24年分享会> 专属配置，对于新加入 <25年分享会>
                      老板，可以忽略本配置；<br />
                      2，套利底仓设置。例：['ETHUSDT']；<br />
                      3，底仓默认为空，当底仓为空的时候，可以开启现货+合约模式；<br />
                      4，当底仓不为空的时候，程序默认自动启动纯合约模式；<br />
                    </div>
                  </template>
                </Inplace>
              </div>

              <!-- coin_margin -->
              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >现货充当保证金</label
                >
                <div
                  v-for="(amount, coin, idx) in initialValues.account_config
                    .coin_margin"
                  :key="coin"
                  class="w-full flex items-center gap-2 mb-1"
                >
                  <AutoComplete
                    :size="formItemSize || 'normal'"
                    v-model="coinMarginEditKeys[idx]"
                    :suggestions="coinMarginSuggestions"
                    forceSelection
                    @complete="
                      (e) => formatSeedCoinSuggestions(e, 'coinMargin')
                    "
                    @item-select="updateCoinMargin"
                    @keydown.enter.prevent
                    placeholder="输入币种后点击提示标签添加底仓（自动加USDT后缀）"
                    emptySearchMessage="重复的输入"
                  />
                  <InputNumber
                    :size="formItemSize || 'normal'"
                    v-model="coinMarginEditValues[idx]"
                    placeholder="保证金金额"
                    class="flex-1"
                    :min="1"
                    mode="decimal"
                    showButtons
                    @value-change="updateCoinMargin"
                  />
                  <Button
                    icon="pi pi-trash"
                    size="small"
                    text
                    @click="
                      () => {
                        removeCoinMargin(idx);
                      }
                    "
                  />
                </div>
                <div>
                  <Button
                    size="small"
                    icon="pi pi-plus"
                    variant="outlined"
                    class="w-full"
                    @click="
                      () => {
                        addCoinMargin();
                      }
                    "
                    >添加币种保证金</Button
                  >
                </div>
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是现货充当保证金？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      1，指定币种当保证金。例：{'ETHUSDT':
                      1000}，指定账户中的所有ETH当作1000U作为保证金。<br />
                      2，普通账户需要将保证金币种，手动划转到合约账户才会生效，如果在现货账户，程序会帮你卖掉。<br />
                      3，统一账户将保证金币种放在杠杆钱包即可，不需要划转。<br />
                      4，如果账户指定币种数量不足，不会计算保证金。<br />
                      5，新手老板请勿轻易尝试，当作保证金的币种如果快速下跌，会有爆仓风险。<br />
                    </div>
                  </template>
                </Inplace>
              </div>

              <!-- order_spot_money_limit -->
              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >现货下单最小金额</label
                >
                <InputNumber
                  v-model="initialValues.account_config.order_spot_money_limit"
                  :min="10"
                  class="w-full"
                  placeholder="现货下单最小金额"
                  mode="decimal"
                  showButtons
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是现货下单最小金额？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      1，现货下单最小金额限制，适当增加可以减少部分reb。<br />
                      2，默认10，不建议小于10，这会让你的下单报错，10是交易所的限制。<br />
                    </div>
                  </template>
                </Inplace>
              </div>
              <!-- order_swap_money_limit -->
              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >合约下单最小金额</label
                >
                <InputNumber
                  v-model="initialValues.account_config.order_swap_money_limit"
                  :min="5"
                  class="w-full"
                  placeholder="合约下单最小金额"
                  mode="decimal"
                  showButtons
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是合约下单最小金额？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      1，合约下单最小金额限制，适当增加可以减少部分reb。<br />
                      2，默认5，不建议小于5，这会让你的下单报错，5是交易所的限制。<br />
                    </div>
                  </template>
                </Inplace>
              </div>
              <!-- max_one_order_amount -->
              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >最大拆单金额</label
                >
                <InputNumber
                  v-model="initialValues.account_config.max_one_order_amount"
                  :min="1"
                  class="w-full"
                  placeholder="最大拆单金额"
                  mode="decimal"
                  showButtons
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是最大拆单金额？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      单个现货/合约一笔下单的最大金额，避免一笔大单导致买入现货小币，造成滑点损失；
                    </div>
                  </template>
                </Inplace>
              </div>
              <!-- twap_interval -->
              <div>
                <label class="hidden sm:block text-sm font-medium mb-1"
                  >下单间隔（秒）</label
                >
                <InputNumber
                  v-model="initialValues.account_config.twap_interval"
                  :min="1"
                  class="w-full"
                  placeholder="下单间隔"
                  mode="decimal"
                  showButtons
                />
                <Inplace
                  :closable="true"
                  class="hidden sm:block"
                  :pt="{
                    display: {
                      class: 'w-full flex justify-end hover:bg-transparent p-1',
                    },
                    content: { class: 'p-1' },
                  }"
                >
                  <template #display>
                    <span
                      class="text-xs text-primary-500 hover:text-primary-400 cursor-pointer"
                    >
                      什么是下单间隔？
                    </span>
                  </template>
                  <template #content>
                    <div
                      class="max-h-[70px] overflow-auto text-xs text-gray-600 dark:text-gray-300 p-2 bg-neutral-50 dark:bg-neutral-800 rounded leading-relaxed"
                    >
                      拆单下单时，每笔下单的间隔时间；
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>
          </template>
        </Inplace>

        <div class="flex justify-end mt-4">
          <Button
            type="submit"
            :label="type === `新增` ? `确定添加` : `保存配置`"
            variant="outlined"
            :loading="viewIsLoading"
          />
        </div>
      </Form>
    </template>
  </Dialog>
  <LeverageConfirmDialog
    ref="refLeverageConfirmDialog"
    :leverage="initialValues.leverage"
    @cancel="cancelLeverageChange"
    @confirm="saveLeverage"
  />
  <ApiKeyOrSecretDialogTemplate
    v-if="type === `修改`"
    ref="refApiKeyOrSecretDialogTmpl"
    :inputType="currentOpenDialogName"
    :frameworkId="frameWorkId || ``"
    :accountName="initialValues.account_name || ``"
    @refreshApikeyOrSecretValue="refreshApikeyOrSecretValueFn"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { maskString } from "@/common-module/utils";
import {
  getAccountInfo,
  addOrEditAccountInfo,
} from "@/common-module/services/service.provider";
import ApiKeyOrSecretDialogTemplate from "@/strategy-center-module/components/apiKeyOrSecretDialogTemplate.vue";
import LeverageConfirmDialog from "@/strategy-center-module/components/LeverageConfirmDialog.vue";
const refLeverageConfirmDialog = ref<InstanceType<
  typeof LeverageConfirmDialog
> | null>(null);
const refApiKeyOrSecretDialogTmpl = ref<InstanceType<
  typeof ApiKeyOrSecretDialogTemplate
> | null>(null);

const props = defineProps<{
  isForceAddAccount: boolean;
  frameWorkId?: string;
  frameWorkType: string;
  type: "新增" | "修改";
  formItemSize?: "small" | "normal" | "large";
}>();

const initialValues = ref<tDbAccountInfoRes>({
  framework_id: "",
  account_name: "",
  account_config: {
    account_type: "普通账户",
    apiKey: "",
    secret: "",
    hour_offset: "",
    wechat_webhook_url: "",
    if_use_bnb_burn: true,
    buy_bnb_value: 11,
    if_transfer_bnb: true,
    seed_coins: [], //套利底仓设置
    coin_margin: {}, //指定账户中的所有ETH的保证金金额
    order_spot_money_limit: 10, //现货下单最小金额限制
    order_swap_money_limit: 5, //合约下单最小金额限制，
    max_one_order_amount: 100, //最大拆单金额
    twap_interval: 2, //下单间隔
  },
  min_kline_num: 168,
  get_kline_num: 1500,
  leverage: 1,
  black_list: [],
  white_list: [],
  is_lock: false,
});
const hourOffsetList = [
  "0m",
  "5m",
  "10m",
  "15m",
  "20m",
  "25m",
  "30m",
  "35m",
  "40m",
  "45m",
  "50m",
  "55m",
];
const accountTypeList = ["普通账户", "统一账户"];

const suggestions = ref<string[]>([]);
const suggestions1 = ref<string[]>([]);
const viewAccountNameList = ref<string[]>([]);
const currentOpenDialogName = ref<string>("");
const viewIsOpenAccountDialog = ref<boolean>(false);
const viewIsLoading = ref<boolean>(false);

const coinMarginEditKeys = ref<string[]>([]);
const coinMarginEditValues = ref<number[]>([]);

const $emit = defineEmits(["refreshAccountInfoList", "refreshForceStatus"]);

onMounted(() => {
  getAccountInfoListFn();
});

const openDialog = (formValues: tDbAccountInfoRes | null) => {
  initialValues.value = {
    framework_id: "",
    account_name: "",
    account_config: {
      account_type: "普通账户",
      apiKey: "",
      secret: "",
      hour_offset: "",
      wechat_webhook_url: "",
      if_use_bnb_burn: true,
      buy_bnb_value: 11,
      if_transfer_bnb: true,
      seed_coins: [], //套利底仓设置
      coin_margin: {}, //指定账户中的所有ETH的保证金金额
      order_spot_money_limit: 10, //现货下单最小金额限制
      order_swap_money_limit: 5, //合约下单最小金额限制，
      max_one_order_amount: 100, //最大拆单金额
      twap_interval: 2, //下单间隔
    },
    min_kline_num: 168,
    get_kline_num: 1500,
    leverage: 1,
    black_list: [],
    white_list: [],
    is_lock: false,
  };

  if (props.type === `修改`) {
    const clonedVal = JSON.parse(JSON.stringify(formValues));
    clonedVal.account_config = {
      ...{
        account_type: "普通账户",
        apiKey: "",
        secret: "",
        hour_offset: "",
        wechat_webhook_url: "",
        if_use_bnb_burn: true,
        buy_bnb_value: 11,
        if_transfer_bnb: true,
        seed_coins: [], //套利底仓设置
        coin_margin: {}, //指定账户中的所有ETH的保证金金额
        order_spot_money_limit: 10, //现货下单最小金额限制
        order_swap_money_limit: 5, //合约下单最小金额限制，
        max_one_order_amount: 100, //最大拆单金额
        twap_interval: 2, //下单间隔
      },
      ...JSON.parse(JSON.stringify(clonedVal.account_config)),
    };
    initialValues.value = {
      ...JSON.parse(JSON.stringify(initialValues.value)),
      ...clonedVal,
    };
    if (initialValues.value.account_config.buy_bnb_value === 0) {
      initialValues.value.account_config.buy_bnb_value = 11;
    }
  } else {
    coinMarginEditKeys.value = [];
    coinMarginEditValues.value = [];
  }

  viewIsOpenAccountDialog.value = true;
};

const getAccountInfoListFn = async () => {
  if (props.frameWorkId) {
    const res = await getAccountInfo(props.frameWorkId);
    if (res.result === true) {
      viewAccountNameList.value = res.data.map((item) => item.account_name);
    }
  }
};

const resolver = ({ values }: any) => {
  const errors: Record<string, any> = {};

  // 框架版本 必填
  if (props.type === `新增`) {
    if (!initialValues.value.account_name) {
      errors.account_name = [{ message: "请填写账户名" }];
    } else if (/\s/.test(initialValues.value.account_name)) {
      errors.account_name = [{ message: "账户名不能包含空格" }];
    } else if (/_/.test(initialValues.value.account_name)) {
      errors.account_name = [{ message: "账户名不能包含下划线" }];
    } else if (
      viewAccountNameList.value.includes(initialValues.value.account_name)
    ) {
      errors.account_name = [{ message: "账户名已存在，请更换" }];
    }
  }

  if (initialValues.value.account_config.account_type === "") {
    errors.account_type = [{ message: "请选择账户类型" }];
  }

  // 分钟偏移 必填
  if (initialValues.value.account_config.hour_offset === "") {
    errors.hour_offset = [{ message: "请选择分钟偏移" }];
  }
  // k线数 必填
  if (
    initialValues.value.get_kline_num < 0 ||
    initialValues.value.get_kline_num === null
  ) {
    errors.get_kline_num = [{ message: "请填写k线数" }];
  }
  // 杠杆数 必填
  if (
    initialValues.value.leverage < 0 ||
    initialValues.value.leverage === null
  ) {
    errors.leverage = [{ message: "请设置杠杆数" }];
  }

  // bnb
  if (
    initialValues.value.account_config.buy_bnb_value < 11 ||
    initialValues.value.account_config.buy_bnb_value === null
  ) {
    errors.buy_bnb_value = [{ message: "请设置买多少U的bnb" }];
  }

  return {
    values,
    errors,
  };
};

const formatSuggestions = (event: any, type = "black_list") => {
  let input: string = event.query.trim();
  if (!input) {
    event.suggestions = [];
    if (type === "black_list") {
      suggestions.value = [];
    } else {
      suggestions1.value = [];
    }
    return;
  }
  // 只允许字母和数字
  if (!/^[a-zA-Z0-9]+$/.test(input)) {
    event.suggestions = [];
    if (type === "black_list") {
      suggestions.value = [];
    } else {
      suggestions1.value = [];
    }
    return;
  }
  // 自动补全 -USDT 后缀
  input = input.toUpperCase() + "-USDT";
  // 过滤已存在的
  const exists =
    type === "black_list"
      ? initialValues.value.black_list.includes(input)
      : initialValues.value.white_list.includes(input);

  const targetValues =
    type === "black_list"
      ? initialValues.value.white_list
      : initialValues.value.black_list;

  const targetExists = targetValues.includes(input);

  if (!exists && !targetExists) {
    event.suggestions = [input];
  } else {
    event.suggestions = [];
  }
  if (type === "black_list") {
    suggestions.value = event.suggestions;
  } else {
    suggestions1.value = event.suggestions;
  }
};

// --- leverage >1 提示
const leverageChangeAction = (newValue: number | number[]) => {
  if (Array.isArray(newValue)) {
    return;
  }

  if (newValue > 1) {
    // 如果值大于1，显示确认对话框
    refLeverageConfirmDialog.value?.openDialog();
  }
};

// --- 拆分apikey secret的输入
const openInputApiKeyOrSecretDialog = (value: string, inputType: string) => {
  currentOpenDialogName.value = inputType;
  let tmpvalue = value;
  if (refApiKeyOrSecretDialogTmpl.value) {
    refApiKeyOrSecretDialogTmpl.value.openDialog(tmpvalue);
  }
};

const refreshApikeyOrSecretValueFn = (cloneValue: string) => {
  if (currentOpenDialogName.value === `API KEY`) {
    initialValues.value.account_config.apiKey = cloneValue;
  } else {
    initialValues.value.account_config.secret = cloneValue;
  }
};

const formSubmitAction = async ({ valid }: any) => {
  if (valid) {
    if (initialValues.value.account_config.if_use_bnb_burn === false) {
      initialValues.value.account_config.buy_bnb_value = 0;
      initialValues.value.account_config.if_use_bnb_burn = false;
    }

    if (initialValues.value.account_config.account_type === "普通账户") {
      initialValues.value.account_config.seed_coins = [];
    }
    addOrEditAccountAction(initialValues.value);
  }
};

const addOrEditAccountAction = async (fromData: tDbAccountInfoRes) => {
  viewIsLoading.value = true;
  const res = await addOrEditAccountInfo({
    ...fromData,
    framework_id: props.frameWorkId || "",
  });
  viewIsLoading.value = false;
  if (res.result === true) {
    toast.add({ severity: "success", summary: "操作成功", life: 2000 });
    $emit("refreshAccountInfoList");
    viewIsOpenAccountDialog.value = false;
    if (props.isForceAddAccount === true) {
      $emit("refreshForceStatus");
    }
  }
};

const cancelLeverageChange = () => {
  initialValues.value.leverage = 1;
};

const saveLeverage = () => {
  initialValues.value.leverage = initialValues.value.leverage;
};

const seedCoinSuggestions = ref<string[]>([]);
const coinMarginSuggestions = ref<string[]>([]);

const formatSeedCoinSuggestions = (event: any, type: string = "seedCoin") => {
  let input: string = event.query.trim();
  if (!input) {
    event.suggestions = [];
    if (type === "seedCoin") {
      seedCoinSuggestions.value = [];
    } else {
      coinMarginSuggestions.value = [];
    }
    return;
  }
  // 只允许字母
  if (!/^[a-zA-Z]+$/.test(input)) {
    event.suggestions = [];
    if (type === "seedCoin") {
      seedCoinSuggestions.value = [];
    } else {
      coinMarginSuggestions.value = [];
    }
    return;
  }

  input = input.toUpperCase() + "USDT";

  // 检查是否已存在
  const exists =
    type === "seedCoin"
      ? initialValues.value.account_config.seed_coins.includes(input)
      : coinMarginEditKeys.value.includes(input);

  if (exists) {
    event.suggestions = [];
    if (type === "seedCoin") {
      seedCoinSuggestions.value = [];
    } else {
      coinMarginSuggestions.value = [];
    }
    return;
  } else {
    event.suggestions = [];
  }

  // 不存在才推送
  if (type === "seedCoin") {
    seedCoinSuggestions.value = [input];
  } else {
    coinMarginSuggestions.value = [input];
  }
};

watch(
  () => initialValues.value.account_config.coin_margin,
  (val) => {
    coinMarginEditKeys.value = Object.keys(val);
    coinMarginEditValues.value = Object.values(val);
  },
  { immediate: true }
);

const addCoinMargin = () => {
  coinMarginEditKeys.value.push("");
  coinMarginEditValues.value.push(1000);
  updateCoinMargin();
};

const removeCoinMargin = (idx: number) => {
  coinMarginEditKeys.value.splice(idx, 1);
  coinMarginEditValues.value.splice(idx, 1);
  updateCoinMargin();
};

const updateCoinMargin = () => {
  const obj: Record<string, number> = {};
  coinMarginEditKeys.value.forEach((k, i) => {
    if (k !== null) obj[k] = coinMarginEditValues.value[i];
  });
  initialValues.value.account_config.coin_margin = obj;
};

defineExpose({
  openDialog,
});
</script>

<style scoped>
/* 隐藏默认的 "No file chosen" */
:deep(.p-fileupload-basic span) {
  display: none;
}

:deep(.p-fileupload-basic .p-fileupload-choose-button span) {
  display: inline-block;
}
</style>
