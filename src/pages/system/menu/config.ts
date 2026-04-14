import { getMenuTree } from '@/api/system/menu'
import { useUserStore } from '@/store/modules/user';
import storage from '@/utils/storage';
import { dynamicRouteManager } from '@/router/dynamic'
import { getCurrentUserMenus } from '@/api/system/userRole'
import {type FormRules } from 'element-plus'
export const TableConfig = {
  // 查询条件
  queryList: [],
  tableColumn: [],
  // 表格查询接口
  queryApi: getMenuTree,
  // 分页相关
  page: 1,
  total: 0,
  pageSize: 20,
};

// 菜单类型标签
export const getMenuTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    'menu': '菜单',
    'button': '按钮',
    'iframe': '内嵌页面'
  }
  return map[type] || type
}

// 菜单类型标签样式
export const getMenuTypeType = (type: string) => {
  const map: Record<string, string> = {
    'menu': 'primary',
    'button': 'warning',
    'iframe': 'success'
  }
  return map[type] || 'info'
}

// 更新菜单和路由
export const updateMenusAndRoutes = async () => {
  try {
    // 1. 重新获取用户菜单
    const menuRes = await getCurrentUserMenus()
    const menus = menuRes.data || []

    // 2. 更新用户store
    const userStore = useUserStore()
    userStore.menus = menus

    // 3. 更新持久化存储
    storage.set('menus', menus)

    // 4. 更新动态路由
    await dynamicRouteManager.generateAndAddRoutes(menus)

    console.log('菜单和路由更新成功')
  } catch (error) {
    console.error('更新菜单和路由失败:', error)
  }
}
// 表单验证规则
export const formRules: FormRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入路由名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '必须以字母开头，只能包含字母、数字、下划线', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    { pattern: /^\/[a-zA-Z0-9_\-/]*$/, message: '必须以/开头，只能包含字母、数字、下划线、横线和斜杠', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  permission: [
    { pattern: /^[a-zA-Z:]+$/, message: '只能包含字母和冒号', trigger: 'blur' }
  ]
}


export const commonIcons = [
  'Home', 'User', 'Setting', 'Menu', 'Document', 'Folder', 'Grid', 'Collection',
  'Search', 'Edit', 'Delete', 'Plus', 'Minus', 'Close', 'Check', 'ArrowRight',
  'ArrowLeft', 'ArrowUp', 'ArrowDown', 'CaretRight', 'CaretLeft', 'CaretTop', 'CaretBottom',
  'ZoomIn', 'ZoomOut', 'Refresh', 'More', 'View', 'Hide', 'Tools', 'Monitor',
  'Location', 'Connection', 'Service', 'Timer', 'Calendar', 'Filter', 'Operation',
  'DataBoard', 'DataLine', 'PieChart', 'Histogram', 'SetUp', 'Reading', 'Notebook',
  'Wallet', 'CreditCard', 'ShoppingCart', 'Goods', 'Printer', 'Camera', 'Phone',
  'VideoCamera', 'Picture', 'Upload', 'Download', 'Files', 'FolderOpened',
  'AlarmClock', 'Coffee', 'Food', 'IceCream', 'Star', 'Bell', 'ChatDotRound',
  'Warning', 'Info', 'Success', 'QuestionFilled'
]

/** 菜单数据类型 */
export interface MenuItem {
  id: string
  title: string
  name: string
  path: string
  component: string
  type: 'menu' | 'button' | 'iframe'
  permission: string
  hidden: boolean
  sort: number
  icon?: string
  parentId?: string | null
  children?: MenuItem[]
}
/** 菜单类型 */
type MenuType = 'menu' | 'button' | 'iframe'
/** 表单数据类型 */
export  interface MenuFormData {
  pid: string | string[] | null
  name: string
  path: string
  component: string
  title: string
  icon: string
  sort: number
  type: MenuType
  hidden: boolean
  cache: boolean
  permission: string
  external: boolean
  target: '_self' | '_blank'
}

/** 默认表单数据 */
export const DEFAULT_FORM_DATA: MenuFormData = {
  pid: '',
  name: '',
  path: '',
  component: '',
  title: '',
  icon: '',
  sort: 0,
  type: 'menu',
  hidden: false,
  cache: true,
  permission: '',
  external: false,
  target: '_self'
}