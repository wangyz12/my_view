import { getRoleList } from '@/api/system/role';

export const TableConfig = {
  // 查询条件
  queryList: [],
  tableColumn: [
    { type: 'selection', width: '55' },
    { prop: 'name', width: '120', label: '角色标识' },
    { prop: 'label', width: '120', label: '角色名称' },
    { prop: 'dataScope', width: '120', label: '数据权限',isSlot: true,slotName:'dataScope' },
    { prop: 'status', width: '80', label: '状态',isSlot: true,slotName:'status'  },
    { prop: 'remark', width: '180', label: '备注' },
    { prop: 'createdAt', width: '200', label: '创建时间' },
    {
      fixed: 'right',
      label: '操作',
      isSlot: true,
      slotName: 'operation',
    },
  ],
  // 表格查询接口
  queryApi: getRoleList,
  // 分页相关
  page: 1,
  total: 0,
  pageSize: 20,
};

export  interface ADDEDITFORM {
  name: string
  label: string
  dataScope: string
  status: string
  remark: string
}


/** 数据权限类型 */
export type DataScope = '1' | '2' | '3' | '4' | '5'

/** 角色状态 */
export type RoleStatus = 0 | 1

/** 角色数据类型 */
export interface RoleItem {
  id: string
  name: string
  label: string
  dataScope: DataScope
  status: RoleStatus
  remark?: string
  createdAt?: string
  updatedAt?: string
}

// ==================== 数据权限映射 ====================

/** 数据权限标签 */
export const getDataScopeLabel = (dataScope: DataScope): string => {
  const map: Record<DataScope, string> = {
    '1': '全部数据',
    '2': '自定义数据',
    '3': '本部门数据',
    '4': '本部门及以下',
    '5': '仅本人数据'
  }
  return map[dataScope] || '未知'
}

/** 数据权限标签类型 */
export const getDataScopeType = (dataScope: DataScope): 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<DataScope, 'success' | 'warning' | 'info' | 'danger'> = {
    '1': 'danger',
    '2': 'warning',
    '3': 'info',
    '4': 'info',
    '5': 'success'
  }
  return map[dataScope] || 'info'
}