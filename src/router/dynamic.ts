import type { Router, RouteRecordRaw } from 'vue-router';
import storage from '@/utils/storage';

// 菜单项接口
interface MenuItem {
  id: string;
  pid: string | null;
  name: string;
  path: string;
  component: string;
  title: string;
  icon?: string;
  sort?: number;
  type: 'menu' | 'button' | 'dir';
  hidden?: boolean;
  cache?: boolean;
  permissions?: string[];
  external?: boolean;
  target?: string;
  children?: MenuItem[];
}
// 引入所有页面组件
const modules = import.meta.glob('@/pages/**/*.vue');
class DynamicRouteManager {
  private router: Router | null = null;
  private dynamicRoutes: RouteRecordRaw[] = [];
  // 初始化
  init(router: Router) {
    this.router = router;
    // 尝试从存储恢复动态路由
    this.restoreRoutes();
  }
  // 生成并添加动态路由
  async generateAndAddRoutes(menus: MenuItem[]): Promise<boolean> {
    if (!this.router) {
      console.error('Router not initialized');
      return false;
    }
    try {
      // 生成路由配置
      const routes = this.generateRoutes(menus);
      // 添加404路由
      routes.push(this.createNotFoundRoute());
      // 动态添加路由
      routes.forEach(route => {
        this.router!.addRoute(route);
      });
      // 保存到内存和存储
      this.dynamicRoutes = routes;
      this.saveRoutes(routes);
      return true;
    } catch (error) {
      return false;
    }
  }
  // 生成路由（只将叶子节点作为路由）
  private generateRoutes(menus: MenuItem[], parentPath: string = ''): RouteRecordRaw[] {
    const routes: RouteRecordRaw[] = [];
    for (const menu of menus) {
      // 如果是隐藏菜单，跳过
      if (menu.hidden) continue;
      // 完整路径
      const fullPath = menu.path;
      // 如果有子菜单且不是叶子节点
      if (menu.children && menu.children.length > 0) {
        // 递归处理子菜单，但不把当前目录注册为路由
        const childRoutes = this.generateRoutes(menu.children, fullPath);
        routes.push(...childRoutes);
      } 
      // 如果是叶子节点（没有子菜单）且有component，才注册为路由
      else if (menu.component && menu.type === 'menu') {
        const route = this.createRouteFromMenu(menu);
        if (route) {
          routes.push(route);
        }
      }
    }
    return routes;
  }
  // 从菜单项创建路由
  private createRouteFromMenu(menu: MenuItem): any | null {
    if (!menu.component) return null;
    return {
      path: menu.path,
      name: menu.name,
      component: this.loadComponent(menu.component),
      meta: {
        title: menu.title,
        icon: menu.icon,
        hidden: menu.hidden,
        cache: menu.cache,
        permissions: menu.permissions,
        menuId: menu.id,
        pid: menu.pid
      }
    };
  }
  // 动态加载组件
  private loadComponent(componentPath: string) {
    // 清理路径
    let path = componentPath.replace(/^\//, '');
    // 构建完整的文件路径
    let fullPath = `/src/pages/${path}`;
    // 确保有 .vue 扩展名
    if (!fullPath.endsWith('.vue')) {
      fullPath += '.vue';
    }
    // 从 glob 中查找匹配的模块
    const matchedPath = Object.keys(modules).find(key => 
      key.includes(path.replace(/\.vue$/, ''))
    );
    if (matchedPath) {
      return modules[matchedPath];
    }
    // 返回一个默认组件或 404
    return () => import('@/components/notFound/index.vue');
  }
  // 创建404路由
  private createNotFoundRoute(): RouteRecordRaw {
    return {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/components/notFound/index.vue'),
      meta: { title: '404', hidden: true }
    };
  }
  // 保存路由配置到存储
  private saveRoutes(routes: RouteRecordRaw[]) {
    // 只保存必要的路由信息，避免循环引用
    const routesInfo = routes.map(route => ({
      path: route.path,
      name: route.name,
      meta: route.meta
    }));
    storage.set('dynamicRoutes', routesInfo);
    storage.set('hasDynamicRoutes', true);
  }
  // 从存储恢复路由
  private restoreRoutes() {
    if (!this.router) return;
    const hasRoutes = storage.get('hasDynamicRoutes');
    const menus = storage.get('menus');
    // 如果有菜单数据但没有动态路由标记，需要重新生成
    if (menus && menus.length > 0 && !hasRoutes) {
      this.generateAndAddRoutes(menus);
    }
  }
  // 重置路由（登出时调用）
  resetRoutes() {
    if (!this.router) return;
    // 获取所有动态路由的名称
    const routeNames = this.dynamicRoutes.map(route => route.name).filter(Boolean);
    // 移除动态路由
    routeNames.forEach(name => {
      if (name) {
        this.router!.removeRoute(name as string);
      }
    });
    // 清空存储
    this.dynamicRoutes = [];
    storage.remove('dynamicRoutes');
    storage.remove('hasDynamicRoutes');
  }
}
// 导出单例
export const dynamicRouteManager = new DynamicRouteManager();