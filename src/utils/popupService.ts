// src/utils/popupService.ts
import { createApp, ref, type Component, h, type App, type VNode } from 'vue'
import { ElDialog, ElButton, ElMessage } from 'element-plus'
import type { DialogProps } from 'element-plus'

// 注意：不要在工具函数中导入全局样式，应该在 main.ts 中导入
// import 'element-plus/dist/index.css'

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
}

/**
 * 弹窗实例接口
 */
export interface PopupInstance {
  close: () => void
  destroy: () => void
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

// 存储所有活跃的弹窗实例，用于批量关闭
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
 * @returns Promise 返回弹窗结果
 */
export function showPopup<P extends Record<string, any> = Record<string, any>>(
  component: Component,
  props?: P,
  options?: PopupOptions
): Promise<any> {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }
  
  return new Promise((resolve, reject) => {
    let isResolved = false // 防止重复 resolve/reject
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
      
      // 根据类型处理 Promise 和回调
      if (type === 'success') {
        resolve(data)
        mergedOptions.onSuccess?.(data)
      } else if (type === 'cancel') {
        reject(new Error('cancel'))
        mergedOptions.onCancel?.()
      } else {
        // close 类型（点击 X 或点击遮罩）
        reject(new Error('close'))
      }
      
      // 触发关闭后的回调
      mergedOptions.onClosed?.()
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
        // 处理成功事件
        const handleSuccess = (data?: any) => {
          handleBeforeClose(() => {
            handleClose('success', data)
          })
        }
        
        // 处理取消事件
        const handleCancel = () => {
          handleBeforeClose(() => {
            handleClose('cancel')
          })
        }
        
        // 处理关闭事件（由内部组件主动触发）
        const handleCloseEvent = () => {
          handleBeforeClose(() => {
            handleClose('close')
          })
        }
        
        return () => {
          // 创建内容组件，传递控制方法
          const contentVNode = h(component, {
            ...(props || {}),
            onSuccess: handleSuccess,
            onCancel: handleCancel,
            onClose: handleCloseEvent,
            // 暴露弹窗实例，允许内部组件主动关闭
            popupInstance: {
              close: () => handleCloseEvent(),
              destroy: destroyPopup,
            },
          })
          
          // 对话框属性
          const dialogProps: Partial<DialogProps> = {
            modelValue: visible.value,
            'onUpdate:modelValue': (val: boolean) => {
              if (!val) {
                // 用户点击遮罩或按 ESC 关闭
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
              // 对话框完全关闭后销毁整个应用
              destroyPopup()
            },
          }
          
          return h(ElDialog, dialogProps, {
            default: () => contentVNode,
          })
        }
      },
    })
    
    // 如果全局有 Element Plus 配置，可以在这里注入
    // app.use(ElementPlus)
    
    // 挂载应用
    app.mount(container)
    
    // 存储弹窗实例以便批量关闭
    const popupInstance = { destroy: destroyPopup }
    activePopups.add(popupInstance)
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
    onSuccess: Function,
    onCancel: Function,
  },
  setup(props: any) {
    return () => h('div', { style: 'padding: 20px;' }, [
      h('div', { style: 'margin-bottom: 24px; line-height: 1.5;' }, props.message),
      h('div', { style: 'display: flex; justify-content: flex-end; gap: 12px;' }, [
        h(ElButton, { onClick: () => props.onCancel?.() }, () => props.cancelText),
        h(ElButton, {
          type: props.danger ? 'danger' : props.confirmType,
          onClick: () => props.onSuccess?.({ confirmed: true }),
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
    onSuccess: Function,
  },
  setup(props: any) {
    return () => h('div', { style: 'padding: 20px;' }, [
      h('div', { style: 'margin-bottom: 24px; line-height: 1.5;' }, props.message),
      h('div', { style: 'display: flex; justify-content: flex-end;' }, [
        h(ElButton, {
          type: props.confirmType,
          onClick: () => props.onSuccess?.({ confirmed: true }),
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
   */
  confirm: (
    message: string,
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      confirmType?: 'primary' | 'success' | 'warning' | 'danger'
      danger?: boolean
    } & Omit<PopupOptions, 'title' | 'onSuccess' | 'onCancel'>
  ): Promise<{ confirmed: boolean }> => {
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
   */
  alert: (
    message: string,
    options?: {
      title?: string
      confirmText?: string
      confirmType?: 'primary' | 'success' | 'warning' | 'danger'
    } & Omit<PopupOptions, 'title' | 'onSuccess'>
  ): Promise<{ confirmed: boolean }> => {
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