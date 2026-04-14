import request from '@/utils/request'

// 获取用户列表
export function getUserList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUserDetail(id: string) {
  return request({
    url: `/user/detail/${id}`,
    method: 'get'
  })
}

// 创建用户
export function createUser(data: any) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(id: string, data: any) {
  return request({
    url: `/user/update/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id: string) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete'
  })
}

// 批量删除用户
export function batchDeleteUsers(ids: string[]) {
  return request({
    url: '/user/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 修改密码
export function changePassword(data: any) {
  return request({
    url: '/user/change-password',
    method: 'post',
    data
  })
}

// 修改用户信息
export function updateUserInfo(data: any) {
  return request({
    url: '/user/update-info',
    method: 'post',
    data
  })
}

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}