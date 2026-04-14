<template>
  <div class="role-form-container">
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
    
    <!-- 操作按钮 -->
    <div class="form-actions">
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type {ADDEDITFORM} from './../config'
import { createRole, updateRole } from '@/api/system/role';

const emit = defineEmits<{
  (e: 'success', data: any): void
  (e: 'close'): void
}>()

interface Props {
  row: {
    [key: string]: any
  }
}

const props = defineProps<Props>()
// 表单数据
const formData = ref<ADDEDITFORM|any>({
  name: '',
  label: '',
  dataScope: '5',
  status: '0',
  remark: ''
})
// 表单引用
const formRef = ref<FormInstance>()
const isEdit = computed(()=>{
  formData.value = props.row
  return !!props.row.id
})


// 提交状态
const submitting = ref(false)

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
const handleSubmit = async ()=>{
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true
    const submitData = { ...formData.value }
    if (isEdit.value) {
      // 编辑角色
      await updateRole(props.row.id, submitData)
      ElMessage.success('更新成功')
    } else {
      // 新增角色
      await createRole(submitData)
      ElMessage.success('创建成功')
    }
    emit('success', submitData)
    emit('close')
  } catch (error) {
    // 表单校验失败或接口报错
    console.error('提交失败:', error)
    ElMessage.error('请正确填写表单信息')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.role-form-container {
  padding: 20px 10px;
}

.role-form {
  margin-bottom: 20px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}
</style>