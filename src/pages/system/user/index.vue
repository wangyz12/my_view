<template>
  <div class="user-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="账号">
              <el-input 
                v-model="searchForm.account" 
                placeholder="请输入账号" 
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input 
                v-model="searchForm.username" 
                placeholder="请输入姓名" 
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
            <el-form-item label="部门">
              <el-cascader
                v-model="searchForm.deptId"
                :options="deptOptions"
                :props="deptProps"
                placeholder="请选择部门"
                style="width: 100%"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select 
                v-model="searchForm.status" 
                placeholder="请选择状态"
                style="width: 100%"
                clearable
              >
                <el-option label="正常" value="0" />
                <el-option label="停用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input 
                v-model="searchForm.phone" 
                placeholder="请输入手机号" 
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="18">
            <el-form-item label-width="0">
              <div class="search-actions">
                <el-button type="primary" @click="handleSearch">
                  <el-icon><Search /></el-icon>搜索
                </el-button>
                <el-button @click="handleReset">
                  <el-icon><Refresh /></el-icon>重置
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAdd" v-permission="'system:user:add'">
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
        <el-table-column prop="phone" label="手机号" width="130">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
          <template #default="{ row }">
            {{ row.email || '-' }}
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button type="primary" link size="small" @click="handleEdit(row)" v-permission="'system:user:edit'">
                编辑
              </el-button>
              <el-button type="primary" link size="small" @click="handleAssignRole(row)" v-permission="'system:user:edit'">
                分配角色
              </el-button>
              <el-button 
                v-if="row.status === '1'" 
                type="success" 
                link 
                size="small" 
                @click="handleEnable(row)" 
                v-permission="'system:user:edit'"
              >
                启用
              </el-button>
              <el-button 
                v-if="row.status === '0'" 
                type="warning" 
                link 
                size="small" 
                @click="handleDisable(row)" 
                v-permission="'system:user:edit'"
              >
                禁用
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:user:remove'">
                删除
              </el-button>
            </div>
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

    <!-- 新增/编辑用户弹框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="formDialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @closed="handleFormDialogClosed"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="account">
          <el-input 
            v-model="formData.account" 
            placeholder="请输入账号，2-50个字符" 
            :disabled="!isAddMode"
          />
          <div class="form-tip">账号创建后不可修改</div>
        </el-form-item>

        <!-- 密码设置（仅新增时显示） -->
        <el-form-item v-if="isAddMode" label="密码设置" required>
          <div class="password-setting">
            <el-switch
              v-model="useDefaultPassword"
              active-text="使用默认密码"
              inactive-text="自定义密码"
              @change="handlePasswordTypeChange"
            />
            <div v-if="useDefaultPassword" class="default-password-tip">
              <el-alert
                title="默认密码: work_123"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
            <div v-else class="custom-password">
              <el-form-item prop="password" class="no-margin">
                <el-input
                  v-model="formData.password"
                  type="password"
                  placeholder="请输入密码，必须包含字母、下划线和数字"
                  show-password
                />
              </el-form-item>
              <div class="password-rule">
                密码规则：必须包含字母、下划线和数字，长度至少6位
              </div>
            </div>
          </div>
        </el-form-item>
        
        <!-- 编辑时的提示 -->
        <el-form-item v-if="!isAddMode" label="密码">
          <div class="password-tip">
            <el-alert
              title="如需修改密码，请使用专门的修改密码功能"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="username">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入姓名，2-50个字符" 
          />
        </el-form-item>

        <!-- 所属部门 -->
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            v-model="formData.deptId"
            :options="deptOptions"
            :props="deptProps"
            placeholder="请选择所属部门"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="formData.phone" 
            placeholder="请输入手机号" 
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="formData.email" 
            placeholder="请输入邮箱" 
            type="email"
          />
        </el-form-item>

        <!-- 用户状态 -->
        <el-form-item label="用户状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 头像（可选） -->
        <el-form-item label="头像" prop="avatar">
          <el-input 
            v-model="formData.avatar" 
            placeholder="请输入头像URL（可选）" 
          />
          <div class="form-tip">支持图片URL地址，可为空</div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色弹框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="选择角色">
          <el-select
            v-model="selectedRoleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.label"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
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
interface User {
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

interface Dept {
  id: string
  name: string
  code: string
  children?: Dept[]
}

interface Role {
  id: string
  name: string
  label: string
}

interface SearchForm {
  account?: string
  username?: string
  deptId?: string | string[]
  phone?: string
  status?: string
}

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
const formData = reactive({
  account: '',
  password: 'work_123',
  username: '',
  deptId: '' as string | string[],
  phone: '',
  email: '',
  status: '0',
  avatar: ''
})

// 表单引用
const formRef = ref<FormInstance>()

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

// ==================== 表单验证 ====================
// 自定义密码验证函数
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
    return
  }
  
  if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
    return
  }
  
  // 检查是否包含字母、下划线和数字
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasUnderscore = /_/.test(value)
  const hasNumber = /\d/.test(value)
  
  if (!hasLetter || !hasUnderscore || !hasNumber) {
    callback(new Error('密码必须包含字母、下划线和数字'))
    return
  }
  
  callback()
}

// 动态表单验证规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    username: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '所属部门不能为空', trigger: 'change' }
    ],
    phone: [
      { 
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'))
            return
          }
          callback()
        },
        trigger: 'blur' 
      }
    ],
    email: [
      { 
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            callback(new Error('邮箱格式不正确'))
            return
          }
          callback()
        },
        trigger: 'blur' 
      }
    ],
    status: [
      { required: true, message: '请选择用户状态', trigger: 'change' }
    ],
    avatar: [
      { 
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          // 简单的URL验证
          if (!/^https?:\/\/.+/i.test(value)) {
            callback(new Error('请输入有效的URL地址'))
            return
          }
          callback()
        },
        trigger: 'blur' 
      }
    ]
  }
  
  // 只有新增时才需要账号和密码验证
  if (isAddMode.value) {
    rules.account = [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 2, max: 50, message: '账号长度在 2 到 50 个字符', trigger: 'blur' }
    ]
    rules.password = [
      { validator: validatePassword, trigger: 'blur' }
    ]
  }
  
  return rules
})

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
  
  // 等待DOM更新后清除验证
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
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
  
  // 等待DOM更新后清除验证
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 处理表单弹框关闭
const handleFormDialogClosed = () => {
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 处理表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
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
        await createUser(params)
        ElMessage.success('新增成功')
      } else {
        // 编辑用户 - 使用保存的用户ID
        if (currentEditUserId.value) {
          await updateUser(currentEditUserId.value, params)
          ElMessage.success('更新成功')
        } else {
          ElMessage.error('找不到要编辑的用户ID')
          return
        }
      }
      
      // 关闭弹框并刷新列表
      formDialogVisible.value = false
      loadUserList()
    } catch (error: any) {
      console.error('表单提交失败:', error)
      ElMessage.error(error.response?.data?.msg || error.message || '操作失败')
    }
  })
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
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-actions {
  display: flex;
  gap: 12px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.password-setting {
  .default-password-tip {
    margin-top: 10px;
  }
  
  .custom-password {
    margin-top: 10px;
    
    .no-margin {
      margin-bottom: 0;
    }
    
    .password-rule {
      margin-top: 5px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.password-tip {
  :deep(.el-alert) {
    padding: 8px 16px;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>