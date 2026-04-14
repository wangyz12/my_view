import request from '@/utils/request'
import { post,get } from '../index'
// 登录
export function login(data: any) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 注册
export function register(data: any) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
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

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}
/**
 * 获取验证码
 * @param params 登录参数 { username: string, password: string }
 * @returns Promise<{ token: string; userInfo: { id: number; name: string; avatar?: string } }>
 */
export const getCaptcha = (params:any) => {
  // 替换为你的真实后台登录接口地址
  return get<any>('/captcha/getCaptcha',params)
}