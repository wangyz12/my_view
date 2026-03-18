<template>
  <el-card class="table-card">
    <template #header>
      <div class="card-header">
        <span>用户列表</span>
        <div>
          <el-button type="primary" @click="emit('add')" v-permission="'system:user:add'">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button 
            type="danger" 
            @click="handleBatchDelete" 
            :disabled="selectedRows.length === 0" 
            v-permission="'system:user:remove'"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="account" label="账号" width="120" />
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column prop="deptId.name" label="部门" width="150">
        <template #default="{ row }">
          {{ row.deptId?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateForTable(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="emit('edit', row)" v-permission="'system:user:edit'">
            编辑
          </el-button>
          <el-button type="primary" link size="small" @click="emit('assign-role', row)" v-permission="'system:user:edit'">
            分配角色
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:user:remove'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue'
import { useUserTable, type User } from '../hooks/useUserTable'

interface Props {
  tableData: User[]
  loading: boolean
  selectedRows: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

interface Emits {
  (e: 'update:selectedRows', rows: User[]): void
  (e: 'update:pagination', pagination: { page: number; limit: number; total: number }): void
  (e: 'add'): void
  (e: 'edit', row: User): void
  (e: 'assign-role', row: User): void
  (e: 'delete', row: User): void
  (e: 'batch-delete'): void
  (e: 'search'): void
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  handleSelectionChange: internalHandleSelectionChange,
  handleSizeChange: internalHandleSizeChange,
  handleCurrentChange: internalHandleCurrentChange,
  handleDelete,
  handleBatchDelete,
  formatDateForTable,
  getStatusTagType,
  getStatusText
} = useUserTable()

// 处理选择变化
const handleSelectionChange = (rows: User[]) => {
  internalHandleSelectionChange(rows)
  emit('update:selectedRows', rows)
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  internalHandleSizeChange(size)
  emit('size-change', size)
}

// 处理当前页变化
const handleCurrentChange = (page: number) => {
  internalHandleCurrentChange(page)
  emit('current-change', page)
}
</script>

<style lang="scss" scoped>
.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>