import axios, { type AxiosInstance, type AxiosError, } from 'axios' 
import type { CustomAxiosRequestConfig, CustomInternalRequestConfig, ApiResponse } from '../types/api'
import { ElMessage } from 'element-plus' // 结合 Element Plus 提示/加载
import { storageToken } from './storage' // 导入 Token 快捷方法
import { startProgress, finishProgress, failProgress } from './progress'
import router from '@/router'
/**
 * 响应拦截器
 * 
 * 【前端视角理解后端】
 * - 后端返回的格式是 { code: 200, data: xxx, msg: '成功' }
 * - code === 200 表示成功，其他都是失败
 * - 401 表示 token 失效或没有权限
 * 
 * 这就是前后端约定的“接口协议”
 */
// 扩展 Window 接口以包含自定义属性
declare global {
  interface Window {
    hasShownAuthError?: boolean
  }
}

// 权限错误处理状态
let authErrorHandled = false
let authErrorTimer: any = null

// 创建 Axios 实例（指定自定义请求配置类型）
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 环境变量（VITE_ 开头）
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器（严格类型约束）
service.interceptors.request.use(
  (config: CustomInternalRequestConfig) => {
    // 处理自定义配置：显示顶部进度条
    if (config.showLoading !== false) {
      startProgress()
    }
    const token = storageToken.get()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    // 请求发送失败时也完成进度条
    failProgress()
    ElMessage.error('请求发送失败：' + error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器（严格类型约束）
service.interceptors.response.use(
  (response: any) => {
    // 完成进度条
    finishProgress()

    const res = response.data
    // 业务逻辑判断（根据实际接口状态码调整）
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  (error: AxiosError) => {
    // 失败进度条
    failProgress()

    // 统一处理网络错误
    // 补充类型断言，避免 error.response?.data 报 any 类型
    const errMsg = (error.response?.data as ApiResponse)?.msg || error.message || '服务器错误'
    
    // 处理 401 和 403 状态码
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 使用防抖机制：短时间内只处理一次权限错误
      if (!authErrorHandled) {
        authErrorHandled = true
        
        // 使用微任务确保在当前事件循环结束后执行
        Promise.resolve().then(() => {
          // 只弹一次消息通知
          ElMessage.error('没有权限，请联系管理员添加权限')
          
          // 跳转到 401 页面
          if (router.currentRoute.value.path !== '/401') {
            router.replace('/401')
          }
        })
        
        // 设置定时器，3秒后重置状态
        if (authErrorTimer) {
          clearTimeout(authErrorTimer)
        }
        authErrorTimer = setTimeout(() => {
          authErrorHandled = false
          authErrorTimer = null
        }, 3000)
      }
      
      return Promise.reject(error)
    }
    
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