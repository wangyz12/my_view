import { getUserList } from '@/api/system/user';
import { getAllDepts } from '@/api/system/dept';
export const TableConfig = {
  // 查询条件
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    { type: 'text', field: 'username', label: '用户名称' },
    {
      type: 'cascader',
      field: 'deptId',
      label: '部门',
      lazy: false,
      queryApi: getAllDepts,
      props:{value: 'id', label: 'name', children: 'children'}
    },
    // 下拉选择器（静态数据）
    {
      type: 'select',
      field: 'status',
      label: '状态',
      option: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    { type: 'text', field: 'phone', label: '手机号' },
  ],
  tableColumn: [
    { type: 'selection', width: '55' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'username', width: '120', label: '姓名' },
    {
      prop: 'deptId.name',
      width: '150',
      label: '部门',
      isSlot: true,
      slotName: 'deptId',
    },
    { prop: 'phone', width: '130', label: '手机号' },
    { prop: 'email', width: '180', label: '邮箱' },
    {
      prop: 'status',
      width: '80',
      label: '状态',
      isSlot: true,
      slotName: 'status',
    },
    { prop: 'createdAt', width: '200', label: '创建时间' },
    {
      fixed: 'right',
      label: '操作',
      isSlot: true,
      slotName: 'operation',
    },
  ],
  // 表格查询接口
  queryApi: getUserList,
  // 分页相关
  page: 1,
  total: 0,
  pageSize: 20,
};
/** 用户状态类型 */
export type UserStatus = 0 | 1

/** 部门信息 */
export interface DeptInfo {
  id: string
  name: string
  code: string
}

/** 用户数据类型 */
export interface UserItem {
  id: string
  account: string
  username: string
  phone: string
  email: string
  status: UserStatus
  deptId: DeptInfo | string
  createdAt?: string
  updatedAt?: string
}