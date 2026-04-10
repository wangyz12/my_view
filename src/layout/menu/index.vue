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
    <!-- 收缩/展开按钮 -->
    <div 
      class="collapse-btn"
      @click="toggleCollapse"
    >
      <el-icon :size="12">
        <DArrowLeft v-if="!isCollapse" />
        <DArrowRight v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';
import MenuItem from './MenuItem.vue'; // 引入递归子组件
import Logo from './logo/index.vue'
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();
console.log(themeStore.menuBgColor)
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
// 切换折叠状态
const toggleCollapse = () => {
  userStore.set_isCollapse(!isCollapse.value);
};
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

  // 鼠标悬停效果
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

  // 点击效果
  &:active {
    transform: scale(0.95);
  }

  .el-icon {
    color: var(--el-text-color-secondary);
    transition: all 0.3s ease;
  }
}

// 菜单折叠时，按钮位置微调
.menu-wrapper.is-collapse .collapse-btn {
  right: -12px;
  
  .el-icon {
    // 图标方向变了，不需要额外处理
  }
}
</style>
