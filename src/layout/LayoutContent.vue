<template>
  <!-- 侧边栏布局 -->
  <el-container v-if="themeStore.isSideLayout" class="layout">
    <el-aside
      :width="userStore.menuWidth"
      class="aside-transition"
      :style="{ backgroundColor: themeStore.menuBgColor }"
    >
      <Menu />
    </el-aside>
    <el-container>
      <el-header
        :class="{ 'fixed-header': themeStore.fixedHeader }"
        :style="{ backgroundColor: themeStore.headerBgColor }"
      >
        <Head />
      </el-header>
      <Breadcrumb v-if="themeStore.showTagsView"/>
      <el-main class="main-content">
        <router-view class="router-view"></router-view>
      </el-main>
    </el-container>
  </el-container>

  <!-- 顶部导航布局 -->
  <el-container v-else class="layout layout-top">
    <el-header
      class="top-header"
      :style="{ backgroundColor: themeStore.headerBgColor }"
    >
      <div class="top-header-content">
        <Logo v-if="themeStore.showLogo" class="top-logo" @goHome="goHome" />
        <TopMenu />
        <Head class="top-head" />
      </div>
    </el-header>
    <el-container class="top-container">
      <Breadcrumb v-if="themeStore.showTagsView"/>
      <el-main class="main-content">
        <router-view class="router-view"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Menu from './menu/index.vue';
import TopMenu from './topMenu/index.vue';
import Head from './head/index.vue';
import Logo from './menu/logo/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();

const goHome = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
:deep(.el-header) {
  padding: 0 !important;
}

:deep(.el-main) {
  padding: 10px !important;
}

.aside-transition {
  transition: width 0.3s ease-in-out, background-color 0.3s ease;
  overflow: hidden;
}

:deep(.el-menu) {
  transition: all 0.3s ease-in-out;
}

// 固定头部样式
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

// 顶部布局样式
.layout-top {
  flex-direction: column;
}

.top-header {
  height: 60px;
  padding: 0 !important;
  transition: background-color 0.3s ease;
}

.top-header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.top-logo {
  flex-shrink: 0;
  margin-right: 20px;
}

.top-head {
  flex-shrink: 0;
  margin-left: auto;
  background-color: transparent !important;

  :deep(.header-box) {
    background-color: transparent !important;
    box-shadow: none !important;
    border-bottom: none !important;
  }
}

.top-container {
  flex-direction: column;
}
</style>
