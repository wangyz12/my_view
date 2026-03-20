<template>
  <div class="recent-activity">
    <div class="section-header">
      <h3 class="section-title">最近活动</h3>
      <p class="section-subtitle">系统最新动态</p>
    </div>
    
    <div class="timeline">
      <div v-for="(activity, index) in activities" :key="index" class="timeline-item">
        <div class="timeline-dot" :style="{ backgroundColor: activity.dotColor }"></div>
        <div class="timeline-content">
          <div class="activity-header">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
          <div class="activity-desc">{{ activity.description }}</div>
          <div v-if="activity.user" class="activity-user">
            <i class="el-icon-user"></i>
            <span>{{ activity.user }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Activity {
  title: string
  description: string
  time: string
  user?: string
  dotColor: string
}

const activities = ref<Activity[]>([
  {
    title: '系统更新完成',
    description: '系统已成功升级到最新版本 v2.5.0，新增了数据报表功能',
    time: '10分钟前',
    user: '系统管理员',
    dotColor: 'var(--el-color-primary)'
  },
  {
    title: '新用户注册',
    description: '用户 "张三" 成功注册了系统账号',
    time: '30分钟前',
    user: '张三',
    dotColor: 'var(--el-color-success)'
  },
  {
    title: '订单处理完成',
    description: '订单 #20240320001 已处理完成，等待发货',
    time: '1小时前',
    user: '李四',
    dotColor: 'var(--el-color-warning)'
  },
  {
    title: '系统备份',
    description: '系统数据备份已完成，备份文件已存储到云端',
    time: '2小时前',
    user: '系统自动任务',
    dotColor: 'var(--el-color-info)'
  },
  {
    title: '安全扫描',
    description: '系统安全扫描完成，未发现安全漏洞',
    time: '3小时前',
    user: '安全系统',
    dotColor: 'var(--el-color-success)'
  }
])
</script>

<style scoped lang="scss">
.recent-activity {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .section-header {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }
    
    .section-subtitle {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .timeline {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--el-border-color);
    }
    
    .timeline-item {
      display: flex;
      margin-bottom: 24px;
      position: relative;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 16px;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        margin-top: 4px;
      }
      
      .timeline-content {
        flex: 1;
        background: var(--el-fill-color-light);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--el-border-color);
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .activity-title {
            font-size: 15px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }
          
          .activity-time {
            font-size: 12px;
            color: var(--el-text-color-placeholder);
            white-space: nowrap;
          }
        }
        
        .activity-desc {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        .activity-user {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--el-text-color-secondary);
          
          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 暗黑模式适配
:deep(.dark) .recent-activity {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  
  .timeline-content {
    background: var(--el-fill-color-dark);
  }
}
</style>