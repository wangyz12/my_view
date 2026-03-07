<!-- src/layout/Layout.vue -->
<template>
   <div class="common-layout layout">
    <el-container class="layout">
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Menu from './menu/index.vue'
defineOptions({
  name: 'Layout'
})
</script>
<style>
.layout{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
