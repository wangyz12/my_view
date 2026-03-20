<template>
  <div class="fullscreen-toggle">
    <el-tooltip
      :content="tooltipText"
      placement="bottom"
      :show-after="500"
    >
      <el-button
        class="fullscreen-btn"
        :type="buttonType"
        :plain="!isFullscreen"
        size="small"
        :circle="isCircle"
        @click="toggleFullscreen"
        @keydown.esc="handleEscKey"
      >
        <el-icon :size="iconSize" :class="{ 'rotate-icon': isFullscreen }">
          <FullScreen v-if="!isFullscreen" />
          <Close v-else />
        </el-icon>
        <span v-if="showText" class="btn-text">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </span>
      </el-button>
    </el-tooltip>
    
    <!-- 快捷键提示 -->
    <div v-if="showShortcutHint" class="shortcut-hint">
      <el-text type="info" size="small">
        快捷键: F11 或 Esc
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen, useEventListener } from '@vueuse/core'
// 图标会自动导入，无需显式导入
import { computed, ref, onMounted, onUnmounted } from 'vue'

const { isFullscreen, toggle, enter, exit } = useFullscreen()

// 配置选项
const props = withDefaults(defineProps<{
  showText?: boolean
  showShortcutHint?: boolean
  iconSize?: number
  isCircle?: boolean
}>(), {
  showText: false,
  showShortcutHint: true,
  iconSize: 16,
  isCircle: false
})

// 计算属性
const tooltipText = computed(() => {
  const action = isFullscreen.value ? '退出全屏' : '进入全屏'
  const shortcut = isFullscreen.value ? ' (Esc)' : ' (F11)'
  return action + shortcut
})

const buttonType = computed(() => {
  return isFullscreen.value ? 'danger' : 'primary'
})

// 切换全屏
const toggleFullscreen = () => {
  toggle()
}

// 处理 ESC 键
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    exit()
  }
}

// 添加键盘快捷键支持
useEventListener('keydown', (event: KeyboardEvent) => {
  // F11 键切换全屏
  if (event.key === 'F11') {
    event.preventDefault()
    toggleFullscreen()
  }
  
  // ESC 键退出全屏
  if (event.key === 'Escape' && isFullscreen.value) {
    event.preventDefault()
    exit()
  }
})

// 全屏变化时的回调
const handleFullscreenChange = () => {
  if (isFullscreen.value) {
    console.log('已进入全屏模式')
    // 可以在这里添加全屏时的额外逻辑
  } else {
    console.log('已退出全屏模式')
    // 可以在这里添加退出全屏时的额外逻辑
  }
}

// 监听全屏状态变化
import { watch } from 'vue'
watch(isFullscreen, handleFullscreenChange)

// 组件挂载时初始化
onMounted(() => {
  console.log('全屏切换组件已加载')
})

// 组件卸载时清理
onUnmounted(() => {
  // 如果组件卸载时处于全屏状态，自动退出全屏
  if (isFullscreen.value) {
    exit()
  }
})
</script>

<style lang="scss" scoped>
.fullscreen-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.fullscreen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  min-width: 40px;
  height: 40px;
  border-radius: v-bind('isCircle ? "50%" : "8px"');
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  .el-icon {
    transition: transform 0.3s ease;
  }
  
  &:hover .el-icon {
    transform: scale(1.1);
  }
  
  .btn-text {
    font-size: 13px;
    font-weight: 500;
  }
}

// 图标旋转动画
.rotate-icon {
  animation: rotate 0.5s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}

// 全屏状态下的样式调整
:fullscreen .fullscreen-btn,
:-webkit-full-screen .fullscreen-btn,
:-moz-full-screen .fullscreen-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.6);
  }
}

// 快捷键提示
.shortcut-hint {
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .fullscreen-btn {
    padding: 6px;
    min-width: 36px;
    height: 36px;
    
    .btn-text {
      display: none;
    }
  }
  
  .shortcut-hint {
    display: none;
  }
}
</style>