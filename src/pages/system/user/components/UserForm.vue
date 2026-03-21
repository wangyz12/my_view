<template>
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
        :disabled="!isAdd"
      />
      <div class="form-tip">账号创建后不可修改</div>
    </el-form-item>

    <!-- 密码设置（仅新增时显示） -->
    <el-form-item v-if="isAdd" label="密码设置" required>
      <div class="password-setting">
        <el-switch
          :model-value="useDefaultPassword"
          active-text="使用默认密码"
          inactive-text="自定义密码"
          @update:model-value="handlePasswordTypeChange"
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
    <el-form-item v-if="!isAdd" label="密码">
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
        <el-radio :value="'0'">正常</el-radio>
        <el-radio :value="'1'">停用</el-radio>
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
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormData, Dept } from '../hooks/useUserManagement'

interface Props {
  isAdd: boolean
  formData: FormData
  deptOptions: Dept[]
  deptProps: any
  useDefaultPassword: boolean
  onPasswordTypeChange?: (value: boolean) => void
}

interface Emits {
  (e: 'update:formData', data: FormData): void
  (e: 'update:useDefaultPassword', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

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
  if (props.isAdd) {
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

// 处理密码类型变化
const handlePasswordTypeChange = (value: boolean) => {
  emit('update:useDefaultPassword', value)
  if (value) {
    // 切换到默认密码
    emit('update:formData', { ...props.formData, password: 'work_123' })
  } else {
    // 切换到自定义密码，清空密码
    emit('update:formData', { ...props.formData, password: '' })
  }
}

// 清除验证
const clearValidate = () => {
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 验证表单
const validate = () => {
  if (!formRef.value) return Promise.reject(new Error('表单引用不存在'))
  return formRef.value.validate()
}

// 暴露方法
defineExpose({
  clearValidate,
  validate
})
</script>

<style lang="scss" scoped>
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

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>