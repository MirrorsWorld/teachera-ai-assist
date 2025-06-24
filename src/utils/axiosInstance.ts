// src/utils/request.ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
// import router from '../router'

import { useNavigate } from 'react-router-dom';

import { toast } from "@/hooks/use-toast";

// 创建axios实例
const service = axios.create({
  // baseURL: "http://localhost:5173",
  // baseURL: import.meta.env.VITE_API_URL, // 从环境变量获取基础API地址
  timeout: 15000, // 请求超时时间
  // 设置跨域 Cookie
  withCredentials: true,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    console.error('Request error:', error)
    toast({
      title: "失败",
      description: '请求发送失败'
    })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // const router = useNavigate();
    const res = response.data
    
    // 根据后端返回的状态码进行判断
    if (response.status !== 200) {
      // 特定状态码处理
      switch (response.status) {
        case 401:
          toast({
            title: "失败",
            description: '登录已过期，请重新登录'
          })
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          toast({
            title: "失败",
            description: '没有权限访问'
          })
          break
        case 404:
          toast({
            title: "失败",
            description: '请求的资源不存在'
          })
          break
        case 500:
          toast({
            title: "失败",
            description: '服务器错误'
          })
          break
        default:
          toast({
            title: "失败",
            description: res.message || '请求失败'
          })
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          let msg = '登录已过期，请重新登录'
          if(error.response.data && error.response.data.detail){
            msg = error.response.data.detail.message
          }
          toast({
            title: "失败",
            description: msg
          })
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          toast({
            title: "失败",
            description: '没有权限访问'
          })
          break
        case 404:
          toast({
            title: "失败",
            description: '请求的资源不存在'
          })
          break
        case 500:
          toast({
            title: "失败",
            description: '服务器错误'
          })
          break
        default:
          toast({
            title: "失败",
            description: '请求失败'
          })
      }
    } else if (error.request) {
      toast({
        title: "失败",
        description: '网络连接失败，请检查网络'
      })
    } else {
      toast({
        title: "失败",
        description: '请求配置错误'
      })
    }
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

// 导出axios实例
export { service }