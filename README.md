# Vue 3 企业级管理后台系统

## 🎯 项目定位

**My Admin** 是一个基于 Vue 3 的企业级管理后台系统，采用配置化开发思想，通过核心组件封装解决管理后台中 80% 的重复开发工作。

**适用人群：**
- **前端新手**：学习企业级项目架构和最佳实践
- **经验开发者**：需要快速搭建管理后台的脚手架
- **全栈学习者**：完整的前后端分离项目实战案例

## 🌐 项目关联

### 后端项目
- **仓库地址**：[https://gitee.com/W_admin_code/node_temp](https://gitee.com/W_admin_code/node_temp)
- **技术栈**：Node.js + Express + TypeScript + MongoDB
- **核心功能**：JWT 认证、RBAC 权限控制、5级数据权限

### 演示地址
- **在线演示**：[https://temp-code.top/](https://temp-code.top/)
- **测试账号**：superadmin / SuperAdmin_123

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 组合式 API + `<script setup>`
- **TypeScript** - 完整的类型安全支持
- **Vite** - 极速构建工具

### UI 组件库
- **Element Plus** - 企业级 UI 组件库
- **Tailwind CSS** - 原子化 CSS 框架
- **Sass/SCSS** - CSS 预处理器

### 状态管理与路由
- **Pinia** - Vue 官方状态管理
- **Vue Router 4** - 官方路由，支持动态路由

### 核心工具
- **Axios** - HTTP 客户端，完整拦截器封装
- **Popup Service** - 统一弹窗管理服务
- **BoxTable** - 配置化表格组件

### 开发工具
- **Auto Import** - 组件/API 自动导入
- **ESLint** + **Prettier** - 代码规范
- **pnpm** - 快速包管理器

## 🏗️ 项目架构

### 目录结构
```
src/
├── api/                    # API 层
├── components/            # 业务组件库
│   ├── BoxTable/          # 核心表格组件
│   └── PageLayout/        # 页面布局组件
├── pages/                 # 页面层
│   ├── system/            # 系统管理模块
│   │   ├── user/          # 用户管理
│   │   ├── role/          # 角色管理
│   │   ├── dept/          # 部门管理
│   │   └── menu/          # 菜单管理
├── store/                 # 状态管理
├── router/                # 路由系统
├── utils/                 # 工具函数
│   └── popupService.ts    # 弹窗服务
└── styles/                # 全局样式
```

### 架构特点
1. **分层清晰**：API → Store → Component → Page
2. **配置驱动**：表格、弹窗、路由都支持配置化
3. **类型安全**：全程 TypeScript，完整类型定义
4. **模块化**：按业务模块组织，易于扩展

## 📊 核心组件

### 1. BoxTable - 配置化表格组件

#### 核心特性
- **配置驱动**：JSON 配置生成完整表格
- **查询表单**：支持 10+ 种表单类型
- **工具栏**：刷新、导出、列设置、密度切换
- **插槽系统**：全面支持自定义渲染
- **状态持久化**：用户设置自动保存

#### 配置示例
```typescript
export const UserTableConfig = {
  tableKey: 'user_table',
  queryApi: getUserList,
  
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    { type: 'select', field: 'status', label: '状态', option: [...] }
  ],
  
  tableColumn: [
    { type: 'index', width: '80', label: '序号' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'status', width: '80', label: '状态', isSlot: true },
    { fixed: 'right', label: '操作', width: '200', isSlot: true }
  ]
}
```

#### 使用示例
```vue
<template>
  <PageLayout type="table">
    <BoxTable :tableConfig="TableConfig">
      <template #status="{ row }">
        <el-tag :type="row.status == 0 ? 'success' : 'danger'">
          {{ row.status == 0 ? '启用' : '停用' }}
        </el-tag>
      </template>
      
      <template #operation="{ row }">
        <el-button @click="handleEdit(row)">编辑</el-button>
        <el-button @click="handleDelete(row)">删除</el-button>
      </template>
    </BoxTable>
  </PageLayout>
</template>
```

### 2. Popup Service - 统一弹窗服务

#### 核心特性
- **统一 API**：`showPopup()`, `confirm()`, `alert()`
- **配置驱动**：通过配置对象控制弹窗行为
- **类型安全**：完整的 TypeScript 类型定义
- **自动清理**：弹窗关闭时自动销毁实例

#### 基础使用
```typescript
import { showPopup } from '@/utils/popupService'

// 显示自定义弹窗
const result = await showPopup(
  UserForm,
  { row: userData },
  {
    title: '编辑用户',
    width: '600px',
    success: (data) => {
      tableInstance.value?.queryTableList()
    }
  }
)

// 确认弹窗
const result = await popupService.confirm(
  '确定要删除这条数据吗？',
  { title: '删除确认', danger: true }
)

// 提示弹窗
await popupService.alert('操作成功！')
```

#### 弹窗组件规范
```vue
<template>
  <el-form :model="form">
    <el-form-item label="用户名">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-button @click="handleCancel">取消</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </el-form>
</template>

<script setup lang="ts">
const props = defineProps<{
  row?: any
  onSuccess?: (data: any) => void
  onCancel?: () => void
}>()

const form = reactive({ username: props.row?.username || '' })

const handleSubmit = () => {
  props.onSuccess?.({ ...form, id: props.row?.id })
}

const handleCancel = () => {
  props.onCancel?.()
}
</script>
```

### 3. PageLayout - 页面布局组件

#### 核心特性
- **统一布局**：标准的页面布局结构
- **面包屑导航**：自动根据路由生成
- **页面标题**：动态设置页面标题
- **响应式设计**：自动适配不同屏幕

#### 使用示例
```vue
<template>
  <PageLayout 
    type="table" 
    :title="用户管理"
    :breadcrumb="breadcrumb"
  >
    <BoxTable :tableConfig="UserTableConfig" />
    
    <template #toolbar>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </template>
  </PageLayout>
</template>
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+ (推荐) 或 npm 9+

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
访问：http://localhost:5173

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
pnpm lint:fix
pnpm type-check
```

## 📖 学习路径

### 对于新手
1. **运行项目**：按照快速开始运行项目
2. **理解结构**：浏览 `src/pages/` 下的页面
3. **学习组件**：重点学习 BoxTable 和 Popup Service
4. **动手实践**：尝试修改用户管理页面

### 对于开发者
1. **深入架构**：研究权限系统和动态路由
2. **性能优化**：学习代码分割和懒加载
3. **开发规范**：掌握 TypeScript 和代码规范

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 下创建页面目录
2. 配置路由（支持动态路由）
3. 配置菜单权限
4. 使用 BoxTable 快速搭建

### 添加新 API
1. 在 `src/api/` 下创建 API 文件
2. 定义 TypeScript 类型
3. 在页面中引入使用

### 自定义主题
1. 修改 `src/styles/` 下的样式文件
2. 通过 ThemeStore 动态切换主题
3. 适配 Element Plus 主题变量

## 📋 现有功能模块

### 🏢 系统管理模块

#### 1. 用户管理
- **用户列表**：分页查询、搜索过滤、状态筛选
- **用户操作**：新增、编辑、删除、启用/禁用
- **弹窗交互**：使用 Popup Service 统一管理
- **权限控制**：基于 RBAC 的权限验证

#### 2. 角色管理
- **角色列表**：角色信息展示和分页
- **权限分配**：为角色分配系统权限
- **数据权限**：配置角色的数据访问范围

#### 3. 部门管理
- **部门树**：树形结构展示部门层级
- **部门操作**：新增、编辑、删除部门
- **用户统计**：显示部门下的用户数量

#### 4. 菜单管理
- **菜单树**：树形结构展示菜单层级
- **菜单配置**：配置菜单图标、路由、权限标识
- **动态路由**：基于用户权限动态生成路由

## 🎯 最佳实践

### 1. 配置化开发
- 使用 BoxTable 配置生成表格，减少重复代码
- 通过 Popup Service 统一管理弹窗
- 路由和菜单支持动态配置

### 2. 类型安全
- 所有 API 接口都有完整的 TypeScript 类型定义
- 组件 Props 和 Emits 都有明确的类型
- 使用泛型提高代码复用性

### 3. 性能优化
- 组件懒加载，按需加载页面
- 请求缓存和防抖处理
- 图片和资源优化

### 4. 代码规范
- 使用 ESLint 和 Prettier 统一代码风格
- 遵循 Git 提交规范
- 完善的代码注释

## ❓ 常见问题

### 1. 如何添加新的查询条件？
在 BoxTable 配置的 `queryList` 中添加新的查询项，支持文本、选择、日期、级联等多种类型。

### 2. 如何自定义表格列渲染？
使用插槽系统，在 `#columnName` 插槽中自定义渲染逻辑。

### 3. 如何创建新的弹窗？
使用 Popup Service 的 `showPopup` 方法，传入自定义组件和配置。

### 4. 如何配置权限？
在路由配置中添加 `meta.permission`，在组件中使用 `v-permission` 指令。

### 5. 如何部署项目？
使用 `pnpm build` 构建后，将 `dist` 目录部署到静态服务器。

## 📄 版本历史

### v1.0.0 (2026-04-20)
- ✅ 基础框架搭建：Vue 3 + TypeScript + Vite
- ✅ 核心组件：BoxTable、Popup Service、PageLayout
- ✅ 系统管理模块：用户、角色、部门、菜单管理
- ✅ 权限系统：RBAC + 动态路由
- ✅ 开发工具链：ESLint、Prettier、Auto Import

### 未来计划
- 🔄 国际化支持（i18n）
- 🔄 主题切换（亮色/暗色）
- 🔄 移动端适配
- 🔄 单元测试和 E2E 测试
- 🔄 更多业务模块

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**💡 提示：** 本项目是一个学习现代前端开发的最佳实践案例。建议从 BoxTable 组件开始学习，这是项目的核心亮点，也是配置化开发思想的典型体现。
