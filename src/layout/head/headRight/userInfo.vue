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
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
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
import { useBreadcrumbStore } from '@/store/modules/breadcrumb'

const breadcrumbStore = useBreadcrumbStore()

// 统一跳转登录
const unificationOut = async (str: string) => {
  const loading = ElLoading.service({
    fullscreen: true,
    text: '正在退出...',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  try{
    storage.clear()
  await userStore.clear_state()
  // 重置标签页
  breadcrumbStore.resetTabs()
  ElMessage.success(str)
  setTimeout(() => {
      loading.close()
      router.replace('/login')
    }, 500)
  } catch(err){
    console.log(err)
    loading.close()
    ElMessage.error('退出失败，请重试')
  }
 
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
