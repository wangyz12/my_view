<template>
  <div class="">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="父级菜单" prop="pid">
        <el-cascader v-model="formData.pid" :options="menuOptions"
          :props="{ value: 'id', label: 'title', children: 'children', checkStrictly: true, emitPath: false }"
          placeholder="选择父级菜单（不选则为顶级菜单）" style="width: 100%" clearable />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleTypeChange">
          <el-radio :value="'menu'">菜单</el-radio>
          <el-radio :value="'button'">按钮</el-radio>
          <el-radio :value="'iframe'">内嵌页面</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="路由名称" prop="name" v-if="formData.type !== 'button'">
        <el-input v-model="formData.name" placeholder="请输入路由名称（英文）" />
      </el-form-item>
      <el-form-item label="路由路径" prop="path" v-if="formData.type !== 'button'">
        <el-input v-model="formData.path" placeholder="请输入路由路径" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component" v-if="formData.type === 'menu'">
        <el-input v-model="formData.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item label="内嵌地址" prop="component" v-if="formData.type === 'iframe'">
        <el-input v-model="formData.component" placeholder="请输入内嵌页面地址" />
      </el-form-item>
      <el-form-item label="权限标识" prop="permission" v-if="formData.type === 'button'">
        <el-input v-model="formData.permission" placeholder="请输入权限标识（如：system:user:add）" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon" v-if="formData.type !== 'button'">
        <div style="display: flex; align-items: center; gap: 10px;">
          <el-input v-model="formData.icon" placeholder="图标名称或点击选择" style="flex: 1;" />
          <el-button type="primary" @click="selectIcon">选择图标</el-button>
          <div v-if="formData.icon" style="display: flex; align-items: center; gap: 5px;">
            <el-icon>
              <component :is="formData.icon" />
            </el-icon>
            <span>{{ formData.icon }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" :max="999" />
      </el-form-item>
      <el-form-item label="是否隐藏" prop="hidden" v-if="formData.type !== 'button'">
        <el-switch v-model="formData.hidden" />
      </el-form-item>
      <el-form-item label="是否缓存" prop="cache" v-if="formData.type === 'menu'">
        <el-switch v-model="formData.cache" />
      </el-form-item>
      <el-form-item label="是否外链" prop="external" v-if="formData.type !== 'button'">
        <el-switch v-model="formData.external" @change="handleExternalChange" />
      </el-form-item>
      <el-form-item label="打开方式" prop="target" v-if="formData.external && formData.type !== 'button'">
        <el-radio-group v-model="formData.target">
          <el-radio :value="'_self'">当前窗口</el-radio>
          <el-radio :value="'_blank'">新窗口</el-radio>
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
import { onMounted } from 'vue'
import { formRules, updateMenusAndRoutes,type MenuItem,type MenuFormData,DEFAULT_FORM_DATA } from './../config'
import { showSelectIconPopup } from './../propup/index'
import { createMenu, updateMenu } from '@/api/system/menu'
interface Props {
  row: Partial<MenuItem>
  list: MenuItem[]
  isAdd: boolean
}
const emit = defineEmits<{
  (e: 'success', data: boolean): void
  (e: 'close'): void
}>()
const props = defineProps<Props>()
const formRef = ref()
// 表单数据
const formData = ref<MenuFormData>({ ...DEFAULT_FORM_DATA })

// 菜单选项（用于选择父级菜单）
const menuOptions = ref<MenuItem[]>([])
// 菜单类型变化
const handleTypeChange = (type: string) => {
  // 根据类型重置相关字段
  if (type === 'button') {
    formData.value.path = ''
    formData.value.component = ''
    formData.value.icon = ''
    formData.value.hidden = false
    formData.value.cache = true
    formData.value.external = false
    formData.value.target = '_self'
  } else if (type === 'iframe') {
    formData.value.permission = ''
    formData.value.cache = true
  }
}
// 外链变化
const handleExternalChange = (external: boolean) => {
  if (!external) {
    formData.value.target = '_self'
  }
}
// 选择图标
const selectIcon = async () => {
  const res = await showSelectIconPopup()
  if (res?.success) {
    const { data } = res
    formData.value.icon = data
  }
}
const onSubmit = async () => {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    try {
      const params:Record<string, any> = { ...formData.value }

      // 处理pid（如果是数组，取最后一个）
      if (Array.isArray(params.pid) && params.pid.length > 0) {
        params.pid = params.pid[params.pid.length - 1]
      }

      if (props.isAdd) {
        // 新增时发送pid
        await createMenu(params)
        ElMessage.success('新增成功')
      } else {
        // 编辑时也发送pid，但确保空字符串被正确处理
        await updateMenu(params)
        ElMessage.success('更新成功')
      }
      // 更新菜单和路由
      await updateMenusAndRoutes()
      emit('success', true)
    } catch (error) {
      console.log(error)
    }
  })
}
onMounted(() => {
  formData.value =  {
    ...DEFAULT_FORM_DATA,
    ...props.row,
    // 处理 parentId 到 pid 的映射
    pid: (props.row as any).pid || (props.row as any).parentId || ''
  }
  menuOptions.value = props.list
})
</script>

<style lang="scss" scoped></style>