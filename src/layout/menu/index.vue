<template>
  <div class="menu-wrapper">
    <Logo v-if="themeStore.showLogo" @goHome="goHome"/>
    <!-- 菜单区域：使用 element-plus 的菜单组件，数据从 userStore 获取 -->
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';
import MenuItem from './MenuItem.vue'; // 引入递归子组件
import Logo from './logo/index.vue'
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();

// 获取用户store中的菜单数据
const userStore = useUserStore();
const menuList = computed(() => userStore.$state.menus || []);

// 路由实例，用于高亮当前菜单
const activeMenu = computed(() => route.path);

// 控制菜单折叠（可根据需要从props或store传入）
const isCollapse = computed(()=>userStore.isCollapse);

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
const goHome = ()=>{
  router.push('/home')
}
</script>
