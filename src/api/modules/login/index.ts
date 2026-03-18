// api/modules/user.ts
import { post,get } from '../../index'
export interface LOGINPARAMS  {
  account:string;
  password:string;
  uuid?: string;
  code?: string;
}
export interface UPDATEPAW  {
  oldPassword:string;
  newPassword:string
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
/**
 * 登录接口
 * @param params 登录参数 { username: string, password: string }
 * @returns Promise<{ token: string; userInfo: { id: number; name: string; avatar?: string } }>
 */
export const login = (params: LOGINPARAMS) => {
  // 替换为你的真实后台登录接口地址
  return post<any>('/user/login', params)
}

/**
 * 修改密码
 * @param params 登录参数 { username: string, password: string }
 * @returns Promise<{ token: string; userInfo: { id: number; name: string; avatar?: string } }>
 */
export const upDatePsw = (params: UPDATEPAW) => {
  // 替换为你的真实后台登录接口地址
  return post<any>('/user/upDatePsw', params)
}

