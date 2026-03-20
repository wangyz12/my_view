<template>
  <div class="stats-cards">
    <div class="cards-grid">
      <div v-for="(card, index) in cards" :key="index" class="stats-card">
        <div class="card-icon" :style="{ backgroundColor: card.iconBg }">
          <i :class="card.icon" class="icon"></i>
        </div>
        <div class="card-content">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-label">{{ card.label }}</div>
          <div class="card-trend" :class="card.trendClass">
            <i :class="card.trendIcon"></i>
            <span>{{ card.trendValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()

interface StatsCard {
  icon: string
  iconBg: string
  value: string
  label: string
  trendValue: string
  trendIcon: string
  trendClass: string
}

const cards = computed<StatsCard[]>(() => [
  {
    icon: 'el-icon-user',
    iconBg: themeStore.isDarkMode ? 'rgba(64, 158, 255, 0.2)' : 'rgba(64, 158, 255, 0.1)',
    value: '3',
    label: '系统用户',
    trendValue: '稳定',
    trendIcon: 'el-icon-success',
    trendClass: 'trend-up'
  },
  {
    icon: 'el-icon-s-grid',
    iconBg: themeStore.isDarkMode ? 'rgba(103, 194, 58, 0.2)' : 'rgba(103, 194, 58, 0.1)',
    value: '3',
    label: '角色数量',
    trendValue: '完整',
    trendIcon: 'el-icon-success',
    trendClass: 'trend-up'
  },
  {
    icon: 'el-icon-menu',
    iconBg: themeStore.isDarkMode ? 'rgba(230, 162, 60, 0.2)' : 'rgba(230, 162, 60, 0.1)',
    value: '15+',
    label: '菜单项',
    trendValue: '可扩展',
    trendIcon: 'el-icon-top',
    trendClass: 'trend-up'
  },
  {
    icon: 'el-icon-cpu',
    iconBg: themeStore.isDarkMode ? 'rgba(144, 147, 153, 0.2)' : 'rgba(144, 147, 153, 0.1)',
    value: '100%',
    label: '系统稳定',
    trendValue: '正常运行',
    trendIcon: 'el-icon-success',
    trendClass: 'trend-up'
  }
])
</script>

<style scoped lang="scss">
.stats-cards {
  margin-bottom: 20px;
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .stats-card {
      background: var(--el-bg-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--el-border-color);
      
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .icon {
          font-size: 20px;
          color: var(--el-color-primary);
        }
      }
      
      .card-content {
        flex: 1;
        
        .card-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--el-text-color-primary);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        
        .card-label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          margin-bottom: 6px;
        }
        
        .card-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          
          &.trend-up {
            color: var(--el-color-success);
          }
          
          &.trend-down {
            color: var(--el-color-error);
          }
          
          i {
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>