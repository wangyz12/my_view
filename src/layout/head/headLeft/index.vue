<template>
  <div class="text-[22px] h-full flex items-center cursor-pointer">
    <!-- 只在侧边栏布局显示折叠按钮 -->
    <el-icon v-if="themeStore.isSideLayout" @click="()=>{userStore.set_isCollapse(!userStore.isCollapse)}">
      <Fold v-if="!userStore.isCollapse"/>
      <Expand v-else/>
    </el-icon>
    <!-- 顶部布局显示 Logo -->
    <Logo v-else-if="themeStore.showLogo" class="top-layout-logo" @goHome="goHome" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';
import Logo from '@/layout/menu/logo/index.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();

const goHome = () => {
  router.push('/home');
};
</script>

<style lang="scss" scoped>
.top-layout-logo {
  :deep(.logo-area) {
    background-color: transparent;
    padding-left: 0;
  }
}
</style>