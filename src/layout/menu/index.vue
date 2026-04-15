<template>
  <div class="menu-wrapper" :class="{ 'is-collapse': isCollapse }">
    <Logo v-if="themeStore.showLogo" @goHome="goHome" />
    <!-- 菜单区域 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="true"
      class="el-menu-vertical transition-all duration-300 ease-in-out"
      :background-color="themeStore.menuBgColor"
      :text-color="themeStore.menuTextColor"
      :active-text-color="themeStore.themeColor"
      @select="handleMenuSelect"
    >
      <template v-if="menuList && menuList.length">
        <MenuItem
          v-for="item in menuList"
          :key="item.id"
          :menu-item="item"
          :base-path="item.path"
        />
      </template>
    </el-menu>
    
    <!-- 收缩/展开按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon :size="12">
        <DArrowLeft v-if="!isCollapse" />
        <DArrowRight v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/modules/theme'
import MenuItem from './MenuItem.vue'
import Logo from './logo/index.vue'

// ==================== 类型定义 ====================

/** 菜单项类型 */
interface MenuItemType {
  id: string
  path: string
  title: string
  name?: string
  icon?: string
  external?: boolean
  target?: '_blank' | '_self'
  children?: MenuItemType[]
  [key: string]: unknown
}

// ==================== 响应式数据 ====================

const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// ==================== 计算属性 ====================

/** 菜单列表 */
const menuList = computed<MenuItemType[]>(() => userStore.$state.menus || [])

/** 当前激活的菜单路径 */
const activeMenu = computed<string>(() => route.path)

/** 菜单是否折叠 */
const isCollapse = computed<boolean>(() => userStore.isCollapse)

// ==================== 方法 ====================

/**
 * 根据路径查找菜单项
 * @param menus - 菜单列表
 * @param path - 目标路径
 * @returns 找到的菜单项或 null
 */
const findMenuItemByPath = (menus: MenuItemType[], path: string): MenuItemType | null => {
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
 * 处理菜单选择
 * @param index - 选中的菜单路径
 */
const handleMenuSelect = (index: string): void => {
  const menuItem = findMenuItemByPath(menuList.value, index)
  
  // 外部链接处理
  if (menuItem?.external) {
    if (menuItem.target === '_blank') {
      window.open(menuItem.path, '_blank')
    } else {
      window.location.href = menuItem.path
    }
    return
  }

  // 内部路由跳转
  router.push(index)
}

/** 返回首页 */
const goHome = (): void => {
  router.push('/home')
}

/** 切换菜单折叠状态 */
const toggleCollapse = (): void => {
  userStore.set_isCollapse(!isCollapse.value)
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
  height: 100%;
}

// 收缩/展开按钮
.collapse-btn {
  position: absolute;
  bottom: 50%;
  right: -12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    right: 3px;
    
    .el-icon {
      color: #fff;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  .el-icon {
    color: var(--el-text-color-secondary);
    transition: all 0.3s ease;
  }
}
</style>