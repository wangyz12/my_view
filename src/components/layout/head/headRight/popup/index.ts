// src/api/signPopup.ts
import { showPopup } from '@/utils/popupService'
import popup from './index.vue'

/**
 * 显示修改密码弹窗
 * @param path 可选参数
 * @returns Promise 返回操作结果
 */
export function showChangePasswordPopup(): Promise<any> {
  
  // 使用弹窗服务
  return showPopup(
    popup,           // 您的弹窗内容组件
    null,                      // 传递给组件的属性
    {
      title: '修改密码',            // 弹窗标题
      width: '500px',              // 弹窗宽度
      showClose: true,             // 显示关闭按钮
      closeOnClickModal: false,    // 点击遮罩不关闭
      className: 'change-password-dialog',
      
      // 成功回调
      success: (data) => {
        console.log('密码修改成功:', data)
        // 这里可以处理成功后的逻辑，比如刷新列表等
      },
      
      // 关闭回调
      close: () => {
        console.log('弹窗关闭')
      },
      
      // 取消回调
      cancel: () => {
        console.log('弹窗取消')
      }
    }
  )
}