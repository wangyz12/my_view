<!-- src/components/popup/index.vue -->
<template>
  <div class="change-password-popup">
    <el-form :model="loginForm" :rules="loginRules" label-width="80px" ref="formRef">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="loginForm.oldPassword" type="password" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="loginForm.newPassword" type="password" placeholder="请输入新密码" />
      </el-form-item>
    </el-form>

    <!-- footer 按钮由我完全控制 -->
    <footer>
      <div class="flex mt-5 justify-end">
        <el-button size="default" @click="handleCancel">取消</el-button>
        <el-button size="default" type="primary" @click="handleConfirm" :loading="loading">
          确定
        </el-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { upDatePsw,type UPDATEPAW } from '@/api'

// 定义要发射的事件 - 通知对话框关闭
const emit = defineEmits<{
  (e: 'success', data: any): void  // 成功时触发
  (e: 'close'): void                // 关闭时触发
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const loginForm = ref<UPDATEPAW>({
  oldPassword: '',
  newPassword: ''
})

// 加载状态
const loading = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 处理取消
const handleCancel = () => {
  // 直接触发 close 事件，让对话框关闭
  emit('close')
}

// 处理确认
const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    loading.value = true
    // 表单验证
    await formRef.value.validate()
    const res:any = await upDatePsw(loginForm.value)
    if(res.code === 200){
      // 触发成功事件，传递数据
      emit('success', {
        success: true,
      })
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重置表单（如果需要）
const resetForm = () => {
  loginForm.value = {
    oldPassword: '',
    newPassword: ''
  }
  formRef.value?.clearValidate()
}

// 暴露方法给父组件（如果需要）
defineExpose({
  resetForm
})
</script>

<style lang="scss" scoped>
.change-password-popup {
  padding: 10px 0;
}

.flex {
  display: flex;
}

.mt-5 {
  margin-top: 20px;
}

.justify-end {
  justify-content: flex-end;
}
</style>