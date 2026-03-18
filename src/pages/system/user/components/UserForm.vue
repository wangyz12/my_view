<template>
  <el-dialog
    v-model="dialogVisibleComputed"
    :title="dialogTitle"
    width="500px"
    @closed="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="formDataComputed"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="formDataComputed.account" placeholder="请输入账号" />
      </el-form-item>
      <!-- 其他表单项保持不变... -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserForm } from '../hooks/useUserForm'
import { useDeptTree, type Dept } from '../hooks/useDeptTree'

interface Props {
  dialogVisible: boolean
  isAdd: boolean
  dialogTitle: string
  formData: {
    account: string
    password: string
    username: string
    deptId: string | string[]
    phone: string
    email: string
    status: string
  }
  deptOptions: Dept[]
}

interface Emits {
  (e: 'update:dialogVisible', visible: boolean): void
  (e: 'update:formData', formData: Props['formData']): void
  (e: 'submit'): void
  (e: 'closed'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用计算属性实现双向绑定
const dialogVisibleComputed = computed({
  get: () => props.dialogVisible,
  set: (value) => {
    if (!value) {
      // 关闭对话框时 emit
      emit('update:dialogVisible', value)
    }
  }
})

// 表单数据计算属性
const formDataComputed = computed({
  get: () => props.formData,
  set: (value) => {
    // 可以选择实时更新或只在提交时更新
    // emit('update:formData', value)
  }
})

const {
  formRef,
  formRules,
  closeDialog: internalCloseDialog,
  handleSubmit: internalHandleSubmit
} = useUserForm()

const { processDeptId } = useDeptTree()

const deptProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true
}

// 关闭对话框
const closeDialog = () => {
  internalCloseDialog()
  emit('update:dialogVisible', false)
  emit('closed')
}

// 提交表单
const handleSubmit = () => {
  internalHandleSubmit(() => {
    // 提交时才更新 formData
    emit('update:formData', { ...props.formData })
    emit('submit')
    closeDialog()
  })
}
</script>