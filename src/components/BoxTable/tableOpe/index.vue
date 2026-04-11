<template>
  <div class="table-container">
    <el-table 
      :data="tableData" 
      border 
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <!-- 动态列 -->
      <template v-for="col in tableColumn" :key="col.prop || col.type">
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
              :name="col.slotName" 
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
  }
})

const emit = defineEmits(['selection-change'])

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
</script>

<style scoped lang="scss">
.table-container {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  :deep(.el-table) {
    font-size: 14px;
    .el-table__header th {
      font-weight: 600;
    }
  }
}
</style>