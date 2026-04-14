import { getUserList } from '@/api/system/user';
import { getDeptTree } from '@/api/system/dept';
export const TableConfig = {
  // 查询条件
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    // 远程搜索输入框配置
    // {
    //   type: 'remote',
    //   field: 'userId',
    //   label: '用户',
    //   queryApi: searchUserApi, // 搜索接口
    //   props: {
    //     value: 'id',
    //     label: 'name'
    //   },
    //   // 可选配置
    //   debounceTime: 500, // 防抖延迟时间，默认300ms
    //   minSearchLength: 2, // 最小搜索长度
    //   maxResults: 20, // 最大返回结果数
    //   skipEmptySearch: true, // 是否跳过空搜索
    //   showTipOnShortLength: true, // 搜索长度不足时是否显示提示
    //   defaultFirstOption: false, // 是否默认选中第一个选项
    //   reserveKeyword: false, // 是否在选中选项后保留搜索关键字
    //   queryParams: (keyword) => ({ keyword, type: 'user' }), // 动态参数
    //   formatData: (data) => data.map(item => ({ value: item.id, label: item.name })) // 自定义格式化
    // },
    // 下拉选择器（远程接口）
    // {
    //   type: 'select',
    //   field: 'deptId',
    //   label: '部门',
    //   queryApi: getDeptList,
    //   props: { value: 'id', label: 'name' },
    //   lazy: false, // 是否懒加载（聚焦时才加载）
    //   queryParams: { status: 1 }, // 固定参数
    //   formatData: (data) => data.map(item => ({ value: item.id, label: item.name }))
    // },
    // 下拉选择器（字典接口）
    // {
    //   type: 'select',
    //   field: 'status',
    //   label: '状态',
    //   dictType: 'sys_user_status', // 字典类型
    //   // 或者自定义字典接口
    //   dictApi: getDictDataApi,
    //   lazy: false
    // }
    { type: 'text', field: 'username', label: '用户名称' },
    // 使用插槽自定义
    // {
    //   field: 'deptId',
    //   label: '部门',
    //   isSlot: true,
    //   slotName: 'deptId'  // 插槽名称，不填则使用 field
    // },
    {
      type: 'cascader',
      field: 'deptId',
      label: '部门',
      lazy: false,
      queryApi: getDeptTree,
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