// src/api/system/userRole.ts
import request from '@/utils/request'

// 为用户分配角色
export function assignUserRoles(data: any) {
  console.log('📡 分配用户角色 API 调用:', data)
  return request({
    url: '/user-role/assign',
    method: 'post',
    data
  })
}

// 批量分配角色
export function batchAssignRoles(data: any) {
  return request({
    url: '/user-role/batch-assign',
    method: 'post',
    data
  })
}

// 获取用户的角色列表
export function getUserRoles(userId: string) {
  return request({
    url: `/user-role/user/${userId}/roles`,
    method: 'get'
  })
}

// 获取用户详情（包含角色）
export function getUserWithRoles(userId: string) {
  return request({
    url: `/user-role/user/${userId}/detail`,
    method: 'get'
  })
}

// 获取角色下的用户列表
export function getRoleUsers(roleId: string, params?: any) {
  return request({
    url: `/user-role/role/${roleId}/users`,
    method: 'get',
    params
  })
}

// 获取当前用户的菜单权限
export function getCurrentUserMenus() {
  return request({
    url: '/user-role/current/menus',
    method: 'get'
  })
}

// 获取当前用户的权限标识
export function getCurrentUserPermissions() {
  return request({
    url: '/user-role/current/permissions',
    method: 'get'
  })
}

// 获取当前用户的数据权限
export function getCurrentUserDataScope() {
  return request({
    url: '/user-role/current/data-scope',
    method: 'get'
  })
}

// 检查当前用户是否有某个权限
export function checkUserPermission(permission: string) {
  return request({
    url: '/user-role/current/check-permission',
    method: 'post',
    data: { permission }
  })
}