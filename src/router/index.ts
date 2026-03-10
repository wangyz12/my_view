// src/router/index.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import storage from '@/utils/storage';
// 定义路由组件
const Layout = () => import('@/layout/index.vue');
const Home = () => import('@/pages/home/index.vue');
const Login = () => import('@/pages/login/index.vue');
const NotFound = () => import('@/components/notFound/index.vue');
const UserInfo = ()=>import('@/pages/userinfo/index.vue')

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Layout',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          requiresAuth: true, // 需要登录
        },
      },
      {
        path: 'userinfo',
        name: 'UserInfo',
        component: UserInfo,
        meta: {
          title: '用户信息',
          requiresAuth: true, // 需要登录
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false, // 不需要登录
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用哈希模式
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 滚动行为：回到顶部
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from) => {
  // 设置页面标题（支持动态参数）
  const defaultTitle = '我的应用';
  if (to.meta.title) {
    const title = typeof to.meta.title === 'function' ? to.meta.title(to.params) : to.meta.title;
    document.title = `${title} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }

  // 获取用户信息
  const userStore = useUserStore();
  const token = userStore.accessToken || storage.get('token');
  const isLoggedIn = !!token;

  // 如果已登录但未获取用户信息，尝试获取
  // if (isLoggedIn && !userStore.userInfo) {
  //   try {
  //     await userStore.getUserInfo()
  //   } catch (error) {
  //     console.error('获取用户信息失败:', error)
  //     // token 无效，清除登录状态
  //     userStore.logout()
  //     return {
  //       path: '/login',
  //       query: { redirect: to.fullPath }
  //     }
  //   }
  // }

  // 权限检查
  // if (to.meta.roles && userStore.userInfo) {
  //   const hasRole = to.meta.roles.some(role =>
  //     userStore.userInfo.roles?.includes(role)
  //   )
  //   if (!hasRole) {
  //     return '/403' // 无权限页面
  //   }
  // }

  // 登录页处理
  if (to.path === '/login') {
    if (isLoggedIn) {
      return from.path === '/' ? '/home' : from.fullPath;
    }
    return true;
  }

  // 登录检查
  if (!isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  return true;
});
export default router;
