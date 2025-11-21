import HttpProvider, {
  contentTypeEnum,
} from "@/common-module/services/http.provider";

// 数据中心状态
export enum dataCenterStatusEnum {
  start = "start",
  stop = "stop",
  restart = "restart",
  // 获取日志
  log = "log",
}

// 日志类型
export enum logTypeEnum {
  startup = "实盘",
  delist = "下架监控",
  monitor = "账户监控",
}

// 框架下载状态
export enum frameWorkDownloadStatusEnum {
  notDownloaded = "not_downloaded",
  downloading = "downloading",
  finished = "finished",
  failed = "failed",
}

// 框架运行状态
export enum frameWorkRunStatusEnum {
  // 启动
  online = "online",
  // stopped
  stopped = "stopped",
  // error
  errored = "errored",
  // 中间状态！
  starting = "starting",
  stopping = "stopping",
  restarting = "restarting",
}

// 因子类型
export enum uploadFolderEnum {
  // 时序因子
  factors = "factors",
  // 截面因子
  sections = "sections",
  // 仓管策略
  positions = "positions",
  // 择时因子
  signals = "signals",
}

// 框架类型
export enum frameWorkTypeEnum {
  // 选币
  selectCoin = "select_coin",
  // 仓管
  position = "position",
  // 数据中心
  data_center = "data_center",
}

export enum frameworkTypeIdEnum {
  selectCoinId = "6780e5efffed44b938b25671",
  positionId = "678915a96ae722eaa2fe2ca2",
  data_center = "6789163a488832004afe2cda",
}

// 账户类型
export enum accountTypeEnum {
  portfolio_margin = "统一账户",
  standard = "普通账户",
}

export enum dataCenterOperationTypeEnum {
  update_cycle = "更新周期",
  exchange_info = "获取交易所信息",
  market_cap_update = "市值数据更新",
  kline_update = "K线数据更新",
  kline_api = "K线API调用",
  data_api_update = "Date API K线更新",
  preprocessing = "数据预处理",
  pivot_processing = "Pivot表处理",
  kline_merge = "K线合并",
  skip_operation = "跳过操作",
  other = "其他",
}

// 用于时间线
export enum dateCenterOperationStatusEnum {
  in_progress = "进行中",
  completed = "已完成",
  failed = "失败",
  skipped = "跳过",
  unknown = "未知",
}

// rebalance模式
export enum rebalanceModeEnum {
  RebAlways = "每个周期rebalance",
  RebByEquityRatio = "调仓金额大于资产最小金额比例时进行reblance",
  RebByPositionRatio = "调仓金额大于币种持仓最小金额比例时进行rebalance",
}

export const initAccountInfo: tDbAccountInfoRes = {
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
    base_margin: { USDT: 1 } as any,
  },
  min_kline_num: 168,
  get_kline_num: 1500,
  leverage: 1,
  black_list: [],
  white_list: [],
  is_lock: false,
  rebalance_mode: {
    mode: "RebAlways",
    params: {
      min_order_usdt_ratio: 0.1,
    },
  },
};

export enum encryptMethodsEnum {
  aes = "aes",
  base64 = "base64",
  sha256 = "sha256",
  rsa = "rsa",
}

// ---------------登录鉴权相关接口-------------
/**
 * 绑定谷歌验证码
 * @param code 验证码
 * @param google_secret_key 谷歌验证码密钥 只有初次需要传入
 * @returns
 */
export const bindGA = (
  code: string,
  google_secret_key?: string
): Promise<iProviderOutputWithT<tDbBindGaRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbBindGaRes> = {
      result: false,
      data: null,
      msg: "",
    };
    const params: any = { code };
    if (google_secret_key) {
      params["google_secret_key"] = google_secret_key;
    }
    HttpProvider.post("/login", false, params).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg || "";
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 判断是否绑定过Ga和鉴权状态
 * @returns
 */
export const isFirstLogin = (): Promise<
  iProviderOutputWithT<tDbIsFistLoginRes>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbIsFistLoginRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get("/first", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 发送声明
 * @param code 声明码
 * @returns
 */
export const sendCodeDeclaration = (
  code: string
): Promise<iProviderOutputWithT<boolean>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<boolean> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get(`/declaration?code=${code}`, false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 退出登录
 * @returns
 */
export const logout = (): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post("/logout", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg || "";
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.detail;
        resolve(output);
      }
    );
  });
};

/**
 * 微信登录
 * @param client_id 随机id
 * @param nonce 随机数
 * @returns
 */
export const wxLoginApi = (
  client_id: string,
  nonce: string
): Promise<iProviderOutputWithT<tDbWxLoginRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbWxLoginRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post("/user/authorized", true, { client_id, nonce }).then(
      (res: any) => {
        if (res.status === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfoData = (): Promise<
  iProviderOutputWithT<tDbUserInfoRes>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbUserInfoRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post("/user/info", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

// ------------------home页面--------------

/**
 * home页账户图表数据
 * @returns
 */
export const getHomeAccountInfo = (
  day: number
): Promise<iProviderOutputArrayWithT<tDbHomeAccountInfoRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbHomeAccountInfoRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/all_account/statistics?query_days=${day}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;

          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].id = i + 1;
              // 排序找最新数据
              // 持仓现货
              if (res.data[i]?.pos_spot) {
                if (JSON.stringify(res.data[i].pos_spot) !== "{}") {
                  const keys = Object.keys(res.data[i].pos_spot);
                  keys.sort((a: string, b: string) => Number(b) - Number(a));
                  res.data[i].pos_spot = res.data[i].pos_spot[keys[0]];
                } else {
                  res.data[i].pos_spot = [];
                }
              }
              // 持仓合约
              if (res.data[i]?.pos_swap) {
                if (JSON.stringify(res.data[i].pos_swap) !== "{}") {
                  const keys = Object.keys(res.data[i].pos_swap);
                  keys.sort((a: string, b: string) => Number(b) - Number(a));
                  res.data[i].pos_swap = res.data[i].pos_swap[keys[0]];
                } else {
                  res.data[i].pos_swap = [];
                }
              }
              // 盈利/亏损币前五名
              if (res.data[i]?.pnl_history) {
                const keys = Object.keys(res.data[i].pnl_history);
                keys.sort((a: string, b: string) => Number(b) - Number(a));
                res.data[i].pnl_history = res.data[i].pnl_history[keys[0]];
              }
            }
          }
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

// ---------------数据中心-------------------

/**
 * 获取框架版本列表
 * @returns
 */
export const getframWorkVersionList = (
  isDataCenter: boolean = false
): Promise<iProviderOutputArrayWithT<vFrameWorkVersionItem>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<vFrameWorkVersionItem> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/list", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = formatFramWorkVersionList(res.data, isDataCenter);
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 格式化框架版本列表
 * @param list 框架版本列表
 * @returns
 */
export const formatFramWorkVersionList = (
  list: tDbFrameWorkItem[],
  isDataCenter: boolean
): vFrameWorkVersionItem[] => {
  let output: vFrameWorkVersionItem[] = [];
  if (list && list.length > 0) {
    if (isDataCenter) {
      list = list.filter(
        (item: tDbFrameWorkItem) => item.id === frameworkTypeIdEnum.data_center
      );
    } else {
      list = list.filter(
        (item: tDbFrameWorkItem) => item.id !== frameworkTypeIdEnum.data_center
      );
    }

    list.map((item: tDbFrameWorkItem) => {
      if (item.versions.length > 0) {
        // 先根据时间倒叙排序
        item.versions.sort(
          (
            a: tDbFrameWorkVersionVersionItem,
            b: tDbFrameWorkVersionVersionItem
          ) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
          }
        );
        item.versions.map((versionItem: tDbFrameWorkVersionVersionItem) => {
          output.push({
            // 分类id
            classId: item.id,
            frameWorkName: item.title,
            name: versionItem.file.name,
            id: versionItem.file.id,
            status: frameWorkDownloadStatusEnum.notDownloaded,
            hidden: versionItem.hidden,
            time: versionItem.time,
          });
        });
      }
    });
  }
  // 过滤掉已经下架的
  output = output.filter((item) => item.hidden === false);
  return output;
};

/**
 * 获取数据中心配置
 * @param framework_id 框架id
 * @returns
 */
export const getDataCenterConfig = (
  framework_id: string
): Promise<iProviderOutputWithT<tDbDataCenterConfigRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbDataCenterConfigRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get("/basic_code/query_config", false, {
      framework_id: framework_id,
    }).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 编辑数据中心配置
 * @param configObj 配置对象
 * @returns
 */
export const editDataCenterConfig = (
  configObj: tDataCenterConfigParams
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post("/save_config/data_center", false, configObj).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 更新数据中心配置
 * @param configObj 配置对象
 * @returns
 */
export const updataDataCenterConfig = (
  configObj: tDataCenterConfigParams
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.put("/save_config/data_center", false, configObj).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取框架下载状态列表
 * @param isSelectDataCenterType 是否只要数据中心
 * @returns
 */
export const getFrameWorkStatus = (
  isSelectDataCenterType: boolean = false
): Promise<iProviderOutputArrayWithT<tDbFrameWorkStatusRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbFrameWorkStatusRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/download/status", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true; // 过滤 排序
          if (isSelectDataCenterType == true) {
            res.data = res.data
              .filter(
                (item: tDbFrameWorkStatusRes) => item.type === "data_center"
              )
              .sort((a: tDbFrameWorkStatusRes, b: tDbFrameWorkStatusRes) => {
                return new Date(b.time).getTime() - new Date(a.time).getTime();
              });
          } else {
            res.data = res.data
              .filter(
                (item: tDbFrameWorkStatusRes) =>
                  item.type !== "data_center" && item.status !== "failed"
              )
              .reverse();
          }
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

// ----------------框架管理------------------------
/**
 * 获取所有框架状态列表
 * @returns
 */
export const getAllFrameWorkStatusList = (): Promise<
  iProviderOutputArrayWithT<tDbFrameWorkStatusRes>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbFrameWorkStatusRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/download/status", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true; // 过滤 排序

          res.data = res.data
            .filter((item: tDbFrameWorkStatusRes) => item.status !== "failed")
            .reverse();
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 启动或停止框架
 * @param configObj 配置对象
 * @returns
 */
export const startOrStopFrameWork = (
  configObj: vDataCenterStatusParams
): Promise<iProviderOutputWithT<string>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<string> = {
      result: false,
      data: "",
      msg: "",
    };
    HttpProvider.post("/basic_code/operate", false, configObj).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 下载框架版本
 * @param framework_id 框架id
 * @returns
 */
export const addFrameWorkVersion = (
  framework_id: string
): Promise<iProviderOutputWithT<string | null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<string | null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get("/basic_code/download", false, {
      framework_id: framework_id,
    }).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 上传因子文件夹
 * @param framework_id 框架id
 * @param upload_folder 因子类型
 * @param formData 文件数据
 * @returns
 */
export const uploadFiles = (
  framework_id: string,
  upload_folder: string,
  formData: FormData
): Promise<iProviderOutputWithT<tDbFactorFileUploadRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbFactorFileUploadRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post(
      `/basic_code/upload/file?framework_id=${framework_id}&upload_folder=${upload_folder}`,
      false,
      formData,
      {
        contentType: contentTypeEnum.formData,
      }
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取因子文件列表
 * @param framework_id 框架id
 * @param upload_folder 因子类型
 * @returns
 */
export const getUploadFiles = (
  framework_id: string,
  upload_folder: string
): Promise<iProviderOutputArrayWithT<string>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<string> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/file/list", false, {
      framework_id: framework_id,
      upload_folder: upload_folder,
    }).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取框架运行状态
 * @returns
 */
export const getFrameWorkRunStatus = (): Promise<
  iProviderOutputArrayWithT<tDbFrameWorkRunStatusRes>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbFrameWorkRunStatusRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/status", false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          res.data.forEach((item: tDbFrameWorkRunStatusRes) => {
            if (typeof item.name === "string") {
              const parts = item.name.split("_");
              item.name = parts[parts.length - 1];
            }
          });
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取账户列表
 * @param frameWorkId 框架id
 * @returns
 */
export const getAccountInfo = (
  frameWorkId: string
): Promise<iProviderOutputArrayWithT<tDbAccountInfoRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbAccountInfoRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get("/basic_code/account/list", false, {
      framework_id: frameWorkId,
    }).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 添加或编辑账户
 * @param accountInfo 账户信息
 * @returns
 */
export const addOrEditAccountInfo = (
  accountInfo: tDbAccountInfoRes
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post("/basic_code/account", false, accountInfo).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 删除账户
 * @param framework_id 框架id
 * @param account_name 账户名称
 * @returns
 */
export const deleteAccount = (
  framework_id: string,
  account_name: string
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.delete(
      `/basic_code/account?framework_id=${framework_id}&account_name=${account_name}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 账户添加策略
 * @param framework_id 框架id
 * @param account_name 账户名称
 * @param formData 策略数据（config.py文件）
 * @returns
 */
export const accountBindStrategy = (
  framework_id: string,
  account_name: string,
  formData: FormData
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post(
      `/basic_code/account_binding_strategy?framework_id=${framework_id}&account_name=${account_name}`,
      false,
      formData,
      {
        contentType: contentTypeEnum.formData,
      }
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 编辑全局配置
 * @param params 配置对象
 * @returns
 */
export const editGlobalConfig = (
  params: object
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post(`/basic_code/global_config`, false, params).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 添加或编辑apikey和secret
 * @param params 配置对象
 * @returns
 */
export const splitSendApikeyOrSecret = (
  params: tSendApikeyOrSecretParams
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post(`/basic_code/account/apikey_secret`, false, params).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 锁定(启用/禁用)账户
 * @param framework_id 框架id
 * @param account_name 账户名称
 * @param is_lock 是否锁定（true:锁定，false:启用）
 * @returns
 */
export const lockAccount = (
  framework_id: string,
  account_name: string,
  is_lock: boolean
): Promise<iProviderOutputWithT<tDbLockAccountRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<tDbLockAccountRes> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/account/lock?framework_id=${framework_id}&account_name=${account_name}&is_lock=${is_lock}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 策略中心页账户图表数据
 * @param frameworkId 框架id
 * @returns
 */
export const getAccountInfoChart = (
  frameworkId: string
): Promise<iProviderOutputArrayWithT<tDbHomeAccountInfoRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbHomeAccountInfoRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/account/statistics?framework_id=${frameworkId}&query_days=0`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取数据中心更新状态列表（分钟偏移量）
 * @param frameworkId 框架id
 * @param hours 小时
 * @returns
 */
export const getDateCenterUpdateStatusList = (
  frameworkId: string,
  hours: number
): Promise<iProviderOutputArrayWithT<tDbDataCenterUpdateStatusRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbDataCenterUpdateStatusRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(
      `/data_center/operations?framework_id=${frameworkId}&hours=${hours}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data?.task_blocks.reverse() || [];
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 框架数据迁移
 * @param oldFrameworkId 旧框架id
 * @param newFrameworkId 新框架id
 * @returns
 */
export const frameWorkDataMigration = (
  oldFrameworkId: string,
  newFrameworkId: string
): Promise<iProviderOutputArrayWithT<tDbDataCenterUpdateStatusRes>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbDataCenterUpdateStatusRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/data/migration?raw_framework_id=${oldFrameworkId}&target_framework_id=${newFrameworkId}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 删除框架
 * @param frameworkId 框架id
 * @returns
 */
export const deleteFrameWork = (
  frameworkId: string
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.delete(`/basic_code?framework_id=${frameworkId}`, false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取设备列表
 * @returns
 */
export const getDeviceList = (): Promise<
  iProviderOutputArrayWithT<tDbDeviceInfo>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbDeviceInfo> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(`/user/devices`, false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data?.devices || [];
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 踢掉设备
 * @param device_id
 * @param google_code
 * @returns
 */
export const deleteDevice = (
  device_id: string,
  google_code: string
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.delete(
      `/user/device?device_id=${device_id}&google_code=${google_code}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 数据中心更新
 */
export const updateDataCenter = (): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/data_center/upgrade`,
      false,
      {},
      {
        timeoutSeconds: 3 * 60,
      }
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 获取导出的框架压缩包名
 * @param frameWorkId
 * @returns
 */
export const getExportFrameWorkZipName = (
  frameWorkId: string
): Promise<iProviderOutputWithT<string>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<string> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/data/export?framework_id=${frameWorkId}`,
      false
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data.filename || "";
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

/**
 * 下载压缩包
 * @param filename 压缩包名
 * @returns
 */
export const getExportFrameWorkZip = (
  filename: string
): Promise<iProviderOutputWithT<any>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<any> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get(
      `/basic_code/data/download?filename=${filename}`,
      false,
      {},
      {
        responseType: "blob",
      }
    ).then(
      (res) => {
        output.result = true;
        output.data = res.data;

        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};

export const importFrameWorkZip = (
  framework_id: string,
  formData: FormData
): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.post(
      `/basic_code/data/import?framework_id=${framework_id}`,
      false,
      formData,
      {
        contentType: contentTypeEnum.formData,
      }
    ).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;
          output.data = res.data;
        } else {
          output.msg = res.msg;
        }
        resolve(output);
      },
      (err) => {
        output.msg = err.msg;
        resolve(output);
      }
    );
  });
};
