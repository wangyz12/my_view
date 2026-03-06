<!-- src/layout/Layout.vue -->
<template>
  <div class="layout">
    <!-- 侧边栏（示例） -->
    <div class="sidebar">
     <Menu />
    </div>
    <!-- 主内容区 -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './menu/index.vue'
defineOptions({
  name: 'Layout'
})
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: #f5f5f5;
  padding-top: 20px;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
