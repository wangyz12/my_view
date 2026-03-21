<template>
  <div class="user-management">
    <!-- 搜索组件 -->
    <UserSearch
      :search-form="searchForm"
      :dept-options="deptOptions"
      :dept-props="deptProps"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格组件 -->
    <UserTable
      :table-data="tableData"
      :loading="loading"
      :selected-rows="selectedRows"
      :pagination="pagination"
      :format-date-for-table="formatDateForTable"
      :get-status-tag-type="getStatusTagType"
      :get-status-text="getStatusText"
      @update:selected-rows="handleSelectionChange"
      @add="handleAdd"
      @edit="handleEdit"
      @assign-role="handleAssignRole"
      @enable="handleEnable"
      @disable="handleDisable"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑用户弹框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="formDialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @opened="handleFormDialogOpened"
      @closed="handleFormDialogClosed"
    >
      <UserForm
        ref="userFormRef"
        :is-add="isAddMode"
        :form-data="formData"
        :dept-options="deptOptions"
        :dept-props="deptProps"
        :use-default-password="useDefaultPassword"
        @update:form-data="handleFormDataUpdate"
        @update:use-default-password="handleUseDefaultPasswordUpdate"
        @password-type-change="handlePasswordTypeChange"
      />
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色弹框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="400px"
      :close-on-click-modal="false"
    >
      <UserRoleAssign
        :role-options="roleOptions"
        :selected-role-ids="selectedRoleIds"
        @update:selected-role-ids="handleSelectedRoleIdsUpdate"
      />
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserManagement } from './hooks/useUserManagement'
import UserSearch from './components/UserSearch.vue'
import UserTable from './components/UserTable.vue'
import UserForm from './components/UserForm.vue'
import UserRoleAssign from './components/UserRoleAssign.vue'
import type { FormData } from './hooks/useUserManagement'

// 使用用户管理逻辑
const {
  // 状态
  tableData,
  loading,
  selectedRows,
  pagination,
  searchForm,
  deptOptions,
  roleOptions,
  formDialogVisible,
  roleDialogVisible,
  formDialogTitle,
  isAddMode,
  formData,
  useDefaultPassword,
  selectedRoleIds,
  currentUserId,
  currentEditUserId,
  
  // 配置
  deptProps,
  
  // 工具函数
  formatDateForTable,
  getStatusTagType,
  getStatusText,
  processDeptId,
  
  // 数据加载
  loadDeptTree,
  loadRoleOptions,
  loadUserList,
  
  // 搜索功能
  handleSearch,
  handleReset,
  
  // 表格操作
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  
  // 用户表单功能
  handlePasswordTypeChange,
  resetFormData,
  handleAdd,
  handleEdit,
  handleFormSubmit: submitForm,
  
  // 角色分配功能
  handleAssignRole,
  handleRoleSubmit,
  
  // 用户状态管理
  handleEnable,
  handleDisable,
  
  // 删除功能
  handleDelete,
  handleBatchDelete
} = useUserManagement()

// 表单引用
const userFormRef = ref()

// 处理表单数据更新
const handleFormDataUpdate = (data: FormData) => {
  Object.assign(formData, data)
}

// 处理使用默认密码更新
const handleUseDefaultPasswordUpdate = (value: boolean) => {
  useDefaultPassword.value = value
}

// 处理选中角色ID更新
const handleSelectedRoleIdsUpdate = (ids: string[]) => {
  selectedRoleIds.value = ids
}

// 处理表单弹框关闭
const handleFormDialogClosed = () => {
  if (userFormRef.value) {
    userFormRef.value.clearValidate()
  }
}

// 处理表单提交
const handleFormSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    // 验证表单
    await userFormRef.value.validate()
    
    // 提交表单
    await submitForm()
  } catch (error) {
    // 验证失败或提交失败，错误已在submitForm中处理
    console.error('表单提交失败:', error)
  }
}

// 处理表单弹框打开后的验证清除
const handleFormDialogOpened = () => {
  // 等待DOM更新后清除验证
  nextTick(() => {
    if (userFormRef.value) {
      userFormRef.value.clearValidate()
    }
  })
}
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>