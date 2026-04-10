<template>
  <div class="h-full flex items-center gap-4">
    <!-- 侧边栏布局：显示折叠按钮和面包屑 -->
    <template v-if="themeStore.isSideLayout">
      <!-- 折叠按钮 -->
      <CollapseButton />
      
      <!-- 面包屑导航 -->
      <div class="breadcrumb hidden md:flex items-center text-sm">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item 
            v-for="(item, index) in breadcrumbItems" 
            :key="index"
            :to="item.path === currentPath ? undefined : { path: item.path }"
          >
            {{ item.title }}
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
import { useUserStore } from '@/store/modules/user'
import Logo from '@/layout/menu/logo/index.vue'
import CollapseButton from './CollapseButton.vue'

const themeStore = useThemeStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 👇 添加这一行，定义 currentPath
const currentPath = computed(() => route.path)

/**
 * 根据路径查找菜单项
 */
const findMenuItemByPath = (menus: any[], path: string): any => {
  for (const menu of menus) {
    if (menu.path === path) return menu
    if (menu.children && menu.children.length) {
      const found = findMenuItemByPath(menu.children, path)
      if (found) return found
    }
  }
  return null
}

/**
 * 通过 parentId 查找菜单（更精确）
 */
const findMenuItemByParentId = (menus: any[], parentId: string): any => {
  for (const menu of menus) {
    if (menu.id === parentId) return menu
    if (menu.children && menu.children.length) {
      const found = findMenuItemByParentId(menu.children, parentId)
      if (found) return found
    }
  }
  return null
}

/**
 * 生成面包屑数据（从菜单数据中获取）
 */
const breadcrumbItems = computed(() => {
  const menus = userStore.$state.menus || []
  
  // 查找当前路径对应的菜单项
  const currentMenu = findMenuItemByPath(menus, route.path)
  
  if (!currentMenu) return []
  
  // 收集父级路径
  const items: any[] = []
  
  const collectParents = (menu: any) => {
    if (menu.parentId && menu.parentId !== '0' && menu.parentId !== null) {
      const parentMenu = findMenuItemByParentId(menus, menu.parentId)
      if (parentMenu) {
        collectParents(parentMenu)
        items.push({
          title: parentMenu.title,
          path: parentMenu.path
        })
      }
    }
  }
  
  collectParents(currentMenu)
  items.push({
    title: currentMenu.title,
    path: currentMenu.path
  })
  
  return items
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

  :deep(.el-breadcrumb__inner) {
    display: flex;
    align-items: center;
    
    .el-icon {
      font-size: 14px;
    }
  }
}
</style>