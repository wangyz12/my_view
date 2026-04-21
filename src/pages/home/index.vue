<template>
  <PageLayout :padding="false">
    <!-- 骨架屏（初始加载时显示） -->
    <div v-if="initialLoading" class="home-skeleton">
      <div class="skeleton-row">
        <div class="skeleton-user-card"></div>
        <div class="skeleton-system-intro"></div>
      </div>
      <div class="skeleton-row">
        <div class="skeleton-quick-access"></div>
        <div class="skeleton-line-chart"></div>
      </div>
      <div class="skeleton-row">
        <div class="skeleton-chart"></div>
        <div class="skeleton-activity"></div>
      </div>
    </div>
    
    <!-- 首页内容（带动画） -->
    <div 
      v-else 
      class="home-container"
      :class="{ 'animation-container': shouldEnableAnimation, 'animate-in': showContent }"
    >
      <!-- 第一行：用户信息和系统介绍 -->
      <div class="home-row">
        <div 
          class="home-col user-info-col"
          :class="getAnimationClass('user-info')"
          :style="getAnimationStyle('user-info')"
        >
          <UserInfoCard 
            :user-info="formattedUserInfo" 
            :loading="loading"
          />
        </div>
        
        <div 
          class="home-col system-intro-col"
          :class="getAnimationClass('system-intro')"
          :style="getAnimationStyle('system-intro')"
        >
          <SystemIntroCard />
        </div>
      </div>
      
      <!-- 第二行：快速访问和折线图 -->
      <div class="home-row">
        <div 
          class="home-col quick-access-col"
          :class="getAnimationClass('quick-access')"
          :style="getAnimationStyle('quick-access')"
        >
          <QuickAccessCard 
            :links="statsData.quickLinks"
            @link-click="handleLinkClick"
          />
        </div>
        
        <div 
          class="home-col chart-col"
          :class="getAnimationClass('access-trend')"
          :style="getAnimationStyle('access-trend')"
        >
          <ChartCard 
            title="系统访问趋势"
            :height="LAYOUT_CONFIG.cardHeights.secondRow"
            :options="accessTrendOptions"
            :loading="loading"
            @chart-click="handleChartClick"
          />
        </div>
      </div>
      
      <!-- 第三行：图表和最近活动 -->
      <div class="home-row">
        <div 
          class="home-col chart-col"
          :class="getAnimationClass('role-distribution')"
          :style="getAnimationStyle('role-distribution')"
        >
          <ChartCard 
            :title="statsData.roleDistribution.title"
            :height="LAYOUT_CONFIG.cardHeights.thirdRow"
            :options="roleDistributionOptions"
            :loading="loading"
            @chart-click="handleChartClick"
          />
        </div>
        
        <div 
          class="home-col activity-col"
          :class="getAnimationClass('activity-list')"
          :style="getAnimationStyle('activity-list')"
        >
          <ActivityList 
            :activities="statsData.recentActivities"
            :loading="loading"
            :height="LAYOUT_CONFIG.cardHeights.thirdRow"
            @view-all="handleViewAllActivities"
            @item-click="handleActivityClick"
          />
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import PageLayout from '@/components/PageLayout/index.vue'
import UserInfoCard from './components/UserInfoCard.vue'
import SystemIntroCard from './components/SystemIntroCard.vue'
import ChartCard from './components/ChartCard.vue'
import QuickAccessCard from './components/QuickAccessCard.vue'
import ActivityList from './components/ActivityList.vue'
import { 
  initialStatsData, 
  generateRandomData 
} from './mockData'
import {
  getRoleDistributionOptions,
  getAccessTrendOptions
} from './chartOptions'
import {
  DEFAULT_AVATAR,
  LAYOUT_CONFIG,
} from './config'
import { useThemeStore } from '@/store/modules/theme'
import {
  type PageAnimationType,
  getComponentAnimation,
  getThemeBasedAnimation,
  componentAnimationOrder,
  shouldAnimate,
  getTotalAnimationDuration
} from './utils/animations'

// 导入样式
import './styles/index.scss'

const router = useRouter()
const userStore = useUserStore()

// 状态
const initialLoading = ref(true)
const loading = ref(false)
const statsData = ref(initialStatsData)
const updateInterval = ref<any>(null)

// 格式化用户信息（从 store 中获取）
const formattedUserInfo = computed(() => {
  const storeInfo = userStore.userInfo
  
  return {
    id: storeInfo.id || '',
    account: storeInfo.account || '未登录',
    username: storeInfo.username || '访客',
    dept: {
      id: storeInfo.deptId?.id || '',
      name: storeInfo.deptId?.name || '未分配部门'
    },
    roles: userStore.roles.map(role => ({
      id: role.id,
      name: role.name
    })),
    phone: storeInfo.phone || '未设置',
    email: storeInfo.email || '未设置',
    avatar: storeInfo.avatar || DEFAULT_AVATAR,
    status: storeInfo.status || '0',
    createdAt: storeInfo.createdAt || new Date().toISOString(),
    lastLogin: storeInfo.lastLogin || new Date().toISOString()
  }
})

// 计算属性：图表配置
const roleDistributionOptions = computed(() => {
  return getRoleDistributionOptions(statsData.value.roleDistribution.data)
})

const accessTrendOptions = computed(() => {
  return getAccessTrendOptions(statsData.value.accessTrend.data)
})

// ==================== 动画相关 ====================
const themeStore = useThemeStore()

// 动画状态
const showContent = ref(false)
const animationReady = ref(false)

// 计算主题调整后的动画类型
const adjustedAnimationType = computed<PageAnimationType>(() => {
  return getThemeBasedAnimation(
    themeStore.themeMode,
    themeStore.pageAnimation
  )
})

// 是否启用动画
const shouldEnableAnimation = computed(() => {
  return shouldAnimate(adjustedAnimationType.value)
})

// 获取组件动画配置
const getAnimationConfig = (componentId: keyof typeof componentAnimationOrder) => {
  return getComponentAnimation(
    adjustedAnimationType.value,
    themeStore.animationDuration,
    componentAnimationOrder[componentId]
  )
}

// 获取组件动画类名
const getAnimationClass = (componentId: keyof typeof componentAnimationOrder) => {
  const config = getAnimationConfig(componentId)
  
  if (config.type === 'none') return ''
  
  const classes = ['animate-base']
  
  // 添加动画类型类
  switch (config.type) {
    case 'fade':
      classes.push('animate-fade-in')
      break
    case 'fade-slide':
      classes.push('animate-fade-slide-up')
      break
    case 'scale':
      classes.push('animate-scale-in')
      break
    case 'slide-x':
      classes.push('animate-slide-in-x')
      break
    case 'slide-y':
      classes.push('animate-slide-in-y')
      break
  }
  
  // 添加延迟类（简化版）
  const delay = config.delay || 0
  if (delay > 0) {
    const delayClass = `animate-delay-${Math.round(delay / 50) * 50}`
    classes.push(delayClass)
  }
  
  return classes.join(' ')
}

// 获取组件动画样式
const getAnimationStyle = (componentId: keyof typeof componentAnimationOrder) => {
  const config = getAnimationConfig(componentId)
  
  if (config.type === 'none') return {}
  
  const style: Record<string, string> = {
    'animation-duration': `${config.duration}ms`,
    'animation-timing-function': config.easing || 'cubic-bezier(0.4, 0, 0.2, 1)',
    'animation-fill-mode': 'both'
  }
  
  if (config.delay) {
    style['animation-delay'] = `${config.delay}ms`
  }
  
  return style
}

// 计算总动画时长（用于控制骨架屏到内容的过渡）
const totalAnimationDuration = computed(() => {
  return getTotalAnimationDuration(
    adjustedAnimationType.value,
    themeStore.animationDuration
  )
})

// 模拟数据更新
const updateMockData = () => {
  statsData.value = generateRandomData(statsData.value)
}

// 初始化数据
const initData = () => {
  loading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
    
    // 准备动画
    animationReady.value = true
    
    // 隐藏初始骨架屏，然后显示内容并触发动画
    setTimeout(() => {
      initialLoading.value = false
      
      // 短暂延迟后显示内容并触发动画
      setTimeout(() => {
        showContent.value = true
        
        // 如果禁用动画，立即显示内容
        if (!shouldEnableAnimation.value) {
          showContent.value = true
        }
      }, 50)
    }, 300)
  }, 800)
}

// 启动定时更新（使用 setInterval）
const startAutoUpdate = () => {
  // 5-10秒随机间隔
  const interval = 5000 + Math.random() * 5000
  
  updateInterval.value = setInterval(() => {
    updateMockData()
  }, interval)
}

// 停止定时更新
const stopAutoUpdate = () => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
    updateInterval.value = null
  }
}

// 事件处理
const handleChartClick = (params: any) => {
  console.log('图表点击:', params)
  ElMessage.info(`点击了: ${params.name || params.seriesName}`)
}

const handleLinkClick = (link: any) => {
  console.log('快速链接点击:', link)
  ElMessage.success(`跳转到: ${link.name}`)
  router.push(link.path)
}

const handleViewAllActivities = () => {
  console.log('查看全部活动')
  ElMessage.info('查看全部活动')
  // 这里可以跳转到活动页面
}

const handleActivityClick = (activity: any) => {
  console.log('活动点击:', activity)
  ElMessage.info(`查看活动: ${activity.user} - ${activity.action}`)
}

// 生命周期
onMounted(() => {
  initData()
  startAutoUpdate()
})

onUnmounted(() => {
  stopAutoUpdate()
})

// 暴露方法（如果需要）
defineExpose({
  refreshData: () => {
    loading.value = true
    setTimeout(() => {
      updateMockData()
      loading.value = false
      ElMessage.success('数据已刷新')
    }, 500)
  },
  stopAutoUpdate,
  startAutoUpdate
})
</script>

<style scoped lang="scss">
@use './styles/index.scss';

// 这里只写页面特有的样式，通用样式已经在 index.scss 中定义
// 响应式调整已经在 index.scss 中处理
</style>