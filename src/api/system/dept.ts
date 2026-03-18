// src/api/system/dept.ts
import request from '@/utils/request'

// 获取部门树
export function getDeptTree(params?: any) {
  return request({
    url: '/dept/tree',
    method: 'get',
    params
  })
}

// 获取所有部门（下拉选择）
export function getAllDepts() {
  return request({
    url: '/dept/all',
    method: 'get'
  })
}

// 获取部门详情
export function getDeptDetail(id: string) {
  return request({
    url: `/dept/detail/${id}`,
    method: 'get'
  })
}

// 创建部门
export function createDept(data: any) {
  return request({
    url: '/dept/create',
    method: 'post',
    data
  })
}

// 更新部门
export function updateDept(data: any) {
  return request({
    url: `/dept/update/${data.id}`,
    method: 'put',
    data
  })
}

// 删除部门
export function deleteDept(id: string) {
  return request({
    url: `/dept/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除部门
export function batchDeleteDepts(ids: string[]) {
  return request({
    url: '/dept/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 获取部门用户统计
export function getDeptUserStats() {
  return request({
    url: '/dept/stats',
    method: 'get'
  })
}