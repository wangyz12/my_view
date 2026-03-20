<template>
  <div class="welcome-banner">
    <div class="banner-content">
      <div class="banner-left">
        <h1 class="banner-title">后台管理系统</h1>
        <p class="banner-subtitle">基于 Vue 3 + TypeScript + Element Plus 构建的企业级后台模板</p>
        <div class="banner-stats">
          <div class="stat-item">
            <div class="stat-value">6+</div>
            <div class="stat-label">功能模块</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">100%</div>
            <div class="stat-label">响应式设计</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">2</div>
            <div class="stat-label">主题模式</div>
          </div>
        </div>
      </div>
      <div class="banner-right">
        <div class="banner-illustration">
          <div class="illustration-circle"></div>
          <div class="illustration-bar"></div>
          <div class="illustration-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 欢迎横幅组件 - 后台管理系统介绍
</script>

<style scoped lang="scss">
.welcome-banner {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  border-radius: 12px;
  padding: 32px;
  color: white;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(var(--el-color-primary-rgb), 0.15);
  
  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .banner-left {
      flex: 1;
      
      .banner-title {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 8px;
        line-height: 1.2;
      }
      
      .banner-subtitle {
        font-size: 16px;
        opacity: 0.9;
        margin-bottom: 24px;
      }
      
      .banner-stats {
        display: flex;
        gap: 32px;
        
        .stat-item {
          .stat-value {
            font-size: 32px;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.8;
          }
        }
      }
    }
    
    .banner-right {
      .banner-illustration {
        position: relative;
        width: 120px;
        height: 120px;
        
        .illustration-circle {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          top: 10px;
          left: 10px;
        }
        
        .illustration-bar {
          position: absolute;
          width: 80px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          top: 40px;
          left: 20px;
          transform: rotate(45deg);
        }
        
        .illustration-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          top: 60px;
          left: 80px;
        }
      }
    }
  }
}

// 暗黑模式适配
:deep(.dark) .welcome-banner {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>