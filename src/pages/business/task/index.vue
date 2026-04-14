<template>
  <PageLayout type="table" :padding="true">
    <BoxTable 
      ref="tableRef" 
      :tableConfig="TableConfig"
      @mounted="handleTableMounted"
      @row-click="handleRowClick"
    >
      <!-- ========== 父级表头插槽 ========== -->
      <!-- 个人信息父级表头 -->
      <template #header-personal="{ column }">
        <div style="color: #409eff; font-weight: bold; display: flex; align-items: center; gap: 4px;">
          <el-icon><User /></el-icon>
          <span>{{ column.label }}</span>
          <el-tag size="small" type="info">父级</el-tag>
        </div>
      </template>
      
      <!-- 部门信息父级表头 -->
      <template #header-dept="{ column }">
        <div style="color: #67c23a; font-weight: bold; display: flex; align-items: center; gap: 4px;">
          <el-icon><OfficeBuilding /></el-icon>
          <span>{{ column.label }}</span>
          <el-tag size="small" type="success">父级</el-tag>
        </div>
      </template>
      
      <!-- 薪资信息父级表头 -->
      <template #header-salary="{ column }">
        <div style="color: #e6a23c; font-weight: bold; display: flex; align-items: center; gap: 4px;">
          <el-icon><Money /></el-icon>
          <span>{{ column.label }}</span>
          <el-tag size="small" type="warning">父级</el-tag>
        </div>
      </template>
      
      <!-- 状态信息父级表头 -->
      <template #header-status-group="{ column }">
        <div style="color: #f56c6c; font-weight: bold; display: flex; align-items: center; gap: 4px;">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ column.label }}</span>
          <el-tag size="small" type="danger">父级</el-tag>
        </div>
      </template>
      
      <!-- ========== 子级表头插槽 ========== -->
      <!-- 账号子级表头 -->
      <template #header-account="{ column }">
        <div style="color: #409eff;">
          <el-icon><Lock /></el-icon>
          {{ column.label }}
          <span style="font-size: 12px; color: #999;">(必填)</span>
        </div>
      </template>
      
      <!-- 姓名子级表头 -->
      <template #header-username="{ column }">
        <div style="color: #67c23a;">
          <el-icon><User /></el-icon>
          {{ column.label }}
        </div>
      </template>
      
      <!-- 手机号子级表头 -->
      <template #header-phone="{ column }">
        <div>
          📱 {{ column.label }}
        </div>
      </template>
      
      <!-- 邮箱子级表头 -->
      <template #header-email="{ column }">
        <div>
          📧 {{ column.label }}
        </div>
      </template>
      
      <!-- 部门子级表头 -->
      <template #header-deptName="{ column }">
        <div>
          🏢 {{ column.label }}
        </div>
      </template>
      
      <!-- 职位子级表头 -->
      <template #header-position="{ column }">
        <div>
          💼 {{ column.label }}
        </div>
      </template>
      
      <!-- 基本工资子级表头 -->
      <template #header-salary-amount="{ column }">
        <div style="color: #e6a23c;">
          💰 {{ column.label }}
          <el-icon><QuestionFilled /></el-icon>
        </div>
      </template>
      
      <!-- 奖金子级表头 -->
      <template #header-bonus="{ column }">
        <div style="color: #e6a23c;">
          🎁 {{ column.label }}
        </div>
      </template>
      
      <!-- 状态子级表头 -->
      <template #header-status="{ column }">
        <div>
          🔔 {{ column.label }}
        </div>
      </template>
      
      <!-- 创建时间子级表头 -->
      <template #header-createdAt="{ column }">
        <div>
          📅 {{ column.label }}
        </div>
      </template>
      
      <!-- ========== 内容插槽 ========== -->
      <!-- 状态列内容插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
          {{ row.status === 'active' ? '正常' : '禁用' }}
        </el-tag>
      </template>
      
      <!-- 操作列内容插槽 -->
      <template #operation="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </BoxTable>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, OfficeBuilding, Money, InfoFilled, Lock, QuestionFilled } from '@element-plus/icons-vue'
import PageLayout from '@/components/PageLayout/index.vue'
import BoxTable from '@/components/BoxTable/index.vue'

const tableRef = ref()
const tableInstance = ref<any>(null)

// 模拟数据接口
const mockApi = (params: any) => {
  console.log('请求参数:', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [
            { id: 1, account: 'admin', username: '管理员', deptName: '技术部', position: '经理', phone: '13800000001', email: 'admin@example.com', status: 'active', salary: 15000, bonus: 5000, createdAt: '2024-01-01' },
            { id: 2, account: 'zhangsan', username: '张三', deptName: '技术部', position: '开发工程师', phone: '13800000002', email: 'zhangsan@example.com', status: 'active', salary: 12000, bonus: 3000, createdAt: '2024-01-02' },
            { id: 3, account: 'lisi', username: '李四', deptName: '市场部', position: '市场专员', phone: '13800000003', email: 'lisi@example.com', status: 'inactive', salary: 10000, bonus: 2000, createdAt: '2024-01-03' },
            { id: 4, account: 'wangwu', username: '王五', deptName: '技术部', position: '架构师', phone: '13800000004', email: 'wangwu@example.com', status: 'active', salary: 20000, bonus: 8000, createdAt: '2024-01-04' },
            { id: 5, account: 'zhaoliu', username: '赵六', deptName: '市场部', position: '市场经理', phone: '13800000005', email: 'zhaoliu@example.com', status: 'active', salary: 16000, bonus: 4000, createdAt: '2024-01-05' }
          ],
          total: 5
        }
      })
    }, 500)
  })
}

// 表格配置 - 配置表头插槽名称
const TableConfig = {
  tableKey: 'multi_level_header_slot_test',
  queryApi: mockApi,
  apiList: 'list',
  size: 'default',
  pageSize: 20,
  pagination: true,
  
  queryList: [
    { type: 'text', field: 'account', label: '账号' },
    { type: 'text', field: 'username', label: '姓名' }
  ],
  
  tableColumn: [
    { type: 'selection', width: '55' },
    { type: 'index', width: '80', label: '序号' },
    
    // 多级表头：个人信息 - 父级表头插槽 header-personal
    {
      label: '个人信息',
      headerSlot: 'header-personal',  // 父级表头插槽
      align: 'center',
      children: [
        { 
          prop: 'account', 
          label: '账号', 
          width: '120',
          headerSlot: 'header-account'  // 子级表头插槽
        },
        { 
          prop: 'username', 
          label: '姓名', 
          width: '120',
          headerSlot: 'header-username'  // 子级表头插槽
        },
        { 
          prop: 'phone', 
          label: '手机号', 
          width: '130',
          headerSlot: 'header-phone'
        },
        { 
          prop: 'email', 
          label: '邮箱', 
          width: '200',
          headerSlot: 'header-email'
        }
      ]
    },
    
    // 多级表头：部门信息 - 父级表头插槽 header-dept
    {
      label: '部门信息',
      headerSlot: 'header-dept',
      align: 'center',
      children: [
        { 
          prop: 'deptName', 
          label: '部门', 
          width: '120',
          headerSlot: 'header-deptName'
        },
        { 
          prop: 'position', 
          label: '职位', 
          width: '120',
          headerSlot: 'header-position'
        }
      ]
    },
    
    // 多级表头：薪资信息 - 父级表头插槽 header-salary
    {
      label: '薪资信息',
      headerSlot: 'header-salary',
      align: 'center',
      children: [
        { 
          prop: 'salary', 
          label: '基本工资', 
          width: '120',
          headerSlot: 'header-salary-amount'
        },
        { 
          prop: 'bonus', 
          label: '奖金', 
          width: '120',
          headerSlot: 'header-bonus'
        }
      ]
    },
    
    // 多级表头：状态信息 - 父级表头插槽 header-status-group
    {
      label: '状态信息',
      headerSlot: 'header-status-group',
      align: 'center',
      children: [
        { 
          prop: 'status', 
          label: '状态', 
          width: '100',
          isSlot: true, 
          slotName: 'status',
          headerSlot: 'header-status'
        },
        { 
          prop: 'createdAt', 
          label: '创建时间', 
          width: '180',
          headerSlot: 'header-createdAt'
        }
      ]
    },
    
    { 
      fixed: 'right', 
      label: '操作', 
      width: '150',
      isSlot: true, 
      slotName: 'operation' 
    }
  ]
}

const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList()
}

const handleRowClick = (row: any) => {
  ElMessage.info(`点击了用户: ${row.username}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户: ${row.username}`)
}

const handleDelete = (row: any) => {
  ElMessage.info(`删除用户: ${row.username}`)
}
</script>

<style lang="scss" scoped>
</style>