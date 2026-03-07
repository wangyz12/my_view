<template>
  <div class="menu-wrapper">
    <!-- 上方 Logo 区域，预留插槽便于自定义 -->
    <div class="logo-area">
      <slot name="logo">
        <div class="default-logo">
          <span class="logo-text">Admin</span>
        </div>
      </slot>
    </div>

    <!-- 菜单区域：使用 element-plus 的菜单组件，数据从 userStore 获取 -->
    <el-menu :default-active="activeMenu" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false"
      class="el-menu-vertical" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF"
      @select="handleMenuSelect">
      <template v-if="menuList && menuList.length">
        <MenuItem v-for="item in menuList" :key="item.id" :menu-item="item" :base-path="item.path" />
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import MenuItem from './MenuItem.vue' // 引入递归子组件
const router = useRouter()
const route = useRoute()

// 获取用户store中的菜单数据
const userStore = useUserStore()
const menuList = computed(() => userStore.$state.menus || [])

// 路由实例，用于高亮当前菜单
const activeMenu = computed(() => route.path)

// 控制菜单折叠（可根据需要从props或store传入）
const isCollapse = ref(false)
// 菜单选择处理函数
const handleMenuSelect = (index: string) => {
  // 如果是外部链接，使用 window.open 打开
  const menuItem = findMenuItemByPath(menuList.value, index)
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
// 根据路径查找菜单项（用于判断是否为外部链接）
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

</script>

<style lang="scss" scoped>
.menu-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #304156;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #fff;
  background-color: #1f2d3d;
}

.default-logo {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.el-menu-vertical {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;

  &:not(.el-menu--collapse) {
    width: 200px;
  }

  &.el-menu--collapse {
    width: 64px;

    .logo-text {
      display: none;
    }
  }
}
</style>