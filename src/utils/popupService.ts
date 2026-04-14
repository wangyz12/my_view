import { createApp, ref, type Component, h, type App } from 'vue'
import { ElDialog, ElButton } from 'element-plus'

/**
 * 弹窗配置选项
 */
export interface PopupOptions {
  title?: string
  width?: string | number
  showClose?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  appendTo?: HTMLElement | string
  className?: string
  beforeClose?: (done: () => void) => void
  /** 弹窗关闭后的回调（无论成功/取消/关闭） */
  onClosed?: () => void
  /** 弹窗成功回调（点击确认/提交等） */
  onSuccess?: (data: any) => void
  /** 弹窗取消回调 */
  onCancel?: () => void
  // 同时支持简写方式
  /** 弹窗成功回调（简写） */
  success?: (data: any) => void
  /** 弹窗关闭回调（简写） */
  close?: () => void
  /** 弹窗取消回调（简写） */
  cancel?: () => void
}

/**
 * 弹窗返回结果
 */
export interface PopupResult<T = any> {
  /** 是否成功（用户点击确认/提交） */
  success: boolean
  /** 取消或关闭时的类型：cancel-取消, close-关闭 */
  type?: 'cancel' | 'close'
  /** 成功时返回的数据 */
  data?: T
}

/**
 * 默认配置
 */
const defaultOptions: PopupOptions = {
  title: '提示',
  width: '500px',
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  appendTo: document.body,
}

// 存储所有活跃的弹窗实例
const activePopups = new Set<{ destroy: () => void }>()

/**
 * 关闭所有弹窗
 */
export function closeAllPopups() {
  activePopups.forEach(popup => {
    popup.destroy()
  })
  activePopups.clear()
}

/**
 * 显示弹窗
 * @param component 要显示的组件
 * @param props 传递给组件的属性
 * @param options 弹窗配置
 * @returns Promise<PopupResult> 返回弹窗结果，始终 resolve 不会 reject
 */
export function showPopup<P extends Record<string, any> = Record<string, any>>(
  component: Component,
  props?: P,
  options?: PopupOptions
): Promise<PopupResult> {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }
  
  return new Promise((resolve) => {
    let isResolved = false
    let app: App | null = null
    let container: HTMLDivElement | null = null
    
    // 创建容器
    container = document.createElement('div')
    container.className = 'popup-service-container'
    
    // 确定挂载点
    const appendTo = typeof mergedOptions.appendTo === 'string'
      ? document.querySelector(mergedOptions.appendTo) || document.body
      : mergedOptions.appendTo || document.body
    
    appendTo.appendChild(container)
    
    // 响应式数据
    const visible = ref(true)
    
    // 清理函数
    const destroyPopup = () => {
      if (app) {
        app.unmount()
        app = null
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
        container = null
      }
      activePopups.delete({ destroy: destroyPopup })
    }
    
    // 处理弹窗关闭
    const handleClose = (type: 'success' | 'cancel' | 'close', data?: any) => {
      if (isResolved) return
      isResolved = true
      
      visible.value = false
      
      let result: PopupResult
      
      if (type === 'success') {
        result = { success: true, data }
        // 同时支持两种回调
        mergedOptions.onSuccess?.(data)
        mergedOptions.success?.(data)
      } else if (type === 'cancel') {
        result = { success: false, type: 'cancel' }
        mergedOptions.onCancel?.()
        mergedOptions.cancel?.()
      } else {
        result = { success: false, type: 'close' }
        mergedOptions.onClosed?.()
        mergedOptions.close?.()
      }
      
      resolve(result)
    }
    
    // 处理 beforeClose 逻辑
    const handleBeforeClose = (done: () => void): void => {
      if (mergedOptions.beforeClose) {
        mergedOptions.beforeClose(done)
      } else {
        done()
      }
    }
    
    // 创建 Vue 应用
    app = createApp({
      name: 'PopupWrapper',
      setup() {
        const handleSuccess = (data?: any) => {
          handleBeforeClose(() => {
            handleClose('success', data)
          })
        }
        
        const handleCancel = () => {
          handleBeforeClose(() => {
            handleClose('cancel')
          })
        }
        
        const handleCloseEvent = () => {
          handleBeforeClose(() => {
            handleClose('close')
          })
        }
        
        return () => {
          // 同时支持两种命名方式
          const contentVNode = h(component, {
            ...(props || {}),
            // 完整命名
            onSuccess: handleSuccess,
            onCancel: handleCancel,
            onClose: handleCloseEvent,
            // 简写命名
            success: handleSuccess,
            cancel: handleCancel,
            close: handleCloseEvent,
            popupInstance: {
              close: () => handleCloseEvent(),
              destroy: destroyPopup,
            },
          })
          
          // 修复 TypeScript 错误：使用 as any 绕过类型检查
          const dialogProps: any = {
            modelValue: visible.value,
            'onUpdate:modelValue': (val: boolean) => {
              if (!val) {
                handleBeforeClose(() => {
                  handleClose('close')
                })
              }
              visible.value = val
            },
            title: mergedOptions.title,
            width: mergedOptions.width,
            closeOnClickModal: mergedOptions.closeOnClickModal,
            closeOnPressEscape: mergedOptions.closeOnPressEscape,
            showClose: mergedOptions.showClose,
            destroyOnClose: true,
            appendToBody: true,
            class: mergedOptions.className,
            onClosed: () => {
              destroyPopup()
            },
          }
          
          return h(ElDialog, dialogProps, {
            default: () => contentVNode,
          })
        }
      },
    })
    
    app.mount(container)
    
    activePopups.add({ destroy: destroyPopup })
  })
}

/**
 * 确认弹窗组件
 */
const ConfirmDialog = {
  name: 'ConfirmDialog',
  props: {
    message: { type: String, required: true },
    title: { type: String, default: '确认' },
    confirmText: { type: String, default: '确认' },
    cancelText: { type: String, default: '取消' },
    confirmType: { type: String, default: 'primary' as const },
    danger: { type: Boolean, default: false },
    // 同时支持两种命名
    onSuccess: Function,
    success: Function,
    onCancel: Function,
    cancel: Function,
  },
  setup(props: any) {
    return () => h('div', { style: 'padding: 20px;' }, [
      h('div', { style: 'margin-bottom: 24px; line-height: 1.5;' }, props.message),
      h('div', { style: 'display: flex; justify-content: flex-end; gap: 12px;' }, [
        h(ElButton, { 
          onClick: () => {
            props.onCancel?.()
            props.cancel?.()
          }
        }, () => props.cancelText),
        h(ElButton, {
          type: props.danger ? 'danger' : props.confirmType,
          onClick: () => {
            props.onSuccess?.({ confirmed: true })
            props.success?.({ confirmed: true })
          },
        }, () => props.confirmText),
      ]),
    ])
  },
}

/**
 * 提示弹窗组件
 */
const AlertDialog = {
  name: 'AlertDialog',
  props: {
    message: { type: String, required: true },
    title: { type: String, default: '提示' },
    confirmText: { type: String, default: '确定' },
    confirmType: { type: String, default: 'primary' as const },
    // 同时支持两种命名
    onSuccess: Function,
    success: Function,
  },
  setup(props: any) {
    return () => h('div', { style: 'padding: 20px;' }, [
      h('div', { style: 'margin-bottom: 24px; line-height: 1.5;' }, props.message),
      h('div', { style: 'display: flex; justify-content: flex-end;' }, [
        h(ElButton, {
          type: props.confirmType,
          onClick: () => {
            props.onSuccess?.({ confirmed: true })
            props.success?.({ confirmed: true })
          },
        }, () => props.confirmText),
      ]),
    ])
  },
}

/**
 * 弹窗服务
 */
export const popupService = {
  show: showPopup,
  
  /**
   * 显示确认弹窗
   * @returns Promise<PopupResult<{ confirmed: boolean }>>
   */
  confirm: (
    message: string,
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      confirmType?: 'primary' | 'success' | 'warning' | 'danger'
      danger?: boolean
    } & Omit<PopupOptions, 'title' | 'onSuccess' | 'onCancel' | 'success' | 'cancel'>
  ): Promise<PopupResult<{ confirmed: boolean }>> => {
    const { title = '确认', confirmText, cancelText, confirmType, danger, ...restOptions } = options || {}
    
    return showPopup(ConfirmDialog, {
      message,
      title,
      confirmText,
      cancelText,
      confirmType,
      danger,
    }, {
      title,
      width: '420px',
      showClose: false,
      ...restOptions,
    })
  },
  
  /**
   * 显示提示弹窗
   * @returns Promise<PopupResult<{ confirmed: boolean }>>
   */
  alert: (
    message: string,
    options?: {
      title?: string
      confirmText?: string
      confirmType?: 'primary' | 'success' | 'warning' | 'danger'
    } & Omit<PopupOptions, 'title' | 'onSuccess' | 'success'>
  ): Promise<PopupResult<{ confirmed: boolean }>> => {
    const { title = '提示', confirmText, confirmType, ...restOptions } = options || {}
    
    return showPopup(AlertDialog, {
      message,
      title,
      confirmText,
      confirmType,
    }, {
      title,
      width: '420px',
      showClose: false,
      ...restOptions,
    })
  },
  
  /**
   * 关闭所有弹窗
   */
  closeAll: closeAllPopups,
}

// 导出类型
export type { PopupOptions as DialogOptions }