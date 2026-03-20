// src/router/index.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import storage from '@/utils/storage';
import { checkRoutePermission, initUserPermissions } from '@/utils/auth';
import { startProgress, finishProgress, failProgress } from '@/utils/progress';

// 定义路由组件
const Layout = () => import('@/layout/index.vue');
const Home = () => import('@/pages/home/index.vue');
const Login = () => import('@/pages/login/index.vue');
const NotFound = () => import('@/components/notFound/index.vue');
const UserInfo = () => import('@/pages/userinfo/index.vue');
const Setting = () => import('@/pages/system/setting/index.vue');

// 系统管理页面
const UserManagement = () => import('@/pages/system/user/index.vue');
const RoleManagement = () => import('@/pages/system/role/index.vue');
const MenuManagement = () => import('@/pages/system/menu/index.vue');
const DeptManagement = () => import('@/pages/system/dept/index.vue');

// 演示页面
const CacheDemo = () => import('@/pages/demo/CacheDemo.vue');
const LoadingDemo = () => import('@/pages/demo/LoadingDemo.vue');

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
          requiresAuth: true,
          icon: 'HomeFilled',
        },
      },
      {
        path: 'userinfo',
        name: 'UserInfo',
        component: UserInfo,
        meta: {
          title: '用户信息',
          requiresAuth: true,
          icon: 'UserFilled',
        },
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          requiresAuth: true,
          icon: 'Setting',
          permission: 'system',
        },
        children: [
          {
            path: 'user',
            name: 'UserManagement',
            component: UserManagement,
            meta: {
              title: '用户管理',
              requiresAuth: true,
              icon: 'User',
              permission: 'system:user:list',
            },
          },
          {
            path: 'role',
            name: 'RoleManagement',
            component: RoleManagement,
            meta: {
              title: '角色管理',
              requiresAuth: true,
              icon: 'Avatar',
              permission: 'system:role:list',
            },
          },
          {
            path: 'menu',
            name: 'MenuManagement',
            component: MenuManagement,
            meta: {
              title: '菜单管理',
              requiresAuth: true,
              icon: 'Menu',
              permission: 'system:menu:list',
            },
          },
          {
            path: 'dept',
            name: 'DeptManagement',
            component: DeptManagement,
            meta: {
              title: '部门管理',
              requiresAuth: true,
              icon: 'OfficeBuilding',
              permission: 'system:dept:list',
            },
          },
          {
            path: 'setting',
            name: 'Setting',
            component: Setting,
            meta: {
              title: '系统设置',
              requiresAuth: true,
              icon: 'Tools',
            },
          },
          {
            path: 'cache-demo',
            name: 'CacheDemo',
            component: CacheDemo,
            meta: {
              title: '缓存演示',
              requiresAuth: true,
              icon: 'cpu',
              keepAlive: true, // 明确指定需要缓存
            },
          },
          {
            path: 'loading-demo',
            name: 'LoadingDemo',
            component: LoadingDemo,
            meta: {
              title: 'Loading演示',
              requiresAuth: true,
              icon: 'Loading',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: () => import('@/components/Unauthorized/index.vue'),
    meta: {
      title: '无权限访问',
      requiresAuth: false,
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
  // 开始路由跳转进度条（排除某些路由）
  if (to.path !== from.path) {
    startProgress();
  }
  
  // 设置页面标题
  const defaultTitle = 'RBAC管理系统';
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

  // 白名单路由（不需要登录）
  const whiteList = ['/login', '/401', '/404'];
  if (whiteList.includes(to.path)) {
    finishProgress();
    return true;
  }

  // 登录检查
  if (!isLoggedIn) {
    finishProgress();
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  // 已登录但访问登录页，重定向到首页
  if (to.path === '/login') {
    finishProgress();
    return from.path === '/' ? '/home' : from.fullPath;
  }

  // 初始化用户权限（如果尚未初始化）
  if (isLoggedIn && (!userStore.menus || userStore.menus.length === 0)) {
    try {
      const success = await initUserPermissions();
      if (!success) {
        // 权限初始化失败，可能是token失效
        userStore.clear_state();
        finishProgress();
        return {
          path: '/login',
          query: { redirect: to.fullPath },
        };
      }
    } catch (error) {
      console.error('权限初始化失败:', error);
      userStore.clear_state();
      finishProgress();
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }
  }

  // 权限检查
  const permissionResult = checkRoutePermission(to, from);
  if (permissionResult !== true) {
    finishProgress();
    return permissionResult;
  }

  return true;
});

// 路由跳转完成后完成进度条
router.afterEach(() => {
  // 延迟完成进度条，让页面有足够时间加载数据
  setTimeout(() => {
    finishProgress();
  }, 100);
});

// 路由跳转错误时失败进度条
router.onError((error) => {
  console.error('路由错误:', error);
  failProgress();
});
export default router;
