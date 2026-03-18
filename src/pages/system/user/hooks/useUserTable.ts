import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, batchDeleteUsers } from '@/api/system/user'
import { formatDate } from '@/utils/timeUtils'

export interface User {
  id: string
  account: string
  username: string
  deptId?: {
    id: string
    name: string
  }
  phone: string
  email: string
  status: string
  createdAt: string
}

export interface SearchForm {
  keyword: string
  deptId: string | string[]
  status: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export function useUserTable() {
  // 搜索表单
  const searchForm = reactive<SearchForm>({
    keyword: '',
    deptId: '',
    status: ''
  })

  // 表格数据
  const tableData = ref<User[]>([])
  const loading = ref(false)
  const selectedRows = ref<User[]>([])

  // 分页
  const pagination = reactive<Pagination>({
    page: 1,
    limit: 10,
    total: 0
  })

  // 加载用户列表
  const loadUserList = async () => {
    try {
      loading.value = true
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...searchForm
      }
      
      // 处理部门ID（如果是数组，取最后一个）
      if (Array.isArray(params.deptId) && params.deptId.length > 0) {
        params.deptId = params.deptId[params.deptId.length - 1]
      }
      
      const res = await getUserList(params)
      tableData.value = res.data.list
      pagination.total = res.data.pagination.total
    } catch (error) {
      console.error('加载用户列表失败:', error)
      ElMessage.error('加载用户列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.page = 1
    loadUserList()
  }

  // 重置搜索
  const resetSearch = () => {
    searchForm.keyword = ''
    searchForm.deptId = ''
    searchForm.status = ''
    handleSearch()
  }

  // 表格选择变化
  const handleSelectionChange = (rows: User[]) => {
    selectedRows.value = rows
  }

  // 分页大小变化
  const handleSizeChange = (size: number) => {
    pagination.limit = size
    pagination.page = 1
    loadUserList()
  }

  // 当前页变化
  const handleCurrentChange = (page: number) => {
    pagination.page = page
    loadUserList()
  }

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
      
      const userIds = selectedRows.value.map(row => row.id)
      await batchDeleteUsers(userIds)
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

  // 格式化日期
  const formatDateForTable = (date: string) => {
    return formatDate(date)
  }

  // 获取状态标签类型
  const getStatusTagType = (status: string) => {
    return status === '0' ? 'success' : 'danger'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    return status === '0' ? '正常' : '停用'
  }

  return {
    // 状态
    searchForm,
    tableData,
    loading,
    selectedRows,
    pagination,
    
    // 方法
    loadUserList,
    handleSearch,
    resetSearch,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    handleBatchDelete,
    formatDateForTable,
    getStatusTagType,
    getStatusText
  }
}