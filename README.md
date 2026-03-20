

# Vue 3 Admin Dashboard

一个基于 Vue 3、TypeScript 和 Vite 构建的现代化管理后台系统。本项目提供了一个完整的企业级管理应用基础框架，包含动态路由、用户管理、角色权限控制、部门管理、菜单配置和灵活的主题定制系统。

## 项目简介

这是一个全栈管理后台系统的前端部分，采用现代化的技术栈和架构设计。系统支持动态权限控制、多主题切换、响应式布局，适用于各种企业级管理应用场景。

**后端仓库地址：** [https://gitee.com/W_admin_code/node_temp](https://gitee.com/W_admin_code/node_temp)

**前端仓库地址：** [https://gitee.com/W_admin_code/my_admin](https://gitee.com/W_admin_code/my_admin) 
演示地址：https://temp-code.top/
## Features

- **Dynamic Routing**: Routes are generated dynamically based on menu permissions
- **User Management**: Complete CRUD operations for user management
- **Role Management**: Role-based access control with menu and department assignment
- **Department Management**: Hierarchical department structure
- **Menu Management**: Dynamic menu configuration
- **Theme Customization**: Built-in theme settings with multiple layout options
- **Permission Directives**: Custom Vue directives for role and permission control
- **Responsive Design**: Adapts to different screen sizes

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- Element Plus (UI Framework)
- Sass/SCSS
- Tailwind CSS

## Project Structure

```
src/
├── api/               # API modules
│   ├── modules/       # Login and menu APIs
│   └── system/        # System APIs (user, role, dept, menu)
├── components/        # Reusable components
├── directives/        # Custom directives (permission, role)
├── layout/            # Layout components
├── pages/             # Page components
│   ├── home/          # Home page
│   ├── login/         # Login page
│   ├── system/        # System management pages
│   └── userinfo/      # User info page
├── router/            # Router configuration
├── store/             # Pinia stores
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

### Build

```bash
# Build for production
pnpm build
```

## Key Modules

### Router

The project implements a dynamic routing system that generates routes based on menu permissions from the backend. See `src/router/dynamic.ts` for the implementation.

### Store

State management using Pinia with the following modules:
- `theme` - Theme and layout settings
- `user` - User information and permissions
- `breadcrumb` - Breadcrumb navigation state

### API

Axios-based request utility with interceptors for authentication and error handling. API modules are organized by feature domain.

## 项目关联

### 后端项目
- **仓库地址：** [https://gitee.com/W_admin_code/node_temp](https://gitee.com/W_admin_code/node_temp)
- **技术栈：** Node.js + Express + TypeScript + MongoDB 
- **主要功能：** 提供 RESTful API 接口，包括用户认证、权限管理、数据 CRUD 等

### 前后端交互
1. **接口规范：** 遵循 RESTful API 设计原则
2. **认证方式：** JWT Token 认证
3. **数据格式：** JSON 格式传输
4. **跨域处理：** 已配置 CORS 支持

### 开发流程
1. 后端开发 API 接口并部署
2. 前端根据接口文档进行开发
3. 前后端联调测试
4. 部署上线

## License

MIT License