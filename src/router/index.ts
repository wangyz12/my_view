// src/router/index.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import storage from '@/utils/storage'
import { dynamicRouteManager } from './dynamic' // 导入动态路由管理器
// 定义路由组件
const Layout = () => import('@/components/layout/index.vue')
const Home = () => import('@/pages/home/index.vue')
const Login = () => import('@/pages/login/index.vue')
const NotFound = () => import('@/components/notFound/index.vue')

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          requiresAuth: true // 需要登录
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false // 不需要登录
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404',
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用哈希模式
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 滚动行为：回到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 我的应用` : '我的应用'
  const menus = storage.get('menus')
  // 获取用户store
  const userStore = useUserStore()
  
  // 检查是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // 检查是否已登录
  const isLoggedIn = userStore.accessToken || storage.get('token')
  
  if (requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    return {
      path: '/login',
      query: { redirect: to.fullPath } // 保存原路径，登录后跳回
    }
  } else if (to.path === '/login' && isLoggedIn) {
    // 已登录但访问登录页，跳转到首页
    return '/home'
  } else {
    // 返回 true 或 undefined 表示导航通过
    return true
  }
})

export default router