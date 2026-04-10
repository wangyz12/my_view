import { defineStore } from 'pinia'

// 定义用户信息类型
interface UserInfo {
  id?: string
  account?: string
  username?: string
  avatar?: string
  phone?: string
  email?: string
  deptId?: any
  [key: string]: any
}

// 定义角色类型
interface Role {
  id: string
  name: string
  label: string
  dataScope: string
}

interface STATE {
  accessToken: string
  refreshToken: string
  userInfo: UserInfo
  menusLoaded: boolean
  menus: any[]
  isCollapse: boolean
  menuWight: string
  tabs: any[]
  // 新增权限相关字段
  permissions: string[] // 权限标识列表
  roles: Role[] // 角色列表
  isSuperAdmin: boolean // 是否是超级管理员
}

// 定义 Store
export const useUserStore = defineStore('user', {
  state: (): STATE => ({
    accessToken: '',
    refreshToken: '',
    menusLoaded: false,
    userInfo: {},
    menus: [],
    isCollapse: false,
    menuWight: '200px',
    tabs: [],
    // 新增权限相关字段
    permissions: [],
    roles: [],
    isSuperAdmin: false
  }),
  
  getters: {
    menuWidth: (state) => {
      return state.isCollapse ? '80px' : '200px'
    },
    // 检查是否有某个权限
    hasPermission: (state) => {
      return (permission: string | string[]): boolean => {
        if (state.isSuperAdmin) return true
        
        if (Array.isArray(permission)) {
          return permission.some(p => state.permissions.includes(p))
        }
        return state.permissions.includes(permission)
      }
    },
    // 检查是否有某个角色
    hasRole: (state) => {
      return (roleName: string | string[]): boolean => {
        if (state.isSuperAdmin) return true
        
        if (Array.isArray(roleName)) {
          return roleName.some(name => 
            state.roles.some(role => role.name === name)
          )
        }
        return state.roles.some(role => role.name === roleName)
      }
    },
    // 获取用户的数据权限范围
    dataScope: (state) => {
      if (state.isSuperAdmin) return '1' // 超级管理员有全部数据权限
      
      // 获取最严格的数据权限
      const dataScopes = state.roles.map(role => role.dataScope)
      if (dataScopes.includes('5')) return '5'
      if (dataScopes.includes('4')) return '4'
      if (dataScopes.includes('3')) return '3'
      if (dataScopes.includes('2')) return '2'
      return '1'
    }
  },
  
  actions: {
    clear_state() {
      this.accessToken = ''
      this.refreshToken = ''
      this.menusLoaded = false
      this.userInfo = {}
      this.menus = []
      this.isCollapse = false
      this.menuWight = '200px'
      this.tabs = []
      // 清除权限相关数据
      this.permissions = []
      this.roles = []
      this.isSuperAdmin = false
    },
    
    set_state(data: any) {
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.userInfo = data.userInfo
      this.menus = data.menus || []
      
      // 设置权限相关数据
      if (data.permissions) {
        this.permissions = data.permissions
      }
      if (data.roles) {
        this.roles = data.roles
        // 检查是否是超级管理员（拥有admin角色）
        this.isSuperAdmin = data.roles.some((role: Role) => role.name === 'admin')
      }
    },
    
    set_isCollapse(data: boolean) {
      this.isCollapse = data
    },
    // 设置权限数据
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    
    // 设置角色数据
    setRoles(roles: Role[]) {
      this.roles = roles
      this.isSuperAdmin = roles.some(role => role.name === 'admin')
    },
    
    // 添加权限
    addPermission(permission: string) {
      if (!this.permissions.includes(permission)) {
        this.permissions.push(permission)
      }
    },
    
    // 移除权限
    removePermission(permission: string) {
      const index = this.permissions.indexOf(permission)
      if (index > -1) {
        this.permissions.splice(index, 1)
      }
    },
    
    // 检查权限（兼容旧版）
    checkPermission(permission: string | string[]): boolean {
      return this.hasPermission(permission)
    },
    
    // 检查角色（兼容旧版）
    checkRole(roleName: string | string[]): boolean {
      return this.hasRole(roleName)
    }
  },
  
  // 数据持久化
  persist: {
    key: 'user-store',
    paths: ['accessToken', 'userInfo', 'menus', 'permissions', 'roles', 'isSuperAdmin']
  }
})