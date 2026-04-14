import { showPopup } from '@/utils/popupService';
import popup from './../components/RoleForm.vue';
import UserMenu from './../components/RoleMenuAssign.vue'
import UserList from './../components/RoleUserTable.vue'
export function showAddEditRloePopup(
  title: string,
  row: any
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
      success: (data: any) => {
        console.log(data)
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

export function showUserMenuPopup(
  title: string,
  roleId: string,
  roleName: string
): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    UserMenu, // 您的弹窗内容组件
    { roleId,roleName }, // 传递给组件的属性
    {
      title, // 弹窗标题
      width: '600px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data: any) => {
        console.log(data)
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

export function showUserListPopup(
  title: string,
  row:any
): Promise<any> {
  // 使用弹窗服务
  return showPopup(
    UserList, // 您的弹窗内容组件
    { row }, // 传递给组件的属性
    {
      title, // 弹窗标题
      width: '1000px', // 弹窗宽度
      showClose: true, // 显示关闭按钮
      closeOnClickModal: false, // 点击遮罩不关闭
      className: 'change-password-dialog',
      // 成功回调
      success: (data: any) => {
        console.log(data)
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