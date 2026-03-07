import { defineStore } from 'pinia'
// 定义用户信息类型（可选，替代 any）
interface UserInfo {
  id?: number
  name?: string
  avatar?: string
  [key: string]: any
}
interface STATE {
  accessToken:string
  refreshToken:string
  userInfo:UserInfo 
  menusLoaded: boolean
  menus:any[]
}
// 定义 Store（参数1：唯一标识，参数2：状态配置）
export const useUserStore = defineStore('user', {
  state:() => <STATE>({
    accessToken: '',
    refreshToken:'',
    menusLoaded:false,
    userInfo: {},
    menus:[]
  }),
  getters: {
 
  },
  actions: {
    set_state(data:STATE){
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.userInfo = data.userInfo;
      this.menus = data.menus
    },
  },
  // 数据持久化
  persist: {
    key: 'user-store', // 自定义存储键名
    paths: ['accessToken', 'userInfo','menus'] // 只持久化 token 和 userInfo
  }
})