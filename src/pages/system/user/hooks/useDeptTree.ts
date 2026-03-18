import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeptTree } from '@/api/system/dept'

export interface Dept {
  id: string
  name: string
  children?: Dept[]
}

export function useDeptTree() {
  // 部门树数据
  const deptOptions = ref<Dept[]>([])

  // 加载部门树
  const loadDeptTree = async () => {
    try {
      const res = await getDeptTree()
      deptOptions.value = res.data
    } catch (error) {
      console.error('加载部门树失败:', error)
      ElMessage.error('加载部门树失败')
    }
  }

  // 处理部门ID（如果是数组，取最后一个）
  const processDeptId = (deptId: string | string[]): string => {
    if (Array.isArray(deptId) && deptId.length > 0) {
      return deptId[deptId.length - 1]
    }
    return deptId as string
  }

  // 获取部门名称
  const getDeptName = (deptId: string, depts: Dept[]): string => {
    const findDept = (id: string, list: Dept[]): Dept | null => {
      for (const dept of list) {
        if (dept.id === id) return dept
        if (dept.children) {
          const found = findDept(id, dept.children)
          if (found) return found
        }
      }
      return null
    }
    
    const dept = findDept(deptId, depts)
    return dept?.name || '-'
  }

  return {
    // 状态
    deptOptions,
    
    // 方法
    loadDeptTree,
    processDeptId,
    getDeptName
  }
}