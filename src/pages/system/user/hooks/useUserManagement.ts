// src/pages/system/user/hooks/useUserManagement.ts
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getUserList, 
  createUser, 
  updateUser, 
  deleteUser, 
  batchDeleteUsers 
} from '@/api/system/user'
import { assignUserRoles, getUserRoles } from '@/api/system/userRole'
import { getAllRoles } from '@/api/system/role'
import { getDeptTree } from '@/api/system/dept'

// ==================== 类型定义 ====================
export interface User {
  id: string
  account: string
  username: string
  deptId: {
    id: string
    name: string
  }
  phone: string
  email: string
  status: string // '0' - 正常, '1' - 停用
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface Dept {
  id: string
  name: string
  code: string
  children?: Dept[]
}

export interface Role {
  id: string
  name: string
  label: string
}

export interface SearchForm {
  account?: string
  username?: string
  deptId?: string | string[]
  phone?: string
  status?: string
}

export interface FormData {
  account: string
  password: string
  username: string
  deptId: string | string[]
  phone: string
  email: string
  status: string
  avatar: string
}

export function useUserManagement() {
  // ==================== 状态管理 ====================
  // 表格数据
  const tableData = ref<User[]>([])
  const loading = ref(false)
  const selectedRows = ref<User[]>([])
  
  // 分页
  const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
  })
  
  // 搜索表单
  const searchForm = reactive<SearchForm>({})
  
  // 部门树
  const deptOptions = ref<Dept[]>([])
  
  // 角色列表
  const roleOptions = ref<Role[]>([])
  
  // 弹框控制
  const formDialogVisible = ref(false)
  const roleDialogVisible = ref(false)
  const formDialogTitle = ref('')
  const isAddMode = ref(true)
  
  // 表单数据
  const formData = reactive<FormData>({
    account: '',
    password: 'work_123',
    username: '',
    deptId: '',
    phone: '',
    email: '',
    status: '0',
    avatar: ''
  })
  
  // 使用默认密码开关
  const useDefaultPassword = ref(true)
  
  // 分配角色相关
  const selectedRoleIds = ref<string[]>([])
  const currentUserId = ref('')
  const currentEditUserId = ref('')
  
  // ==================== 配置 ====================
  // 部门选择器配置
  const deptProps = {
    value: 'id',
    label: 'name',
    children: 'children',
    checkStrictly: true
  }
  
  // ==================== 工具函数 ====================
  // 格式化日期
  const formatDateForTable = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-')
  }
  
  // 获取状态标签类型
  const getStatusTagType = (status: string) => {
    return status === '0' ? 'success' : 'danger'
  }
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    return status === '0' ? '正常' : '停用'
  }
  
  // 处理部门ID（如果是数组，取最后一个）
  const processDeptId = (deptId: string | string[]): any => {
    if (Array.isArray(deptId) && deptId.length > 0) {
      return deptId[deptId.length - 1]
    }
    return deptId as string
  }
  
  // ==================== 数据加载 ====================
  // 加载部门树
  const loadDeptTree = async () => {
    try {
      const res = await getDeptTree()
      deptOptions.value = res.data || []
    } catch (error) {
      console.error('加载部门树失败:', error)
      ElMessage.error('加载部门树失败')
    }
  }
  
  // 加载角色列表
  const loadRoleOptions = async () => {
    try {
      const res = await getAllRoles()
      roleOptions.value = res.data || []
    } catch (error) {
      console.error('加载角色列表失败:', error)
      ElMessage.error('加载角色列表失败')
    }
  }
  
  // 加载用户列表
  const loadUserList = async () => {
    loading.value = true
    try {
      // 处理部门ID（如果是数组，取最后一个）
      const deptId = Array.isArray(searchForm.deptId) && searchForm.deptId.length > 0 
        ? searchForm.deptId[searchForm.deptId.length - 1] 
        : searchForm.deptId
      
      const params = {
        ...searchForm,
        deptId,
        page: pagination.page,
        limit: pagination.limit
      }
      
      const res = await getUserList(params)
      tableData.value = res.data.list || []
      pagination.total = res.data.pagination?.total || 0
    } catch (error) {
      console.error('加载用户列表失败:', error)
      ElMessage.error('加载用户列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // ==================== 搜索功能 ====================
  // 处理搜索
  const handleSearch = () => {
    pagination.page = 1
    loadUserList()
  }
  
  // 处理重置
  const handleReset = () => {
    Object.keys(searchForm).forEach(key => {
      (searchForm as any)[key] = undefined
    })
    pagination.page = 1
    loadUserList()
  }
  
  // ==================== 表格操作 ====================
  // 处理选择变化
  const handleSelectionChange = (rows: User[]) => {
    selectedRows.value = rows
  }
  
  // 处理分页大小变化
  const handleSizeChange = (size: number) => {
    pagination.limit = size
    pagination.page = 1
    loadUserList()
  }
  
  // 处理当前页变化
  const handleCurrentChange = (page: number) => {
    pagination.page = page
    loadUserList()
  }
  
  // ==================== 用户表单功能 ====================
  // 处理密码类型变化
  const handlePasswordTypeChange = (value: boolean) => {
    if (value) {
      // 切换到默认密码
      formData.password = 'work_123'
    } else {
      // 切换到自定义密码，清空密码
      formData.password = ''
    }
  }
  
  // 重置表单数据
  const resetFormData = () => {
    Object.assign(formData, {
      account: '',
      password: 'work_123',
      username: '',
      deptId: '',
      phone: '',
      email: '',
      status: '0',
      avatar: ''
    })
    useDefaultPassword.value = true
    currentEditUserId.value = ''
  }
  
  // 打开新增用户弹框
  const handleAdd = () => {
    isAddMode.value = true
    formDialogTitle.value = '新增用户'
    resetFormData()
    formDialogVisible.value = true
  }
  
  // 打开编辑用户弹框
  const handleEdit = (row: User) => {
    isAddMode.value = false
    formDialogTitle.value = '编辑用户'
    currentEditUserId.value = row.id // 保存用户ID
    
    // 填充表单数据
    Object.assign(formData, {
      account: row.account,
      password: '', // 编辑时不显示密码
      username: row.username || '',
      deptId: row.deptId?.id || row.deptId || '',
      phone: row.phone || '',
      email: row.email || '',
      status: row.status || '0',
      avatar: row.avatar || ''
    })
    useDefaultPassword.value = false
    
    formDialogVisible.value = true
  }
  
  // 处理表单提交
  const handleFormSubmit = async () => {
    try {
      // 如果使用默认密码，确保密码是默认值
      if (useDefaultPassword.value) {
        formData.password = 'work_123'
      }
      
      const params: any = { ...formData }
      params.deptId = processDeptId(params.deptId)
      
      // 处理空值字段
      if (!params.phone) delete params.phone
      if (!params.email) delete params.email
      if (!params.avatar) delete params.avatar
      
      // 编辑时不发送密码字段
      if (!isAddMode.value) {
        delete params.password
      }
      
      if (isAddMode.value) {
        // 新增用户
        console.log('创建用户参数:', params)
        const result = await createUser(params)
        console.log('创建用户响应:', result)
        // 检查是否真的是错误（code不是200或201）
        if (result.code && result.code !== 200 && result.code !== 201) {
          throw new Error(result.msg || '新增失败')
        }
        ElMessage.success(result.msg || '新增成功')
      } else {
        // 编辑用户 - 使用保存的用户ID
        if (currentEditUserId.value) {
          console.log('更新用户参数:', currentEditUserId.value, params)
          const result = await updateUser(currentEditUserId.value, params)
          console.log('更新用户响应:', result)
          // 检查是否真的是错误（code不是200）
          if (result.code && result.code !== 200) {
            throw new Error(result.msg || '更新失败')
          }
          ElMessage.success(result.msg || '更新成功')
        } else {
          ElMessage.error('找不到要编辑的用户ID')
          return
        }
      }
      
      // 关闭弹框并刷新列表
      formDialogVisible.value = false
      loadUserList()
    } catch (error: any) {
      console.error('表单提交失败 - 完整错误对象:', error)
      console.error('错误code:', error.code)
      console.error('错误response:', error.response)
      console.error('错误message:', error.message)
      
      // 检查是否是成功的响应被误判为错误
      // 如果错误对象有code属性且是200或201，说明是成功的响应
      if (error.code === 201 || error.code === 200) {
        // 这是成功的响应，不是错误
        console.log('操作成功，但响应被误判为错误')
        return
      }
      
      // 如果错误对象有response.data且code是200或201
      if (error.response?.data?.code === 201 || error.response?.data?.code === 200) {
        console.log('操作成功，API返回成功状态码')
        return
      }
      
      // 只有真正的错误才显示错误消息
      if (error.response?.data?.msg || error.message) {
        ElMessage.error(error.response?.data?.msg || error.message || '操作失败')
      }
      throw error
    }
  }
  
  // ==================== 角色分配功能 ====================
  // 打开分配角色弹框
  const handleAssignRole = async (row: User) => {
    try {
      currentUserId.value = row.id
      
      // 获取用户当前角色
      const res = await getUserRoles(row.id)
      const userRoles = res.data || []
      selectedRoleIds.value = userRoles.map((role: Role) => role.id)
      
      roleDialogVisible.value = true
    } catch (error) {
      console.error('获取用户角色失败:', error)
      ElMessage.error('获取用户角色失败')
    }
  }
  
  // 处理角色分配提交
  const handleRoleSubmit = async () => {
    try {
      const params = {
        userId: currentUserId.value,
        roleIds: selectedRoleIds.value
      }
      console.log('📡 分配用户角色参数:', params)
      await assignUserRoles(params)
      ElMessage.success('角色分配成功')
      roleDialogVisible.value = false
    } catch (error: any) {
      console.error('分配角色失败:', error)
      ElMessage.error(error.response?.data?.msg || error.message || '分配失败')
    }
  }
  
  // ==================== 用户状态管理 ====================
  // 启用用户
  const handleEnable = async (row: User) => {
    try {
      await ElMessageBox.confirm('确定要启用该用户吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      
      await updateUser(row.id, { status: '0' })
      ElMessage.success('启用成功')
      loadUserList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('启用用户失败:', error)
        ElMessage.error('启用失败')
      }
    }
  }
  
  // 禁用用户
  const handleDisable = async (row: User) => {
    try {
      await ElMessageBox.confirm('确定要禁用该用户吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      
      await updateUser(row.id, { status: '1' })
      ElMessage.success('禁用成功')
      loadUserList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('禁用用户失败:', error)
        ElMessage.error('禁用失败')
      }
    }
  }
  
  // ==================== 删除功能 ====================
  // 删除用户
  const handleDelete = async (row: User) => {
    try {
      await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      loadUserList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除用户失败:', error)
        ElMessage.error('删除失败')
      }
    }
  }
  
  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择要删除的用户')
      return
    }
    
    try {
      await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      
      const ids = selectedRows.value.map(row => row.id)
      await batchDeleteUsers(ids)
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      loadUserList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败:', error)
        ElMessage.error('批量删除失败')
      }
    }
  }
  
  // ==================== 初始化 ====================
  onMounted(() => {
    loadDeptTree()
    loadRoleOptions()
    loadUserList()
  })
  
  return {
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
    handleFormSubmit,
    
    // 角色分配功能
    handleAssignRole,
    handleRoleSubmit,
    
    // 用户状态管理
    handleEnable,
    handleDisable,
    
    // 删除功能
    handleDelete,
    handleBatchDelete
  }
}