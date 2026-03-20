<template>
  <!-- 上方 Logo 区域，预留插槽便于自定义 -->
  <div
    class="logo-area cursor-pointer"
    :class="{ 'collapsed': isCollapse }"
    :style="{ backgroundColor: themeStore.logoBgColor, color: themeStore.logoTextColor }"
    @click="logcLick"
  >
    <slot name="logo">
      <div class="default-logo flex items-center gap-3">
        <!-- Logo 图标 -->
        <div class="logo-icon w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          A
        </div>
        <span 
          class="logo-text transition-all duration-300 ease-in-out overflow-hidden"
          :style="{ color: themeStore.logoTextColor }"
        >
          Admin System
        </span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'
import { useUserStore } from '@/store/modules/user'

const themeStore = useThemeStore()
const userStore = useUserStore()
const emit = defineEmits(['goHome'])

const isCollapse = computed(() => userStore.isCollapse)

const logcLick = () => {
  emit('goHome')
}
</script>

<style lang="scss" scoped>
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.collapsed {
    padding-left: 0;
    justify-content: center;
    
    .logo-text {
      opacity: 0;
      max-width: 0;
    }
  }
}

.default-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 200px;
  opacity: 1;
}

.logo-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.logo-area.collapsed .logo-icon {
  transform: scale(1.1);
}
</style>