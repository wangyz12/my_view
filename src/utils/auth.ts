import storage from './storage';
import { dynamicRouteManager } from '@/router/dynamic';
import router from '@/router/index';

// 登录成功后的处理
export async function handleLoginSuccess(token: string, menus: any[]) {
  // 保存token和菜单
  storage.set('token', token);
  storage.set('menus', menus);
  
  // 生成动态路由
  await dynamicRouteManager.generateAndAddRoutes(menus);
  
  // 跳转到首页或目标页面
  router.push('/');
}

// 登出处理
export function handleLogout() {
  // 清除token和菜单
  storage.remove('token');
  storage.remove('menus');
  
  // 重置动态路由
  dynamicRouteManager.resetRoutes();
  
  // 跳转到登录页
  router.push('/login');
}