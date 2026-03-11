<!-- src/layout/Layout.vue -->
<template>
  <div class="common-layout">
    <el-watermark
      :content="watermarkContent"
      :font="watermarkFont"
      :gap="[100, 100]"
      :rotate="-30"
      :z-index="10"
    >
      <el-container class="layout">
        <el-aside
          :width="userStore.menuWidth"
          class="aside-transition"
        >
          <Menu />
        </el-aside>
        <el-container>
          <el-header>
            <Head />
          </el-header>
          <el-main class="main-content">
            <router-view class="router-view"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-watermark>
  </div>
</template>

<script setup lang="ts">
import Menu from './menu/index.vue';
import Head from './head/index.vue';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
// 水印内容
const watermarkContent = computed(() => {
  const userInfo = userStore.userInfo;
  return [
    userInfo?.username || '内部资料',
    userInfo?.phone || '',
    new Date().toLocaleDateString(),
  ];
});
// 水印字体配置
const watermarkFont = {
  color: 'rgba(0, 0, 0, 0.1)',
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'Microsoft Yahei, sans-serif',
};
</script>
<style lang="scss" scoped>
:deep(.el-header) {
  padding: 0 !important;
}

:deep(.el-main) {
  padding: 10px !important;
}

.aside-transition {
  transition: width 0.3s ease-in-out;
  /* 添加宽度过渡效果 */
  overflow: hidden;
  /* 确保内容不会在过渡期间溢出 */
}

/* 可选：为菜单内部的元素也添加过渡效果 */
:deep(.el-menu) {
  transition: all 0.3s ease-in-out;
}
</style>
