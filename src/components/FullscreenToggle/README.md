# 全屏切换组件 (FullscreenToggle)

基于 `@vueuse/core` 的 `useFullscreen` 实现的全屏切换组件，支持键盘快捷键和多种配置选项。

## 功能特性

- ✅ 全屏/退出全屏切换
- ✅ 键盘快捷键支持 (F11 进入/切换, Esc 退出)
- ✅ 响应式设计
- ✅ 动画效果
- ✅ 多种样式配置
- ✅ TypeScript 支持

## 安装依赖

组件依赖 `@vueuse/core`，如果尚未安装，请先安装：

```bash
pnpm add @vueuse/core
# 或
npm install @vueuse/core
# 或
yarn add @vueuse/core
```

## 基本使用

```vue
<template>
  <fullscreen-toggle />
</template>

<script setup lang="ts">
import FullscreenToggle from '@/components/FullscreenToggle/index.vue'
</script>
```

## 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showText` | `boolean` | `false` | 是否显示文字标签 |
| `showShortcutHint` | `boolean` | `true` | 是否显示快捷键提示 |
| `iconSize` | `number` | `16` | 图标大小 |
| `isCircle` | `boolean` | `false` | 是否为圆形按钮 |

## 使用示例

### 1. 基本圆形按钮（推荐用于头部导航）
```vue
<fullscreen-toggle 
  :show-text="false"
  :show-shortcut-hint="false"
  :is-circle="true"
/>
```

### 2. 带文字标签的按钮
```vue
<fullscreen-toggle 
  :show-text="true"
  :show-shortcut-hint="true"
  :is-circle="false"
/>
```

### 3. 自定义图标大小
```vue
<fullscreen-toggle 
  :icon-size="20"
  :is-circle="true"
/>
```

## 键盘快捷键

- **F11**: 切换全屏模式
- **Esc**: 退出全屏模式（仅在全屏状态下有效）

## 事件

组件会自动处理以下事件：

- **全屏状态变化**: 监听 `isFullscreen` 状态变化
- **键盘事件**: 监听 F11 和 Esc 键
- **点击事件**: 按钮点击切换全屏

## 样式定制

组件使用 SCSS 编写样式，可以通过以下 CSS 变量进行定制：

```scss
// 在父组件中覆盖样式
.fullscreen-toggle {
  --fullscreen-btn-bg: #409EFF;
  --fullscreen-btn-hover-bg: #66b1ff;
  --fullscreen-btn-text: #ffffff;
}
```

## 在项目中的使用位置

当前组件已集成到头部导航的右侧区域，位于主题设置按钮和用户信息之间：

```
头部导航右侧布局：
[全屏按钮] [主题设置] [用户头像/信息]
```

## 浏览器兼容性

组件使用标准的 Fullscreen API，兼容现代浏览器：

- Chrome 15+
- Firefox 10+
- Safari 5.1+
- Edge 12+
- Opera 12.1+

## 注意事项

1. 全屏功能需要用户交互（点击事件）才能触发，这是浏览器的安全限制
2. 在某些浏览器中，F11 键可能被浏览器自身占用
3. 移动设备上的全屏行为可能有所不同
4. 组件卸载时会自动退出全屏模式

## 开发说明

组件基于以下技术实现：

- Vue 3 Composition API
- @vueuse/core (useFullscreen, useEventListener)
- Element Plus UI 组件库
- TypeScript 类型支持

如需扩展功能，可以修改 `src/components/FullscreenToggle/index.vue` 文件。