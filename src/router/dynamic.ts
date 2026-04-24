import type { Router, RouteRecordRaw } from 'vue-router';
import storage from '@/utils/storage';
/**
 * 动态路由管理器
 * 
 * 【核心原理】
 * 1. 后端返回菜单树（包含路径、组件、权限等信息）
 * 2. 前端把菜单树转换成 Vue Router 的 routes 配置
 * 3. 通过 router.addRoute() 动态添加到路由表中
 * 
 * 【为什么需要动态路由？】
 * - 不同角色看到的菜单不一样（管理员 vs 普通员工）
 * - 静态写死路由，无法根据权限动态调整
 * - 动态路由 = 权限驱动的路由
 */
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
  private layoutName = 'Layout';
  private isGenerating = false;  // 防重复标志
  private generatedMenusHash = '';  // 菜单哈希

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
    // 防重复：如果正在生成或菜单未变化，跳过
    const menusHash = JSON.stringify(menus)
    if (this.isGenerating || this.generatedMenusHash === menusHash) {
      console.log('路由正在生成中或菜单未变化，跳过')
      return true
    }

    this.isGenerating = true
    this.generatedMenusHash = menusHash
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
    if (!componentPath) {
      console.warn('Component path is empty');
      return () => import('@/components/notFound/index.vue');
    }

    // 清理并规范化路径
    let path = componentPath.replace(/^\//, '').replace(/\.vue$/i, '');
    
    // 构建可能的匹配路径（多个匹配模式提高兼容性）
    const candidates = [
      // 模式1: /src/pages/business/project/index
      `/src/pages/${path}`,
      // 模式2: /src/pages/business/project/index.vue
      `/src/pages/${path}.vue`,
    ];

    // 从 glob 中查找匹配的模块（支持多种后端返回格式）
    for (const candidate of candidates) {
      if (modules[candidate]) {
        return modules[candidate];
      }
    }
    
    // 兜底：使用模糊匹配（处理路径前缀匹配）
    const matchedKey = Object.keys(modules).find(key => {
      // 移除 /src/pages/ 前缀后比较
      const normalizedKey = key.replace(/^\/src\/pages\//, '').replace(/\.vue$/, '');
      const normalizedPath = path.replace(/\.vue$/, '');
      return normalizedKey === normalizedPath || normalizedKey.endsWith('/' + normalizedPath);
    });

    if (matchedKey) {
      return modules[matchedKey];
    }
    
    // 诊断日志：输出所有已知模块路径帮助调试
    if (Object.keys(modules).length > 0) {
      const sampleKeys = Object.keys(modules).slice(0, 5).join(', ');
      console.warn(
        `Component not found: "${componentPath}". ` +
        `Tried candidates: ${JSON.stringify(candidates)}. ` +
        `Available modules sample: ${sampleKeys}`
      );
    } else {
      console.warn(`Component not found: "${componentPath}". No modules found via import.meta.glob.`);
    }
    
    // 返回一个默认组件或 404
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
  // 页面刷新后，Vue Router 内存中的路由表会丢失
  // 需要重新从 localStorage 取出菜单数据，重新生成路由
  private restoreRoutes() {
    if (!this.router) return;
    
    const menus = storage.get('menus');
    
    // 如果 localStorage 中有菜单数据，则重新生成动态路由
    // 刷新后 router.getRoutes() 中已经没有这些路由了
    if (menus && menus.length > 0) {
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