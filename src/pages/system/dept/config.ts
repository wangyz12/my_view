import { getDeptTree } from '@/api/system/dept';
export const TableConfig = {
  // 查询条件
  queryList: [
    { type: 'text', field: 'keyword', label: '部门名称' },
    // 下拉选择器（静态数据）
    {
      type: 'select',
      field: 'status',
      label: '状态',
      option: [
        { label: '正常', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
  ],
  // 表格查询接口
  queryApi: getDeptTree,
  // 分页相关
  page: 1,
  total: 0,
  pageSize: 20,
};

export interface FORMATDATA {
  parentId: string
  name: string
  code: string
  orderNum: number
  leader:string
  phone: string
  email: string
  status: string
}