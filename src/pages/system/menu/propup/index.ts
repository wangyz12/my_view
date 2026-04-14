import { showPopup } from '@/utils/popupService';
import popup from './../components/UserAddEdit.vue';
import iconPopup from './../components/UserSelectIcon.vue';
import type{MenuItem} from './../config';
export function showAddEditMenuPopup(
  title: string,
  row: MenuItem | {},
  list:MenuItem[],
  isAdd:boolean
): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    popup, // 您的弹窗内容组件
    { row,list,isAdd }, // 传递给组件的属性
    {
      title, // 弹窗标题
      width: '600px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data) => {
        console.log(data,'成功回调')
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

export function showSelectIconPopup(): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    iconPopup, // 您的弹窗内容组件
    {}, // 传递给组件的属性
    {
      title:'选择图标', // 弹窗标题
      width: '600px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data) => {
        console.log(data,'成功回调')
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