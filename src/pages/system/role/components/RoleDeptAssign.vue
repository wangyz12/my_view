<template>
  <div class="dept-assign-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索部门名称"
        clearable
        prefix-icon="Search"
        @input="handleSearch"
      />
    </div>

    <!-- 部门树 -->
    <div class="tree-area">
      <el-tree
        ref="treeRef"
        :data="filteredDeptTree"
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
              <el-tag v-if="data.status === '0'" size="small" type="success">启用</el-tag>
              <el-tag v-else-if="data.status === '1'" size="small" type="danger">停用</el-tag>
              <span v-if="data.code" class="dept-code">{{ data.code }}</span>
              <span v-if="data.leader" class="dept-leader">{{ data.leader }}</span>
            </span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 底部统计 -->
    <div class="stats-area">
      <div class="stats-item">
        <span class="label">已选择:</span>
        <span class="value">{{ checkedCount }} 个部门</span>
      </div>
      <div class="stats-item">
        <span class="label">总部门数:</span>
        <span class="value">{{ totalDeptCount }} 个</span>
      </div>
      <div class="stats-item">
        <span class="label">启用:</span>
        <span class="value">{{ enabledDeptCount }} 个</span>
      </div>
      <div class="stats-item">
        <span class="label">停用:</span>
        <span class="value">{{ disabledDeptCount }} 个</span>
      </div>
    </div>

    <!-- 选择模式 -->
    <div class="mode-area">
      <div class="mode-tip">
        <el-icon><InfoFilled /></el-icon>
        <span>提示：选择部门后，角色将拥有这些部门的数据权限</span>
      </div>
      <div class="mode-actions">
        <el-button size="small" @click="selectAll">全选</el-button>
        <el-button size="small" @click="clearAll">清空</el-button>
        <el-button size="small" @click="selectEnabled">选择启用部门</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElTree } from 'element-plus'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { getDeptTree } from '@/api/system/dept'
import { getRoleDepts, assignRoleDepts } from '@/api/system/role'

interface Props {
  roleId: string
  roleName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'close'): void
}>()

// 树组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 搜索关键词
const searchKeyword = ref('')

// 部门树数据
const deptTree = ref<any[]>([])
const loading = ref(false)

// 默认选中的部门ID
const defaultCheckedKeys = ref<string[]>([])

// 树配置
const treeProps = {
  label: 'name',
  children: 'children'
}

// 加载部门树
const loadDeptTree = async () => {
  try {
    loading.value = true
    const res = await getDeptTree()
    if (res.code === 200) {
      deptTree.value = res.data || []
    }
  } catch (error) {
    console.error('加载部门树失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载角色已分配的部门
const loadRoleDepts = async () => {
  try {
    const res = await getRoleDepts(props.roleId)
    if (res.code === 200) {
      defaultCheckedKeys.value = res.data || []
    }
  } catch (error) {
    console.error('加载角色部门失败:', error)
  }
}

// 过滤后的部门树
const filteredDeptTree = computed(() => {
  if (!searchKeyword.value) {
    return deptTree.value
  }

  const filterTree = (nodes: any[]): any[] => {
    return nodes
      .map(node => {
        const children = node.children ? filterTree(node.children) : []
        
        // 检查节点是否匹配搜索条件
        const matchesSearch = !searchKeyword.value || 
          node.name?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          node.code?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          node.leader?.toLowerCase().includes(searchKeyword.value.toLowerCase())
        
        // 如果节点本身匹配，或者有子节点匹配，则保留该节点
        if (matchesSearch || children.length > 0) {
          return {
            ...node,
            children
          }
        }
        
        return null
      })
      .filter(Boolean)
  }

  return filterTree(deptTree.value)
})

// 统计信息
const checkedCount = computed(() => {
  return treeRef.value?.getCheckedKeys().length || 0
})

const totalDeptCount = computed(() => {
  const countNodes = (nodes: any[]): number => {
    return nodes.reduce((total, node) => {
      return total + 1 + (node.children ? countNodes(node.children) : 0)
    }, 0)
  }
  return countNodes(deptTree.value)
})

const enabledDeptCount = computed(() => {
  const countEnabled = (nodes: any[]): number => {
    return nodes.reduce((total, node) => {
      const isEnabled = node.status === '0' ? 1 : 0
      return total + isEnabled + (node.children ? countEnabled(node.children) : 0)
    }, 0)
  }
  return countEnabled(deptTree.value)
})

const disabledDeptCount = computed(() => {
  return totalDeptCount.value - enabledDeptCount.value
})

// 节点过滤方法
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name?.toLowerCase().includes(value.toLowerCase()) ||
         data.code?.toLowerCase().includes(value.toLowerCase()) ||
         data.leader?.toLowerCase().includes(value.toLowerCase())
}

// 事件处理
const handleSearch = () => {
  treeRef.value?.filter(searchKeyword.value)
}

const handleCheck = () => {
  // 选中状态变化
}

// 选择操作
const selectAll = () => {
  const getAllKeys = (nodes: any[]): string[] => {
    return nodes.reduce((keys: string[], node) => {
      keys.push(node.id)
      if (node.children) {
        keys.push(...getAllKeys(node.children))
      }
      return keys
    }, [])
  }
  
  const allKeys = getAllKeys(deptTree.value)
  treeRef.value?.setCheckedKeys(allKeys)
}

const clearAll = () => {
  treeRef.value?.setCheckedKeys([])
}

const selectEnabled = () => {
  const getEnabledKeys = (nodes: any[]): string[] => {
    return nodes.reduce((keys: string[], node) => {
      if (node.status === '0') {
        keys.push(node.id)
      }
      if (node.children) {
        keys.push(...getEnabledKeys(node.children))
      }
      return keys
    }, [])
  }
  
  const enabledKeys = getEnabledKeys(deptTree.value)
  treeRef.value?.setCheckedKeys(enabledKeys)
}

// 获取选中的部门ID
const getSelectedDeptIds = (): string[] => {
  return treeRef.value?.getCheckedKeys() as string[] || []
}

// 保存分配
const saveAssignment = async (): Promise<boolean> => {
  try {
    const deptIds = getSelectedDeptIds()
    await assignRoleDepts(props.roleId, { deptIds })
    return true
  } catch (error) {
    console.error('分配部门失败:', error)
    return false
  }
}

// 初始化
onMounted(async () => {
  await Promise.all([loadDeptTree(), loadRoleDepts()])
})

defineExpose({
  saveAssignment
})
</script>

<style scoped>
.dept-assign-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  gap: 16px;
}

.search-area {
  padding: 0 8px;
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

.dept-code {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.dept-leader {
  font-size: 12px;
  color: #409eff;
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

.mode-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #d9ecff;
}

.mode-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  font-size: 14px;
}

.mode-actions {
  display: flex;
  gap: 8px;
}
</style>