

# Vue 3 Admin Dashboard

A modern admin dashboard built with Vue 3, TypeScript, and Vite. This project provides a comprehensive foundation for building enterprise-level admin applications with dynamic routing, user management, role-based access control, and a flexible theming system.

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

## License

MIT License