<template>
  <PageLayout type="table" :padding="false">
    <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted" @load-success="getData">
      <template #table-toolbar>
        <el-button type="primary" @click="handleEdit('新增菜单', {})" v-permission="'system:menu:add'">
          <el-icon>
            <Plus />
          </el-icon>新增
        </el-button>
      </template>
      <template #table="{ tableData, loading, displayColumns }">
        <el-table v-loading="loading" :data="tableData" row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange"
          style="width: 100%" height="100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title" label="菜单名称" width="150">
            <template #default="{ row }">
              <span v-if="row.icon" style="margin-right: 5px">
                <el-icon>
                  <component :is="row.icon" />
                </el-icon>
              </span>
              {{ row.title }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="路由名称" width="150" />
          <el-table-column prop="path" label="路由路径" width="180" />
          <el-table-column prop="component" label="组件路径" width="200" />
          <el-table-column prop="type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="getMenuTypeType(row.type)" size="small">
                {{ getMenuTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="permission" label="权限标识" width="150" />
          <el-table-column prop="hidden" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.hidden ? 'info' : 'success'" size="small">
                {{ row.hidden ? '隐藏' : '显示' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit('新增子菜单', row)"
                v-permission="'system:menu:add'">
                添加子菜单
              </el-button>
              <el-button type="primary" link size="small" @click="handleEdit('编辑菜单', row)"
                v-permission="'system:menu:edit'">
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:menu:edit'">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </BoxTable>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/components/PageLayout/index.vue'
import BoxTable from '@/components/BoxTable/index.vue'
import type { BoxTableInstance, LoadSuccessData } from '@/components/BoxTable/index.vue'
import { TableConfig, getMenuTypeLabel, getMenuTypeType, updateMenusAndRoutes, type MenuItem } from './config'
import { Plus, } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { deleteMenu } from '@/api/system/menu'
import { showAddEditMenuPopup } from './propup/index'
const tableRef = ref<InstanceType<typeof BoxTable> | null>(null)
const tableInstance = ref<BoxTableInstance | null>(null)
const menuList = ref<MenuItem[]>([])
// 表格渲染完成后的回调，获取组件实例
const handleTableMounted = (instance: BoxTableInstance) => {
  tableInstance.value = instance
  instance.queryTableList()
}
// 获取表格数据
const getData = (obj:LoadSuccessData<MenuItem>)=>{
  menuList.value = obj.data
}
const handleSelectionChange = (val: MenuItem) => {
  console.log(val)
}
const handleEdit = async (title: string, row: Object) => {
  const isAdd = title === '编辑菜单'?false:true
  const res = await showAddEditMenuPopup(title, {...row}, menuList.value,isAdd)
  if (res?.success) {
    tableInstance.value?.queryTableList()
  }
}
const handleDelete = (row: MenuItem) => {
  ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      tableInstance.value?.queryTableList()
      // 更新菜单和路由
      await updateMenusAndRoutes()
    } catch (error) {
      console.error('删除菜单失败:', error)
    }
  })
}
</script>

<style lang="scss" scoped></style>