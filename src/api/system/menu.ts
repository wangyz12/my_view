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

// 创建菜单
export function createMenu(data: any) {
  return request({
    url: '/menu/addMenu',
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
    url: '/menu/delMenu',
    method: 'post',
    data: { id }
  })
}



// 获取当前用户菜单
export function getCurrentUserMenus() {
  return request({
    url: '/user-role/current/menus',
    method: 'get'
  })
}