import router from '@/router/index';
import type { App } from 'vue';
import storage from '@/utils/storage';
import { dynamicRouteManager } from '@/router/dynamic';

const token = storage.get('token');
const menus = storage.get('menus');
export async function setupRouter(app: App) {
  // 初始化动态路由管理器
  await dynamicRouteManager.init(router);
  // 如果有token和菜单，立即生成动态路由
  if (token && menus && menus.length > 0) {
    // 使用微任务延迟执行，确保路由准备就绪
    await dynamicRouteManager.generateAndAddRoutes(menus);
  }
  // 注册路由
  app.use(router);
  // 返回路由准备好的Promise
  return router.isReady();
}