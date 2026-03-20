<template>
  <div class="project-progress">
    <div class="section-header">
      <h3 class="section-title">项目进度</h3>
      <p class="section-subtitle">当前进行中的项目</p>
    </div>
    
    <div class="projects-grid">
      <div v-for="(project, index) in projects" :key="index" class="project-card">
        <div class="project-header">
          <div class="project-title">{{ project.title }}</div>
          <div class="project-status" :class="project.statusClass">
            {{ project.status }}
          </div>
        </div>
        
        <div class="project-desc">{{ project.description }}</div>
        
        <div class="project-progress-bar">
          <div class="progress-info">
            <span>完成度</span>
            <span>{{ project.progress }}%</span>
          </div>
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ 
                width: `${project.progress}%`,
                backgroundColor: project.progressColor 
              }"
            ></div>
          </div>
        </div>
        
        <div class="project-meta">
          <div class="meta-item">
            <i class="el-icon-user"></i>
            <span>{{ project.teamSize }} 人</span>
          </div>
          <div class="meta-item">
            <i class="el-icon-date"></i>
            <span>{{ project.deadline }}</span>
          </div>
        </div>
        
        <div class="project-team">
          <div class="team-avatars">
            <div 
              v-for="(avatar, avatarIndex) in project.teamAvatars" 
              :key="avatarIndex"
              class="team-avatar"
              :style="{ backgroundColor: avatar.color }"
            >
              {{ avatar.initials }}
            </div>
            <div v-if="project.teamSize > 3" class="team-more">
              +{{ project.teamSize - 3 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TeamAvatar {
  initials: string
  color: string
}

interface Project {
  title: string
  description: string
  progress: number
  progressColor: string
  status: string
  statusClass: string
  teamSize: number
  deadline: string
  teamAvatars: TeamAvatar[]
}

const projects = ref<Project[]>([
  {
    title: '后台管理系统重构',
    description: '重构现有后台管理系统，提升性能和用户体验',
    progress: 75,
    progressColor: 'var(--el-color-primary)',
    status: '进行中',
    statusClass: 'status-in-progress',
    teamSize: 5,
    deadline: '2024-04-15',
    teamAvatars: [
      { initials: '张', color: '#409EFF' },
      { initials: '李', color: '#67C23A' },
      { initials: '王', color: '#E6A23C' }
    ]
  },
  {
    title: '移动端应用开发',
    description: '开发配套的移动端应用程序',
    progress: 45,
    progressColor: 'var(--el-color-success)',
    status: '进行中',
    statusClass: 'status-in-progress',
    teamSize: 3,
    deadline: '2024-05-20',
    teamAvatars: [
      { initials: '赵', color: '#F56C6C' },
      { initials: '钱', color: '#909399' }
    ]
  },
  {
    title: '数据迁移项目',
    description: '将旧系统数据迁移到新平台',
    progress: 90,
    progressColor: 'var(--el-color-warning)',
    status: '即将完成',
    statusClass: 'status-near-completion',
    teamSize: 4,
    deadline: '2024-03-25',
    teamAvatars: [
      { initials: '孙', color: '#409EFF' },
      { initials: '周', color: '#67C23A' },
      { initials: '吴', color: '#E6A23C' }
    ]
  },
  {
    title: '安全加固项目',
    description: '系统安全漏洞修复和加固',
    progress: 30,
    progressColor: 'var(--el-color-danger)',
    status: '规划中',
    statusClass: 'status-planning',
    teamSize: 2,
    deadline: '2024-06-10',
    teamAvatars: [
      { initials: '郑', color: '#F56C6C' }
    ]
  }
])
</script>

<style scoped lang="scss">
.project-progress {
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
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    
    .project-card {
      background: var(--el-fill-color-light);
      border-radius: 10px;
      padding: 20px;
      border: 1px solid var(--el-border-color);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      
      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .project-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          flex: 1;
        }
        
        .project-status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
          white-space: nowrap;
          
          &.status-in-progress {
            background: rgba(var(--el-color-primary-rgb), 0.1);
            color: var(--el-color-primary);
          }
          
          &.status-near-completion {
            background: rgba(var(--el-color-success-rgb), 0.1);
            color: var(--el-color-success);
          }
          
          &.status-planning {
            background: rgba(var(--el-color-warning-rgb), 0.1);
            color: var(--el-color-warning);
          }
        }
      }
      
      .project-desc {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-bottom: 20px;
        line-height: 1.5;
      }
      
      .project-progress-bar {
        margin-bottom: 20px;
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
        
        .progress-track {
          height: 8px;
          background: var(--el-border-color);
          border-radius: 4px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }
        }
      }
      
      .project-meta {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        
        .meta-item {
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
      
      .project-team {
        .team-avatars {
          display: flex;
          gap: 8px;
          
          .team-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: 500;
          }
          
          .team-more {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--el-border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }
}

// 暗黑模式适配
:deep(.dark) .project-progress {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  
  .project-card {
    background: var(--el-fill-color-dark);
    
    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>