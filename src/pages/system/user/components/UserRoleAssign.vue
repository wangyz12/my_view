<template>
  <el-dialog
    v-model="props.roleDialogVisible"
    title="分配角色"
    width="400px"
    @closed="closeRoleDialog"
  >
    <el-form>
      <el-form-item label="选择角色">
        <el-select
          v-model="selectedRoleIdsComputed"
          multiple
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option
            v-for="role in props.roleOptions"
            :key="role.id"
            :label="role.label"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeRoleDialog">取消</el-button>
        <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserRoleAssign, type Role } from '../hooks/useUserRoleAssign'

interface Props {
  roleDialogVisible: boolean
  roleOptions: Role[]
  selectedRoleIds: string[]
}

interface Emits {
  (e: 'update:roleDialogVisible', visible: boolean): void
  (e: 'update:selectedRoleIds', ids: string[]): void
  (e: 'submit'): void
  (e: 'closed'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用计算属性实现双向绑定
const selectedRoleIdsComputed = computed({
  get: () => props.selectedRoleIds || [],
  set: (value) => {
    // 实时更新，但也可以选择只在提交时更新
    // emit('update:selectedRoleIds', value)
  }
})

const {
  closeRoleDialog: internalCloseRoleDialog,
  handleRoleSubmit: internalHandleRoleSubmit
} = useUserRoleAssign()

// 关闭对话框
const closeRoleDialog = () => {
  internalCloseRoleDialog()
  emit('update:roleDialogVisible', false)
  emit('closed')
}

// 提交角色分配
const handleRoleSubmit = () => {
  // 提交时才更新选中的角色 IDs
  emit('update:selectedRoleIds', selectedRoleIdsComputed.value)
  
  internalHandleRoleSubmit(() => {
    emit('submit')
    closeRoleDialog()
  })
}
</script>