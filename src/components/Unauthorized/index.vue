<template>
  <div class="unauthorized-container">
    <div class="error-content">
      <div class="error-icon">
        <el-icon><Lock /></el-icon>
      </div>
      <h1 class="error-title">403</h1>
      <p class="error-desc">抱歉，您没有访问该页面的权限</p>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
      <div class="error-tips">
        <p>可能的原因：</p>
        <ul>
          <li>您的账号没有该页面的访问权限</li>
          <li>您的角色权限已被修改</li>
          <li>页面正在维护中</li>
        </ul>
        <p>如需访问该页面，请联系系统管理员</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.error-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 80px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 72px;
  color: #303133;
  margin: 0 0 20px;
  font-weight: 600;
}

.error-desc {
  font-size: 20px;
  color: #606266;
  margin-bottom: 30px;
}

.error-actions {
  margin-bottom: 30px;
  
  .el-button {
    margin: 0 10px;
  }
}

.error-tips {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  
  p {
    margin: 10px 0;
    color: #909399;
  }
  
  ul {
    margin: 10px 0;
    padding-left: 20px;
    
    li {
      margin: 5px 0;
      color: #909399;
    }
  }
}
</style>