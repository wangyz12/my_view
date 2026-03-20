<template>
  <div
    class="h-[60px] px-4 flex items-center justify-between"
    :class="{ 
      'bg-white': themeStore.isSideLayout, 
      'bg-transparent': themeStore.isTopLayout,
      'header-box': themeStore.layout === 'side'
    }"
  >
 
    <head-left v-if='isShow'/>
    <!-- 右侧：用户操作 -->
    <head-right />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme'
import HeadRight from './headRight/index.vue'
import HeadLeft from './headLeft/index.vue'
const themeStore = useThemeStore()
defineProps({
  isShow:{
    type:Boolean,
    default:true
  }
})
</script>

<style lang="scss" scoped>
.collapse-btn {
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.header-box {
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>