<template>
  <div class="main-table">
    <!-- 查询表单 -->
    <QueryForm 
      v-if="tableConfig.queryList?.length" 
      ref="queryFormRef" 
      :queryList="tableConfig.queryList"
      :columnsPerRow="tableConfig.columnsPerRow || 3" 
      :defaultExpand="tableConfig.defaultExpand || false"
      @search="handleSearch" 
      @reset="handleReset"
    >
      <!-- 查询表单插槽 -->
      <template 
        v-for="slot in queryFormSlots" 
        :key="slot"
        #[slot]="slotProps"
      >
        <slot :name="`query-${slot}`" v-bind="slotProps" />
      </template>
      
      <template #extra-buttons="slotProps">
        <slot name="query-extra-buttons" v-bind="slotProps" />
      </template>
    </QueryForm>

    <!-- 表格 -->
    <div :class="['table-wrapper', tableSize]">
      <TableToolbar 
        :columns="tableConfig.tableColumn" 
        :tableKey="tableConfig.tableKey || 'default'"
        :exportable="!!tableConfig.exportApi" 
        :loading="loading" 
        :exportLoading="exportLoading" 
        :size="tableSize"
        @refresh="handleRefresh" 
        @export="handleExport" 
        @size-change="handleSizeChange"
        @columns-change="handleColumnsChange"
      >
        <template #toolbar>
          <slot name="table-toolbar" />
        </template>
      </TableToolbar>
      
      <slot name="table" :tableData="tableData" :loading="loading" :displayColumns="displayColumns">
        <TableComponent 
          ref="tableComponentRef" 
          :border="tableConfig.border||false"
          :tableColumn="displayColumns" 
          :tableData="tableData" 
          :loading="loading"
          :rowClassName="tableConfig.rowClassName"
          :rowStyle="tableConfig.rowStyle"
          :spanMethod="tableConfig.spanMethod"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
        >
          <!-- 表格列插槽 -->
          <template 
            v-for="col in tableSlotsColumns" 
            :key="col.slotName || col.prop"
            #[getTableSlotName(col)]="scope"
          >
            <slot 
              :name="getTableSlotName(col)" 
              :row="scope.row" 
              :column="col"
              :$index="scope.$index" 
            />
          </template>
        </TableComponent>
      </slot>
    </div>

    <!-- 分页 -->
    <Pagination 
      v-if="tableConfig.pagination !== false" 
      v-model:page="currentPage" 
      v-model:pageSize="pageSize"
      :total="total" 
      @change="handlePageChange" 
    />
  </div>
</template>

<script setup lang="ts">
// 考虑到初级前端，封装的不深，组件封装便于理解，二次封装，自定义拓展，不拓展也可直接使用可满足开发中大部分业务表格，
// 特定的复杂表格留有表格插槽可自行编写复杂情况的表格
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import QueryForm from './searchForm/index.vue'
import TableComponent from './tableOpe/index.vue'
import Pagination from './tableOpe/Pagination.vue'
import TableToolbar from './tableOpe/TableToolbar.vue'
export type {
  BoxTableInstance,
  LoadSuccessData,
  BoxTableConfig,
  QueryItem,
  TableColumn
} from './types'
import type {BoxTableInstance, TableColumn} from './types'
const props = defineProps({
  tableConfig: {
    type: Object as any,
    default: () => ({})
  }
})

const emit = defineEmits([
  'selection-change', 
  'load-success', 
  'load-error', 
  'mounted', 
  'refresh', 
  'export',
  'row-click',      // 新增：行单击
  'row-dblclick'    // 新增：行双击
])

const tableData = ref<any[]>([])
const loading = ref(false)
const exportLoading = ref(false)
const currentPage = ref(props.tableConfig.page || 1)
const pageSize = ref(props.tableConfig.pageSize || 20)
const total = ref(props.tableConfig.total || 0)
const searchParams = ref<Record<string, any>>({})
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null)
const tableComponentRef = ref<InstanceType<typeof TableComponent> | null>(null)
const tableSize = ref(props.tableConfig.size || 'default')
const visibleColumns = ref<TableColumn[]>([])

/** 获取查询表单的插槽名称（过滤掉内置插槽） */
const queryFormSlots = computed<string[]>(() => {
  const builtInSlots = ['extra-buttons']
  const queryList = props.tableConfig.queryList || []
  const slotItems = queryList.filter((item: any) => item.isSlot)
  return slotItems.map((item: any) => item.slotName || item.field)
})

/** 获取需要创建插槽的表格列 */
const tableSlotsColumns = computed<TableColumn[]>(() => {
  return (props.tableConfig.tableColumn || []).filter((col: TableColumn) => 
    col.isSlot || col.type === 'expand'
  )
})

/** 获取表格插槽名称 */
const getTableSlotName = (col: TableColumn): string => {
  if (col.type === 'expand') return 'expand'
  return col.slotName || col.prop || ''
}

/** 显示的列（过滤掉隐藏的列） */
const displayColumns = computed<TableColumn[]>(() => {
  if (visibleColumns.value.length) {
    const fixedColumns = (props.tableConfig.tableColumn || []).filter((col: TableColumn) =>
      col.type === 'selection' || col.type === 'index'
    )
    return [...fixedColumns, ...visibleColumns.value]
  }
  return props.tableConfig.tableColumn || []
})


/** 处理列变化 */
const handleColumnsChange = (columns: TableColumn[]): void => {
  visibleColumns.value = columns
}

/** 刷新数据 */
const handleRefresh = (): void => {
  emit('refresh')
  loadData()
}

/** 导出数据 */
const handleExport = async (): Promise<void> => {
  if (!props.tableConfig.exportApi) return

  exportLoading.value = true
  try {
    const params = {
      ...searchParams.value,
      pageSize: total.value
    }
    const res = await props.tableConfig.exportApi(params)

    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.tableConfig.exportFileName || 'export'}.xlsx`
    link.click()
    URL.revokeObjectURL(url)

    emit('export')
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    exportLoading.value = false
  }
}

/** 表格密度切换 */
const handleSizeChange = (size: string): void => {
  tableSize.value = size
  localStorage.setItem('table_size', size)
}
/** 获取路径值 */
const getValueByPath = (obj: any, path: string): any => {
  if (!path) return ''
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
/** 获取表格数据 */
const loadData = async (): Promise<void> => {
  if (!props.tableConfig.queryApi) return

  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }

    const res = await props.tableConfig.queryApi(params)
    
    const dataListKey = props.tableConfig.apiList || 'list'
    
    if (res.code === 200) {
      tableData.value = getValueByPath(res.data, dataListKey) || res.data?.[dataListKey] || res.data || []
      total.value = res.data?.total || 0
      // 调用 成功回调传递查询出来的数据
      emit('load-success', { data: tableData.value, total: total.value })
    } else {
      throw new Error(res.message || '获取数据失败')
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    emit('load-error', error as Error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleSearch = (params: Record<string, any>): void => {
  searchParams.value = params
  currentPage.value = 1
  loadData()
}


/** 重置 */
const handleReset = (): void => {
  searchParams.value = {}
  currentPage.value = 1
  loadData()
}
/** 分页变化 */
const handlePageChange = (): void => {
  loadData()
}
/** 选中变化 */
const handleSelectionChange = (selection: any[]): void => {
  emit('selection-change', selection)
}

/** 行单击（透传） */
const handleRowClick = (row: any, column: any, event: Event): void => {
  emit('row-click', row, column, event)
}

/** 行双击（透传） */
const handleRowDblClick = (row: any, column: any, event: Event): void => {
  emit('row-dblclick', row, column, event)
}

/** 刷新表格 */
const queryTableList = (): Promise<void> => {
  return loadData()
}

/** 重置并刷新 */
const resetAndRefresh = (): void => {
  handleReset()
}

/** 获取当前搜索参数 */
const getSearchParams = (): Record<string, any> => {
  return { ...searchParams.value }
}

/** 设置搜索参数并查询 */
const setSearchParams = (params: Record<string, any>, isResetPage = true): void => {
  searchParams.value = { ...params }
  if (isResetPage) {
    currentPage.value = 1
  }
  loadData()
}

/** 获取查询表单实例 */
const getQueryFormInstance = () => {
  return queryFormRef.value
}

/** 获取表格实例 */
const getTableInstance = () => {
  return tableComponentRef.value
}

// 暴露方法给父组件
const instance: BoxTableInstance = {
  queryTableList,
  resetAndRefresh,
  loadData,
  getSearchParams,
  setSearchParams,
  getQueryFormInstance,
  getTableInstance
}

defineExpose(instance)

// 监听配置变化
watch(() => props.tableConfig, () => {
  currentPage.value = props.tableConfig.page || 1
  pageSize.value = props.tableConfig.pageSize || 20
  total.value = props.tableConfig.total || 0
  loadData()
}, { deep: true })

// 组件渲染完成后
onMounted(() => {
  nextTick(() => {
    const savedSize = localStorage.getItem('table_size')
    if (savedSize) {
      tableSize.value = savedSize
    }
    emit('mounted', instance)
  })
})


</script>

<style scoped lang="scss">
.main-table {
  background: #f5f7fa;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  .table-wrapper {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .table-slot-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      
      > * {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
    }

    :deep(.el-table) {
      height: 100% !important;
      flex: 1;
      
      .el-table__body-wrapper {
        overflow-y: auto !important;
      }
    }

    &.large {
      :deep(.el-table) {
        td,
        th {
          padding: 16px 0;
        }
      }
    }

    &.small {
      :deep(.el-table) {
        td,
        th {
          padding: 4px 0;
        }
      }
    }
  }
}
</style>