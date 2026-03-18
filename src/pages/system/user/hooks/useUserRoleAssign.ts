import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRoles } from '@/api/system/role'
import { assignUserRoles, getUserRoles } from '@/api/system/userRole'

export interface Role {
  id: string
  name: string
  label: string
}

export function useUserRoleAssign() {
  // 对话框状态
  const roleDialogVisible = ref(false)
  const currentUserId = ref('')
  
  // 角色数据
  const roleOptions = ref<Role[]>([])
  const selectedRoleIds = ref<string[]>([])

  // 加载角色列表
  const loadRoleOptions = async () => {
    try {
      const res = await getAllRoles()
      roleOptions.value = res.data
    } catch (error) {
      console.error('加载角色列表失败:', error)
      ElMessage.error('加载角色列表失败')
    }
  }

  // 打开分配角色对话框
  const openRoleAssignDialog = async (userId: string) => {
    currentUserId.value = userId
    
    try {
      // 获取用户当前的角色
      const res = await getUserRoles(userId)
      selectedRoleIds.value = res.data.map((role: Role) => role.id)
      
      roleDialogVisible.value = true
    } catch (error) {
      console.error('获取用户角色失败:', error)
      ElMessage.error('获取用户角色失败')
    }
  }

  // 关闭对话框
  const closeRoleDialog = () => {
    roleDialogVisible.value = false
    resetRoleData()
  }

  // 重置角色数据
  const resetRoleData = () => {
    currentUserId.value = ''
    selectedRoleIds.value = []
  }

  // 提交角色分配
  const handleRoleSubmit = async (onSuccess?: () => void) => {
    try {
      await assignUserRoles({
        userId: currentUserId.value,
        roleIds: selectedRoleIds.value
      })
      
      ElMessage.success('角色分配成功')
      closeRoleDialog()
      onSuccess?.()
    } catch (error: any) {
      ElMessage.error(error.message || '分配失败')
    }
  }

  return {
    // 状态
    roleDialogVisible,
    roleOptions,
    selectedRoleIds,
    
    // 方法
    loadRoleOptions,
    openRoleAssignDialog,
    closeRoleDialog,
    handleRoleSubmit
  }
}