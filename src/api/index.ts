// 核心修改：分别导入默认的 request 函数和命名导出的 get/post 方法
import request, { get, post } from '@/utils/request'

// 统一导出各模块接口（注意：你之前写的是 ./modules/login，需确认文件存在）
export * from './modules/login'
export * from './modules/menu'
// 可选：重新导出通用请求方法，方便其他模块使用
export { request, get, post }