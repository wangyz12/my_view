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
@import '../styles/index.scss';

// 这个组件现在使用 components.scss 中定义的样式
// 如果需要覆盖或添加特定样式，可以在这里添加
</style>