import { showPopup } from '@/utils/popupService';
import popup from './../components/DeptForm.vue';
import {type DeptItem} from './../config'
export function showDeptFormPopup(
  title: string,
  row: DeptItem | {},
  isAdd: boolean,
  list: DeptItem[],
): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    popup, // 您的弹窗内容组件
    { row, isAdd,list,  }, // 传递给组件的属性
    {
      title, // 弹窗标题
      width: '600px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data: any) => {
        console.log(data, '成功回调');
        // 这里可以处理成功后的逻辑，比如刷新列表等
      },
      // 关闭回调
      close: () => {
        console.log('弹窗关闭');
      },
      // 取消回调
      cancel: () => {
        console.log('弹窗取消');
      },
    }
  );
}
