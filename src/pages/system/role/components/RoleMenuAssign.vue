<template>
  <div class="menu-assign-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索菜单名称"
        clearable
        prefix-icon="Search"
        @input="handleSearch"
      />
    </div>

    <!-- 菜单类型过滤 -->
    <div class="filter-area">
      <el-radio-group v-model="menuType" @change="handleTypeChange">
        <el-radio-button :value="''">全部</el-radio-button>
        <el-radio-button :value="'dir'">目录</el-radio-button>
        <el-radio-button :value="'menu'">菜单</el-radio-button>
        <el-radio-button :value="'button'">按钮</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 菜单树 -->
    <div class="tree-area">
      <el-tree
        ref="treeRef"
        :data="filteredMenuTree"
        show-checkbox
        node-key="id"
        :props="treeProps"
        :default-checked-keys="defaultCheckedKeys"
        :filter-node-method="filterNode"
        highlight-current
        default-expand-all
        @check="handleCheck"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-label">{{ node.label }}</span>
            <span class="node-meta">
              <el-tag v-if="data.type === 'dir'" size="small" type="info">目录</el-tag>
              <el-tag v-else-if="data.type === 'menu'" size="small" type="success">菜单</el-tag>
              <el-tag v-else-if="data.type === 'button'" size="small" type="warning">按钮</el-tag>
              <span v-if="data.permission" class="permission">{{ data.permission }}</span>
            </span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 底部统计 -->
    <div class="stats-area">
      <div class="stats-item">
        <span class="label">已选择:</span>
        <span class="value">{{ checkedCount }} 个</span>
      </div>
      <div class="stats-item">
        <span class="label">目录:</span>
        <span class="value">{{ typeStats.dir }} 个</span>
      </div>
      <div class="stats-item">
        <span class="label">菜单:</span>
        <span class="value">{{ typeStats.menu }} 个</span>
      </div>
      <div class="stats-item">
        <span class="label">按钮:</span>
        <span class="value">{{ typeStats.button }} 个</span>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-area">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,  computed,  onMounted } from 'vue'
import { ElTree, ElMessage } from 'element-plus'
import { getMenuTree } from '@/api/system/menu'
import { getRoleMenus, assignRoleMenus } from '@/api/system/role'

interface Props {
  roleId: string
  roleName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

// 树组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 搜索关键词
const searchKeyword = ref('')

// 菜单类型过滤
const menuType = ref('')

// 菜单树数据
const menuTree = ref<any[]>([])
const loading = ref(false)

// 提交状态
const submitting = ref(false)

// 默认选中的菜单ID
const defaultCheckedKeys = ref<string[]>([])

// 树配置
const treeProps = {
  label: 'title',
  children: 'children'
}

// 加载菜单树
const loadMenuTree = async () => {
  try {
    loading.value = true
    const res = await getMenuTree()
    if (res.code === 200) {
      menuTree.value = res.data || []
    }
  } catch (error) {
    console.error('加载菜单树失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载角色已分配的菜单
const loadRoleMenus = async () => {
  try {
    const res = await getRoleMenus(props.roleId)
    if (res.code === 200) {
      defaultCheckedKeys.value = res.data || []
      // 等待树组件渲染完成后设置选中的菜单
      setTimeout(() => {
        if (treeRef.value && defaultCheckedKeys.value.length > 0) {
          console.log('🎯 设置默认选中的菜单:', defaultCheckedKeys.value)
          treeRef.value.setCheckedKeys(defaultCheckedKeys.value)
        }
      }, 100)
    }
  } catch (error) {
    console.error('加载角色菜单失败:', error)
  }
}

// 过滤后的菜单树
const filteredMenuTree = computed(() => {
  if (!searchKeyword.value && !menuType.value) {
    return menuTree.value
  }

  const filterTree = (nodes: any[]): any[] => {
    return nodes
      .map(node => {
        const children = node.children ? filterTree(node.children) : []
        // 检查节点是否匹配搜索条件
        const matchesSearch = !searchKeyword.value || 
          node.title?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          node.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
        // 检查节点是否匹配类型过滤
        const matchesType = !menuType.value || node.type === menuType.value
        
        // 如果节点本身匹配，或者有子节点匹配，则保留该节点
        if ((matchesSearch && matchesType) || children.length > 0) {
          return {
            ...node,
            children
          }
        }
        
        return null
      })
      .filter(Boolean)
  }

  return filterTree(menuTree.value)
})

// 统计信息
const checkedCount = computed(() => {
  return treeRef.value?.getCheckedKeys().length || 0
})

const typeStats = computed(() => {
  const stats = { dir: 0, menu: 0, button: 0 }
  
  const countTypes = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.type === 'dir') stats.dir++
      else if (node.type === 'menu') stats.menu++
      else if (node.type === 'button') stats.button++
      
      if (node.children) {
        countTypes(node.children)
      }
    })
  }
  
  countTypes(menuTree.value)
  return stats
})

// 节点过滤方法
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.title?.toLowerCase().includes(value.toLowerCase()) ||
         data.name?.toLowerCase().includes(value.toLowerCase())
}

// 事件处理
const handleSearch = () => {
  treeRef.value?.filter(searchKeyword.value)
}

const handleTypeChange = () => {
  // 类型变化时重新过滤
}

const handleCheck = () => {
  // 选中状态变化
}

// 获取选中的菜单ID
const getSelectedMenuIds = (): string[] => {
  return treeRef.value?.getCheckedKeys() as string[] || []
}

// 处理提交
const handleSubmit = async () => {
  try {
    submitting.value = true
    const menuIds = getSelectedMenuIds()
    await assignRoleMenus(props.roleId, menuIds)
    ElMessage.success(`已为${props.roleName}角色重新分配菜单`)
    emit('success')
  } catch (error: any) {
    console.error('分配菜单失败:', error)
    throw error // 重新抛出错误，让弹框保持打开
  } finally {
    submitting.value = false
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 保存分配（保持向后兼容）
const saveAssignment = async (): Promise<boolean> => {
  try {
    const menuIds = getSelectedMenuIds()
    await assignRoleMenus(props.roleId, menuIds)
    return true
  } catch (error) {
    console.error('分配菜单失败:', error)
    return false
  }
}

// 初始化
onMounted(async () => {
  await Promise.all([loadMenuTree(), loadRoleMenus()])
})

defineExpose({
  saveAssignment
})
</script>

<style scoped>
.menu-assign-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  gap: 16px;
}

.search-area {
  padding: 0 8px;
}

.filter-area {
  display: flex;
  justify-content: center;
}

.tree-area {
  flex: 1;
  overflow: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-label {
  font-size: 14px;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.stats-area {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stats-item .label {
  font-size: 12px;
  color: #666;
}

.stats-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

.action-area {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>