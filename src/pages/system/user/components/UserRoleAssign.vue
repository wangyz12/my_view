<template>
  <el-form>
    <el-form-item label="选择角色">
      <el-cascader
        v-model="localSelectedRoleIds"
        :options="deptOptions"
        :props="deptProps"
        placeholder="请选择所属部门"
        style="width: 100%"
        clearable
        @change="handleCascaderChange"
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
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeptTree } from '@/api/system/dept'
import { assignUserRoles } from '@/api/system/userRole'

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
const localSelectedRoleIds = ref<any[]>([]) // 存储选中的多维数组
const selectedRoleIds = ref<any[]>([]) // 存储转换后的一维数组

const deptProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  multiple: true, // 多选
  emitPath: true  // 返回完整路径（多维数组）
}

// 将多维数组转换为一维数组（只取最后一个值）
const flattenCascaderValue = (cascaderValue: any[]): any[] => {
  if (!cascaderValue || !cascaderValue.length) return []
  
  // 方式1：只取每个路径的最后一个值（叶子节点）
  return cascaderValue.map(path => path[path.length - 1])
}

// 方式2：如果需要去重
const flattenCascaderValueUnique = (cascaderValue: any[]): any[] => {
  if (!cascaderValue || !cascaderValue.length) return []
  
  const leafIds = cascaderValue.map(path => path[path.length - 1])
  return [...new Set(leafIds)] // 去重
}

// 方式3：如果需要展平所有选中的节点（不仅仅是叶子节点）
const flattenAllSelectedNodes = (cascaderValue: any[]): any[] => {
  if (!cascaderValue || !cascaderValue.length) return []
  
  return cascaderValue.flat() // 展平所有选中的节点
}

// 处理级联选择器变化
const handleCascaderChange = (value: any[]) => {
  console.log('原始选中值（多维数组）:', value)
  
  // 转换为叶子节点 ID 的一维数组
  const flatIds = flattenCascaderValue(value)
  selectedRoleIds.value = flatIds
  
  console.log('转换后的一维数组:', flatIds)
  console.log('转换后的一维数组（去重）:', flattenCascaderValueUnique(value))
}

// 提交
const onSubmit = async () => {
  try {
    // 使用转换后的一维数组
    const flatIds = flattenCascaderValue(localSelectedRoleIds.value)
    
    const params = {
      userId: props.row.id,
      roleIds: flatIds  // 提交一维数组
    }
    
    console.log('提交参数:', params)
    
    await assignUserRoles(params)
    ElMessage.success('角色分配成功')
    emit('success', true)
  } catch (error: any) {
    ElMessage.error(error.response?.data?.msg || error.message || '分配失败')
  }
}

// 初始化选中的值
watch(() => props.row, (val) => {
  if (val?.deptId?.id) {
    // 如果有选中的部门，需要构建完整路径
    // 注意：这里需要根据你的数据结构构建完整路径
    localSelectedRoleIds.value = [[val.deptId.id]]
    
    // 转换为一维数组
    selectedRoleIds.value = flattenCascaderValue(localSelectedRoleIds.value)
  }
}, { immediate: true })

onMounted(async () => {
  const res: any = await getDeptTree()
  deptOptions.value = res.data || []
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>