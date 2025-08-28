import axios from "axios";
import qs from "qs";
import type {
  CancelTokenSource as tAxiosCancelTokenSource,
  AxiosRequestConfig as tAxiosRequestConfig,
  ResponseType as tAxiosResponseType,
} from "axios";
import { emitGlobalError } from "@/common-module/utils";
import { useStorageValueOrFn } from "@/common-module/hooks/getOrSetStorage";
import { useNetworkStore } from "@/store/network";

const { sessionGAtoken, localStorageWxtoken, userInfo } = useStorageValueOrFn();

export enum contentTypeEnum {
  wwwFormUrlencoded = "application/x-www-form-urlencoded;charset=UTF-8",
  json = "application/json;charset=UTF-8",
  formData = "multipart/form-data",
}

// 动态获取 API 前缀
const getApiPrefix = (): string => {
  // 检查是否为开发环境
  const isDev = import.meta.env.VITE_APP_ENV === "development";

  // 开发环境下从全局常量获取（vite 定义的）
  if (isDev && typeof __API_PREFIX__ !== "undefined" && __API_PREFIX__) {
    return __API_PREFIX__;
  }

  // 生产环境或开发环境 fallback：从 base 标签获取
  const baseElement = document.querySelector("base");
  if (baseElement && baseElement.href) {
    const url = new URL(baseElement.href);
    const pathname = url.pathname;
    // 移除开头和结尾的斜杠，获取 API 前缀
    return pathname.replace(/^\/|\/$/g, "");
  }

  return "";
};

// 构建 API 基础路径
const buildApiBaseUrl = (endpoint: string): string => {
  const prefix = getApiPrefix();
  if (prefix) {
    return `/${prefix}/${endpoint}`;
  }
  return `/${endpoint}`;
};

const flaskBaseUrl = buildApiBaseUrl("flask");
const apiBaseUrl = buildApiBaseUrl("api");

export interface iHttpOptions {
  /**
   * const resAxiosCancelTokenSourceInstance = axios.CancelToken.source();
   * resAxiosCancelTokenSourceInstance.cancel();
   */
  axiosCancelTokenSourceInstance?: tAxiosCancelTokenSource;
  baseUrl?: string;
  contentType?: contentTypeEnum;
  timeoutSeconds?: number;
  responseType?: tAxiosResponseType;
}

axios.interceptors.request.use(
  (req) => {
    // 开始计时
    const networkStore = useNetworkStore();
    networkStore.setRequestStartTime();

    // 处理一个特殊接口
    if (req.url?.includes("/user/info")) {
      const wxToken = localStorageWxtoken.value;
      if (wxToken) {
        req.headers[`xbx-Authorization`] = wxToken; // [mk] miss will cause invaild token issue
      }
    } else if (req.url?.includes("/user/authorized")) {
      return req;
    }

    const GAToken = sessionGAtoken.value;
    if (GAToken) {
      req.headers.Authorization = `Bearer ${GAToken}`;
    }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  /**
   * 成功响应处理
   */
  (response) => {
    // 计算网络延迟
    const networkStore = useNetworkStore();
    networkStore.calculateLatency();

    // 检查响应头是否有 x-refresh-token
    const refreshToken =
      response.headers["x-refresh-token"] ||
      response.headers["X-Refresh-Token"] ||
      response.headers["X-REFRESH-TOKEN"];
    if (refreshToken) {
      // 更新本地 GAToken
      sessionGAtoken.value = refreshToken;
    }

    let errorMessage = "请求失败";
    const data = response.data;
    // 从data中获取错误详情，如果后端返回了detail/message字段
    const serverMessage =
      data?.detail || data?.message || data?.msg || data?.error;

    switch (data?.code) {
      case 400:
        errorMessage = serverMessage || "请求参数错误";
        emitGlobalError(errorMessage);
        break;
      case 401: {
        errorMessage = serverMessage || "未授权，请登录";
        emitGlobalError(errorMessage);
        sessionStorage.removeItem("gaToken");
        sessionGAtoken.value = null;
        window.dispatchEvent(
          new CustomEvent("global-navigate", { detail: "/login" })
        );
        break;
      }
      case 444: {
        errorMessage = serverMessage || "请先绑定微信";
        emitGlobalError(errorMessage);
        localStorageWxtoken.value = null;
        userInfo.value = null;
        window.dispatchEvent(
          new CustomEvent("global-navigate", { detail: "/bindWx" })
        );
        break;
      }
      case 403:
        errorMessage = serverMessage || "拒绝访问";
        emitGlobalError(errorMessage);
        break;
      case 404:
        errorMessage = serverMessage || "请求资源不存在";
        emitGlobalError(errorMessage);
        break;
      case 500:
        errorMessage = serverMessage || "服务器内部错误";
        emitGlobalError(errorMessage);
        break;
    }
    return response;
  },
  /**
   * 错误响应处理
   * HTTP状态码不为200的情况
   */
  (error) => {
    // HTTP状态码不在2xx范围内的处理
    let errorMessage = "请求失败";

    if (error.response) {
      // 服务器有响应
      const { status, data } = error.response;

      // 从data中获取错误详情，如果后端返回了detail/message字段
      const serverMessage =
        data?.detail || data?.message || data?.msg || data?.error;
      // 根据HTTP状态码显示不同错误

      switch (status) {
        case 400:
          errorMessage = serverMessage || "请求参数错误";
          break;
        case 401: {
          errorMessage = serverMessage || "未授权，请登录";
          sessionStorage.removeItem("gaToken");
          sessionGAtoken.value = null;
          window.dispatchEvent(
            new CustomEvent("global-navigate", { detail: "/login" })
          );
          break;
        }
        case 444: {
          errorMessage = serverMessage || "请先绑定微信";
          localStorageWxtoken.value = null;
          userInfo.value = null;
          // window.location.href = "/bindWx";
          window.dispatchEvent(
            new CustomEvent("global-navigate", { detail: "/bindWx" })
          );
          break;
        }
        case 403:
          errorMessage = serverMessage || "拒绝访问";
          break;
        case 404:
          errorMessage = serverMessage || "请求资源不存在";
          break;
        case 500:
          errorMessage = serverMessage || "服务器内部错误";
          break;
        default:
          errorMessage = serverMessage || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = "网络异常，请检查网络连接";
    } else {
      // 请求配置出错
      errorMessage = error.message || "请求配置错误";
    }
    emitGlobalError(errorMessage);

    return Promise.reject(error);
  }
);

const httpProvider = {
  get: (
    url: string,
    isAPI = false,
    queryStringObj = {},
    {
      baseUrl = isAPI ? apiBaseUrl : flaskBaseUrl,
      contentType = contentTypeEnum.wwwFormUrlencoded,
      timeoutSeconds = 30,
      responseType = "json",
    }: iHttpOptions = {}
  ): Promise<iServerResponseWithT<any>> => {
    const config: tAxiosRequestConfig = {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": contentType,
      },
      url: `${baseUrl}${url}`,
      params: queryStringObj,
      timeout: timeoutSeconds * 1000,
      responseType: responseType,
    };

    return axios(config);
  },
  post: (
    url: string,
    isAPI = false,
    requestBodyObj = {},
    {
      axiosCancelTokenSourceInstance = axios.CancelToken.source(),
      baseUrl = isAPI ? apiBaseUrl : flaskBaseUrl,
      contentType = contentTypeEnum.json,
      timeoutSeconds = 30,
      responseType = "json",
    }: iHttpOptions = {}
  ): Promise<iServerResponseWithT<any>> => {
    const config: tAxiosRequestConfig = {
      method: "POST",
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": contentType,
      },
      url: `${baseUrl}${url}`,
      data:
        contentType === contentTypeEnum.wwwFormUrlencoded
          ? qs.stringify(requestBodyObj)
          : requestBodyObj,
      timeout: timeoutSeconds * 1000,
      responseType: responseType,
      cancelToken: axiosCancelTokenSourceInstance.token,
    };

    return axios(config);
  },
  put: (
    url: string,
    isAPI = false,
    requestBodyObj = {},
    {
      baseUrl = isAPI ? apiBaseUrl : flaskBaseUrl,
      contentType = contentTypeEnum.json,
      timeoutSeconds = 30,
      responseType = "json",
    }: iHttpOptions = {}
  ): Promise<iServerResponseWithT<any>> => {
    const config: tAxiosRequestConfig = {
      method: "PUT",
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": contentType,
      },
      url: `${baseUrl}${url}`,
      data:
        contentType === contentTypeEnum.wwwFormUrlencoded
          ? qs.stringify(requestBodyObj)
          : requestBodyObj,
      timeout: timeoutSeconds * 1000,
      responseType: responseType,
    };

    return axios(config);
  },
  delete: (
    url: string,
    isAPI = false,
    requestBodyObj = {},
    {
      baseUrl = isAPI ? apiBaseUrl : flaskBaseUrl,
      contentType = contentTypeEnum.json,
      timeoutSeconds = 30,
      responseType = "json",
    }: iHttpOptions = {}
  ): Promise<iServerResponseWithT<any>> => {
    const config: tAxiosRequestConfig = {
      method: "DELETE",
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": contentType,
      },
      url: `${baseUrl}${url}`,
      data:
        contentType === contentTypeEnum.wwwFormUrlencoded
          ? qs.stringify(requestBodyObj)
          : requestBodyObj,
      timeout: timeoutSeconds * 1000,
      responseType: responseType,
    };

    return axios(config);
  },
  upload: (
    url: string,
    isAPI = false,
    formData = new FormData(),
    {
      baseUrl = flaskBaseUrl,
      contentType = contentTypeEnum.formData,
      timeoutSeconds = 30,
      responseType = "json",
    }: iHttpOptions = {}
  ): Promise<iServerResponseWithT<any>> => {
    return httpProvider.post(url, isAPI, formData, {
      baseUrl,
      contentType,
      timeoutSeconds,
      responseType,
    });
  },
};

export default httpProvider;
