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
// ==================== UserInfoCard 样式 ====================
.user-info-card {
  &.user-info-loading {
    min-height: 240px;
  }
  
  .user-info-content {
    display: flex;
    gap: $spacing-lg;
  }
  
  .user-avatar {
    position: relative;
    flex-shrink: 0;
  }
  
  .user-status {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-round;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    background-color: $card-bg-color;
    box-shadow: $box-shadow-card;
  }
  
  .user-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .user-header {
    .user-name {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $text-color-primary;
    }
    
    .user-account {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
  
  .user-dept {
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-color-regular;
    
    .el-icon {
      color: $primary-color;
    }
  }
  
  .user-roles {
    .flex-vertical-center {
      gap: $spacing-sm;
      margin-bottom: $spacing-xs;
      font-size: $font-size-sm;
      color: $text-color-regular;
      
      .el-icon {
        color: $primary-color;
      }
      
      .roles-label {
        font-weight: $font-weight-medium;
      }
    }
  }
  
  .roles-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
  
  .role-tag {
    padding: $spacing-xs $spacing-sm;
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    border: 1px solid rgba($primary-color, 0.2);
  }
  
  .user-contact {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
  
  .contact-item {
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-color-regular;
    
    .el-icon {
      color: $success-color;
    }
  }
  
  .user-meta {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-top: $spacing-base;
    padding-top: $spacing-base;
    border-top: 1px solid $border-color-lighter;
  }
  
  .meta-item {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
  }
  
  .meta-label {
    color: $text-color-secondary;
  }
  
  .meta-value {
    color: $text-color-primary;
    font-weight: $font-weight-medium;
  }
  
  // 骨架屏样式
  .user-info-skeleton {
    display: flex;
    gap: $spacing-lg;
  }
  
  .skeleton-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    @include skeleton-animation;
  }
  
  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .skeleton-name {
    height: 24px;
    width: 120px;
    border-radius: $border-radius-sm;
    @include skeleton-animation;
  }
  
  .skeleton-dept {
    height: 20px;
    width: 180px;
    border-radius: $border-radius-sm;
    @include skeleton-animation;
  }
  
  .skeleton-details {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    margin-top: $spacing-sm;
  }
  
  .skeleton-detail {
    height: 18px;
    border-radius: $border-radius-sm;
    @include skeleton-animation;
    
    &:nth-child(1) {
      width: 200px;
    }
    
    &:nth-child(2) {
      width: 180px;
    }
    
    &:nth-child(3) {
      width: 220px;
    }
  }
}
</style>