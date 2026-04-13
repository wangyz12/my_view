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
    
    <!-- 首页内容 -->
    <div v-else class="home-container">
      <!-- 第一行：用户信息和系统介绍 -->
      <div class="home-row">
        <div class="home-col user-info-col">
          <UserInfoCard 
            :user-info="formattedUserInfo" 
            :loading="loading"
          />
        </div>
        
        <div class="home-col system-intro-col">
          <SystemIntroCard />
        </div>
      </div>
      
      <!-- 第二行：快速访问和折线图 -->
      <div class="home-row">
        <div class="home-col quick-access-col">
          <QuickAccessCard 
            :links="statsData.quickLinks"
            @link-click="handleLinkClick"
          />
        </div>
        
        <div class="home-col chart-col">
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
        <div class="home-col chart-col">
          <ChartCard 
            :title="statsData.roleDistribution.title"
            :height="LAYOUT_CONFIG.cardHeights.thirdRow"
            :options="roleDistributionOptions"
            :loading="loading"
            @chart-click="handleChartClick"
          />
        </div>
        
        <div class="home-col activity-col">
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
  USER_STATUS_CONFIG,
  type UserStatus
} from './config'

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
    
    // 隐藏初始骨架屏
    setTimeout(() => {
      initialLoading.value = false
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
@import './styles/index.scss';

// 这里只写页面特有的样式，通用样式已经在 index.scss 中定义
// 响应式调整已经在 index.scss 中处理
</style>