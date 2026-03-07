// src/utils/popupService.ts
import { createApp, ref, type Component, h } from 'vue'
import { ElDialog } from 'element-plus'
import 'element-plus/dist/index.css'

/**
 * 弹窗配置选项
 */
export interface PopupOptions {
  title?: string
  width?: string | number
  height?: string | number
  showClose?: boolean
  closeOnClickModal?: boolean
  appendTo?: HTMLElement | string
  className?: string
  beforeClose?: (done: () => void) => void
  success?: (data: any) => void
  close?: () => void
  cancel?: () => void
}

/**
 * 默认配置
 */
const defaultOptions: PopupOptions = {
  title: '提示',
  width: '500px',
  height: 'auto',
  showClose: true,
  closeOnClickModal: false,
  appendTo: document.body,
}

/**
 * 显示弹窗
 * @param component 要显示的组件
 * @param props 传递给组件的属性
 * @param options 弹窗配置
 * @returns Promise 返回弹窗结果
 */
export function showPopup(
  component: Component,
  props: any,
  options: PopupOptions = {}
): Promise<any> {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }
  
  return new Promise((resolve, reject) => {
    // 创建容器
    const container = document.createElement('div')
    container.className = 'popup-service-container'
    
    // 确定挂载点
    const appendTo = typeof mergedOptions.appendTo === 'string'
      ? document.querySelector(mergedOptions.appendTo) || document.body
      : mergedOptions.appendTo || document.body
    
    appendTo.appendChild(container)
    
    // 响应式数据
    const visible = ref(true)
    
    // 创建包装组件
    const app = createApp({
      setup() {
        // 处理成功事件
        const handleSuccess = (data: any) => {
          visible.value = false
          resolve(data)
          mergedOptions.success?.(data)
        }
        
        // 处理关闭事件（由内部组件触发）
        const handleClose = () => {
          visible.value = false
          mergedOptions.close?.()
        }
        
        // 处理取消事件（由内部组件触发）
        const handleCancel = () => {
          visible.value = false
          reject(new Error('cancel'))
          mergedOptions.cancel?.()
        }
        
        // 渲染函数
        return () => {
          // 创建内容组件，传递所有必要的方法
          const contentVNode = h(component, {
            ...props,
            // 将对话框的控制方法传递给内容组件
            onSuccess: handleSuccess,
            onClose: handleClose,
            onCancel: handleCancel,
          })
          
          // 创建对话框 - 注意：没有 footer 插槽了，完全由内容组件控制
          return h(ElDialog, {
            modelValue: visible.value,
            'onUpdate:modelValue': (val: boolean) => {
              visible.value = val
            },
            title: mergedOptions.title,
            width: mergedOptions.width,
            closeOnClickModal: mergedOptions.closeOnClickModal,
            closeOnPressEscape: mergedOptions.closeOnClickModal,
            showClose: mergedOptions.showClose,
            destroyOnClose: true, // 关闭时销毁内容
            appendToBody: true,
            class: mergedOptions.className,
            onClosed: () => {
              // 对话框完全关闭后，销毁组件
              app.unmount()
              if (container.parentNode) {
                container.parentNode.removeChild(container)
              }
            },
            onClose: () => {
              // 点击右上角 X 时触发
              visible.value = false
              mergedOptions.close?.()
            }
          }, {
            default: () => contentVNode
            // 注意：没有 footer 插槽，完全由内容组件控制
          })
        }
      }
    })
    
    // 挂载应用
    app.mount(container)
  })
}

/**
 * 创建弹窗的快捷方法
 */
export const popupService = {
  show: showPopup,
  
  /**
   * 显示一个确认弹窗
   */
  confirm: (message: string, options: PopupOptions = {}) => {
    const confirmComponent = {
      props: ['onSuccess', 'onClose', 'onCancel'],
      setup(props: any) {
        return () => h('div', { style: 'padding: 20px; text-align: center;' }, [
          h('p', { style: 'margin-bottom: 20px;' }, message),
          h('div', { style: 'display: flex; justify-content: center; gap: 12px;' }, [
            h('button', { 
              class: 'el-button',
              onClick: () => props.onCancel?.()
            }, '取消'),
            h('button', { 
              class: 'el-button el-button--primary',
              onClick: () => props.onSuccess?.({ confirmed: true })
            }, '确认')
          ])
        ])
      }
    }
    
    return showPopup(confirmComponent, {}, {
      title: '确认',
      width: '400px',
      ...options
    })
  },
  
  /**
   * 显示一个提示弹窗
   */
  alert: (message: string, options: PopupOptions = {}) => {
    const alertComponent = {
      props: ['onSuccess', 'onClose'],
      setup(props: any) {
        return () => h('div', { style: 'padding: 20px; text-align: center;' }, [
          h('p', { style: 'margin-bottom: 20px;' }, message),
          h('div', { style: 'display: flex; justify-content: center;' }, [
            h('button', { 
              class: 'el-button el-button--primary',
              onClick: () => props.onSuccess?.({ confirmed: true })
            }, '确定')
          ])
        ])
      }
    }
    
    return showPopup(alertComponent, {}, {
      title: '提示',
      width: '400px',
      ...options
    })
  }
}