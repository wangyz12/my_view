<template>
  <PageLayout type="table" :padding="false">
    <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted">
      <!-- 工具按钮 -->
      <template #table-toolbar>
        <el-button type="primary" @click="handleEdit('新增角色', {})" v-permission="'system:role:edit'">
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>
      </template>
      <template #dataScope="{ row }">
        <el-tag :type="getDataScopeType(row.dataScope)">
          {{ getDataScopeLabel(row.dataScope) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status == 0 ? 'success' : 'danger'">
          {{ row.status == 0 ? '启用' : '停用' }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleEdit('编辑角色', row)" v-permission="'system:role:edit'">
          编辑
        </el-button>
        <el-button type="primary" link @click="handleMenuAssign(row)" v-permission="'system:role:edit'">
          分配菜单
        </el-button>
        <el-button v-permission="'system:role:edit'" type="danger" link @click="handleDelete(row)"
          :disabled="row.name === 'admin'">
          删除
        </el-button>
      </template>
    </BoxTable>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/components/PageLayout/index.vue'
import BoxTable from '@/components/BoxTable/index.vue'
import { ElMessageBox } from 'element-plus'
import { TableConfig, getDataScopeType, getDataScopeLabel } from './config'
import { showAddEditRloePopup, showUserMenuPopup } from './propup/index'
import { deleteRole } from '@/api/system/role'
const tableRef = ref()
const tableInstance = ref<any>(null)
// 表格渲染完成后的回调，获取组件实例
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList()
}
const handleEdit = async (title: string, row: any) => {
  const res: any = await showAddEditRloePopup(title, row)
  if (res.success) {
    tableInstance.value.queryTableList()
  }
}
const handleMenuAssign = async (row: any) => {
  const res: any = await showUserMenuPopup(`为${row.label}分配菜单`, row.id, row.label)
  if (res.success) {
    tableInstance.value.queryTableList()
  }
}
// 删除角色
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.label}" 吗？`,
      '提示',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    tableInstance.value.queryTableList()
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}
</script>

<style lang="scss" scoped></style>