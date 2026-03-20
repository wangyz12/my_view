<template>
  <div class="progress-bar" :class="{ 'progress-bar--active': active, 'progress-bar--fail': isError }">
    <div class="progress-bar__inner" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  progress?: number
  isError?: boolean
}>(), {
  active: false,
  progress: 0,
  isError: false
})
</script>

<style lang="scss" scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  z-index: 9999;
  overflow: hidden;
  transition: opacity 0.3s ease;
  opacity: 0;
  
  &--active {
    opacity: 1;
  }
  
  &__inner {
    height: 100%;
    background: linear-gradient(90deg, #409eff, #67c23a);
    transition: width 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
    
    .progress-bar--fail & {
      background: linear-gradient(90deg, #f56c6c, #e6a23c);
      box-shadow: 0 0 10px rgba(245, 108, 108, 0.5);
    }
  }
}
</style>