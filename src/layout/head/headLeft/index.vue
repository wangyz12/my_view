<template>
  <div class="h-full flex items-center gap-4">
    <!-- 侧边栏布局：显示折叠按钮和面包屑 -->
    <template v-if="themeStore.isSideLayout">
      <!-- 折叠按钮 -->
      <CollapseButton />
      
      <!-- 面包屑导航 -->
      <div class="breadcrumb hidden md:flex items-center text-sm">
        <el-breadcrumb separator="/">
          <transition-group name="breadcrumb">
            <el-breadcrumb-item 
              v-for="item in breadcrumbItems" 
              :key="item.path"
            >
              <span class="breadcrumb-item-content">{{ item.title }}</span>
            </el-breadcrumb-item>
          </transition-group>
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

// ==================== 类型定义 ====================

/** 菜单项类型 */
interface MenuItem {
  id: string
  path: string
  title: string
  parentId: string | null
  name?: string
  icon?: string
  children?: MenuItem[]
  [key: string]: unknown
}

/** 面包屑项类型 */
interface BreadcrumbItem {
  title: string
  path: string
}

// ==================== 响应式数据 ====================

const themeStore = useThemeStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// ==================== 工具函数 ====================

/**
 * 根据路径查找菜单项
 * @param menus - 菜单列表
 * @param path - 目标路径
 * @returns 找到的菜单项或 null
 */
const findMenuItemByPath = (menus: MenuItem[], path: string): MenuItem | null => {
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
 * 通过 parentId 查找父级菜单
 * @param menus - 菜单列表
 * @param parentId - 父级ID
 * @returns 找到的父级菜单或 null
 */
const findMenuItemByParentId = (menus: MenuItem[], parentId: string): MenuItem | null => {
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
 * 递归收集面包屑路径
 * @param menu - 当前菜单
 * @param menus - 完整菜单列表
 * @param items - 收集结果
 */
const collectBreadcrumbItems = (
  menu: MenuItem,
  menus: MenuItem[],
  items: BreadcrumbItem[]
): void => {
  if (menu.parentId && menu.parentId !== '0' && menu.parentId !== null) {
    const parentMenu = findMenuItemByParentId(menus, menu.parentId)
    if (parentMenu) {
      collectBreadcrumbItems(parentMenu, menus, items)
      items.push({
        title: parentMenu.title,
        path: parentMenu.path
      })
    }
  }
}

// ==================== 计算属性 ====================

/**
 * 生成面包屑数据
 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const menus = (userStore.$state.menus as MenuItem[]) || []
  const currentMenu = findMenuItemByPath(menus, route.path)
  
  if (!currentMenu) return []
  
  const items: BreadcrumbItem[] = []
  collectBreadcrumbItems(currentMenu, menus, items)
  items.push({
    title: currentMenu.title,
    path: currentMenu.path
  })
  
  return items
})

// ==================== 方法 ====================

const goHome = (): void => {
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

/* 面包屑切换动画 */
.breadcrumb-move,
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb-item-content {
  display: inline-block;
}
</style>