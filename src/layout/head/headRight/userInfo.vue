<template>
  <div class="flex overflow-hidden">
    <el-dropdown placement="bottom">
      <div class="h-[40px] flex items-center cursor-pointer">
        <img :src="avatarUrl" alt="头像" avatar class="avatar mr-3" />
        <div>{{ userStore.userInfo.username }}</div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, index) in dropdList" :key="index" @click="dropdClick(item)">{{ item.label
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import avatar from '@/assets/default/avatar.jpeg';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { showChangePasswordPopup } from './popup/index'
import storage from '@/utils/storage'
import { ElMessage, ElMessageBox } from 'element-plus';
const userStore = useUserStore();
const router = useRouter();
const avatarUrl = computed(() => {
  const { userInfo } = userStore;
  return userInfo.avatar || avatar;
});
interface DROPDLIST {
  label: string;
  value: string;
  type: string;
  path?: string;
}
const dropdList: DROPDLIST[] = [
  {
    label: '个人中心',
    value: '1',
    type: 'router',
    path: '/userinfo',
  },
  { label: '修改密码', value: '2', type: 'popup' },
  { label: '退出登录', value: '3', type: 'msgbox' },
];
// 统一跳转登录
const unificationOut = async (str: string) => {
  storage.clear()
  await userStore.clear_state()
  ElMessage.success(str)
  setTimeout(() => router.push('/login'), 500)
}
// 退出
const outFunc = () => {
  ElMessageBox.confirm('确定退出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    unificationOut('账号成功退出，请重新登录')
  }).catch(() => { })
}
// 跳转个人信息
const linkFunc = (path: string) => {
  router.push(path);
};
// 修改密码弹框
const popupFunc = async (itme: DROPDLIST) => {
  if (itme.value === '2') {
    // 修改密码
    const res: any = await showChangePasswordPopup()
    if (res.success) {
      unificationOut('密码修改成功，请重新登录')
    }
  }
}
// 下拉菜单点击事件
const dropdClick = (item: DROPDLIST) => {
  switch (item.type) {
    case 'router':
      linkFunc(item.path || '');
      break;
    case 'popup':
      popupFunc(item)
      break;
    case 'msgbox':
      outFunc()
      break;
  }
};
</script>
