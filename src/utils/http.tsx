import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from "axios";
// eslint-disable-next-line
type JSONValue = string | number | null | boolean | JSONValue[] | { [key: string]: JSONValue };

export class Http {
  instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 5000 // 设置超时时间为10秒
    });
  }

  get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>) {
    return this.instance.request<R>({...config, url, params: query, method: 'get'});
  }

  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'data' | 'url' | 'method'>) {
    return this.instance.request<R>({...config, url, data, method: 'post'});
  }

  // update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data'>) {
    return this.instance.request<R>({...config, url, data, method: 'patch'})
  }

  // destroy
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'>) {
    return this.instance.request<R>({...config, url: url, params: query, method: 'delete'})
  }
}

const currentUrl = window.location.protocol + '//' + window.location.host + '/action';
const BASE_URL = import.meta.env ? '/action' : currentUrl
const API_BASE_URL = 'https://shop.lebai.ltd/api/robotapi'
export const http = new Http(BASE_URL);

http.instance.interceptors.response.use(response => {
  return response
}, (error) => {
  if (error.response) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 429) {
    }
  }
  throw error
})

export const apiHttp = new Http(API_BASE_URL)
apiHttp.instance.interceptors.response.use(response => {
  return response
}, (error) => {
  if (error.response) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 429) {
    }
  }
  throw error
})
