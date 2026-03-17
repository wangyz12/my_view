<template>
  <div class="top-menu-wrapper">
    <!-- 菜单区域：横向菜单 -->
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      mode="horizontal"
      class="top-menu"
      :background-color="themeStore.menuBgColor"
      :text-color="themeStore.menuTextColor"
      :active-text-color="themeStore.themeColor"
      @select="handleMenuSelect"
    >
      <!-- 静态首页菜单项 -->
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <template v-if="menuList && menuList.length">
        <MenuItem
          v-for="item in menuList"
          :key="item.id"
          :menu-item="item"
          :base-path="item.path"
        />
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';
import MenuItem from './../menu/MenuItem.vue'; // 引入递归子组件

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

// 获取用户store中的菜单数据
const userStore = useUserStore();
const menuList = computed(() => userStore.$state.menus || []);

// 路由实例，用于高亮当前菜单
const activeMenu = computed(() => route.path);

// 菜单选择处理函数
const handleMenuSelect = (index: string) => {
  // 如果是外部链接，使用 window.open 打开
  const menuItem = findMenuItemByPath(menuList.value, index);
  if (menuItem?.external) {
    if (menuItem.target === '_blank') {
      window.open(menuItem.path, '_blank');
    } else {
      window.location.href = menuItem.path;
    }
    return;
  }

  // 内部路由跳转
  router.push(index);
};

// 根据路径查找菜单项（用于判断是否为外部链接）
const findMenuItemByPath = (menus: any[], path: string): any => {
  for (const menu of menus) {
    if (menu.path === path) return menu;
    if (menu.children && menu.children.length) {
      const found = findMenuItemByPath(menu.children, path);
      if (found) return found;
    }
  }
  return null;
};
</script>

<style lang="scss" scoped>
.top-menu-wrapper {
  flex: 1;
  overflow: hidden;
}

.top-menu {
  border-bottom: none !important;
  background-color: transparent !important;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    background-color: transparent !important;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: #263445 !important;
  }
}
</style>
