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
      <!-- 查询表单插槽 - 使用 query- 前缀 -->
      <template 
        v-for="slot in queryFormSlots" 
        :key="slot"
        #[slot]="slotProps"
      >
        <slot :name="`query-${slot}`" v-bind="slotProps" />
      </template>
      
      <!-- 额外按钮插槽 -->
      <template #extra-buttons="slotProps">
        <slot name="query-extra-buttons" v-bind="slotProps" />
      </template>
    </QueryForm>

    <!-- 表格 -->
    <div :class="['table-wrapper', tableSize]">
      <!-- 表格工具栏 -->
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
          :tableColumn="displayColumns" 
          :tableData="tableData" 
          :loading="loading"
          @selection-change="handleSelectionChange"
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
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import QueryForm from './searchForm/index.vue'
import TableComponent from './tableOpe/index.vue'
import Pagination from './tableOpe/Pagination.vue'
import TableToolbar from './tableOpe/TableToolbar.vue'

const props = defineProps({
  tableConfig: {
    type: Object as any,
    default: () => ({})
  }
})

const emit = defineEmits(['selection-change', 'load-success', 'load-error', 'mounted', 'refresh', 'export'])

const tableData = ref<any[]>([])
const loading = ref(false)
const exportLoading = ref(false)
const currentPage = ref(props.tableConfig.page || 1)
const pageSize = ref(props.tableConfig.pageSize || 20)
const total = ref(props.tableConfig.total || 0)
const searchParams = ref<any>({})
const queryFormRef = ref()
const tableComponentRef = ref()
const tableSize = ref(props.tableConfig.size || 'default')
const visibleColumns = ref<any[]>([])

// 获取查询表单的插槽名称（过滤掉内置插槽）
const queryFormSlots = computed(() => {
  const builtInSlots = ['extra-buttons']
  return Object.keys(props.tableConfig.queryList?.find((item: any) => item.isSlot) ? 
    props.tableConfig.queryList.filter((item: any) => item.isSlot).map((item: any) => item.slotName || item.field) : 
    [])
})

// 获取需要创建插槽的表格列
const tableSlotsColumns = computed(() => {
  return props.tableConfig.tableColumn?.filter((col: any) => 
    col.isSlot || col.type === 'expand'
  ) || []
})

// 获取表格插槽名称（统一使用 table- 前缀）
const getTableSlotName = (col: any) => {
  if (col.type === 'expand') {
    return 'expand'
  }
  // 直接返回 slotName 或 prop，不加 table- 前缀
  return col.slotName || col.prop
}

// 显示的列（过滤掉隐藏的列）
const displayColumns = computed(() => {
  if (visibleColumns.value.length) {
    // 合并 selection 和 index 列
    const fixedColumns = props.tableConfig.tableColumn?.filter((col: any) =>
      col.type === 'selection' || col.type === 'index'
    ) || []
    return [...fixedColumns, ...visibleColumns.value]
  }
  return props.tableConfig.tableColumn || []
})

// 处理列变化
const handleColumnsChange = (columns: any[]) => {
  visibleColumns.value = columns
}

// 刷新数据
const handleRefresh = () => {
  emit('refresh')
  loadData()
}

// 导出数据
const handleExport = async () => {
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

// 表格密度切换
const handleSizeChange = (size: string) => {
  tableSize.value = size
  localStorage.setItem('table_size', size)
}

// 获取数据
const loadData = async () => {
  if (!props.tableConfig.queryApi) return

  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }

    const res = await props.tableConfig.queryApi(params)
    
    // 使用 dataListStr 指定数据列表字段，默认 'list'
    const dataListKey = props.tableConfig.apiList || 'list'
    
    if (res.code === 200) {
      // 支持嵌套路径，如 'data.user.list'
      const getValueByPath = (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
      }
      
      tableData.value = getValueByPath(res.data, dataListKey) || res.data?.[dataListKey] || res.data || []
      total.value = res.data?.total || 0
      emit('load-success', { data: tableData.value, total: total.value })
    } else {
      throw new Error(res.message || '获取数据失败')
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    emit('load-error', error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = (params: any) => {
  searchParams.value = params
  currentPage.value = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchParams.value = {}
  currentPage.value = 1
  loadData()
}

// 分页变化
const handlePageChange = () => {
  loadData()
}

// 选中变化
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

// 刷新表格
const queryTableList = () => {
  loadData()
}

// 重置并刷新
const resetAndRefresh = () => {
  handleReset()
}

// 获取当前搜索参数
const getSearchParams = () => {
  return { ...searchParams.value }
}

// 设置搜索参数并查询
const setSearchParams = (params: any, isResetPage = true) => {
  searchParams.value = { ...params }
  if (isResetPage) {
    currentPage.value = 1
  }
  loadData()
}

// 获取查询表单实例
const getQueryFormInstance = () => {
  return queryFormRef.value
}

// 获取表格实例
const getTableInstance = () => {
  return tableComponentRef.value
}

// 暴露方法给父组件
defineExpose({
  queryTableList,
  resetAndRefresh,
  loadData,
  getSearchParams,
  setSearchParams,
  getQueryFormInstance,
  getTableInstance
})

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

    const instance = {
      queryTableList,
      resetAndRefresh,
      loadData,
      getSearchParams,
      setSearchParams,
      getQueryFormInstance,
      getTableInstance,
      $component: null as any
    }
    instance.$component = instance
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
      
      // 确保插槽内的表格填满容器
      > * {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
    }

    // 默认表格样式
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