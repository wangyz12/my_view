<!-- BoxTable/components/TableToolbar.vue -->
<template>
  <div class="table-toolbar">
    <!-- 左侧区域：用户自定义工具栏插槽 -->
    <div class="toolbar-left">
    </div>
    <!-- 右侧区域：内置工具按钮 -->
    <div class="toolbar-right">
      <slot name="toolbar" />
      <!-- 刷新按钮 -->
      <el-tooltip content="刷新数据" placement="top">
        <el-button 
          :loading="loading"
          circle 
          @click="handleRefresh"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- 密度切换按钮 -->
      <el-tooltip content="表格密度" placement="top">
        <el-dropdown @command="handleSizeChange">
          <el-button circle>
            <el-icon><Expand /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="large">宽松</el-dropdown-item>
              <el-dropdown-item command="default">默认</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
      
      <!-- 全屏按钮 -->
      <el-tooltip content="全屏" placement="top">
        <el-button circle @click="toggleFullscreen">
          <el-icon><FullScreen /></el-icon>
        </el-button>
      </el-tooltip>
      
      <!-- 导出按钮 -->
      <el-tooltip v-if="exportable" content="导出数据" placement="top">
        <el-button :loading="exportLoading" circle @click="handleExport">
          <el-icon><Download /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Refresh, Expand, FullScreen, Download,  } from '@element-plus/icons-vue'

const props = defineProps({
  // 表格列配置
  columns: {
    type: Array as any,
    default: () => []
  },
  // 表格唯一标识，用于保存列设置
  tableKey: {
    type: String,
    default: 'default'
  },
  // 是否可导出
  exportable: {
    type: Boolean,
    default: false
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 导出加载状态
  exportLoading: {
    type: Boolean,
    default: false
  },
  // 表格密度
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['refresh', 'export', 'size-change', 'columns-change'])

// 本地列数据
const localColumns = ref<any[]>([])
const originalColumns = ref<any[]>([])
const showColumnSettings = ref(false)
const isFullscreen = ref(false)

// 过滤掉 selection 和 index 类型的列
const normalColumns = computed(() => {
  return props.columns.filter((col: any) => 
    col.type !== 'selection' && col.type !== 'index'
  )
})

// 获取存储的列设置
const getStoredColumns = () => {
  const storageKey = `table_columns_${props.tableKey}`
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('读取列设置失败:', e)
      return null
    }
  }
  return null
}

// 保存列设置
const saveColumnSettings = () => {
  const storageKey = `table_columns_${props.tableKey}`
  const settings = localColumns.value.map(col => ({
    prop: col.prop,
    visible: col.visible
  }))
  localStorage.setItem(storageKey, JSON.stringify(settings))
  emit('columns-change', localColumns.value)
}

// 初始化列设置
const initColumnSettings = () => {
  const normalCols = normalColumns.value
  if (!normalCols.length) return
  
  const savedColumns = getStoredColumns()
  
  if (savedColumns) {
    localColumns.value = normalCols.map((col: any) => {
      const savedCol = savedColumns.find((s: any) => s.prop === col.prop)
      return {
        ...col,
        visible: savedCol ? savedCol.visible : true
      }
    })
  } else {
    localColumns.value = normalCols.map((col: any) => ({
      ...col,
      visible: true
    }))
  }
  
  originalColumns.value = JSON.parse(JSON.stringify(localColumns.value))
}


// 重置列设置
const resetColumnSettings = () => {
  localColumns.value = originalColumns.value.map(col => ({
    ...col,
    visible: true
  }))
  saveColumnSettings()
}

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

// 导出
const handleExport = () => {
  emit('export')
}

// 密度切换
const handleSizeChange = (size: string) => {
  emit('size-change', size)
}

// 全屏切换
const toggleFullscreen = () => {
  const element = document.querySelector('.main-table') as HTMLElement
  if (!isFullscreen.value) {
    if (element?.requestFullscreen) {
      element.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  isFullscreen.value = !isFullscreen.value
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 监听列配置变化
watch(() => props.columns, () => {
  initColumnSettings()
}, { deep: true })

// 监听 tableKey 变化
watch(() => props.tableKey, () => {
  initColumnSettings()
})

// 组件挂载
onMounted(() => {
  initColumnSettings()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// 组件卸载
onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// 暴露方法
defineExpose({
  getVisibleColumns: () => localColumns.value.filter(col => col.visible !== false),
  resetColumnSettings
})
</script>

<style scoped lang="scss">
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding:10px;
  padding-bottom:0;
  border-radius: 4px;
  
  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.column-settings {
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 12px;
  }
  
  .settings-list {
    max-height: 400px;
    overflow-y: auto;
    
    .column-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: move;
      border-bottom: 1px solid #f0f0f0;
      
      &:hover {
        background-color: #f5f7fa;
      }
      
      .drag-handle {
        cursor: move;
        margin-right: 12px;
        color: #909399;
      }
      
      .el-checkbox {
        flex: 1;
      }
    }
  }
}
</style>