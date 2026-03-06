// src/utils/request.ts
import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios' // 关键：添加 AxiosResponse 导入
import type { CustomAxiosRequestConfig, CustomInternalRequestConfig, ApiResponse } from '../types/api'
import { ElMessage, ElLoading } from 'element-plus' // 结合 Element Plus 提示/加载
import { storageToken } from './storage' // 导入 Token 快捷方法
// 创建 Axios 实例（指定自定义请求配置类型）
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 环境变量（VITE_ 开头）
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 加载中实例（用于全局加载状态）
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

// 请求拦截器（严格类型约束）
service.interceptors.request.use(
  (config: CustomInternalRequestConfig) => {
    // 处理自定义配置：显示加载中
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    }
    const token = storageToken.get()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    ElMessage.error('请求发送失败：' + error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器（严格类型约束）
service.interceptors.response.use(
  (response: any) => {
    // 关闭加载中
    if (loadingInstance) loadingInstance.close()

    const res = response.data
    // 业务逻辑判断（根据实际接口状态码调整）
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  (error: AxiosError) => {
    // 关闭加载中
    if (loadingInstance) loadingInstance.close()

    // 统一处理网络错误
    // 补充类型断言，避免 error.response?.data 报 any 类型
    const errMsg = (error.response?.data as ApiResponse)?.msg || error.message || '服务器错误'
    ElMessage.error(`请求错误：${errMsg}`)
    return Promise.reject(error)
  }
)

// 封装通用请求方法（暴露给业务层，带类型约束）
const request = <T = any>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> => {
  return service(config)
}

// 封装 GET/POST 快捷方法（可选，简化调用）
export const get = <T = any>(
  url: string,
  params?: Record<string, any>,
  config?: CustomAxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, url, method: 'GET', params })
}

export const post = <T = any>(
  url: string,
  data?: Record<string, any>,
  config?: CustomAxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, url, method: 'POST', data })
}

export default request