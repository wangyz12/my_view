<template>
  <div class="user-info-card flex-card" :class="{ 'user-info-loading': loading }">
    <!-- 骨架屏 -->
    <div v-if="loading" class="user-info-skeleton">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-info">
        <div class="skeleton-name"></div>
        <div class="skeleton-dept"></div>
        <div class="skeleton-details">
          <div class="skeleton-detail"></div>
          <div class="skeleton-detail"></div>
          <div class="skeleton-detail"></div>
        </div>
      </div>
    </div>
    
    <!-- 用户信息 -->
    <div v-else class="user-info-content">
      <div class="user-avatar">
        <el-avatar :size="80" :src="userInfo.avatar" />
        <div class="user-status" :class="getStatusClass(userInfo.status)">
          {{ getStatusText(userInfo.status) }}
        </div>
      </div>
      
      <div class="user-main">
        <div class="user-header">
          <h3 class="user-name">{{ userInfo.username }}</h3>
          <span class="user-account">{{ userInfo.account }}</span>
        </div>
        
        <div class="user-dept flex-vertical-center">
          <el-icon><OfficeBuilding /></el-icon>
          <span>{{ userInfo.dept.name }}</span>
        </div>
        
        <div class="user-roles">
          <div class="flex-vertical-center">
            <el-icon><Lock /></el-icon>
            <span class="roles-label">角色:</span>
          </div>
          <div class="roles-list">
            <span 
              v-for="role in userInfo.roles" 
              :key="role.id"
              class="role-tag"
            >
              {{ role.name }}
            </span>
          </div>
        </div>
        
        <div class="user-contact">
          <div class="contact-item flex-vertical-center">
            <el-icon><Phone /></el-icon>
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="contact-item flex-vertical-center">
            <el-icon><Message /></el-icon>
            <span>{{ userInfo.email }}</span>
          </div>
        </div>
        
        <div class="user-meta">
          <div class="meta-item">
            <span class="meta-label">注册时间:</span>
            <span class="meta-value">{{ formatDate(userInfo.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">最后登录:</span>
            <span class="meta-value">{{ formatDate(userInfo.lastLogin) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ElAvatar, 
  ElIcon 
} from 'element-plus'
import { 
  OfficeBuilding, 
  Lock, 
  Phone, 
  Message 
} from '@element-plus/icons-vue'
import { USER_STATUS_CONFIG, type UserStatus } from '../config'

interface Role {
  id: string
  name: string
}

interface Dept {
  id: string
  name: string
}

interface UserInfo {
  id: string
  account: string
  username: string
  dept: Dept
  roles: Role[]
  phone: string
  email: string
  avatar: string
  status: string
  createdAt: string
  lastLogin: string
}

interface Props {
  userInfo: UserInfo
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 获取状态类名
const getStatusClass = (status: string) => {
  const statusKey = status as UserStatus
  return USER_STATUS_CONFIG[statusKey]?.class || 'status-inactive'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusKey = status as UserStatus
  return USER_STATUS_CONFIG[statusKey]?.text || '未知状态'
}

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return '未知日期'
  }
}
</script>

<style scoped lang="scss">
@use '../styles/index.scss';

// 这个组件现在使用 components.scss 中定义的样式
// 如果需要覆盖或添加特定样式，可以在这里添加
</style>