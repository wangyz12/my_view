// 全局进度条管理

import { ref } from 'vue'

// 进度条状态
const progress = ref(0)
const active = ref(false)
const isError = ref(false)

// 请求计数器
let requestCount = 0

/**
 * 开始进度条
 */
export const startProgress = () => {
  requestCount++
  if (requestCount === 1) {
    active.value = true
    isError.value = false
    progress.value = 0
    
    // 模拟进度条增长
    const interval = setInterval(() => {
      if (progress.value >= 90) {
        clearInterval(interval)
        return
      }
      
      // 非线性增长，让进度条看起来更自然
      const increment = Math.random() * 10 + 1
      progress.value = Math.min(progress.value + increment, 90)
    }, 200)
  }
}

/**
 * 完成进度条
 */
export const finishProgress = () => {
  requestCount = Math.max(0, requestCount - 1)
  if (requestCount === 0) {
    progress.value = 100
    isError.value = false
    
    // 延迟隐藏进度条
    setTimeout(() => {
      active.value = false
      setTimeout(() => {
        progress.value = 0
      }, 300)
    }, 300)
  }
}

/**
 * 失败进度条
 */
export const failProgress = () => {
  requestCount = Math.max(0, requestCount - 1)
  if (requestCount === 0) {
    progress.value = 100
    isError.value = true
    
    // 延迟隐藏进度条
    setTimeout(() => {
      active.value = false
      setTimeout(() => {
        progress.value = 0
        isError.value = false
      }, 300)
    }, 300)
  }
}

/**
 * 重置进度条（用于异常情况）
 */
export const resetProgress = () => {
  requestCount = 0
  active.value = false
  progress.value = 0
  isError.value = false
}

export const useProgress = () => {
  return {
    progress,
    active,
    isError,
    startProgress,
    finishProgress,
    failProgress,
    resetProgress
  }
}