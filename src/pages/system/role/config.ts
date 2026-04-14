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

// 数据权限标签
export const getDataScopeType = (dataScope: string) => {
  const map: Record<string, string> = {
    '1': 'success',
    '2': 'warning',
    '3': 'info',
    '4': '',
    '5': 'danger'
  }
  return map[dataScope] || 'info'
}

export const getDataScopeLabel = (dataScope: string) => {
  const map: Record<string, string> = {
    '1': '全部数据',
    '2': '自定义',
    '3': '本部门',
    '4': '本部门及以下',
    '5': '仅本人'
  }
  return map[dataScope] || '未知'
}

export  interface ADDEDITFORM {
  name: string
  label: string
  dataScope: string
  status: string
  remark: string
}