<!-- src/layout/Layout.vue -->
<template>
    <el-main class="main-content" :style="mainStyle">
      <route-cache class="router-view"></route-cache>
    </el-main>
</template>

<script setup lang="ts">
import RouteCache from '@/components/RouteCache/index.vue'
import {useThemeStore} from '@/store/modules/theme'
const themeStore = useThemeStore()
const mainStyle = computed(()=>{
  const pagePadding = themeStore.pagePadding
  const obj = {
    padding:`${pagePadding}px !important`
  }
  return obj
})
</script>

<style lang="scss" scoped>

</style>
