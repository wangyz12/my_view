import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

// 核心验证逻辑，减少重复代码
function hasAuth(value: string | string[], arg: string | undefined, userStore: ReturnType<typeof useUserStore>, type: 'permission' | 'role'): boolean {
  // 超级管理员直接通过
  if (userStore.isSuperAdmin) return true

  // 获取数据源和比较函数
  let userAuthList: string[]
  let getItemName: (item: any) => string
  if (type === 'permission') {
    userAuthList = userStore.permissions
    getItemName = (p: string) => p
  } else {
    userAuthList = userStore.roles.map(role => role.name)
    getItemName = (r: any) => r.name || r
  }

  if (!userAuthList || userAuthList.length === 0) return false

  const permissionList = Array.isArray(value) ? value : [value]
  
  // 如果没有指定任何权限，认为有权限
  if (permissionList.length === 0) return true

  if (arg === 'and') {
    // 必须满足全部
    return permissionList.every(p => userAuthList.includes(getItemName(p)))
  } else {
    // 满足任一即可
    return permissionList.some(p => userAuthList.includes(getItemName(p)))
  }
}

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const userStore = useUserStore()

    if (!hasAuth(value, arg, userStore, 'permission')) {
      // 使用 display: none 替代 removeChild，避免 Vue 虚拟 DOM 报错
      el.style.display = 'none'
    }
  }
}

const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const userStore = useUserStore()

    if (!hasAuth(value, arg, userStore, 'role')) {
      el.style.display = 'none'
    }
  }
}

export { permission, role }