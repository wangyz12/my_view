<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404"
      sub-title="页面不存在，请检查路径是否正确"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>