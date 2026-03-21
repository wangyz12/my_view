<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    class="role-form"
  >
    <el-form-item label="角色标识" prop="name">
      <el-input
        v-model="formData.name"
        :placeholder="isEdit ? '角色标识（不可修改）' : '请输入角色标识（英文）'"
        :disabled="isEdit"
        clearable
      />
      <div class="form-tip">
        提示：角色标识用于系统内部识别，创建后不可修改，如：admin, manager, user
      </div>
    </el-form-item>

    <el-form-item label="角色名称" prop="label">
      <el-input
        v-model="formData.label"
        placeholder="请输入角色名称"
        clearable
      />
    </el-form-item>

    <el-form-item label="数据权限" prop="dataScope">
      <el-select v-model="formData.dataScope" placeholder="请选择数据权限" style="width: 100%">
        <el-option label="全部数据权限" value="1" />
        <el-option label="自定义数据权限" value="2" />
        <el-option label="本部门数据权限" value="3" />
        <el-option label="本部门及以下数据权限" value="4" />
        <el-option label="仅本人数据权限" value="5" />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio :value="'0'">启用</el-radio>
        <el-radio :value="'1'">禁用</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="formData.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  isEdit?: boolean
  initialData?: any
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  initialData: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'validate', isValid: boolean): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  name: '',
  label: '',
  dataScope: '5',
  status: '0',
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和减号', trigger: 'blur' }
  ],
  label: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  dataScope: [
    { required: true, message: '请选择数据权限', trigger: 'change' }
  ]
}

// 监听初始数据变化
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(formData, newData)
  }
}, { immediate: true })

// 监听表单数据变化
watch(formData, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// 验证表单
const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false
  
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 重置表单
const reset = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    name: '',
    label: '',
    dataScope: '5',
    status: '0',
    remark: ''
  })
}

// 获取表单数据
const getFormData = () => ({ ...formData })

defineExpose({
  validate,
  reset,
  getFormData
})
</script>

<style scoped>
.role-form {
  padding: 20px 10px 0;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.4;
}
</style>