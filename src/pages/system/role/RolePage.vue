<template>
  <div class="role-page">
    <!-- 角色表格 -->
    <RoleTable
      ref="roleTableRef"
      :loading="loading"
      :table-data="roleList"
      :pagination="pagination"
      @search="handleSearch"
      @reset="handleReset"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @batch-delete="handleBatchDelete"
      @refresh="handleRefresh"
      @menu-assign="handleMenuAssign"
      @dept-assign="handleDeptAssign"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RoleTable from './components/RoleTable.vue'
import RoleForm from './components/RoleForm.vue'
import RoleMenuAssign from './components/RoleMenuAssign.vue'
import RoleDeptAssign from './components/RoleDeptAssign.vue'
import { popupService } from '@/utils/popupService'
import { getRoleList, createRole, updateRole, deleteRole, batchDeleteRoles } from '@/api/system/role'

// 表格引用
const roleTableRef = ref()

// 加载状态
const loading = ref(false)

// 角色列表数据
const roleList = ref<any[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 搜索条件
const searchParams = reactive({
  name: '',
  status: ''
})

// 当前编辑的角色ID
const currentRoleId = ref('')

// 加载角色列表
const loadRoleList = async () => {
  try {
    loading.value = true
    
    const params = {
      ...searchParams,
      page: pagination.current,
      limit: pagination.size
    }
    
    console.log('📡 发送角色列表请求，参数:', params)
    const res = await getRoleList(params)
    console.log('✅ API响应:', res)
    console.log('📊 响应数据:', res.data)
    console.log('👥 角色列表数据:', res.data?.list)
    
    if (res.code === 200) {
      roleList.value = res.data?.list || []
      pagination.total = res.data?.total || 0
      console.log('🎯 赋值后的roleList:', roleList.value)
      console.log('📈 分页总数:', pagination.total)
    } else {
      console.error('❌ API返回错误:', res.msg)
      ElMessage.error(res.msg || '加载失败')
    }
  } catch (error: any) {
    console.error('❌ 加载角色列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = (params: any) => {
  Object.assign(searchParams, params)
  pagination.current = 1
  loadRoleList()
}

// 重置
const handleReset = () => {
  Object.assign(searchParams, {
    name: '',
    status: ''
  })
  pagination.current = 1
  loadRoleList()
}

// 新增角色
const handleAdd = async () => {
  try {
    await popupService.show(RoleForm, {
      isEdit: false,
      initialData: {
        name: '',
        label: '',
        dataScope: '5',
        status: '0',
        remark: ''
      }
    }, {
      title: '新增角色',
      width: '500px',
      onSuccess: async (data: any) => {
        try {
          await createRole(data)
          ElMessage.success('新增成功')
          loadRoleList()
        } catch (error: any) {
          console.error('新增角色失败:', error)
          ElMessage.error(error.response?.data?.msg || error.message || '新增失败')
          throw error // 重新抛出错误，让弹框保持打开
        }
      },
      onCancel: () => {
        console.log('用户取消了新增操作')
      }
    })
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('新增角色弹框错误:', error)
    }
  }
}

// 编辑角色
const handleEdit = async (row: any) => {
  try {
    await popupService.show(RoleForm, {
      isEdit: true,
      initialData: {
        name: row.name,
        label: row.label,
        dataScope: row.dataScope,
        status: row.status,
        remark: row.remark || ''
      }
    }, {
      title: '编辑角色',
      width: '500px',
      onSuccess: async (data: any) => {
        try {
          await updateRole(row.id, data)
          ElMessage.success('更新成功')
          loadRoleList()
        } catch (error: any) {
          console.error('更新角色失败:', error)
          ElMessage.error(error.response?.data?.msg || error.message || '更新失败')
          throw error // 重新抛出错误，让弹框保持打开
        }
      },
      onCancel: () => {
        console.log('用户取消了编辑操作')
      }
    })
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('编辑角色弹框错误:', error)
    }
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
    loadRoleList()
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async (rows: any[]) => {
  if (rows.length === 0) return
  
  // 检查是否包含admin角色
  const hasAdmin = rows.some(row => row.name === 'admin')
  if (hasAdmin) {
    ElMessage.warning('不能删除超级管理员角色')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${rows.length} 个角色吗？`,
      '提示',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    const ids = rows.map(row => row.id)
    await batchDeleteRoles(ids)
    ElMessage.success('批量删除成功')
    
    // 清空选择
    roleTableRef.value?.clearSelection()
    loadRoleList()
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error(error.message || '批量删除失败')
    }
  }
}

// 刷新
const handleRefresh = () => {
  loadRoleList()
}

// 分配菜单
const handleMenuAssign = async (row: any) => {
  try {
    await popupService.show(RoleMenuAssign, {
      roleId: row.id,
      roleName: row.label
    }, {
      title: `分配菜单权限 - ${row.label}`,
      width: '700px',
      height: '600px',
      onSuccess: () => {
        ElMessage.success('菜单分配成功')
      },
      onCancel: () => {
        console.log('用户取消了菜单分配操作')
      }
    })
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('分配菜单弹框错误:', error)
    }
  }
}

// 分配部门
const handleDeptAssign = async (row: any) => {
  try {
    await popupService.show(RoleDeptAssign, {
      roleId: row.id,
      roleName: row.label
    }, {
      title: `分配部门权限 - ${row.label}`,
      width: '700px',
      height: '600px',
      onSuccess: () => {
        ElMessage.success('部门分配成功')
      },
      onCancel: () => {
        console.log('用户取消了部门分配操作')
      }
    })
  } catch (error: any) {
    if (error.message !== 'cancel') {
      console.error('分配部门弹框错误:', error)
    }
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadRoleList()
}

// 当前页变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadRoleList()
}

// 初始化加载
onMounted(() => {
  loadRoleList()
})
</script>

<style scoped>
.role-page {
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 100px);
}
</style>