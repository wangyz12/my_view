<template>
  <PageLayout type="table" :padding="false">
    <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted">
      <!-- 表格列插槽 -->
      <template #deptId="{ row }">
        <span>{{ row.deptId?.name || '-' }}</span>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status == 0 ? 'success' : 'danger'">
          {{ row.status == 0 ? '启用' : '停用' }}
        </el-tag>
      </template>
      <!-- 工具按钮 -->
      <template #table-toolbar>
        <el-button type="primary" @click="handleAdd" v-permission="'system:user:edit'">
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)"
          v-permission="'system:user:edit'">编辑</el-button>
        <el-button type="primary" link size="small" @click="handleRole(row)" v-permission="'system:user:edit'">
          分配角色
        </el-button>
        <el-button v-if="row.status === '1'" type="success" link size="small" @click="handelClick('enable', row)"
          v-permission="'system:user:edit'">
          启用
        </el-button>
        <el-button v-if="row.status === '0'" type="warning" link size="small" @click="handelClick('disable', row)"
          v-permission="'system:user:edit'">
          禁用
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)"
          v-permission="'system:user:edit'">删除</el-button>
      </template>
    </BoxTable>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/components/PageLayout/index.vue'
import BoxTable from '@/components/BoxTable/index.vue'
import { TableConfig,type UserItem } from './config'
import type { BoxTableInstance } from '@/components/BoxTable/index.vue'
import { showChangePasswordPopup, showRloePropup } from './propup/index'
import {
  deleteUser,
  updateUser
} from '@/api/system/user'
import { ElMessage, ElMessageBox } from 'element-plus'
/** 弹窗返回结果 */
interface PopupResult {
  success: boolean
  data?: any
}
const tableRef = ref<InstanceType<typeof BoxTable> | null>(null)
const tableInstance = ref<BoxTableInstance | null>(null)

// 表格渲染完成后的回调，获取组件实例
const handleTableMounted = (instance: BoxTableInstance): void => {
  tableInstance.value = instance
  instance.queryTableList()
}
/** 新增用户 */
const handleAdd = async (): Promise<void> => {
  const res = await showChangePasswordPopup('新增用户', {}) as PopupResult
  if (res?.success) {
    tableInstance.value?.queryTableList()
  }
}

/** 编辑用户 */
const handleEdit = async (row: UserItem): Promise<void> => {
  const deptIdValue = typeof row.deptId === 'object' ? row.deptId?.id : row.deptId
  const params = {
    ...row,
    deptId: deptIdValue
  }
  const res = await showChangePasswordPopup('编辑用户', params) as PopupResult
  if (res?.success) {
    tableInstance.value?.queryTableList()
  }
}
const handleDelete = (row: UserItem) => {
  ElMessageBox.confirm(
    '是否删除该数据',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      tableInstance.value?.queryTableList()
    })
    .catch(() => {
    })
}
const handelClick = async (str: string, row: UserItem) => {
  try {
    await ElMessageBox.confirm(`是否${str === 'enable' ? '启用' : '禁用'}该用户`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    const status = str === 'enable' ? '0' : '1'
    await updateUser(row.id, { status })
    ElMessage.success('启用成功')
    tableInstance.value?.queryTableList()
  } catch (error) {
  }
}
const handleRole = async (row: any) => {
  const res = await showRloePropup(row)
  if (res.success) {
    tableInstance.value?.queryTableList()
  }
}
</script>

<style lang="scss" scoped></style>