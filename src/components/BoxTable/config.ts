// import { getUserList } from '@/api/system/user';
// import { getDeptTree } from '@/api/system/dept';
// import { getRoleList } from '@/api/system/role';
// import { getDictData } from '@/api/system/dict';

// 使用组件完整的配置
export const TableConfig = {
  // ==================== 基础配置 ====================
  // 表格唯一标识（用于保存列设置到 localStorage）
  tableKey: 'user_table',
  // 用于表格取不同的数据list  默认是list，具体角色页面使用过
  apiList:'list',
  // 数据查询接口
  // queryApi: getUserList,
  // 控制表格的border
  border:true,
  // 导出接口（可选，配置后自动显示导出按钮）
  exportApi: null, // 如果有导出接口，填入函数名
  
  // 导出文件名
  exportFileName: '用户列表',
  
  // 表格密度：large（宽松）、default（默认）、small（紧凑）
  size: 'default',
  
  // 每页显示条数
  pageSize: 20,
  
  // 是否显示分页
  pagination: true,
  
  // ==================== 查询表单配置 ====================
  // 每行显示几个查询项
  columnsPerRow: 3,
  
  // 是否默认展开查询表单（超过 columnsPerRow 时）
  defaultExpand: false,
  
  // 查询表单列表
  queryList: [
    // 1. 文本输入框
    { 
      type: 'text', 
      field: 'account', 
      label: '账户',
      defaultValue: '' 
    },
    
    // 2. 文本输入框
    { 
      type: 'text', 
      field: 'username', 
      label: '用户名称',
      defaultValue: '' 
    },
    
    // 3. 级联选择器（部门）
    { 
      type: 'cascader', 
      field: 'deptId', 
      label: '部门',
      lazy: false,
      // queryApi: getDeptTree,
      props: {
        value: 'id',      // 接口返回的 value 字段名
        label: 'name',    // 接口返回的 label 字段名
        children: 'children'  // 子级字段名
      }
    },
    
    // 4. 下拉选择器（静态数据 - 状态）
    { 
      type: 'select', 
      field: 'status', 
      label: '状态',
      option: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
      defaultValue: ''
    },
    
    // 5. 下拉选择器（远程接口 - 角色）
    { 
      type: 'select', 
      field: 'roleId', 
      label: '角色',
      // queryApi: getRoleList,
      props: { 
        value: 'id', 
        label: 'name' 
      },
      lazy: true,  // 聚焦时才加载
      defaultValue: ''
    },
    
    // 6. 下拉选择器（字典接口）
    { 
      type: 'select', 
      field: 'userType', 
      label: '用户类型',
      dictType: 'sys_user_type',  // 字典类型
      lazy: false,
      defaultValue: ''
    },
    
    // 7. 日期范围选择器
    { 
      type: 'daterange', 
      field: 'createTime', 
      label: '创建时间',
      defaultValue: []
    },
    
    // 8. 远程搜索框（可选）
    // { 
    //   type: 'remote', 
    //   field: 'userId', 
    //   label: '负责人',
    //   queryApi: searchUserApi,
    //   props: { value: 'id', label: 'name' },
    //   debounceTime: 500,
    //   minSearchLength: 2,
    //   maxResults: 20,
    //   skipEmptySearch: true,
    //   defaultValue: ''
    // },
    
    // 9. 自定义插槽示例（需要自定义组件时使用）
    // { 
    //   field: 'customField', 
    //   label: '自定义',
    //   isSlot: true,
    //   slotName: 'customField',
    //   defaultValue: ''
    // }
  ],
  
  // ==================== 表格列配置 ====================
  tableColumn: [
    // 多选框列
    { 
      type: 'selection', 
      width: '55' 
    },
    
    // 序号列
    { 
      type: 'index', 
      width: '80', 
      label: '序号' 
    },
    
    // 普通列 - 账号
    { 
      prop: 'account', 
      width: '120', 
      label: '账号',
      sortable: false,
      showOverflowTooltip: true
    },
    
    // 普通列 - 姓名
    { 
      prop: 'username', 
      width: '120', 
      label: '姓名' 
    },
    
    // 部门列 - 支持嵌套属性（dept.name）
    { 
      prop: 'dept.name', 
      width: '150', 
      label: '部门' 
    },
    
    // 手机号
    { 
      prop: 'phone', 
      width: '130', 
      label: '手机号' 
    },
    
    // 邮箱
    { 
      prop: 'email', 
      width: '180', 
      label: '邮箱' 
    },
    
    // 状态列 - 使用插槽自定义渲染
    { 
      prop: 'status', 
      width: '80', 
      label: '状态',
      isSlot: true,      // 启用插槽
      slotName: 'status' // 插槽名称，在页面中使用 #status
    },
    
    // 创建时间 - 可排序
    { 
      prop: 'createTime', 
      width: '180', 
      label: '创建时间',
      sortable: true
    },
    
    // 操作列 - 固定在右侧
    { 
      fixed: 'right', 
      label: '操作', 
      width: '150',
      isSlot: true,      // 启用插槽
      slotName: 'operation'  // 插槽名称，在页面中使用 #operation
    }
  ],

   // 行样式自定义
   rowClassName: ({ row, rowIndex }:any) => {
    if (row.status === '1') return 'disabled-row'
    return ''
  },
  
  // 行内联样式
  rowStyle: ({ row, rowIndex }:any) => {
    if (row.status === '1') return { color: '#999' }
    return {}
  },
  
  // 单元格合并
  spanMethod: ({ row, column, rowIndex, columnIndex }:any) => {
    if (columnIndex === 0 && rowIndex % 2 === 0) {
      return { rowspan: 2, colspan: 1 }
    }
    return { rowspan: 1, colspan: 1 }
  }
};