import { useUserStore } from '@/store/modules/user'
import { getCurrentUserMenus, getCurrentUserPermissions, getCurrentUserDataScope } from '@/api/system/userRole'
import { getUserDetail } from '@/api/system/user'
import router from '@/router'
import { dynamicRouteManager } from '@/router/dynamic'

/**
 * 初始化用户权限
 */
export async function initUserPermissions() {
  const userStore = useUserStore()
  
  try {
    // 1. 获取用户菜单
    const menuRes = await getCurrentUserMenus()
    userStore.menus = menuRes.data
    
    // 2. 生成动态路由
    if (menuRes.data && menuRes.data.length > 0) {
      await dynamicRouteManager.generateAndAddRoutes(menuRes.data)
    }
    
    // 3. 获取用户权限标识
    const permRes = await getCurrentUserPermissions()
    userStore.setPermissions(permRes.data)
    
    // 4. 获取用户数据权限
    const dataScopeRes = await getCurrentUserDataScope()
    // 数据权限信息可以存储在userInfo中或单独的状态中
    
    // 5. 获取用户详情（包含角色信息）
    if (userStore.userInfo?.id) {
      const userDetailRes = await getUserDetail(userStore.userInfo.id)
      if (userDetailRes.data.roles) {
        userStore.setRoles(userDetailRes.data.roles)
      }
    }
    
    return true
  } catch (error) {
    console.error('初始化用户权限失败:', error)
    return false
  }
}

/**
 * 检查路由权限
 * @param to 目标路由
 * @param from 来源路由
 */
export function checkRoutePermission(to: any, from: any) {
  const userStore = useUserStore()
  
  // 不需要权限检查的路由
  const whiteList = ['/login', '/404', '/401']
  if (whiteList.includes(to.path)) {
    return true
  }
  
  // 检查是否登录
  if (!userStore.accessToken) {
    return '/login'
  }
  
  // 检查是否有菜单权限
  if (to.meta?.permission) {
    const requiredPermission = to.meta.permission
    if (!userStore.checkPermission(requiredPermission)) {
      // 没有权限，跳转到401页面
      return '/401'
    }
  }
  
  // 检查是否有角色权限
  if (to.meta?.roles) {
    const requiredRoles = to.meta.roles
    if (!userStore.checkRole(requiredRoles)) {
      return '/401'
    }
  }
  
  return true
}

/**
 * 动态添加路由
 * 根据用户菜单权限动态添加路由
 */
export function addDynamicRoutes() {
  const userStore = useUserStore()
  
  // 这里可以根据userStore.menus动态添加路由
  // 由于你的项目已经有静态路由，这里主要处理动态路由的添加
  
  // 示例：将菜单转换为路由
  const convertMenuToRoute = (menu: any) => {
    return {
      path: menu.path,
      name: menu.name,
      component: () => import(`@/pages${menu.component}.vue`),
      meta: {
        title: menu.title,
        icon: menu.icon,
        permission: menu.permission,
        cache: menu.cache,
        hidden: menu.hidden
      }
    }
  }
  
  // 递归处理子菜单
  const processMenus = (menus: any[]) => {
    menus.forEach(menu => {
      if (menu.type === 'menu' && !menu.external) {
        const route = convertMenuToRoute(menu)
        
        // 添加到路由
        router.addRoute('Layout', route)
        
        // 处理子菜单
        if (menu.children && menu.children.length > 0) {
          processMenus(menu.children)
        }
      }
    })
  }
  
  // 开始处理
  processMenus(userStore.menus)
}

/**
 * 重置权限状态
 */
export function resetPermissions() {
  const userStore = useUserStore()
  userStore.clear_state()
}

/**
 * 检查按钮权限
 * @param permission 权限标识
 * @returns 是否有权限
 */
export function checkButtonPermission(permission: string): boolean {
  const userStore = useUserStore()
  return userStore.checkPermission(permission)
}

/**
 * 检查数据权限
 * @param deptId 部门ID
 * @returns 是否有权限访问该部门的数据
 */
export function checkDataPermission(deptId: string): boolean {
  const userStore = useUserStore()
  
  // 超级管理员有全部权限
  if (userStore.isSuperAdmin) {
    return true
  }
  
  const dataScope = userStore.dataScope
  
  switch (dataScope) {
    case '1': // 全部数据权限
      return true
      
    case '2': // 自定义数据权限
      // 这里需要根据用户自定义的部门权限来检查
      // 暂时返回true，实际项目中需要从后端获取用户的自定义部门权限
      return true
      
    case '3': // 本部门数据权限
      return deptId === userStore.userInfo.deptId?.id
      
    case '4': // 本部门及以下数据权限
      // 这里需要检查部门树，暂时简单处理
      return deptId === userStore.userInfo.deptId?.id
      
    case '5': // 仅本人数据权限
      return false // 按钮权限不涉及数据权限
      
    default:
      return false
  }
}