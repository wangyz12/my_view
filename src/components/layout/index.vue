<!-- src/layout/Layout.vue -->
<template>
   <div class="common-layout">
    <el-container class="layout">
      <el-aside :width="userStore.menuWidth" class="aside-transition">
        <Menu />
      </el-aside>
      <el-container>
        <el-header>
          <Head />
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Menu from './menu/index.vue'
import Head from './head/index.vue'
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore()
defineOptions({
  name: 'Layout'
})
</script>
<style lang="scss" scoped>
:deep(.el-header){
  padding: 0 !important;
}
:deep(.el-main){
  padding: 10px !important;
}
.aside-transition {
  transition: width 0.3s ease-in-out;  /* 添加宽度过渡效果 */
  overflow: hidden;  /* 确保内容不会在过渡期间溢出 */
}

/* 可选：为菜单内部的元素也添加过渡效果 */
:deep(.el-menu) {
  transition: all 0.3s ease-in-out;
}
</style>
