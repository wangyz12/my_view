<template>
  <div class="quick-actions">
    <div class="section-header">
      <h3 class="section-title">快速操作</h3>
      <p class="section-subtitle">常用功能一键直达</p>
    </div>
    
    <div class="actions-grid">
      <div 
        v-for="(action, index) in actions" 
        :key="index" 
        class="action-item"
        @click="handleAction(action)"
      >
        <div class="action-icon" :style="{ backgroundColor: action.iconBg }">
          <i :class="action.icon" class="icon"></i>
        </div>
        <div class="action-content">
          <div class="action-title">{{ action.title }}</div>
          <div class="action-desc">{{ action.description }}</div>
        </div>
        <div class="action-arrow">
          <i class="el-icon-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useThemeStore } from '@/store/modules/theme'

const router = useRouter()
const themeStore = useThemeStore()

interface QuickAction {
  icon: string
  iconBg: string
  title: string
  description: string
  route?: string
  action?: () => void
}

const actions = ref<QuickAction[]>([
  {
    icon: 'el-icon-user',
    iconBg: themeStore.isDarkMode ? 'rgba(64, 158, 255, 0.2)' : 'rgba(64, 158, 255, 0.1)',
    title: '用户管理',
    description: '管理系统用户和权限',
    route: '/system/user'
  },
  {
    icon: 'el-icon-s-grid',
    iconBg: themeStore.isDarkMode ? 'rgba(103, 194, 58, 0.2)' : 'rgba(103, 194, 58, 0.1)',
    title: '角色管理',
    description: '配置角色和权限分配',
    route: '/system/role'
  },
  {
    icon: 'el-icon-menu',
    iconBg: themeStore.isDarkMode ? 'rgba(230, 162, 60, 0.2)' : 'rgba(230, 162, 60, 0.1)',
    title: '菜单管理',
    description: '管理系统菜单和路由',
    route: '/system/menu'
  },
  {
    icon: 'el-icon-office-building',
    iconBg: themeStore.isDarkMode ? 'rgba(144, 147, 153, 0.2)' : 'rgba(144, 147, 153, 0.1)',
    title: '部门管理',
    description: '管理组织架构和部门',
    route: '/system/dept'
  },
  {
    icon: 'el-icon-setting',
    iconBg: themeStore.isDarkMode ? 'rgba(245, 108, 108, 0.2)' : 'rgba(245, 108, 108, 0.1)',
    title: '系统设置',
    description: '配置系统参数和主题',
    route: '/system/setting'
  },
  {
    icon: 'el-icon-user',
    iconBg: themeStore.isDarkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)',
    title: '个人中心',
    description: '查看和修改个人信息',
    route: '/userinfo'
  }
])

const handleAction = (action: QuickAction) => {
  if (action.route) {
    router.push(action.route)
  } else if (action.action) {
    action.action()
  }
}
</script>

<style scoped lang="scss">
.quick-actions {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  
  .section-header {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }
    
    .section-subtitle {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 6px;
      background: var(--el-fill-color-light);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--el-border-color);
      
      &:hover {
        background: var(--el-fill-color);
        border-color: var(--el-color-primary);
      }
      
      .action-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        .icon {
          font-size: 18px;
          color: var(--el-color-primary);
        }
      }
      
      .action-content {
        flex: 1;
        
        .action-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 2px;
        }
        
        .action-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .action-arrow {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }
    }
  }
}

// 暗黑模式适配
:deep(.dark) .quick-actions {
  .action-item {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: var(--el-fill-color-darker);
    }
  }
}
</style>