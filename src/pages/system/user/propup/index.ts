import { showPopup } from '@/utils/popupService';
import popup from './../components/UserForm.vue';
import role from './../components/UserRoleAssign.vue';
import dept from './../components/UserDept.vue';
import type {UserItem} from './../config';
export function showChangePasswordPopup(
  title: string,
  row: UserItem|{}
): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    popup, // 您的弹窗内容组件
    { row }, // 传递给组件的属性
    {
      title, // 弹窗标题
      width: '600px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data) => {
        console.log( data);
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

export function showRloePropup(row: UserItem|{}): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    role, // 您的弹窗内容组件
    { row }, // 传递给组件的属性
    {
      title: '分配角色', // 弹窗标题
      width: '400px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data) => {
        console.log( data);
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

export function showDeptpup(row: UserItem|{}): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    dept, // 您的弹窗内容组件
    { row }, // 传递给组件的属性
    {
      title: '分配部门', // 弹窗标题
      width: '400px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data) => {
        console.log('密码修改成功:', data);
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
