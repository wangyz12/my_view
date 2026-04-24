<template>
  <div class="quick-access-card flex-card">
    <div class="access-header">
      <h3 class="access-title">快速访问</h3>
      <span class="access-count">{{ links.length }}个功能</span>
    </div>
    
    <div class="access-grid">
      <div 
        v-for="link in links" 
        :key="link.id"
        class="access-item"
        @click="handleClick(link)"
      >
        <div class="access-icon" :style="{ backgroundColor: link.color + '20' }">
          <el-icon :style="{ color: link.color }">
            <component :is="getIconComponent(link.icon)" />
          </el-icon>
        </div>
        <div class="access-content">
          <div class="access-name">{{ link.title }}</div>
          <div class="access-desc">{{ link.description }}</div>
        </div>
        <div class="access-arrow">
          <el-icon><ArrowRight /></el-icon>
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
  Menu,
  ArrowRight
} from '@element-plus/icons-vue'
import { QUICK_ACCESS_LINKS, type QuickAccessLink } from '../config'

interface Props {
  links: QuickAccessLink[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  linkClick: [link: QuickAccessLink]
}>()

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    User,
    Lock,
    OfficeBuilding,
    Menu
  }
  return iconMap[iconName] || User
}

// 处理点击事件
const handleClick = (link: QuickAccessLink) => {
  emit('linkClick', link)
}
</script>

<style scoped lang="scss">
// ==================== QuickAccessCard 样式 ====================
.quick-access-card {
  gap: $spacing-lg;
  
  .access-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }
  
  .access-title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-color-primary;
  }
  
  .access-count {
    font-size: $font-size-sm;
    color: $text-color-secondary;
    background-color: $bg-color-light;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
  }
  
  .access-grid {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }
  
  .access-item {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
    background-color: $bg-color-light;
    border-radius: $border-radius-lg;
    cursor: pointer;
    transition: all $transition-duration-base $transition-timing-function;
    
    &:hover {
      background-color: $bg-color-lighter;
      transform: translateX(4px);
      
      .access-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
  
  .access-icon {
    width: 48px;
    height: 48px;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    .el-icon {
      font-size: $font-size-xl;
    }
  }
  
  .access-content {
    flex: 1;
    min-width: 0;
    
    .access-name {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      color: $text-color-primary;
      @include text-ellipsis;
    }
    
    .access-desc {
      margin: 0;
      font-size: $font-size-xs;
      color: $text-color-secondary;
      @include text-ellipsis;
    }
  }
  
  .access-arrow {
    opacity: 0;
    transform: translateX(-4px);
    transition: all $transition-duration-base $transition-timing-function;
    
    .el-icon {
      color: $text-color-secondary;
    }
  }
}
</style>