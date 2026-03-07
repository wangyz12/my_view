// api/modules/user.ts
import { post } from '../../index'
export interface LOGINPARAMS  {
  account:string;
  password:string
}
export interface UPDATEPAW  {
  oldPassword:string;
  newPassword:string
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

