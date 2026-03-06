// api/modules/user.ts
import { post } from '../../index'
interface LOGINPARAMS  {
  account:string;
  password:string
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
