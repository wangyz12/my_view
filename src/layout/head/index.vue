<template>
  <div
    class="h-[60px] px-3 py-1 flex items-center justify-end  "
    :class="{ 
      'bg-white': themeStore.isSideLayout, 
      'bg-transparent': themeStore.isTopLayout,
      'header-box':themeStore.layout === 'side'
       }"
  >
    <head-right />
  </div>
</template>

<script setup lang="ts">
import HeadLeft from './headLeft/index.vue'
import HeadRight from './headRight/index.vue'
import { useThemeStore } from '@/store/modules/theme'
const themeStore = useThemeStore()
</script>

<style lang="scss" scoped>
</style>