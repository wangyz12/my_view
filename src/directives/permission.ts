// src/directives/permission.ts
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

/**
 * 权限指令 v-permission
 * 使用方式：
 * 1. v-permission="'system:user:add'" - 单个权限
 * 2. v-permission="['system:user:add', 'system:user:edit']" - 多个权限（满足任一即可）
 * 3. v-permission:and="['system:user:add', 'system:user:edit']" - 多个权限（必须全部满足）
 */
const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const userStore = useUserStore()
    
    // 如果没有权限数据，直接显示
    if (!userStore.permissions || userStore.permissions.length === 0) {
      return
    }
    
    // 超级管理员拥有所有权限
    if (userStore.isSuperAdmin) {
      return
    }
    
    let hasPermission = false
    
    if (Array.isArray(value)) {
      // 数组：多个权限
      if (arg === 'and') {
        // 必须全部满足
        hasPermission = value.every(permission => userStore.permissions.includes(permission))
      } else {
        // 满足任一即可（默认）
        hasPermission = value.some(permission => userStore.permissions.includes(permission))
      }
    } else if (typeof value === 'string') {
      // 字符串：单个权限
      hasPermission = userStore.permissions.includes(value)
    } else {
      // 无效的权限配置，直接显示
      return
    }
    
    // 如果没有权限，移除元素
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 角色指令 v-role
 * 使用方式：
 * 1. v-role="'admin'" - 单个角色
 * 2. v-role="['admin', 'manager']" - 多个角色（满足任一即可）
 * 3. v-role:and="['admin', 'manager']" - 多个角色（必须全部满足）
 */
const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const userStore = useUserStore()
    
    // 如果没有角色数据，直接显示
    if (!userStore.roles || userStore.roles.length === 0) {
      return
    }
    
    // 超级管理员拥有所有角色
    if (userStore.isSuperAdmin) {
      return
    }
    
    let hasRole = false
    
    if (Array.isArray(value)) {
      // 数组：多个角色
      if (arg === 'and') {
        // 必须全部满足
        hasRole = value.every(roleName => 
          userStore.roles.some(role => role.name === roleName)
        )
      } else {
        // 满足任一即可（默认）
        hasRole = value.some(roleName => 
          userStore.roles.some(role => role.name === roleName)
        )
      }
    } else if (typeof value === 'string') {
      // 字符串：单个角色
      hasRole = userStore.roles.some(role => role.name === value)
    } else {
      // 无效的角色配置，直接显示
      return
    }
    
    // 如果没有角色，移除元素
    if (!hasRole) {
      el.parentNode?.removeChild(el)
    }
  }
}

export { permission, role }