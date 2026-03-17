<template>
  <!-- 上方 Logo 区域，预留插槽便于自定义 -->
  <div
    class="logo-area cursor-pointer"
    :style="{ backgroundColor: themeStore.logoBgColor, color: themeStore.logoTextColor }"
    @click="logcLick"
  >
    <slot name="logo">
      <div class="default-logo">
        <span class="logo-text" :style="{ color: themeStore.logoTextColor }">Admin</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()
const emit = defineEmits(['goHome'])
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

.default-logo {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.3s ease;
}
</style>