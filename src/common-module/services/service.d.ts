const tIsFistLoginRes = {
  is_first_use: false,
  is_declaration: false,
};
type tDbIsFistLoginRes = typeof tIsFistLoginRes;

const tbindGaRes = {
  access_token: "",
  token_type: "Bearer",
  is_bind: true, //是否绑定过微信
};

type tDbBindGaRes = typeof tbindGaRes;

const tWxLoginRes = {
  name: "Az",
  token: "",
  user: {
    access: {
      block: true,
      crypto: true,
      stock: true,
      x: true,
    },
    address: null,
    apiKey: "",
    approval: {
      block: false,
      crypto: true,
      stock: true,
    },
    assets: {
      hulu: {
        gold: 0,
        gold_cum: 0,
        name: "hulu",
        platinum: 0,
        silver: 0,
        silver_cum: 0,
      },
    },
    bbsmid: "y6pLok3pemfA",
    clientInfo: ["crypto-0", "crypto-1", "crypto-2"],
    courseDownloadLink: {
      crypto: [
        {
          baidu: "https://pan.baidu.com/s/1yW30EK2dCZiBLMjjfJvyRQ",
          download: "xbx-coin-2020_part1",
          extra: ["https://pan.baidu.com/s/1u6VWkI_OCyB8RDmCEZSxIQ", "wc01"],
          name: "crypto-0",
          pass2: "i9uu",
          title: "初窥门径篇：数字货币介绍",
          version: "更新时间: 2020-03-27",
        },
      ],
      fen: [],
      groups: {
        "bqjcsj-1": [
          {
            ct: "2022-05-01 19:06",
            description: "B圈基础事件小组",
            extra_permissions: [],
            filenames: [],
            id: "626e699df021b5a0b4beded4",
            is_hidden: null,
            location: "bqjcsj-1",
            name: "B圈基础事件小组专属代码",
            path: "",
            require_auth: null,
            ut: "2022-05-01 19:09",
          },
        ],
      },
      services: {},
      stock: [
        {
          baidu: "https://pan.baidu.com/s/1_i327W93yJvee_Ke7BFXQw",
          download: "xbx_stock_2019",
          name: "stock-0",
          pass2: "9vks",
          title: "第一部分",
          version: "更新时间: 2022-01-26",
        },
        {
          baidu: "https://pan.baidu.com/s/1qf29chFUBfxWOaPaK7eIGw ",
          download: "xbx_stock_2019-pro",
          name: "stock-1",
          pass2: "lw6v",
          title: "第二部分",
          version: "更新时间: 2022-01-26",
        },
      ],
    },
    data_perms_advanced: false,
    email: "",
    extra: {
      aiServiceId: "",
    },
    form: {},
    groupInfo: [],
    headimgurl: "https://thirdwx.qlogo.cn/m",
    id: "",
    isMember: true,
    isSciship: null,
    is_approved: true,
    liteClassInfo: [],
    membership: {
      expire: "2026-05-22",
      since: "2025-05-22",
    },
    membershipInfo: ["fen-2025"],
    nickname: "",
    sciship: {},
    serviceInfo: [],
    services: {
      coin: {
        active: true,
        info: null,
      },
      stock: {
        active: true,
        info: null,
      },
    },
    shipInfo: [],
    ship_vx_group: [],
    uuid: "",
    virgin: true,
  },
};

type tDbWxLoginRes = typeof tWxLoginRes;

const tUserInfoRes = {
  access: {
    block: true,
    crypto: true,
    stock: true,
    x: true,
  },
  address: null,
  apiKey: "",
  approval: {
    block: false,
    crypto: true,
    stock: true,
  },
  assets: {
    hulu: {
      gold: 0,
      gold_cum: 0,
      name: "hulu",
      platinum: 0,
      silver: 0,
      silver_cum: 0,
    },
  },
  bbsmid: "",
  clientInfo: ["crypto-0", "crypto-1", "crypto-2"],
  courseDownloadLink: {
    crypto: [
      {
        baidu: "https://pan.baidu.com/s/1yW30EK2dCZiBLMjjfJvyRQ",
        download: "xbx-coin-2020_part1",
        extra: ["https://pan.baidu.com/s/1u6VWkI_OCyB8RDmCEZSxIQ", "wc01"],
        name: "crypto-0",
        pass2: "i9uu",
        title: "初窥门径篇：数字货币介绍",
        version: "更新时间: 2020-03-27",
      },
    ],
    fen: [],
    groups: {
      "bqjcsj-1": [
        {
          ct: "2022-05-01 19:06",
          description: "B圈基础事件小组",
          extra_permissions: [],
          filenames: [],
          id: "626e699df021b5a0b4beded4",
          is_hidden: null,
          location: "bqjcsj-1",
          name: "B圈基础事件小组专属代码",
          path: "",
          require_auth: null,
          ut: "2022-05-01 19:09",
        },
      ],
    },
    services: {},
    stock: [
      {
        baidu: "https://pan.baidu.com/s/1_i327W93yJvee_Ke7BFXQw",
        download: "xbx_stock_2019",
        name: "stock-0",
        pass2: "9vks",
        title: "第一部分",
        version: "更新时间: 2022-01-26",
      },
    ],
  },
  data_perms_advanced: false,
  email: "",
  extra: {
    aiServiceId: "",
  },
  form: {},
  groupInfo: [],
  headimgurl: "https://thirdwx32",
  id: "",
  isMember: true,
  isSciship: null,
  is_approved: true,
  liteClassInfo: [],
  membership: {
    expire: "2026-05-22",
    since: "2025-05-22",
  },
  membershipInfo: ["fen-2025"],
  nickname: "",
  sciship: {},
  serviceInfo: [],
  services: {
    coin: {
      active: true,
      info: null,
    },
    stock: {
      active: true,
      info: null,
    },
  },
  shipInfo: [],
  ship_vx_group: [],
  uuid: "",
  virgin: true,
};

type tDbUserInfoRes = typeof tUserInfoRes;

const tFrameWorkVersionVersionItem = {
  count: 960,
  course: {},
  extra: {
    threads: [],
  },
  file: {
    ct: "2025-01-10 17:10",
    description:
      "### 框架重要功能\n- **支持“纯合约模式”**：多头和空头都是合约。\n- **支持“现货+合约模式”**：多头可以包含现货、合约，空头包含合约。\n- **纯多功能**：全部仓位只买入策略的多头。不交易空头。\n- **统一账户功能**：可以在 `传统的非统一账户` 和 `统一账户`模式 之间选择。任何模式下，原有功能都保留\n- **分钟偏移功能**：支持任意时间开始的小时级别K线\n- **多账户功能**：一个程序可以同时在多个账户下运行策略。\n- **多offset功能**\n\n-----\n\n### 策略级别功能\n- **多策略融合功能（大杂烩）**：一个账户下可以同时运行多个选币策略。例如可以在一个账户下，使用一份资金，运行策略A（参数1）、策略A（参数2）、策略A（参数3）、策略B（参数1）、策略B（参数2）。以此类推。\n- **多策略资金配比功能**：一个账户运行多个策略时，每个策略可以配置不同的资金比例。\n- **多空分离选币**：多头和空头可以使用不一样的策略。\n- **多空分离过滤（前置）**：多头和空头的前置过滤条件可以不同。\n- **多空分离过滤（后置）**：多头和空头的后置过滤条件可以不同。\n- **数据整理支持自定义数据**：支持在策略中加入量价数据之外的任意第三方数据\n\n-----\n\n### 其他功能\n- **自动rebalance功能**。默认开启，可以关闭后手动rebalance\n  - rebalance时，可以设定最小下单量。例如设置为50u，可以显著降低无效换手。\n- **动态拆单功能**\n- **BNB抵扣手续费功能**。开启BNB燃烧，抵扣手续费\n- **小额资产自动兑换BNB功能**\n- **企业微信机器人通知功能**。开启企业微信机器人\n- **交易黑名单与白名单功能**。开启选币黑名单与白名单",
    extra_permissions: [],
    filenames: [],
    id: "6780e3f55bc883b52cb2566d",
    is_hidden: null,
    location: "fen-2025",
    name: "选币策略框架𝓟𝓻𝓸(实盘)v1.2.0",
    path: "",
    require_auth: null,
    ut: "2025-01-10 17:10",
  },
  hidden: false,
  link: "",
  remark: "",
  time: "2025-01-10 17:14",
  title: "",
};
type tDbFrameWorkVersionVersionItem = typeof tFrameWorkVersionVersionItem;

const tFrameWorkItem = {
  category: "basic-code",
  course_name: "fen-2025",
  description: "🔆 高阶选币策略实盘框架，支持超灵活测策略配置和丰富的实盘模式",
  group: "coin",
  id: "6780e5efffed44b938b25671",
  order: 2,
  title: "25分享会-选币实盘框架𝓟𝓻𝓸",
  versions: [tDbFrameWorkVersionVersionItem],
  white: 0,
};

type tDbFrameWorkItem = typeof tFrameWorkItem;

type vFrameWorkVersionItem = {
  frameWorkName: string;
  name: string;
  id: string;
  status: string;
  hidden: boolean;
};

const dataCenterConfigParams = {
  id: "ssss",
  kline_count_1h: 1500,
  error_webhook_url: "http://xxxxxxxxx",
  use_api: { kline: false, coin_cap: false },
  enabled_hour_offsets: ["0m", "5m"],
  funding_rate: true,
  is_first: false,
};

type tDataCenterConfigParams = typeof dataCenterConfigParams & {
  is_debug?: boolean; //策略页面
};

type tDbDataCenterConfigRes = tDataCenterConfigParams & { is_first: boolean };

const tFrameWorkStatusRes = {
  id: 1,
  framework_id: "67c17920385b886f613131b3",
  framework_name: "选币策略框架𝓟𝓻𝓸(实盘)v1.2.0",
  status: "finished",
  type: "data_center",
  time: "2025-01-17 11:22",
  path: "/Users/muzihang/PycharmProjects/qronos/data/firm/7448dc0db7_position-mgmt-trading_v1",
};

type tDbFrameWorkStatusRes = typeof tFrameWorkStatusRes;

// start 启动
// stop 停止
// restart 重启
// log 日志
const dataCenterStatusParams = {
  type: "log",
};

type vDataCenterStatusParams = typeof dataCenterStatusParams & {
  lines?: number;
} & { framework_id: string | number };

const tFactorFileUploadRes = {
  saved_files: [],
};
type tDbFactorFileUploadRes = typeof tFactorFileUploadRes;

const tFramwWorkRunStatusRes = {
  pm_id: 5,
  name: "coin-realtime-data_v1.1.1_realtime_data",
  framework_id: "6859193ccd1ae7cd52424467",
  status: frameWorkRunStatus.online,
  restart_time: 191,
  mem_usage: "0.0MB",
  cpu_usage: "0%",
  pm_uptime: 1751964356166,
};

type tDbFrameWorkRunStatusRes = typeof tFramwWorkRunStatusRes;

const tNewAccountConfigRes = {
  seed_coins: ["ETHUSDT", "ABCUSDT"], //套利底仓设置
  coin_margin: {}, //指定账户中的所有ETH的保证金金额
  order_spot_money_limit: 10, //现货下单最小金额限制
  order_swap_money_limit: 5, //合约下单最小金额限制，
  max_one_order_amount: 100, //最大拆单金额
  twap_interval: 2, //下单间隔
};

const tAccountInfoRes = {
  framework_id: "682d6e8b3adbfebc224d2cac",
  account_name: "账户1",
  account_config: {
    account_type: "普通账户",
    apiKey: "xxxxx",
    secret: "xxxxx",
    if_use_bnb_burn: true, //默认true
    buy_bnb_value: 21,
    if_transfer_bnb: true, //默认true
    hour_offset: "5m",
    wechat_webhook_url: "http://xxxxxxx",
    ...tNewAccountConfigRes,
  },
  min_kline_num: 168,
  get_kline_num: 999,
  leverage: 1,
  black_list: ["A-USDT"],
  white_list: ["B-USDT"],
  is_lock: false,
};

const tStrategyConfigRes = {
  name: "RotationStrategy",
  hold_period: "1H",
  params: {
    factor_list: [
      ["Bias", false, 216, 1],
      ["Bias", false, 840, 1],
    ],
  },
};

const tStrategyPoolRes = [
  {
    name: "浪淘沙多空",
    strategy_list: [
      {
        strategy: "Strategy_大学生",
        offset_list: [15, 5],
        hold_period: "24H",
        is_use_spot: true,
        cap_weight: 0.041666666666666664,
        long_cap_weight: 1,
        short_cap_weight: 0,
        long_select_coin_num: 0.1,
        short_select_coin_num: 0,
        factor_list: [["CirculatingMcap", true, 1, 1]],
        filter_list: [["ZfStd", 48, "pct:<0.8"]],
        filter_list_post: [["ZfMeanQ", 648, "val:>0.5"]],
        use_custom_func: false,
      },
    ],
  },
];

const tEquityRes = {
  time: ["2025-07-06 04:00:00", "2025-07-06 05:00:00"],
  equity_amount: [197.17, 197.18],
  long_pos_val: [0, 0],
  short_pos_val: [-31.08, -31.08],
  long_coin_num: [0, 0],
  short_coin_num: [11, 11, 11, 11, 11],
  net: [0.9, 0.9],
  max2here: [1.01, 1.01],
  dd2here: [-0.14, -0.14],
  long_ratio: [0, 0],
  short_ratio: [0.16, 0.16],
  empty_ratio: [0.84, 0.84],
};

type tDbAccountInfoRes = typeof tAccountInfoRes & {
  strategy_name?: string;
  strategy_config?: typeof tStrategyConfigRes;
  strategy_pool?: (typeof tStrategyPoolRes)[];
  equity?: typeof tEquityRes | null;
  sub_stg_eqs?: {
    [key: string]: {
      candle_begin_time: string[];
      net: number[];
    };
  } | null;
};

const tGlobalConfigDataRes = {
  framework_id: "",
  is_debug: false,
  error_webhook_url: "",
  realtime_data_path: "",
};

type tDbGlobalConfigDataRes = typeof tGlobalConfigDataRes;

const sendApikeyOrSecretParams = {
  framework_id: "xxxx",
  account_name: "xxxxx",
  keyword: "apiKey or secret",
  sort_id: 1,
  content: "abcd",
  total: 4,
};

type tSendApikeyOrSecretParams = typeof sendApikeyOrSecretParams;

const tLockAccountRes = {
  account_name: "账户2",
  is_lock: false,
  operation: "解锁",
  python_file: "账户2.py",
};

type tDbLockAccountRes = typeof tLockAccountRes;

const tHomeAccountInfoRes = {
  // 前端拓展字段
  id: 1,
  selectValue: "合约",
  //跳转到框架页面的id
  edit_id: 1,
  framework_id: "685d01ea59ea5960a881a420",
  framework_name: "仓位管理实盘框架v1.3.3",
  account_name: "账户2",
  hour_offset: "5m",
  strategy_name: null,
  strategy_config: null,
  strategy_pool: [
    {
      name: "浪淘沙多空",
      strategy_list: [
        {
          strategy: "Strategy_大学生多头",
          offset_list: [7, 10],
          hold_period: "24H",
          is_use_spot: true,
          cap_weight: 0.25,
          long_cap_weight: 1,
          short_cap_weight: 0,
          long_select_coin_num: 0.1,
          short_select_coin_num: 0,
          // 因子 因子排序（true升序 false降序） 因子参数 因子权重
          factor_list: [["ZfStd", true, 1, 1]],
          // 过滤因子 过滤因子排序（true升序 false降序） 因子使用条件
          filter_list: [["ZfStd", 15, "pct:<0.8"]],
          // 过滤因子后置 过滤因子排序（true升序 false降序） 因子使用条件
          filter_list_post: [["ZfMeanQ", 1, "val:>0.5"]],
        },
      ],
    },
  ],
  eq_pct_24h: -0.0, //24h账户收益率
  eq_pnl_24h: 0.65, //24h账户盈亏
  eq_max_24h: 197.82, //24h账户最大净值
  eq_min_24h: 196.48, //24h账户最小净值
  equity: {
    time: ["2025-07-06 04:00:00", "2025-07-06 05:00:00"],
    equity_amount: [197.17, 197.18],
    long_pos_val: [0, 0],
    short_pos_val: [-31.08, -31.08],
    long_coin_num: [0, 0],
    short_coin_num: [11, 11, 11, 11, 11],
    net: [0.9, 0.9],
    max2here: [1.01, 1.01],
    dd2here: [-0.14, -0.14],
    long_ratio: [0, 0],
    short_ratio: [0.16, 0.16],
    empty_ratio: [0.84, 0.84],
  },
  // 现货持仓
  pos_spot: [
    {
      symbol: "BTCUSDT", //币种
      side: -1,
      change: "46.51%",
      pos_u: -0.76,
      pnl_u: 0.66,
      avg_price: 0.3155,
      cur_price: 0.1688,
    },
  ],
  // 合约持仓
  pos_swap: [
    {
      symbol: "BTCUSDT",
      side: -1,
      change: "46.51%",
      pos_u: -0.76,
      pnl_u: 0.66,
      avg_price: 0.3155,
      cur_price: 0.1688,
    },
  ],
  sub_stg_eqs: {
    "S1-浪淘沙2多空": {
      candle_begin_time: [], //时间
      net: [], //净值
    },
    "S1-浪淘沙2多空": {
      candle_begin_time: [], //时间
      net: [], //净值
    },
    "S1-浪淘沙2多空": {
      candle_begin_time: [], //时间
      net: [], //净值
    },
  },
};

type tDbHomeAccountInfoRes = typeof tHomeAccountInfoRes;
