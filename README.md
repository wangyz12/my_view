# Vue 3 全栈管理后台系统

## 🎯 项目定位

**适用于：**
- **新手前端**：想学习企业级项目架构和最佳实践
- **老手前端**：需要快速搭建管理后台的脚手架
- **想转全栈的前端**：完整的前后端分离项目实战案例

这是一个**生产级**的 Vue 3 管理后台系统，不仅提供了完整的用户权限管理功能，更重要的是展示了**如何从零构建企业级应用**的完整思路和架构设计。

## 🌐 项目关联

### 后端项目
- **仓库地址：** [https://gitee.com/W_admin_code/node_temp](https://gitee.com/W_admin_code/node_temp)
- **技术栈：** Node.js + Express + TypeScript + MongoDB
- **核心功能：** JWT 认证、RBAC 权限控制、RESTful API、文件上传、日志系统

### 演示地址
- **在线演示：** [https://temp-code.top/](https://temp-code.top/)
- **测试账号：** admin / admin_123
- **部署平台：** Vercel (前端) + 阿里云 ECS (后端)

### 前后端协作
1. **接口规范：** 完整的 RESTful API 设计
2. **认证机制：** JWT Token + Refresh Token
3. **权限控制：** 基于角色的访问控制 (RBAC)
4. **开发流程：** 前后端分离，API 先行

## 🏗️ 项目架构

### 核心设计理念
```
┌─────────────────────────────────────────────────────────────┐
│                   现代化前端工程架构                           │
│  配置化驱动 + 模块化设计 + 类型安全 + 自动化工具链                 │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构（精简版）
```
src/
├── api/                    # API 层 - 接口统一管理
│   ├── modules/           # 业务模块 API
│   └── system/            # 系统管理 API
├── components/            # 业务组件库
│   └── BoxTable/          # 核心表格组件（重点！）
├── layout/                # 布局系统
│   ├── index.vue          # 主布局
│   ├── menu/              # 菜单组件
│   └── head/              # 头部导航
├── pages/                 # 页面层
│   ├── system/            # 系统管理
│   │   ├── user/          # 用户管理（使用 BoxTable）
│   │   ├── role/          # 角色管理
│   │   ├── dept/          # 部门管理
│   │   └── menu/          # 菜单管理
│   ├── business/          # 业务模块
│   └── demo/              # 组件演示
├── store/                 # 状态管理 (Pinia)
│   ├── theme.ts           # 主题配置
│   ├── user.ts            # 用户信息
│   └── breadcrumb.ts      # 面包屑导航
├── router/                # 路由系统
│   ├── index.ts           # 路由配置
│   └── dynamic.ts         # 动态路由（基于权限）
├── utils/                 # 工具函数
│   ├── request.ts         # Axios 封装
│   ├── auth.ts            # 认证工具
│   └── storage.ts         # 本地存储
└── styles/                # 全局样式
```

### 架构特点
1. **分层清晰**：API → Store → Component → Page
2. **配置驱动**：路由、菜单、权限都支持动态配置
3. **类型安全**：全程 TypeScript，接口有完整类型定义
4. **自动化**：组件自动导入、API 自动生成、图标自动引入

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 组合式 API + `<script setup>`
- **TypeScript** - 类型安全，开发体验佳
- **Vite** - 极速构建，开发体验流畅

### UI 组件库
- **Element Plus** - 企业级 UI 组件库
- **Tailwind CSS** - 原子化 CSS 框架
- **Sass/SCSS** - CSS 预处理器

### 状态管理 & 路由
- **Pinia** - Vue 官方推荐的状态管理
- **Vue Router** - 官方路由，支持动态路由
- **Pinia Plugin Persistedstate** - 状态持久化

### 工具链 & 优化
- **Auto Import** - 组件/API 自动导入，减少 import 语句
- **Unplugin Vue Components** - 组件自动注册
- **VueUse** - Vue 组合式工具集
- **Axios** - HTTP 客户端，完整拦截器封装

### 图表 & 地图
- **ECharts** - 企业级图表库

### 开发工具
- **ESLint** + **Prettier** - 代码规范
- **pnpm** - 快速、节省磁盘的包管理器

## 📊 BoxTable 组件封装（核心亮点）

### 🎯 设计目标
解决管理后台中 **80% 的表格需求**，通过 JSON 配置快速生成功能完整的表格页面，同时保留 **20% 的灵活性** 通过插槽系统实现。

### ✨ 核心特性
- **✅ 配置驱动**：JSON 配置生成完整表格
- **✅ 查询表单**：支持 10+ 种表单类型
- **✅ 工具栏**：刷新、导出、列设置、密度切换
- **✅ 分页集成**：自动分页，支持远程/本地分页
- **✅ 插槽系统**：全面支持自定义渲染
- **✅ 状态持久化**：列设置、表格密度自动保存
- **✅ 类型安全**：完整的 TypeScript 类型定义

### 🎨 配置示例
```typescript
// 用户管理表格配置
export const UserTableConfig = {
  tableKey: 'user_table',
  queryApi: getUserList,
  exportApi: exportUserList,
  
  // 查询表单配置
  queryList: [
    { type: 'text', field: 'account', label: '账户' },
    { type: 'select', field: 'status', label: '状态', option: [...] },
    { type: 'cascader', field: 'deptId', label: '部门', queryApi: getDeptTree }
  ],
  
  // 表格列配置
  tableColumn: [
    { type: 'selection', width: '55' },
    { type: 'index', width: '80', label: '序号' },
    { prop: 'account', width: '120', label: '账号' },
    { prop: 'username', width: '120', label: '姓名' },
    { prop: 'status', width: '80', label: '状态', isSlot: true },
    { fixed: 'right', label: '操作', width: '200', isSlot: true }
  ]
}
```

### 🚀 使用示例
```vue
<template>
  <BoxTable :tableConfig="TableConfig" @mounted="handleTableMounted">
    <!-- 状态列自定义渲染 -->
    <template #status="{ row }">
      <el-tag :type="row.status == 0 ? 'success' : 'danger'">
        {{ row.status == 0 ? '启用' : '停用' }}
      </el-tag>
    </template>
    
    <!-- 操作列 -->
    <template #operation="{ row }">
      <el-button @click="handleEdit(row)">编辑</el-button>
      <el-button @click="handleDelete(row)">删除</el-button>
    </template>
    
    <!-- 工具栏扩展 -->
    <template #table-toolbar>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </template>
  </BoxTable>
</template>
```

### 🔧 高级功能
1. **表格插槽**：完全自定义表格渲染，支持树形表格、合并单元格等复杂场景
2. **行事件**：  支持行单击、双击事件
3. **高级配置**：行样式、单元格合并、自定义排序
4. **实例方法**：提供完整的编程式 API
5. **主题适配**：自动适配 Element Plus 主题

### 📚 完整文档
- [BoxTable 使用文档](./src/components/BoxTable/README.md)
- [BoxTable 配置参考](./src/components/BoxTable/配置参考.md)
- [BoxTable 二次开发指南](./src/components/BoxTable/二次开发.md)

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+ (推荐) 或 npm 9+

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
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

### 预览构建结果
```bash
pnpm preview
```

## 📖 学习路径

### 对于新手
1. **先跑起来**：按照快速开始运行项目
2. **看页面结构**：浏览 `src/pages/` 下的各个页面
3. **学 BoxTable**：重点学习 BoxTable 组件的使用
4. **理解架构**：查看 API、Store、Router 的交互
5. **动手修改**：尝试修改用户管理页面

### 对于想转全栈
1. **前后端协作**：查看 API 层如何与后端交互
2. **认证授权**：研究 JWT 认证和 RBAC 权限控制
3. **错误处理**：学习全局错误处理和用户提示
4. **性能优化**：查看代码分割、懒加载等优化手段
5. **部署运维**：学习前后端分离项目的部署策略

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 下创建页面目录
2. 配置路由（支持动态路由）
3. 配置菜单权限（如果需要）
4. 编写页面组件，可以使用 BoxTable 快速搭建

### 添加新 API
1. 在 `src/api/` 下创建 API 文件
2. 定义 TypeScript 类型
3. 在页面中引入使用

### 自定义主题
1. 修改 `src/styles/` 下的样式文件
2. 通过 ThemeStore 动态切换主题
3. 适配 Element Plus 主题变量

## 🎯 项目核心价值

### 1. 实战性
- 真实的业务场景（用户、角色、部门、菜单管理）
- 完整的权限控制系统
- 生产环境部署配置

### 2. 教学性
- 清晰的代码结构和注释
- 完整的文档体系
- 从简单到复杂的学习路径

### 3. 可扩展性
- 模块化设计，易于扩展新功能
- 配置化思想，减少重复代码
- 完整的类型系统，降低维护成本

### 4. 现代化
- 使用最新的 Vue 3 特性
- 完整的工具链支持
- 最佳实践和性能优化

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**💡 提示：** 本项目不仅是一个可运行的管理后台，更是一个**学习现代前端开发的最佳实践案例**。建议从 BoxTable 组件开始学习，这是项目的核心亮点，也是配置化开发思想的典型体现。