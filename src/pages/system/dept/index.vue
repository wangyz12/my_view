<template>
  <PageLayout type="table" :padding="false">
    <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted" @load-success="getData">
      <template #table-toolbar>
        <el-button type="primary" @click="handleEdit('新增菜单', {})" v-permission="'system:dept:add'">
          <el-icon>
            <Plus />
          </el-icon>新增
        </el-button>
      </template>
      <template #table="{ tableData, loading, displayColumns }">
        <el-table v-loading="loading" :data="tableData" row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="部门名称" width="200">
            <template #default="{ row }">
              <span style="margin-left: 10px">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="部门编码" width="120" />
          <el-table-column prop="orderNum" label="排序" width="80" />
          <el-table-column prop="leader" label="负责人" width="120" />
          <el-table-column prop="phone" label="联系电话" width="130" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
                {{ row.status === '0' ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit('新增子部门',row)" v-permission="'system:dept:add'">
              添加子部门
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit('编辑部门',row)" v-permission="'system:dept:edit'">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:dept:remove'">
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
import { deleteDept } from '@/api/system/dept'
import { TableConfig } from './config'
import {showDeptFormPopup}from './popup/index'
const tableRef = ref()
const tableInstance = ref<any>(null)
const deptList = ref<any>([])
// 表格渲染完成后的回调，获取组件实例
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList()
}
// 获取表格数据
const getData = (obj:any)=>{
  deptList.value = obj.data
}
const handleSelectionChange = (row:any)=>{
  console.log(row)
}
const handleEdit = async (title:string, row:any)=>{
  const isAdd = !!(title === '编辑部门')
  const res:any = await showDeptFormPopup(title,row,isAdd,deptList.value)
  if(res.success){
    tableInstance.value.queryTableList()
  }
}
const handleDelete = (row:any)=>{
  ElMessageBox.confirm(`确定要删除${row.name}部门吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteDept(row.id)
      ElMessage.success('删除成功')
      tableInstance.value.queryTableList()
    } catch (error: any) {
      console.log(error)
    }
  })
}
</script>

<style lang="scss" scoped></style>