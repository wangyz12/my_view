/**
 * BoxTable 组件实例类型
 * 用于父组件通过 ref 调用组件方法
 */
export interface BoxTableInstance {
  queryTableList: () => Promise<void>
  loadData: () => Promise<void>
  getSearchParams: () => Record<string, unknown>
  setSearchParams: (params: Record<string, unknown>, isResetPage?: boolean) => void
  resetAndRefresh: () => void
  getQueryFormInstance: () => unknown
  getTableInstance: () => unknown
}

/**
 * 数据加载成功事件的数据类型
 */
export interface LoadSuccessData<T = unknown> {
  data: T[]
  total: number
}

/**
 * 表格配置类型
 */
export interface BoxTableConfig {
  tableKey?: string
  queryApi: (params: Record<string, unknown>) => Promise<{
    code: number
    data: unknown
    message?: string
  }>
  apiList?: string
  exportApi?: (params: Record<string, unknown>) => Promise<unknown>
  exportFileName?: string
  size?: 'large' | 'default' | 'small'
  pageSize?: number
  pagination?: boolean
  border?: boolean
  queryList?: QueryItem[]
  tableColumn?: TableColumn[]
  rowClassName?: (params: RowStyleParams) => string
  rowStyle?: (params: RowStyleParams) => Record<string, string>
  spanMethod?: (params: SpanMethodParams) => SpanMethodResult
  page?: number
  total?: number
}

/**
 * 查询项配置类型
 */
export interface QueryItem {
  type?: 'text' | 'select' | 'cascader' | 'daterange' | 'remote'
  field: string
  label: string
  defaultValue?: unknown
  isSlot?: boolean
  slotName?: string
  option?: Array<{ label: string; value: unknown }>
  queryApi?: (...args: unknown[]) => Promise<unknown>
  props?: Record<string, string>
  lazy?: boolean
  dictType?: string
}

/**
 * 表格列配置类型
 */
export interface TableColumn {
  type?: 'selection' | 'index' | 'expand'
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  isSlot?: boolean
  slotName?: string
  children?: TableColumn[]
}
/**
 * 行样式参数类型
 */
export interface RowStyleParams {
  row: unknown
  rowIndex: number
}

/**
 * 单元格合并参数类型
 */
export interface SpanMethodParams {
  row: unknown
  column: unknown
  rowIndex: number
  columnIndex: number
}

/**
 * 单元格合并返回值类型
 */
export interface SpanMethodResult {
  rowspan: number
  colspan: number
}