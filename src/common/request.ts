import axios from "axios"
const TIMEOUT = 1000 * 60;

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

interface HttpRequest {
  url: string;
  data?: object;
  params?: object;
  headers?: object;
  showLoading?: boolean;
  method?: "POST" | "GET";
  // 请求loading遮罩区域
  loadingSelector?: string;
}

interface HttpResponse {
  success?: boolean;
  code?: string;
  data?: object | Array<any>;
  message?: string;
  traceId?: string;
}

const instance = axios.create({
  // 默认开启凭证，带cookie到请求中
  withCredentials: true,
  // 默认10秒超时
  timeout: TIMEOUT,
  headers: {
    // 默认请求格式为JSON
    "Content-Type": "application/json",
    // 默认请求不缓存
    "Cache-Control": "no-cache"
  }
})

// 响应拦截
instance.interceptors.response.use(
  resp => {
    const data = resp.data;
    if (data.success === true || resp.status === 200) {
      return data;
    }
    return Promise.reject(data.message)
  },
  err => {
    return Promise.reject(err)
  }
)

const request = (config: HttpRequest) => {
  if (!config) {
    return;
  }
  return axios(config);
}

const post = (config: HttpRequest) => {
  return new Promise<any>((resolve, reject) => {
    request({
      ...config,
      method: "POST"
    })?.then((res: HttpResponse) => {
      if (res) {
        if (res.success) {
          resolve(res.data);
        } else {
          reject(res.message || "")
        }
      }
    }).catch((err) => {
      reject(err && err.message ? err.message : "请求失败");
    });
  });
}

const get = (config: HttpRequest) => {
  return new Promise<any>((resolve, reject) => {
    request({
      ...config,
      method: "GET"
    })?.then((res: HttpResponse) => {
      if (res) {
        if (res.success) {
          resolve(res.data);
        } else {
          reject(res.message || "")
        }
      }
    }).catch((err) => {
      reject(err && err.message ? err.message : "请求失败");
    });
  });
}

export {
  post,
  get
};