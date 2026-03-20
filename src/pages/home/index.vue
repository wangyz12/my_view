<template>
  <div class="home-page full-box">
    <!-- 欢迎横幅 -->
    <WelcomeBanner />
    
    <!-- 数据统计卡片 -->
    <StatsCards />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 快速操作 -->
      <QuickActions />
      
      <!-- 系统状态 -->
      <SystemStatus />
    </div>
  </div>
</template>

<script setup lang="ts">
import WelcomeBanner from './components/WelcomeBanner.vue'
import StatsCards from './components/StatsCards.vue'
import QuickActions from './components/QuickActions.vue'
import SystemStatus from './components/SystemStatus.vue'
</script>

<style scoped lang="scss">
.home-page {
  padding: 10px;
  background: #f5f7fa;
  .main-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-top: 24px;
    
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }
}

// 暗黑模式适配
:deep(.dark) .home-page {
  background: #0a0a0a;
}
</style>