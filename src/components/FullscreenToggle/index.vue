<template>
  <div class="fullscreen-toggle">
    <el-tooltip :content="tooltipText" placement="bottom" :show-after="500">
      <el-icon :size="iconSize" :style="iconColorStyle" class="fullscreen-btn cursor-pointer" @click="toggleFullscreen"
        @keydown.esc="handleEscKey" :class="{ 'rotate-icon': isFullscreen }">
        <FullScreen v-if="!isFullscreen" />
        <Close v-else />
      </el-icon>
      <span v-if="showText" class="btn-text">
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </span>
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
import { useThemeStore } from '@/store/modules/theme'
const themeStore = useThemeStore()
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
// 动态计算图标颜色（响应主题变化）
const iconColorStyle = computed(() => {
  if (themeStore.isDarkMode) {
    return { color: '#f0f2f5' }  // 深色模式：亮白色
  }
  return { color: '#1f2d3d' }     // 浅色模式：深灰色
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
@use './index.scss';
</style>