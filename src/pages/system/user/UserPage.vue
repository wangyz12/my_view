<template>
  <div class="user-management">
    <!-- 搜索组件 -->
    <UserSearch
      :search-form="searchForm"
      :dept-options="deptOptions"
      @update:search-form="updateSearchForm"
      @search="handleSearch"
      @reset="resetSearch"
    />

    <!-- 表格组件 -->
    <UserTable
      :table-data="tableData"
      :loading="loading"
      :selected-rows="selectedRows"
      :pagination="pagination"
      @update:selected-rows="updateSelectedRows"
      @update:pagination="updatePagination"
      @add="handleAdd"
      @edit="handleEdit"
      @assign-role="handleAssignRole"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @search="handleSearch"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 表单对话框 -->
    <UserForm
      :dialog-visible="dialogVisible"
      :is-add="isAdd"
      :dialog-title="dialogTitle"
      :form-data="formData"
      :dept-options="deptOptions"
      @update:dialog-visible="updateDialogVisible"
      @update:form-data="updateFormData"
      @submit="handleFormSubmit"
      @closed="handleFormClosed"
    />

    <!-- 分配角色对话框 -->
    <UserRoleAssign
      :role-dialog-visible="roleDialogVisible"
      :role-options="roleOptions"
      :selected-role-ids="selectedRoleIds"
      @update:role-dialog-visible="updateRoleDialogVisible"
      @update:selected-role-ids="updateSelectedRoleIds"
      @submit="handleRoleSubmit"
      @closed="handleRoleClosed"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserTable } from './hooks/useUserTable'
import { useUserForm } from './hooks/useUserForm'
import { useUserRoleAssign } from './hooks/useUserRoleAssign'
import { useDeptTree } from './hooks/useDeptTree'
import UserSearch from './components/UserSearch.vue'
import UserTable from './components/UserTable.vue'
import UserForm from './components/UserForm.vue'
import UserRoleAssign from './components/UserRoleAssign.vue'

// 使用 hooks
const {
  // 状态
  searchForm,
  tableData,
  loading,
  selectedRows,
  pagination,
  
  // 方法
  loadUserList,
  handleSearch: internalHandleSearch,
  resetSearch: internalResetSearch,
  handleSelectionChange,
  handleSizeChange: internalHandleSizeChange,
  handleCurrentChange: internalHandleCurrentChange,
  handleDelete: internalHandleDelete,
  handleBatchDelete: internalHandleBatchDelete
} = useUserTable()

const {
  // 状态
  dialogVisible,
  isAdd,
  dialogTitle,
  formData,
  
  // 方法
  openAddDialog,
  openEditDialog,
  closeDialog,
  handleSubmit
} = useUserForm()

const {
  // 状态
  roleDialogVisible,
  roleOptions,
  selectedRoleIds,
  
  // 方法
  loadRoleOptions,
  openRoleAssignDialog,
  closeRoleDialog,
  handleRoleSubmit: internalHandleRoleSubmit
} = useUserRoleAssign()

const {
  // 状态
  deptOptions,
  
  // 方法
  loadDeptTree
} = useDeptTree()

// 更新搜索表单
const updateSearchForm = (form: any) => {
  Object.assign(searchForm, form)
}

// 更新选中的行
const updateSelectedRows = (rows: any[]) => {
  handleSelectionChange(rows)
}

// 更新分页
const updatePagination = (newPagination: any) => {
  Object.assign(pagination, newPagination)
}

// 更新对话框可见性
const updateDialogVisible = (visible: boolean) => {
  dialogVisible.value = visible
}

// 更新表单数据
const updateFormData = (newFormData: any) => {
  Object.assign(formData, newFormData)
}

// 更新角色对话框可见性
const updateRoleDialogVisible = (visible: boolean) => {
  roleDialogVisible.value = visible
}

// 更新选中的角色ID
const updateSelectedRoleIds = (ids: string[]) => {
  selectedRoleIds.value = ids
}

// 处理新增
const handleAdd = () => {
  openAddDialog()
}

// 处理编辑
const handleEdit = (row: any) => {
  openEditDialog(row)
}

// 处理分配角色
const handleAssignRole = (row: any) => {
  openRoleAssignDialog(row.id)
}

// 处理删除
const handleDelete = (row: any) => {
  internalHandleDelete(row)
}

// 处理批量删除
const handleBatchDelete = () => {
  internalHandleBatchDelete()
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  internalHandleSizeChange(size)
  loadUserList()
}

// 处理当前页变化
const handleCurrentChange = (page: number) => {
  internalHandleCurrentChange(page)
  loadUserList()
}

// 处理表单提交
const handleFormSubmit = () => {
  handleSubmit(() => {
    loadUserList()
  })
}

// 处理表单关闭
const handleFormClosed = () => {
  closeDialog()
}

// 处理角色提交
const handleRoleSubmit = () => {
  internalHandleRoleSubmit(() => {
    // 角色分配成功后可以刷新用户列表或进行其他操作
    loadUserList()
  })
}

// 处理角色对话框关闭
const handleRoleClosed = () => {
  closeRoleDialog()
}

// 初始化
onMounted(() => {
  loadDeptTree()
  loadRoleOptions()
  loadUserList()
})
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;
}
</style>