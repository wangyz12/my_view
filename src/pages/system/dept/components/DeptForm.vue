<template>
  <div class="">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="父级部门" prop="parentId">
        <el-cascader v-model="formData.parentId" :options="deptOptions"
          :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true, emitPath: false }"
          placeholder="选择父级部门（不选则为顶级部门）" style="width: 100%" clearable />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="formData.orderNum" :min="0" :max="999" />
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input v-model="formData.leader" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="'0'">正常</el-radio>
          <el-radio :value="'1'">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <footer>
      <div class="flex justify-center">
        <el-button size="default" @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {  createDept, updateDept,} from '@/api/system/dept'
import { type FormRules} from 'element-plus'
interface Props {
  row: Record<string, any>
  list: Record<string, any>[]
  isAdd:boolean
}
const emit = defineEmits<{
  (e: 'success', data: any): void
  (e: 'close'): void
}>()
const props = defineProps<Props>()
const formRef = ref<any>()
// 菜单选项（用于选择父级菜单）
const deptOptions = ref<any[]>([])
const formData = ref<any>({
  parentId: '',
  name: '',
  code: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})
// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { max: 50, message: '部门名称不能超过50个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { max: 30, message: '部门编码不能超过30个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ]
}
const onSubmit = async()=>{
  await formRef.value.validate(async (valid:any) => {
  if (!valid) return

  try {
    const params:any = { ...formData.value }

    // 处理pid（如果是数组，取最后一个）
    if (Array.isArray(params.pid) && params.pid.length > 0) {
      params.pid = params.pid[params.pid.length - 1]
    }

    if (props.isAdd) {
      // 新增时发送pid
      await createDept(params)
      ElMessage.success('新增成功')
    } else {
      // 编辑时也发送pid，但确保空字符串被正确处理
      await updateDept(params)
      ElMessage.success('更新成功')
    }
    emit('success',true)
    emit('close')
  } catch (error: any) {
    console.log(error)
  } 
})
}
onMounted(()=>{
  console.log(props)
  formData.value = props.row
  deptOptions.value = props.list
})
</script>

<style lang="scss" scoped></style>