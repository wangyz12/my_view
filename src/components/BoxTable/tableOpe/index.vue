<template>
  <div class="table-container">
    <el-table 
      :data="tableData" 
      :border="border" 
      style="width: 100%"
      height="100%" 
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClickWrapper"
      @row-dblclick="handleRowDblClickWrapper"
      :row-class-name="getRowClassName"
      :row-style="getRowStyle"
      :span-method="spanMethod"
    >
      <!-- 动态列 - 支持多级表头 -->
      <template v-for="col in tableColumn" :key="col.prop || col.label || col.type">
        <!-- 多选列 -->
        <el-table-column
          v-if="col.type === 'selection'"
          type="selection"
          :width="col.width || '55'"
          :fixed="col.fixed"
        />
        
        <!-- 索引列 -->
        <el-table-column
          v-else-if="col.type === 'index'"
          type="index"
          :label="col.label || '序号'"
          :width="col.width || '80'"
          :fixed="col.fixed"
        />
        
        <!-- 多级表头：有 children -->
        <el-table-column
          v-else-if="col.children && col.children.length"
          :label="col.label"
          :align="col.align || 'center'"
        >
          <el-table-column
            v-for="child in col.children"
            :key="child.prop || child.label"
            :prop="child.prop"
            :label="child.label"
            :width="child.width"
            :min-width="child.minWidth"
            :align="child.align || 'center'"
            :sortable="child.sortable"
            :show-overflow-tooltip="child.showOverflowTooltip !== false"
          >
            <template #default="scope">
              <!-- 自定义插槽 -->
              <slot 
                v-if="child.isSlot" 
                :name="child.slotName || child.prop" 
                :row="scope.row" 
                :column="child"
                :$index="scope.$index"
              />
              <!-- 默认渲染 -->
              <span v-else>
                {{ getValueByPath(scope.row, child.prop) }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        
        <!-- 普通列 -->
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :fixed="col.fixed"
          :sortable="col.sortable"
          :show-overflow-tooltip="col.showOverflowTooltip !== false"
        >
          <template #default="scope">
            <!-- 自定义插槽 -->
            <slot 
              v-if="col.isSlot" 
              :name="col.slotName || col.prop" 
              :row="scope.row" 
              :column="col"
              :$index="scope.$index"
            />
            <!-- 默认渲染 -->
            <span v-else>
              {{ getValueByPath(scope.row, col.prop) }}
            </span>
          </template>
        </el-table-column>
      </template>
      
      <!-- 空数据状态 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  tableColumn: {
    type: Array as any,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  // 行样式自定义
  rowClassName: {
    type: Function,
    default: null
  },
  rowStyle: {
    type: Function,
    default: null
  },
  // 单元格合并方法
  spanMethod: {
    type: Function,
    default: null
  },
  border:{
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['selection-change', 'row-click', 'row-dblclick'])
// 包装行单击事件，防止按钮触发
const handleRowClickWrapper = (row: any, column: any, event: Event) => {
  const target = event.target as HTMLElement
  // 检查点击的是否是按钮或按钮内的元素
  const isButton = target.closest('.el-button') || target.closest('.el-popconfirm')
  
  if (!isButton) {
    emit('row-click', row, column, event)
  }
}

// 包装行双击事件，防止按钮触发
const handleRowDblClickWrapper = (row: any, column: any, event: Event) => {
  const target = event.target as HTMLElement
  const isButton = target.closest('.el-button') || target.closest('.el-popconfirm')
  
  if (!isButton) {
    emit('row-dblclick', row, column, event)
  }
}
// 根据路径获取值 (支持 a.b.c 格式)
const getValueByPath = (obj: any, path: string) => {
  if (!path) return ''
  const keys = path.split('.')
  let value = obj
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return ''
    }
  }
  return value
}

// 选中变化
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

// 行单击
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 行双击
const handleRowDblClick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

// 获取行类名
const getRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (props.rowClassName) {
    return props.rowClassName({ row, rowIndex })
  }
  return ''
}

// 获取行样式
const getRowStyle = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (props.rowStyle) {
    return props.rowStyle({ row, rowIndex })
  }
  return {}
}
</script>

<style scoped lang="scss">
.table-container {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  :deep(.el-table) {
    font-size: 14px;
    flex: 1;
    min-height: 0;
    
    .el-table__header th {
      font-weight: 600;
    }
  }
}
</style>