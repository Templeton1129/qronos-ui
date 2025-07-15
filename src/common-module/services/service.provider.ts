import HttpProvider, {
  contentTypeEnum,
} from "@/common-module/services/http.provider";

export enum frameWorkTypeEnum {
  dataCenter = 0,
  warehouseRealTrading = 1,
  coinRealTrading = 2,
}

export enum dataCenterStatusEnum {
  start = "start",
  stop = "stop",
  restart = "restart",
  // 获取日志
  log = "log",
}

export enum logTypeEnum {
  startup = "实盘",
  delist = "下架监控",
  monitor = "账户监控",
}

export enum frameWorkDownloadStatusEnum {
  notDownloaded = "not_downloaded",
  downloading = "downloading",
  finished = "finished",
  failed = "failed",
}

export enum framwWorkRunStatusEnum {
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

export enum uploadFolderEnum {
  // 时序因子
  factors = "factors",
  // 截面因子
  sections = "sections",
  // 仓管策略
  positions = "positions",
}

export enum frameWorkTypeEnum {
  // 选币
  selectCoin = "select_coin",
  // 仓管
  position = "position",
  // 数据中心
  data_center = "data_center",
}

export enum accountTypeEnum {
  portfolio_margin = "统一账户",
  standard = "普通账户",
}

// 接口返回444 则代表未登录微信 接口返回xbx-Authorization 就能拿去获取userInfo
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

export const CheckGAaToken = (): Promise<iProviderOutputWithT<null>> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputWithT<null> = {
      result: false,
      data: null,
      msg: "",
    };
    HttpProvider.get("/protected", false).then(
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

export const getframWorkVersionList = (): Promise<
  iProviderOutputArrayWithT<vFrameWorkVersionItem>
> => {
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
          output.data = formatFramWorkVersionList(res.data);
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

export const formatFramWorkVersionList = (
  list: tDbFrameWorkItem[]
): vFrameWorkVersionItem[] => {
  let output: vFrameWorkVersionItem[] = [];
  if (list && list.length > 0) {
    list.map((item: tDbFrameWorkItem) => {
      if (item.versions.length > 0) {
        item.versions.map((versionItem: tDbFrameWorkVersionVersionItem) => {
          output.push({
            frameWorkName: item.title,
            name: versionItem.file.name,
            id: versionItem.file.id,
            status: frameWorkDownloadStatusEnum.notDownloaded,
            hidden: versionItem.hidden,
          });
        });
      }
    });
  }

  output = output.filter((item) => item.hidden === false);
  return output;
};

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

export const getAllFrameWorkStatusList = (
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

// home页账户图表数据
export const getHomeAccountInfo = (): Promise<
  iProviderOutputArrayWithT<tDbHomeAccountInfoRes>
> => {
  return new Promise((resolve, reject) => {
    let output: iProviderOutputArrayWithT<tDbHomeAccountInfoRes> = {
      result: false,
      data: [],
      msg: "",
    };
    HttpProvider.get(`/basic_code/all_account/statistics`, false).then(
      (res) => {
        res = res.data;
        if (res.code === 200) {
          output.result = true;

          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].id = i + 1;

              // 排序找最新数据
              if (res.data[i]?.pos_spot) {
                if (JSON.stringify(res.data[i].pos_spot) !== "{}") {
                  const keys = Object.keys(res.data[i].pos_spot);
                  keys.sort((a: string, b: string) => Number(a) - Number(b));
                  res.data[i].pos_spot =
                    res.data[i].pos_spot[keys[keys.length - 1]];
                } else {
                  res.data[i].pos_spot = [];
                }
              }
              if (res.data[i]?.pos_swap) {
                if (JSON.stringify(res.data[i].pos_swap) !== "{}") {
                  const keys = Object.keys(res.data[i].pos_swap);
                  keys.sort((a: string, b: string) => Number(a) - Number(b));
                  res.data[i].pos_swap =
                    res.data[i].pos_swap[keys[keys.length - 1]];
                } else {
                  res.data[i].pos_swap = [];
                }
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

// 策略中心页账户图表数据
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
      `/basic_code/account/statistics?framework_id=${frameworkId}`,
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
