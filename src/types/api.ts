import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 定义后端返回数据的通用格式（根据你的实际接口调整）
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 扩展 Axios 请求配置（可选，比如添加自定义配置）
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  // 示例：添加是否显示加载中状态的自定义配置
  showLoading?: boolean
}

// 拦截器请求配置类型（InternalAxiosRequestConfig 是 Axios 内部请求配置类型）
export type CustomInternalRequestConfig = InternalAxiosRequestConfig & CustomAxiosRequestConfig