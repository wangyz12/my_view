// src/pages/system/user/hooks/useFormValidation.ts
import type { FormRules } from 'element-plus'

// 自定义密码验证函数
export const validatePassword = (rule: any, value: string, callback: any) => {
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

// 手机号验证
export const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback()
    return
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'))
    return
  }
  callback()
}

// 邮箱验证
export const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback()
    return
  }
  if (!/^\S+@\S+\.\S+$/.test(value)) {
    callback(new Error('邮箱格式不正确'))
    return
  }
  callback()
}

// 头像URL验证
export const validateAvatar = (rule: any, value: string, callback: any) => {
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
}

// 获取表单验证规则
export const getFormRules = (isAdd: boolean): FormRules => {
  const rules: FormRules = {
    username: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '所属部门不能为空', trigger: 'change' }
    ],
    phone: [
      { validator: validatePhone, trigger: 'blur' }
    ],
    email: [
      { validator: validateEmail, trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择用户状态', trigger: 'change' }
    ],
    avatar: [
      { validator: validateAvatar, trigger: 'blur' }
    ]
  }
  
  // 只有新增时才需要账号和密码验证
  if (isAdd) {
    rules.account = [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 2, max: 50, message: '账号长度在 2 到 50 个字符', trigger: 'blur' }
    ]
    rules.password = [
      { validator: validatePassword, trigger: 'blur' }
    ]
  }
  
  return rules
}