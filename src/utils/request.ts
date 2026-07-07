import type { BaseResp } from "@/types/apiTypes";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { errorToast } from "./popup";
import { getToken } from "./auth";

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 接口响应错误捕获处理
const apiErrorHandler = (err: AxiosError<BaseResp>) => {
  console.error(err);

  // 统一处理接口报错
  const { msg, errorCode } = err.response?.data ?? {};
  errorToast(`ErrorCode:${errorCode} ${msg}`);
};

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["token"] = token;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(
  (result) => result.data,
  (err) => {
    apiErrorHandler(err);
    return Promise.reject(err);
  },
);

const request = <Req = unknown, Resp = unknown>(
  config: AxiosRequestConfig<Req>,
) => instance<Req, Resp>(config).catch((err) => Promise.reject(err));

export default request;
