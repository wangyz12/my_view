# BoxTable 组件文档

## 概述

BoxTable 是一个基于 Vue 3 + Element Plus 的表格组件，集成了查询表单、表格主体、分页和工具栏功能。通过 JSON 配置驱动渲染，支持高度自定义。

## 核心特性

- ✅ **JSON 配置驱动**：通过配置对象控制查询表单、表格列、分页等
- ✅ **查询表单**：支持文本、下拉、级联、日期范围、远程搜索等多种表单类型
- ✅ **表格功能**：支持多选、序号、自定义列、排序、固定列等
- ✅ **工具栏**：刷新、导出、列设置、表格密度切换
- ✅ **分页**：标准分页组件
- ✅ **插槽系统**：支持查询表单和表格列的自定义插槽
- ✅ **状态管理**：自动保存列设置和表格密度到 localStorage
- ✅ **API 集成**：无缝对接后端接口
## 添加功能
### 表格插槽
当前组件已添加完整的表格插槽功能，用于应对复杂表格场景，如：树形表格、合并单元格表格、自定义布局表格等。

#### 基本用法
```vue
<BoxTable :tableConfig="TableConfig">
  <!-- 完全自定义表格渲染 -->
  <template #table="{ tableData, loading, displayColumns }">
    <el-table 
      :data="tableData" 
      :loading="loading"
      :row-class-name="TableConfig.rowClassName"
      :row-style="TableConfig.rowStyle"
      :span-method="TableConfig.spanMethod"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" />
      
      <!-- 序号列 -->
      <el-table-column type="index" width="80" label="序号" />
      
      <!-- 动态渲染列 -->
      <template v-for="col in displayColumns" :key="col.prop || col.type">
        <!-- 自定义插槽列 -->
        <el-table-column 
          v-if="col.isSlot" 
          :prop="col.prop" 
          :label="col.label" 
          :width="col.width"
          :fixed="col.fixed"
          :sortable="col.sortable"
        >
          <template #default="scope">
            <slot :name="col.slotName || col.prop" :row="scope.row" />
          </template>
        </el-table-column>
        
        <!-- 普通列 -->
        <el-table-column 
          v-else 
          :prop="col.prop" 
          :label="col.label" 
          :width="col.width"
          :fixed="col.fixed"
          :sortable="col.sortable"
          :show-overflow-tooltip="col.showOverflowTooltip"
        />
      </template>
    </el-table>
  </template>
  
  <!-- 原有的列插槽仍然可用 -->
  <template #status="{ row }">
    <el-tag :type="row.status == 0 ? 'success' : 'danger'">
      {{ row.status == 0 ? '启用' : '停用' }}
    </el-tag>
  </template>
</BoxTable>
```

#### 插槽参数说明
- `tableData`: 当前表格数据数组
- `loading`: 加载状态
- `displayColumns`: 当前显示的列配置（已过滤隐藏列）

#### 适用场景
1. **树形表格**：使用 el-table 的树形模式
2. **复杂合并单元格**：自定义 span-method 方法
3. **自定义表格布局**：完全控制表格结构和样式
4. **特殊表格类型**：如可编辑表格、拖拽排序表格等

#### 注意事项
- 使用表格插槽时，需要手动处理所有列的渲染
- 原有的列插槽（如 #status、#operation）仍然可以在自定义表格中使用
- 表格插槽会覆盖默认的表格渲染，但查询表单、工具栏、分页等功能保持不变

## 目录结构

```
BoxTable/
├── index.vue              # 主组件
├── config.ts              # 配置示例和类型定义
├── searchForm/            # 查询表单组件
│   ├── index.vue          # 查询表单主组件
│   └── useQueryData.ts    # 查询表单数据逻辑
└── tableOpe/              # 表格操作组件
    ├── index.vue          # 表格主体组件
    ├── TableToolbar.vue   # 表格工具栏
    └── Pagination.vue     # 分页组件
```

## 快速开始

### 1. 基本使用

```vue
<template>
  <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted">
    <!-- 表格列插槽 -->
    <template #status="{ row }">
      <el-tag :type="row.status == 0 ? 'success' : 'danger'">
        {{ row.status == 0 ? '启用' : '停用' }}
      </el-tag>
    </template>
    
    <!-- 工具栏插槽 -->
    <template #table-toolbar>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增
      </el-button>
    </template>
    
    <!-- 操作列插槽 -->
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
  </BoxTable>
</template>

<script setup lang="ts">
import BoxTable from '@/components/BoxTable/index.vue'
import { TableConfig } from './config'
import { getUserList } from '@/api/system/user'

const tableRef = ref()
const tableInstance = ref<any>(null)

// 表格渲染完成后的回调
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList() // 加载数据
}

// 配置对象
const TableConfig = {
  // 查询表单配置
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    { type: 'text', field: 'username', label: '用户名称' },
    { 
      type: 'select', 
      field: 'status', 
      label: '状态',
      option: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ]
    }
  ],
  
  // 表格列配置
  tableColumn: [
    { type: 'selection', width: '55' },
    { type: 'index', width: '80', label: '序号' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'username', width: '120', label: '姓名' },
    { 
      prop: 'status', 
      width: '80', 
      label: '状态',
      isSlot: true,
      slotName: 'status'
    },
    { 
      fixed: 'right', 
      label: '操作', 
      width: '150',
      isSlot: true,
      slotName: 'operation'
    }
  ],
  
  // 数据查询接口
  queryApi: getUserList,
  
  // 分页配置
  page: 1,
  pageSize: 20,
  pagination: true,
  
  // 表格标识（用于保存列设置）
  tableKey: 'user_table',
  
  // 表格密度
  size: 'default' // large | default | small
}
</script>
```

### 2. 配置对象详解

#### 基础配置

```typescript
{
  // 表格唯一标识（用于保存列设置到 localStorage）
  tableKey: 'user_table',
  
  // 数据查询接口（必填）
  queryApi: getUserList,
  
  // 导出接口（可选）
  exportApi: exportUserList,
  exportFileName: '用户列表',
  
  // 表格密度
  size: 'default', // large | default | small
  
  // 分页配置
  pageSize: 20,
  pagination: true,
  
  // 查询表单配置
  columnsPerRow: 3,      // 每行显示几个查询项
  defaultExpand: false,  // 是否默认展开查询表单
}
```

#### 查询表单配置（queryList）

查询表单支持多种类型，每个查询项的基本结构：

```typescript
{
  type: 'text' | 'select' | 'cascader' | 'daterange' | 'remote',
  field: '字段名',
  label: '显示标签',
  defaultValue: '默认值',
  isSlot: false,      // 是否使用插槽
  slotName: '插槽名'  // 插槽名称（isSlot为true时使用）
}
```

**1. 文本输入框（text）**
```typescript
{ 
  type: 'text', 
  field: 'account', 
  label: '账户',
  defaultValue: '' 
}
```

**2. 下拉选择器（select）**
```typescript
// 静态数据
{ 
  type: 'select', 
  field: 'status', 
  label: '状态',
  option: [
    { label: '启用', value: 0 },
    { label: '停用', value: 1 },
  ],
  defaultValue: ''
}

// 远程数据
{ 
  type: 'select', 
  field: 'roleId', 
  label: '角色',
  queryApi: getRoleList,      // 数据接口
  props: { value: 'id', label: 'name' },  // 字段映射
  lazy: true,                 // 聚焦时才加载
  defaultValue: ''
}

// 字典数据
{ 
  type: 'select', 
  field: 'userType', 
  label: '用户类型',
  dictType: 'sys_user_type',  // 字典类型
  lazy: false,
  defaultValue: ''
}
```

**3. 级联选择器（cascader）**
```typescript
{ 
  type: 'cascader', 
  field: 'deptId', 
  label: '部门',
  lazy: false,
  queryApi: getDeptTree,      // 树形数据接口
  props: {
    value: 'id',              // 值字段
    label: 'name',            // 标签字段
    children: 'children'      // 子节点字段
  }
}
```

**4. 日期范围选择器（daterange）**
```typescript
{ 
  type: 'daterange', 
  field: 'createTime', 
  label: '创建时间',
  defaultValue: []  // [开始日期, 结束日期]
}
```

**5. 远程搜索框（remote）**
```typescript
{ 
  type: 'remote', 
  field: 'userId', 
  label: '负责人',
  queryApi: searchUserApi,    // 搜索接口
  props: { value: 'id', label: 'name' },
  debounceTime: 500,          // 防抖延迟
  minSearchLength: 2,         // 最小搜索长度
  maxResults: 20,             // 最大返回结果数
  skipEmptySearch: true,      // 跳过空搜索
  defaultValue: ''
}
```

**6. 自定义插槽（isSlot）**
```typescript
{ 
  field: 'customField', 
  label: '自定义',
  isSlot: true,
  slotName: 'customField',  // 对应插槽名称为 query-customField
  defaultValue: ''
}
```

#### 表格列配置（tableColumn）

```typescript
[
  // 多选框列
  { type: 'selection', width: '55' },
  
  // 序号列
  { type: 'index', width: '80', label: '序号' },
  
  // 普通列
  { 
    prop: 'account',           // 数据字段（支持 a.b.c 格式）
    width: '120',              // 列宽
    label: '账号',             // 列标题
    sortable: false,           // 是否可排序
    showOverflowTooltip: true, // 超出显示提示
    fixed: 'right',            // 固定列：'left' | 'right'
    minWidth: '100'            // 最小宽度
  },
  
  // 自定义插槽列
  { 
    prop: 'status', 
    width: '80', 
    label: '状态',
    isSlot: true,              // 启用插槽
    slotName: 'status'         // 插槽名称
  },
  
  // 操作列（通常固定在右侧）
  { 
    fixed: 'right', 
    label: '操作', 
    width: '150',
    isSlot: true,
    slotName: 'operation'
  }
]
```

### 3. 插槽系统

#### 查询表单插槽

查询表单插槽使用 `query-` 前缀：

```vue
<BoxTable :tableConfig="TableConfig">
  <!-- 自定义查询表单字段 -->
  <template #query-customField="{ item, formData, updateFormData }">
    <el-input v-model="formData[item.field]" placeholder="自定义输入" />
  </template>
  
  <!-- 额外按钮 -->
  <template #query-extra-buttons>
    <el-button type="warning" @click="handleExport">导出</el-button>
  </template>
</BoxTable>
```

#### 表格列插槽

表格列插槽直接使用列名或 slotName：

```vue
<BoxTable :tableConfig="TableConfig">
  <!-- 状态列插槽 -->
  <template #status="{ row }">
    <el-tag :type="row.status == 0 ? 'success' : 'danger'">
      {{ row.status == 0 ? '启用' : '停用' }}
    </el-tag>
  </template>
  
  <!-- 部门列插槽 -->
  <template #deptId="{ row }">
    <span>{{ row.deptId?.name || '-' }}</span>
  </template>
  
  <!-- 操作列插槽 -->
  <template #operation="{ row }">
    <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
    <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
  </template>
</BoxTable>
```

#### 工具栏插槽

```vue
<BoxTable :tableConfig="TableConfig">
  <!-- 工具栏插槽 -->
  <template #table-toolbar>
    <el-button type="primary" @click="handleAdd">
      <el-icon><Plus /></el-icon>新增
    </el-button>
    <el-button type="success" @click="handleBatchEnable">批量启用</el-button>
  </template>
</BoxTable>
```

### 4. 组件实例方法

通过 `ref` 获取组件实例后，可以调用以下方法：

```typescript
const tableRef = ref()
const tableInstance = ref<any>(null)

// 表格渲染完成后的回调
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  
  // 加载数据
  instance.queryTableList()
  
  // 获取当前搜索参数
  const params = instance.getSearchParams()
  console.log('当前搜索参数:', params)
  
  // 设置搜索参数并查询
  instance.setSearchParams({ status: 0 })
  
  // 重置并刷新
  instance.resetAndRefresh()
  
  // 获取查询表单实例
  const queryForm = instance.getQueryFormInstance()
  
  // 获取表格实例
  const table = instance.getTableInstance()
}

// 完整的方法列表
const tableMethods = {
  // 数据操作
  queryTableList: () => tableInstance.value?.queryTableList(),      // 查询表格数据
  loadData: () => tableInstance.value?.loadData(),                  // 加载数据
  resetAndRefresh: () => tableInstance.value?.resetAndRefresh(),    // 重置并刷新
  
  // 参数管理
  getSearchParams: () => tableInstance.value?.getSearchParams(),    // 获取搜索参数
  setSearchParams: (params: any, isResetPage = true) =>             // 设置搜索参数
    tableInstance.value?.setSearchParams(params, isResetPage),
  
  // 组件实例获取
  getQueryFormInstance: () => tableInstance.value?.getQueryFormInstance(), // 查询表单实例
  getTableInstance: () => tableInstance.value?.getTableInstance(),         // 表格实例
  
  // 其他操作
  handleRefresh: () => tableInstance.value?.handleRefresh(),        // 手动刷新
  handleExport: () => tableInstance.value?.handleExport(),          // 手动导出
}
```

### 5. 事件系统

```vue
<BoxTable 
  :tableConfig="TableConfig"
  @mounted="handleTableMounted"
  @selection-change="handleSelectionChange"
  @load-success="handleLoadSuccess"
  @load-error="handleLoadError"
  @refresh="handleRefresh"
  @export="handleExport"
  @row-click="handleRowClick"
  @row-dblclick="handleRowDblClick"
/>
```

```typescript
// 表格渲染完成
const handleTableMounted = (instance: any) => {
  console.log('表格实例:', instance)
}

// 行选中变化
const handleSelectionChange = (selection: any[]) => {
  console.log('选中行:', selection)
}

// 数据加载成功
const handleLoadSuccess = ({ data, total }: { data: any[], total: number }) => {
  console.log('加载成功:', data.length, '条数据，总计:', total)
}

// 数据加载失败
const handleLoadError = (error: any) => {
  console.error('加载失败:', error)
}

// 刷新事件
const handleRefresh = () => {
  console.log('表格已刷新')
}

// 导出事件
const handleExport = () => {
  console.log('数据已导出')
}

// 行单击事件
const handleRowClick = (row: any, column: any, event: Event) => {
  console.log('行单击:', row, column)
  // 可以在这里实现行详情展开、编辑等操作
}

// 行双击事件
const handleRowDblClick = (row: any, column: any, event: Event) => {
  console.log('行双击:', row, column)
  // 通常用于快速编辑或查看详情
}
```

### 6. 完整配置示例

```typescript
import { getUserList, exportUserList } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'
import { getRoleList } from '@/api/system/role'

export const TableConfig = {
  // ==================== 基础配置 ====================
  tableKey: 'user_table',
  queryApi: getUserList,
  exportApi: exportUserList,
  exportFileName: '用户列表',
  size: 'default',
  pageSize: 20,
  pagination: true,
  columnsPerRow: 3,
  defaultExpand: false,
  
  // ==================== 查询表单配置 ====================
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    { type: 'text', field: 'username', label: '用户名称' },
    { 
      type: 'cascader', 
      field: 'deptId', 
      label: '部门',
      lazy: false,
      queryApi: getDeptTree,
      props: { value: 'id', label: 'name', children: 'children' }
    },
    { 
      type: 'select', 
      field: 'status', 
      label: '状态',
      option: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ]
    },
    { 
      type: 'select', 
      field: 'roleId', 
      label: '角色',
      queryApi: getRoleList,
      props: { value: 'id', label: 'name' },
      lazy: true
    },
    { type: 'text', field: 'phone', label: '手机号' },
    { 
      type: 'daterange', 
      field: 'createTime', 
      label: '创建时间',
      defaultValue: []
    }
  ],
  
  // ==================== 表格列配置 ====================
  tableColumn: [
    { type: 'selection', width: '55' },
    { type: 'index', width: '80', label: '序号' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'username', width: '120', label: '姓名' },
    { prop: 'deptId.name', width: '150', label: '部门', isSlot: true, slotName: 'deptId' },
    { prop: 'phone', width: '130', label: '手机号' },
    { prop: 'email', width: '180', label: '邮箱' },
    { prop: 'status', width: '80', label: '状态', isSlot: true, slotName: 'status' },
    { prop: 'createdAt', width: '180', label: '创建时间', sortable: true },
    { fixed: 'right', label: '操作', width: '200', isSlot: true, slotName: 'operation' }
  ]
}
```

## 代码逻辑文档

### 1. 组件架构

BoxTable 采用分层架构：

```
父组件 (使用页面)
    ↓
BoxTable (主组件，协调各子组件)
    ├── QueryForm (查询表单组件)
    ├── TableToolbar (表格工具栏)
    ├── TableComponent (表格主体组件)
    └── Pagination (分页组件)
```

### 2. 数据流

```
用户操作 → 事件触发 → 状态更新 → API调用 → 数据渲染
    ↑                                         ↓
    └─────────── 响应式更新 ────────────────┘
```

### 3. 核心函数

#### 数据加载 (`loadData`)
- 调用配置的 `queryApi`
- 处理分页参数
- 更新表格数据和总数
- 触发 `load-success` 或 `load-error` 事件

#### 查询处理 (`handleSearch`)
- 收集查询表单数据
- 重置页码为 1
- 触发数据加载

#### 列设置管理 (`handleColumnsChange`)
- 保存用户列设置到 localStorage
- 过滤隐藏的列
- 保持 selection 和 index 列始终显示

#### 导出处理 (`handleExport`)
- 调用配置的 `exportApi`
- 处理全量数据导出（pageSize = total）
- 生成 Excel 文件并下载
- 触发 `export` 事件

### 4. 插槽机制

#### 查询表单插槽命名规则
```typescript
// 配置中：slotName = 'customField'
// 使用时：<template #query-customField>
```

#### 表格列插槽命名规则
```typescript
// 配置中：slotName = 'status' 或 prop = 'status'
// 使用时：<template #status>
```

#### 插槽作用域
- `row`: 当前行数据
- `column`: 列配置对象
- `$index`: 行索引
- `formData`: 查询表单数据（查询表单插槽）
- `updateFormData`: 更新表单数据函数（查询表单插槽）

### 5. 状态管理

#### localStorage 存储
- `table_size`: 表格密度设置
- `tableKey_columns`: 列显示设置（根据 tableKey）

#### 响应式数据
- `tableData`: 表格数据
- `searchParams`: 查询参数
- `currentPage`: 当前页码
- `total`: 数据总数
- `loading`: 加载状态

## 未来扩展功能

### 扩展原则

> **核心思想**：BoxTable 只封装 80% 的通用场景，剩余 20% 的特殊需求通过插槽让使用者自行实现。以下功能按优先级排序，高优先级的会在后续版本中陆续支持。

---

### 🔴 高优先级（计划在 v2.x 中支持）

这些功能通用性强，适合集成到组件中。

| 功能 | 说明 | 预计版本 |
| :--- | :--- | :--- |
| **虚拟滚动** | 支持大数据量（1万+）场景，提升渲染性能 | v2.1 |
| **行拖拽排序** | 通过拖拽调整表格行顺序 | v2.2 |
| **表格高度自适应** | 自动计算表格高度，避免出现双滚动条 | v2.0 |
| **列显隐配置持久化** | 已实现，继续优化体验 | v2.0 |

---

### 🟡 中优先级（视需求情况而定）

这些功能有一定通用性，但不是所有场景都需要，可能会以**可选插件**的形式提供。

| 功能 | 说明 | 替代方案 |
| :--- | :--- | :--- |
| **列拖拽排序** | 通过拖拽调整列顺序 | 可自行使用 SortableJS 实现 |
| **单元格编辑** | 双击单元格进行编辑 | 可通过插槽自行实现 |
| **树形表格** | 展示层级数据 | 可通过插槽 + el-table 树形模式实现 |
| **表格尾部合计** | 在表格底部显示合计行 | 可通过插槽自行实现 |
| **行展开（详情面板）** | 点击行展开更多详情 | 可通过插槽自行实现 |

---

### 🟢 低优先级（暂不实现，推荐自行扩展）

这些功能业务相关性高，不适合放入通用组件，使用者可通过插槽自行实现。

| 功能 | 说明 | 实现方式 |
| :--- | :--- | :--- |
| **导出 Excel** | 已提供导出按钮和事件，导出逻辑由使用者实现 | 使用 `exportApi` 或监听 `@export` 事件 |
| **批量操作** | 批量删除、批量审核等 | 使用 `selection` 列 + 自定义工具栏 |
| **数据图表** | 将表格数据可视化为图表 | 在表格上方自行添加图表组件 |
| **导入功能** | Excel 导入数据 | 在工具栏插槽中添加导入按钮 |
| **打印功能** | 打印表格数据 | 自行实现打印逻辑 |
| **数据对比** | 对比两行数据的差异 | 业务相关，自行实现 |

---
## 最佳实践

### 1. 配置管理

```typescript
// config/userTable.config.ts
export const UserTableConfig = {
  // ... 配置
}

// 复用配置
export const createTableConfig = (overrides: Partial<typeof UserTableConfig>) => {
  return { ...UserTableConfig, ...overrides }
}
```

### 2. 错误处理

```typescript
// 在页面组件中处理错误
const handleLoadError = (error: any) => {
  ElMessage.error(error.message || '加载失败')
  // 记录错误日志
  console.error('表格加载错误:', error)
}
```

### 3. 性能监控

```typescript
// 监控表格性能
const startTime = Date.now()
const handleLoadSuccess = ({ data, total }) => {
  const loadTime = Date.now() - startTime
  console.log(`表格加载完成: ${data.length}条数据, 耗时${loadTime}ms`)
  
  if (loadTime > 1000) {
    console.warn('表格加载较慢，考虑优化')
  }
}
```

### 4. 可访问性

```vue
<!-- 添加 ARIA 属性 -->
<BoxTable 
  :tableConfig="TableConfig"
  aria-label="用户数据表格"
  role="grid"
>
  <!-- 操作按钮添加键盘支持 -->
  <template #operation="{ row }">
    <el-button 
      @click="handleEdit(row)"
      @keydown.enter="handleEdit(row)"
      aria-label="编辑用户"
    >
      编辑
    </el-button>
  </template>
</BoxTable>
```

## 常见问题

### 1. 接口返回格式不匹配

```typescript
// 在配置前处理接口
const adaptedGetUserList = async (params: any) => {
  const res = await getUserList(params)
  // 适配 BoxTable 需要的格式
  return {
    code: 200,
    data: {
      list: res.data.items,
      total: res.data.count
    }
  }
}

const TableConfig = {
  queryApi: adaptedGetUserList,
  // ...
}
```

### 2. 自定义查询表单验证

```vue
<template #query-customField="{ formData, updateFormData }">
  <el-input 
    v-model="formData.customField"
    :rules="[{ required: true, message: '必填项' }]"
  />
</template>
```

### 3. 动态更新配置

```typescript
// 动态更新查询条件
const updateQueryList = () => {
  TableConfig.queryList = [
    ...TableConfig.queryList,
    { type: 'text', field: 'newField', label: '新字段' }
  ]
}

// 动态更新表格列
const updateTableColumn = () => {
  TableConfig.tableColumn = TableConfig.tableColumn.map(col => 
    col.prop === 'status' ? { ...col, width: '100' } : col
  )
}
```

## 总结

BoxTable 组件是一个功能丰富、可配置性高的表格解决方案，通过 JSON 配置驱动的方式，大大减少了重复的表格开发工作。其模块化设计和插槽系统提供了极大的灵活性，可以满足各种复杂的业务需求。

随着项目的不断发展，BoxTable 将持续优化和扩展，成为前端表格开发的核心工具。

---

**相关文档**
- [JSON 配置类型定义](./CONFIG_TYPES.md)
- [API 接口文档](./API.md)（待完善）
- [示例代码](../examples/)（待完善）