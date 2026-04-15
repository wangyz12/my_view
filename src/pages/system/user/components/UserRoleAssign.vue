<template>
  <el-form>
    <el-form-item label="分配角色">
      <el-select
        v-model="localSelectedRoleIds"
        multiple
        placeholder="请选择角色"
        style="width: 100%"
        clearable
      >
        <el-option
          v-for="item in roleOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    
    <footer>
      <div class="flex justify-center mt-10">
        <el-button size="default" @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitting">确定</el-button>
      </div>
    </footer>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRoles } from '@/api/system/role'
import { assignUserRoles, getUserRoles } from '@/api/system/userRole'

// ==================== 类型定义 ====================

/** 角色数据类型 */
interface RoleItem {
  id: string
  name: string
  label: string
  dataScope?: string
  status?: number
}

/** 用户数据类型 */
interface UserItem {
  id: string
  account?: string
  username?: string
}

/** API 响应类型 */
interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

/** 角色列表响应数据 */
interface RoleListData {
  data: RoleItem[]
  code: number
  msg:string
}

/** 提交参数类型 */
interface AssignRoleParams {
  userId: string
  roleIds: string[]
}

/** 组件 Props */
interface Props {
  row: UserItem
}

// ==================== 响应式数据 ====================

const emit = defineEmits<{
  (e: 'success', data: boolean): void
  (e: 'close'): void
}>()

const props = defineProps<Props>()

const roleOptions = ref<RoleItem[]>([])
const localSelectedRoleIds = ref<string[]>([])
const submitting = ref(false)

// ==================== 方法 ====================

/** 提交角色分配 */
const onSubmit = async (): Promise<void> => {
  if (!props.row.id) {
    ElMessage.warning('用户信息不存在')
    return
  }
  
  try {
    submitting.value = true
    
    const params: AssignRoleParams = {
      userId: props.row.id,
      roleIds: localSelectedRoleIds.value
    }
    
    await assignUserRoles(params)
    ElMessage.success('角色分配成功')
    emit('success', true)
    emit('close')
  } catch (error: any) {
    console.error('角色分配失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '分配失败'
    ElMessage.error(errorMsg)
  } finally {
    submitting.value = false
  }
}

// ==================== 生命周期 ====================

onMounted(async () => {
  try {
    // 并行加载数据
    const [userRolesRes, allRolesRes] = await Promise.all([
      getUserRoles(props.row.id) as Promise<ApiResponse<RoleItem[]>>,
      getAllRoles() as Promise<ApiResponse<RoleItem[]>>
    ])
    
    // 设置用户已分配的角色ID
    if (userRolesRes.code === 200) {
      localSelectedRoleIds.value = userRolesRes.data.map((role: RoleItem) => role.id)
    }
    
    // 设置所有角色选项
    if (allRolesRes.code === 200) {
      roleOptions.value = allRolesRes.data || []
    }
  } catch (error) {
    console.error('加载角色数据失败:', error)
    ElMessage.error('加载角色数据失败')
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>