<template>
  <div class="h-full flex items-center gap-4">
    <!-- 侧边栏布局：显示折叠按钮和面包屑 -->
    <template v-if="themeStore.isSideLayout">
      <!-- 折叠按钮 -->
      <CollapseButton />
      
      <!-- 面包屑导航 -->
      <div class="breadcrumb hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    
    <!-- 顶部布局：显示 Logo -->
    <Logo v-else-if="themeStore.showLogo" class="top-layout-logo" @goHome="goHome" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/store/modules/theme'
import Logo from '@/layout/menu/logo/index.vue'
import CollapseButton from './CollapseButton.vue'

const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

// 面包屑数据（简化版，实际项目中可以从路由元数据获取）
const breadcrumbItems = computed(() => {
  const path = route.path
  if (path === '/home') return []
  
  const parts = path.split('/').filter(Boolean)
  return parts.map(part => {
    // 这里可以添加路由名称映射
    if (part === 'system') return '系统管理'
    if (part === 'user') return '用户管理'
    if (part === 'role') return '角色管理'
    if (part === 'menu') return '菜单管理'
    if (part === 'dept') return '部门管理'
    if (part === 'setting') return '系统设置'
    if (part === 'userinfo') return '个人中心'
    return part
  })
})

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
.top-layout-logo {
  :deep(.logo-area) {
    background-color: transparent;
    padding-left: 0;
  }
}

.breadcrumb {
  border-left: 1px solid var(--el-border-color);
  padding-left: 1rem;
}
</style>