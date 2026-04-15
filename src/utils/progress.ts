// 全局进度条管理

import { ref } from 'vue'

// 进度条状态
const progress = ref(0)
const active = ref(false)
const isError = ref(false)

// 请求计数器
let requestCount = 0
let progressTimer: ReturnType<typeof setInterval> | null = null
/**
 * 开始进度条
 */
export const startProgress = () => {
  requestCount++
  if (requestCount === 1) {
    active.value = true
    isError.value = false
    progress.value = 0
    
    // 清除之前的定时器
    if (progressTimer) clearInterval(progressTimer)
    
    progressTimer = setInterval(() => {
      if (progress.value >= 90) {
        if (progressTimer) clearInterval(progressTimer)
        return
      }
      progress.value = Math.min(progress.value + Math.random() * 10 + 1, 90)
    }, 200)
  }
}

/**
 * 完成进度条
 */
export const finishProgress = () => {
  requestCount = Math.max(0, requestCount - 1)
  if (requestCount === 0) {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
    progress.value = 100
    setTimeout(() => {
      active.value = false
      progress.value = 0
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