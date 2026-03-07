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
  private layoutName = 'Layout'; // Layout 路由的名称

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
      // 先清除原有的动态路由（只清除之前添加的动态路由，保留静态路由）
      this.resetRoutes();

      // 检查 Layout 路由是否存在
      const layoutExists = this.router.hasRoute(this.layoutName);
      if (!layoutExists) {
        console.error('Layout route not found, please check your router configuration');
        return false;
      }

      // 生成路由配置（保持原有路径格式）
      const routes = this.generateRoutes(menus);

      // 将动态路由添加到 Layout 下
      routes.forEach(route => {
        // 保持原有路径格式，不修改路径
        this.router!.addRoute(this.layoutName, route);
      });

      // 保存到内存和存储
      this.dynamicRoutes = routes;
      this.saveRoutes(routes);

      // 打印调试信息
      console.log('动态路由添加完成，当前路由信息：', this.getRouteInfo());

      return true;
    } catch (error) {
      console.error('Failed to generate routes:', error);
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
        // 如果是目录类型且有component，则创建父路由
        if (menu.type === 'dir' && menu.component) {
          const parentRoute = this.createRouteFromMenu(menu);
          if (parentRoute) {
            // 递归处理子菜单作为children
            parentRoute.children = this.generateRoutes(menu.children, fullPath);
            routes.push(parentRoute);
          } else {
            // 如果没有component，则只处理子路由
            const childRoutes = this.generateRoutes(menu.children, fullPath);
            routes.push(...childRoutes);
          }
        } else {
          // 如果不是目录类型，递归处理子菜单
          const childRoutes = this.generateRoutes(menu.children, fullPath);
          routes.push(...childRoutes);
        }
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
        pid: menu.pid,
        type: menu.type
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
    console.warn(`Component not found: ${componentPath}`);
    return () => import('@/components/notFound/index.vue');
  }

  // 重置路由（登出时调用）
  resetRoutes() {
    if (!this.router) return;
    
    // 只移除之前添加的动态路由
    this.dynamicRoutes.forEach(route => {
      if (route.name) {
        try {
          // 检查路由是否还存在
          const existingRoute = this.router!.getRoutes().find(r => r.name === route.name);
          if (existingRoute) {
            this.router!.removeRoute(route.name as string);
          }
        } catch (e) {
          // 忽略移除失败的
        }
      }
    });
    
    // 清空存储
    this.dynamicRoutes = [];
    storage.remove('dynamicRoutes');
    storage.remove('hasDynamicRoutes');
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

  // 获取路由信息（用于调试）
  getRouteInfo() {
    if (!this.router) return null;
    
    const routes = this.router.getRoutes();
    const layoutRoute = routes.find(r => r.name === this.layoutName);
    
    return {
      staticRoutes: routes
        .filter(r => r.name !== this.layoutName && !this.dynamicRoutes.some(dr => dr.name === r.name))
        .map(r => ({ path: r.path, name: r.name })),
      layoutChildren: layoutRoute?.children?.map(c => ({ 
        path: c.path, 
        name: c.name,
        isHome: c.path === 'home' 
      })),
      dynamicRoutes: this.dynamicRoutes.map(r => ({ path: r.path, name: r.name }))
    };
  }
}

// 导出单例
export const dynamicRouteManager = new DynamicRouteManager();