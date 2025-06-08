import type { AxiosRequestConfig } from "axios";
import { service } from "./axiosInstance";


interface RequestOptions extends AxiosRequestConfig {
    loading?: boolean;
  }
  
  /**
   * 封装get方法
   * @param url - 请求地址
   * @param params - 请求参数
   * @param options - 请求配置
   * @returns Promise
   */
  export function get<T = any>(url: string, params = {}, options: RequestOptions = {}) {
    return service.get<T>(url, { params, ...options })
  }
  
  /**
   * 封装post请求
   * @param url - 请求地址
   * @param data - 请求数据
   * @param options - 请求配置
   * @returns Promise
   */
  export function post<T = any>(url: string, data = {}, options: RequestOptions = {}) {
    return service.post<T>(url, data, options)
  }
  
  /**
   * 封装put请求
   * @param url - 请求地址
   * @param data - 请求数据
   * @param options - 请求配置
   * @returns Promise
   */
  export function put<T = any>(url: string, data = {}, options: RequestOptions = {}) {
    return service.put<T>(url, data, options)
  }
  
  /**
   * 封装delete请求
   * @param url - 请求地址
   * @param data - 请求数据
   * @param options - 请求配置
   * @returns Promise
   */
  export function del<T = any>(url: string, data = {}, options: RequestOptions = {}) {
    return service.delete<T>(url, { ...options, data })
  }
  
  // 导出请求方法
  export default {
    get,
    post,
    put,
    del
  }