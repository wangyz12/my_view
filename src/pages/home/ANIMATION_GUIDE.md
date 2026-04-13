# 首页组件入场动画指南

## 概述
首页组件在骨架屏加载完成后，会根据theme store中的配置显示入场动画。动画效果可以根据主题模式（亮色/暗色）自动调整。

## 动画配置

### 1. 动画类型 (PageAnimationType)
在 `theme.ts` 中定义了6种动画类型：

| 动画类型 | 描述 | 亮色模式效果 | 暗色模式效果 |
|---------|------|-------------|-------------|
| `fade` | 淡入淡出 | 标准淡入 | 标准淡入 |
| `fade-slide` | 淡入+上浮 | 淡入+上浮20px | 简化为淡入 |
| `scale` | 缩放淡入 | 从0.95缩放到1 | 从0.95缩放到1 |
| `slide-x` | 水平滑动 | 从左侧30px滑入 | 简化为淡入+上浮 |
| `slide-y` | 垂直滑动 | 从上方30px滑入 | 简化为淡入+上浮 |
| `none` | 无动画 | 立即显示 | 立即显示 |

### 2. 动画参数
- **时长**: 可配置，默认250ms，范围100-500ms
- **延迟**: 组件间有80ms的错开延迟
- **缓动函数**: `cubic-bezier(0.4, 0, 0.2, 1)`（平滑出入）

### 3. 组件入场顺序
组件按照以下顺序依次入场：

1. **用户信息卡片** (user-info) - 延迟0ms
2. **系统介绍卡片** (system-intro) - 延迟80ms
3. **快速访问卡片** (quick-access) - 延迟160ms
4. **访问趋势图表** (access-trend) - 延迟240ms
5. **角色分布图表** (role-distribution) - 延迟320ms
6. **最近活动列表** (activity-list) - 延迟400ms

## 使用方法

### 1. 在theme store中配置动画
```typescript
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

// 设置动画类型
themeStore.setPageAnimation('fade-slide')

// 设置动画时长
themeStore.setAnimationDuration(300)

// 重置动画设置
themeStore.resetAnimationSettings()
```

### 2. 在组件中使用动画
首页已经集成了动画系统，无需额外配置。

### 3. 添加新组件的动画
如果需要为其他组件添加动画：

```vue
<template>
  <div 
    :class="getAnimationClass('new-component')"
    :style="getAnimationStyle('new-component')"
  >
    <!-- 组件内容 -->
  </div>
</template>

<script setup>
// 在 componentAnimationOrder 中添加新组件
export const componentAnimationOrder = {
  // ... 现有组件
  'new-component': 6, // 新的顺序索引
}
</script>
```

## 动画实现原理

### 1. 动画工具函数 (`utils/animations.ts`)
- `getComponentAnimation()`: 获取组件的动画配置
- `getThemeBasedAnimation()`: 根据主题模式调整动画类型
- `getAnimationClass()`: 生成动画CSS类名
- `getAnimationStyle()`: 生成动画内联样式

### 2. CSS动画定义 (`styles/index.scss`)
定义了5种动画的关键帧：
- `fadeIn`: 淡入
- `fadeSlideUp`: 淡入上浮
- `scaleIn`: 缩放淡入
- `slideInX`: 水平滑动
- `slideInY`: 垂直滑动

### 3. 响应式调整
- **移动端**: 减少动画移动距离（从30px减少到15px）
- **暗色模式**: 简化动画效果，减少视觉干扰
- **减少动画偏好**: 尊重用户的系统设置

## 性能优化

### 1. 动画禁用条件
- 用户系统设置 `prefers-reduced-motion: reduce`
- 动画类型设置为 `none`
- 低性能设备（通过JavaScript检测）

### 2. 优化建议
- 动画时长不超过500ms
- 使用 `transform` 和 `opacity` 进行动画（GPU加速）
- 避免同时动画过多元素

## 测试方法

### 1. 测试不同动画类型
```typescript
// 在浏览器控制台测试
const themeStore = useThemeStore()
const animations = ['fade', 'fade-slide', 'scale', 'slide-x', 'slide-y', 'none']

animations.forEach((animation, index) => {
  setTimeout(() => {
    themeStore.setPageAnimation(animation)
    console.log(`测试动画: ${animation}`)
  }, index * 1000)
})
```

### 2. 测试主题切换
```typescript
// 切换主题模式，观察动画变化
themeStore.toggleThemeMode()
```

### 3. 测试性能
- 使用Chrome DevTools的Performance面板
- 检查FPS和布局抖动

## 常见问题

### 1. 动画不显示
- 检查theme store中的`pageAnimation`设置
- 检查`shouldEnableAnimation`计算属性
- 查看控制台是否有错误

### 2. 动画卡顿
- 减少动画时长
- 减少同时动画的元素数量
- 使用更简单的动画类型

### 3. 动画顺序不对
- 检查`componentAnimationOrder`中的顺序索引
- 确保组件ID正确

## 扩展功能

### 1. 自定义动画
可以扩展`PageAnimationType`类型和`animationClassMap`来添加自定义动画。

### 2. 动画事件
可以添加动画开始/结束的事件监听：
```typescript
const onAnimationStart = () => {
  console.log('动画开始')
}

const onAnimationEnd = () => {
  console.log('动画结束')
}
```

### 3. 动画组合
可以组合多个动画效果：
```typescript
// 例如：先缩放后淡入
const combinedAnimation = {
  type: 'scale' as PageAnimationType,
  duration: 300,
  // 可以添加第二个动画阶段
}
```

## 注意事项

1. **可访问性**: 确保动画不会影响键盘导航和屏幕阅读器
2. **用户体验**: 动画应该增强体验，而不是干扰
3. **一致性**: 在整个应用中保持动画风格一致
4. **性能**: 在低端设备上考虑禁用复杂动画

通过这套动画系统，首页组件可以在骨架屏加载完成后以优雅的方式入场，提升用户体验。