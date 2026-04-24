<template>
  <div class="system-intro-card flex-card">
    <div class="intro-header">
      <h3 class="intro-title">{{ SYSTEM_INTRO_CONFIG.title }}</h3>
      <span class="intro-version">{{ SYSTEM_INTRO_CONFIG.version }}</span>
    </div>
    
    <p class="intro-description">
      {{ SYSTEM_INTRO_CONFIG.description }}
    </p>
    <div class="intro-stats">
      <h4 class="stats-title">系统统计</h4>
      <div class="stats-grid">
        <div 
          v-for="stat in SYSTEM_INTRO_CONFIG.stats" 
          :key="stat.label"
          class="stat-item"
        >
          <div class="stat-icon">
            <el-icon>
              <component :is="getIconComponent(stat.icon)" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { 
  User,
  Lock,
  OfficeBuilding,
  Monitor
} from '@element-plus/icons-vue'
import { SYSTEM_INTRO_CONFIG } from '../config'

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    User,
    Lock,
    OfficeBuilding,
    Monitor
  }
  return iconMap[iconName] || User
}
</script>

<style scoped lang="scss">
// ==================== SystemIntroCard 样式 ====================
.system-intro-card {
  gap: $spacing-lg;
  
  .intro-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }
  
  .intro-title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-color-primary;
  }
  
  .intro-version {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    background-color: $bg-color-light;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
  }
  
  .intro-description {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-color-regular;
    line-height: 1.6;
  }
  
  .intro-stats {
    .stats-title {
      margin: 0 0 $spacing-base 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $text-color-primary;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-base;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
    background-color: $bg-color-light;
    border-radius: $border-radius-lg;
    transition: all $transition-duration-base $transition-timing-function;
    
    &:hover {
      background-color: $bg-color-lighter;
      transform: translateY(-2px);
    }
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    .el-icon {
      font-size: $font-size-lg;
    }
  }
  
  .stat-content {
    flex: 1;
    
    .stat-value {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $text-color-primary;
    }
    
    .stat-label {
      margin: 0;
      font-size: $font-size-xs;
      color: $text-color-secondary;
    }
  }
}
</style>