<template>
  <div class="activity-list-card flex-card">
    <div class="activity-header">
      <h3 class="activity-title">最近活动</h3>
      <el-button 
        link
        size="small"
        @click="handleViewAll"
      >
        查看全部
      </el-button>
    </div>
    
    <div 
      class="activity-container"
      :style="{ height: height + 'px' }"
    >
      <!-- 骨架屏 -->
      <div v-if="loading" class="activity-skeleton">
        <div 
          v-for="index in 5" 
          :key="index"
          class="skeleton-item"
        >
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>
      
      <!-- 活动列表 -->
      <div v-else class="activity-list">
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-item"
          @click="handleItemClick(activity)"
        >
          <div class="activity-avatar">
            <el-avatar :size="36" :src="activity.avatar" />
          </div>
          
          <div class="activity-content">
            <div class="activity-main">
              <span class="activity-user">{{ activity.user }}</span>
              <span class="activity-action" :style="{ color: getActivityColor(activity.type) }">
                {{ getActivityText(activity.type) }}
              </span>
              <span class="activity-target">{{ activity.target }}</span>
            </div>
            
            <div class="activity-meta">
              <span class="activity-time">{{ formatTime(activity.time) }}</span>
              <span class="activity-ip">{{ activity.ip }}</span>
            </div>
          </div>
          
          <div class="activity-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElAvatar, ElIcon, ElButton } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { ACTIVITY_TYPE_CONFIG, type ActivityType } from '../config'

interface Activity {
  id: string
  user: string
  type: string
  target: string
  time: string
  ip: string
  avatar: string
}

interface Props {
  activities: Activity[]
  loading?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: 300
})

const emit = defineEmits<{
  viewAll: []
  itemClick: [activity: Activity]
}>()

// 获取活动类型颜色
const getActivityColor = (type: string) => {
  const typeKey = type as ActivityType
  return ACTIVITY_TYPE_CONFIG[typeKey]?.color || '#909399'
}

// 获取活动类型文本
const getActivityText = (type: string) => {
  const typeKey = type as ActivityType
  return ACTIVITY_TYPE_CONFIG[typeKey]?.text || '未知操作'
}

// 格式化时间
const formatTime = (timeString: string) => {
  try {
    const date = new Date(timeString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // 如果是今天
    if (date.toDateString() === now.toDateString()) {
      if (diff < 60 * 60 * 1000) { // 1小时内
        const minutes = Math.floor(diff / (60 * 1000))
        return `${minutes}分钟前`
      }
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 如果是昨天
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 其他情况
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return '未知时间'
  }
}

// 事件处理
const handleViewAll = () => {
  emit('viewAll')
}

const handleItemClick = (activity: Activity) => {
  emit('itemClick', activity)
}
</script>

<style scoped lang="scss">
@use '../styles/index.scss';

// 这个组件现在使用 components.scss 中定义的样式
// 如果需要覆盖或添加特定样式，可以在这里添加
</style>