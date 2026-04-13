<template>
  <el-form>
    <el-form-item label="分配部门">
      <el-cascader
        v-model="localSelectedRoleIds"
        :options="deptOptions"
        :props="deptProps"
        placeholder="请选择所属部门"
        style="width: 100%"
        clearable
      />
    </el-form-item>
    <footer>
      <div class="flex justify-center mt-10">
        <el-button size="default" @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </footer>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeptTree } from '@/api/system/dept'
import {updateUser}from '@/api/system/user'
interface Props {
  row: {
    [key: string]: any
  }
}
const emit = defineEmits<{
  (e: 'success', data: any): void
  (e: 'close'): void
}>()
const props = defineProps<Props>()
const deptOptions = ref<any>([])
const localSelectedRoleIds = ref<any[]>([])
const deptProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
}
// 提交
const onSubmit = async () => {
  try {
    const params = {
      deptId:localSelectedRoleIds.value[0]
    }
    await updateUser(props.row.id,params)
    ElMessage.success('角色分配成功')
    emit('success', true)
  } catch (error: any) {
    ElMessage.error(error.response?.data?.msg || error.message || '分配失败')
  }
}
onMounted(async () => {
  localSelectedRoleIds.value = [props.row.deptId.id]
  const res: any = await getDeptTree()
  deptOptions.value = res.data || []
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>