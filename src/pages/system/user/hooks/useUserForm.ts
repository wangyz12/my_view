import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createUser, updateUser } from '@/api/system/user'

export interface UserFormData {
  account: string
  password: string
  username: string
  deptId: string | string[]
  phone: string
  email: string
  status: string
}

export function useUserForm() {
  // 对话框状态
  const dialogVisible = ref(false)
  const isAdd = ref(true)
  const dialogTitle = ref('')
  const formRef = ref<FormInstance>()
  const currentUserId = ref('')

  // 表单数据
  const formData = reactive<UserFormData>({
    account: '',
    password: '',
    username: '',
    deptId: '',
    phone: '',
    email: '',
    status: '0'
  })

  // 表单验证规则
  const formRules: FormRules = {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    username: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '请选择部门', trigger: 'change' }
    ],
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    email: [
      { pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式不正确', trigger: 'blur' }
    ]
  }

  // 打开新增对话框
  const openAddDialog = () => {
    isAdd.value = true
    dialogTitle.value = '新增用户'
    dialogVisible.value = true
  }

  // 打开编辑对话框
  const openEditDialog = (row: any) => {
    isAdd.value = false
    dialogTitle.value = '编辑用户'
    currentUserId.value = row.id
    
    // 填充表单数据
    Object.assign(formData, {
      account: row.account,
      password: '',
      username: row.username,
      deptId: row.deptId?.id || '',
      phone: row.phone || '',
      email: row.email || '',
      status: row.status
    })
    
    dialogVisible.value = true
  }

  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false
    resetForm()
  }

  // 重置表单
  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(formData, {
      account: '',
      password: '',
      username: '',
      deptId: '',
      phone: '',
      email: '',
      status: '0'
    })
    currentUserId.value = ''
  }

  // 处理部门ID（如果是数组，取最后一个）
  const processDeptId = (deptId: string | string[]): any => {
    if (Array.isArray(deptId) && deptId.length > 0) {
      return deptId[deptId.length - 1]
    }
    return deptId as string
  }

  // 提交表单
  const handleSubmit = async (onSuccess?: () => void) => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      
      try {
        const params = { ...formData }
        params.deptId = processDeptId(params.deptId)
        
        if (isAdd.value) {
          await createUser(params)
          ElMessage.success('新增成功')
        } else {
          await updateUser(currentUserId.value, params)
          ElMessage.success('更新成功')
        }
        
        closeDialog()
        onSuccess?.()
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      }
    })
  }

  return {
    // 状态
    dialogVisible,
    isAdd,
    dialogTitle,
    formRef,
    formData,
    formRules,
    
    // 方法
    openAddDialog,
    openEditDialog,
    closeDialog,
    resetForm,
    handleSubmit
  }
}