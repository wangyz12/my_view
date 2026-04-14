<template>
  <div class="role-table-container">
    <!-- 搜索区域 -->
    <div class="search-area" v-if="showSearch">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色标识">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入角色标识"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" style="width: 200px" placeholder="请选择状态" clearable>
            <el-option label="启用" value="0" />
            <el-option label="禁用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-area" v-if="showActions">
      <div class="left-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
      <div class="right-actions">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-area">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="角色标识" width="120" />
        <el-table-column prop="label" label="角色名称" width="120" />
        <el-table-column prop="dataScope" label="数据权限" width="100">
          <template #default="{ row }">
            <el-tag :type="getDataScopeType(row.dataScope)">
              {{ getDataScopeLabel(row.dataScope) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === '0' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="primary" link @click="handleMenuAssign(row)">
              分配菜单
            </el-button>
            <!-- <el-button type="primary" link @click="handleDeptAssign(row)">
              分配部门
            </el-button> -->
            <el-button
              type="danger"
              link
              @click="handleDelete(row)"
              :disabled="row.name === 'admin'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-area" v-if="showPagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'

interface Props {
  showSearch?: boolean
  showActions?: boolean
  showPagination?: boolean
  loading?: boolean
  tableData?: any[]
  pagination?: {
    current: number
    size: number
    total: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  showActions: true,
  showPagination: true,
  loading: false,
  tableData: () => [],
  pagination: () => ({
    current: 1,
    size: 10,
    total: 0
  })
})

const emit = defineEmits<{
  (e: 'search', params: any): void
  (e: 'reset'): void
  (e: 'add'): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'batch-delete', rows: any[]): void
  (e: 'refresh'): void
  (e: 'menu-assign', row: any): void
  (e: 'dept-assign', row: any): void
  (e: 'size-change', size: number): void
  (e: 'current-change', current: number): void
  (e: 'selection-change', rows: any[]): void
}>()

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 选中的行
const selectedRows = ref<any[]>([])

// 数据权限标签
const getDataScopeType = (dataScope: string) => {
  const map: Record<string, string> = {
    '1': 'success',
    '2': 'warning',
    '3': 'info',
    '4': '',
    '5': 'danger'
  }
  return map[dataScope] || 'info'
}

const getDataScopeLabel = (dataScope: string) => {
  const map: Record<string, string> = {
    '1': '全部数据',
    '2': '自定义',
    '3': '本部门',
    '4': '本部门及以下',
    '5': '仅本人'
  }
  return map[dataScope] || '未知'
}

// 事件处理
const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  emit('reset')
}

const handleAdd = () => {
  emit('add')
}

const handleEdit = (row: any) => {
  emit('edit', row)
}

const handleDelete = (row: any) => {
  emit('delete', row)
}

const handleBatchDelete = () => {
  emit('batch-delete', selectedRows.value)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleMenuAssign = (row: any) => {
  emit('menu-assign', row)
}

const handleDeptAssign = (row: any) => {
  emit('dept-assign', row)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleCurrentChange = (current: number) => {
  emit('current-change', current)
}

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
  emit('selection-change', rows)
}

// 暴露方法
const clearSelection = () => {
  selectedRows.value = []
}

defineExpose({
  clearSelection
})
</script>

<style scoped>
.role-table-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-area {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 8px;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.table-area {
  flex: 1;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>