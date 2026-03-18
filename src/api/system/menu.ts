// src/api/system/menu.ts
import request from '@/utils/request'

// 获取菜单树
export function getMenuTree(params?: any) {
  return request({
    url: '/menu/tree',
    method: 'get',
    params
  })
}

// 获取所有菜单（下拉选择）
export function getAllMenus() {
  return request({
    url: '/menu/all',
    method: 'get'
  })
}

// 获取菜单详情
export function getMenuDetail(id: string) {
  return request({
    url: `/menu/detail/${id}`,
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data: any) {
  return request({
    url: '/menu/create',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(data: any) {
  return request({
    url: `/menu/update/${data.id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu(id: string) {
  return request({
    url: `/menu/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除菜单
export function batchDeleteMenus(ids: string[]) {
  return request({
    url: '/menu/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取当前用户菜单
export function getCurrentUserMenus() {
  return request({
    url: '/user-role/current/menus',
    method: 'get'
  })
}