<!-- pages/system/user/index.vue -->
<template>
  <PageLayout type="table" :padding="true">
    <BoxTable 
      ref="tableRef" 
      :tableConfig="TableConfig"
      @mounted="handleTableMounted"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      @selection-change="handleSelectionChange"
      @load-success="handleLoadSuccess"
    >
      <!-- 部门列插槽（显示部门名称） -->
      <template #deptId="{ row }">
        <span>{{ row.deptId?.name || '-' }}</span>
      </template>
      
      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status === '0' ? 'success' : 'danger'">
          {{ row.status === '0' ? '启用' : '禁用' }}
        </el-tag>
      </template>
      
      <!-- 工具栏按钮 -->
      <template #table-toolbar>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
        <el-button type="danger" plain @click="handleBatchDelete">
          批量删除 ({{ selectedRows.length }})
        </el-button>
      </template>
      
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click="handleAssignRole(row)">
          分配角色
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </BoxTable>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageLayout from '@/components/PageLayout/index.vue'
import BoxTable from '@/components/BoxTable/index.vue'
import { getUserList } from '@/api/system/user'


// 表格实例
const tableRef = ref()
const tableInstance = ref<any>(null)
const selectedRows = ref<any[]>([])

// 表格配置
const TableConfig = {
  tableKey: 'user_table',
  queryApi: getUserList,
  exportApi: null,
  exportFileName: '用户列表',
  size: 'default',
  pageSize: 20,
  pagination: true,
  apiList: 'list',  // 接口返回数据中列表字段名
  
  // 查询表单配置
  queryList: [
    { type: 'text', field: 'account', label: '账号', defaultValue: '' },
    { type: 'text', field: 'username', label: '用户名称', defaultValue: '' },
    { type: 'text', field: 'phone', label: '手机号', defaultValue: '' },
    { 
      type: 'select', 
      field: 'status', 
      label: '状态',
      option: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ],
      defaultValue: ''
    }
  ],
  
  // 表格列配置
  tableColumn: [
    { type: 'selection', width: '55' },
    { type: 'index', width: '80', label: '序号' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'username', width: '120', label: '姓名' },
    { prop: 'deptId', width: '150', label: '部门', isSlot: true, slotName: 'deptId' },
    { prop: 'phone', width: '130', label: '手机号' },
    { prop: 'email', width: '180', label: '邮箱' },
    { prop: 'status', width: '80', label: '状态', isSlot: true, slotName: 'status' },
    { prop: 'createdAt', width: '180', label: '创建时间' },
    { fixed: 'right', label: '操作', width: '240', isSlot: true, slotName: 'operation' }
  ],
  
  // 行样式自定义（示例：禁用行变灰）
  rowClassName: ({ row, rowIndex }: { row: any; rowIndex: number }) => {
    if (row.status === '1') {
      return 'disabled-row'
    }
    return ''
  },
  
  // 单元格合并（示例：合并相同账号的行）
  // spanMethod: ({ row, column, rowIndex, columnIndex }: any) => {
  //   if (columnIndex === 0 && rowIndex % 2 === 0) {
  //     return { rowspan: 2, colspan: 1 }
  //   }
  //   if (columnIndex === 0 && rowIndex % 2 === 1) {
  //     return { rowspan: 0, colspan: 0 }
  //   }
  //   return { rowspan: 1, colspan: 1 }
  // }
}

// 表格挂载完成
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList()
}

// 行单击
const handleRowClick = (row: any, column: any, event: Event) => {
  ElMessage.success(`单击了表格`)
  // 可做预览等操作
}

// 行双击
const handleRowDblClick = (row: any, column: any, event: Event) => {
  ElMessage.success(`单击了表格`)
}

// 选中变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  console.log('选中行:', selection)
}

// 加载成功
const handleLoadSuccess = ({ data, total }: { data: any[]; total: number }) => {
  console.log(`加载完成：共 ${total} 条数据`)
}

// 新增
const handleAdd = async () => {
    ElMessage.success('新增点击')
}

// 编辑
const handleEdit = async (row: any) => {
    ElMessage.success('编辑点击')
}

// 分配角色
const handleAssignRole = async (row: any) => {
    ElMessage.success('角色分配点击')
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定删除用户「${row.username}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    ElMessage.success('删除点击')
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return
  
  ElMessageBox.confirm(
    `确定删除选中的 ${selectedRows.value.length} 个用户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    ElMessage.success('批量删除点击')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
// 自定义行样式
:deep(.disabled-row) {
  color: #c0c4cc;
  background-color: #f5f7fa;
}
</style>