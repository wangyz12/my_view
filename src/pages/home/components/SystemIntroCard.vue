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
@import '../styles/index.scss';

// 这个组件现在使用 components.scss 中定义的样式
// 如果需要覆盖或添加特定样式，可以在这里添加
</style>