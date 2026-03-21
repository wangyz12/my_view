// src/api/system/role.ts
import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params: any) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

// 获取所有角色（下拉选择）
export function getAllRoles() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

// 获取角色详情
export function getRoleDetail(id: string) {
  return request({
    url: `/role/detail/${id}`,
    method: 'get'
  })
}

// 创建角色
export function createRole(data: any) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(id: string, data: any) {
  return request({
    url: `/role/update/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id: string) {
  return request({
    url: `/role/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除角色
export function batchDeleteRoles(ids: string[]) {
  return request({
    url: '/role/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取角色菜单树
export function getRoleMenuTree(roleId: string) {
  return request({
    url: `/role/${roleId}/menu-tree`,
    method: 'get'
  })
}

// 获取角色部门树
export function getRoleDeptTree(roleId: string) {
  return request({
    url: `/role/${roleId}/dept-tree`,
    method: 'get'
  })
}

// 分配角色菜单
export function assignRoleMenus(roleId: string, menuIds: string[]) {
  console.log('📡 分配角色菜单 API 调用:', { roleId, menuIds })
  return request({
    url: `/role/${roleId}/assign-menus`,
    method: 'post',
    data: { menuIds }
  })
}

// 分配角色部门
export function assignRoleDepts(roleId: string, deptIds: string[]) {
  return request({
    url: `/role/${roleId}/assign-depts`,
    method: 'post',
    data: { deptIds }
  })
}

// 获取菜单树（用于角色分配菜单）
export function getMenuTree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

// 获取部门树（用于角色分配部门）
export function getDeptTree() {
  return request({
    url: '/dept/tree',
    method: 'get'
  })
}

// 获取角色已分配的菜单
export function getRoleMenus(roleId: string) {
  console.log('📡 获取角色已有菜单 API 调用:', roleId)
  return request({
    url: `/role/${roleId}/menus`,
    method: 'get'
  })
}

// 获取角色已分配的部门
export function getRoleDepts(roleId: string) {
  console.log('📡 获取角色已有部门 API 调用:', roleId)
  return request({
    url: `/role/${roleId}/depts`,
    method: 'get'
  })
}