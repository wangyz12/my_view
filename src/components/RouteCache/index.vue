<template>
  <router-view v-slot="{ Component, route }">
    <transition 
      :name="transitionName" 
      :mode="transitionMode" 
      :duration="transitionDuration"
    >
      <keep-alive :include="cachedRoutes">
        <component :is="Component" :key="route.fullPath" class="full-page" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/store/modules/theme'

const route = useRoute()
const themeStore = useThemeStore()

// 缓存的组件名称列表
const cachedRoutes = ref<string[]>([])

// ========== 动画相关计算属性 ==========
// 动画名称（当动画为 none 时返回空字符串，禁用动画）
const transitionName = computed(() => {
  const animation = themeStore.pageAnimation
  if (animation === 'none') return ''
  return `route-${animation}`
})

// 动画模式：明确类型为 Vue transition 支持的 mode
const transitionMode = computed<'out-in' | 'in-out' | 'default'>(() => 'out-in')

// 动画时长
const transitionDuration = computed(() => ({
  enter: themeStore.animationDuration,
  leave: themeStore.animationDuration
}))

// ========== 缓存逻辑 ==========
// 需要缓存的页面（根据路由meta中的keepAlive配置）
const shouldCache = (route: any): boolean => {
  // 如果全局缓存被禁用，则不缓存任何页面
  if (!themeStore.enableRouteCache) {
    return false
  }
  
  // 默认情况下，所有页面都缓存（除了登录页等）
  const noCacheRoutes = ['/login', '/401', '/404']
  
  if (noCacheRoutes.includes(route.path)) {
    return false
  }
  
  // 如果路由meta中明确指定了keepAlive，则使用该配置
  if (route.meta?.keepAlive !== undefined) {
    return route.meta.keepAlive
  }
  
  // 默认缓存所有需要权限的页面
  return route.meta?.requiresAuth === true
}

// 获取组件名称
const getComponentName = (route: any): string | undefined => {
  // 从路由配置中获取组件名称
  if (route.matched && route.matched.length > 0) {
    const matched = route.matched[route.matched.length - 1]
    return matched.components?.default?.name || matched.name
  }
  return undefined
}

// 添加路由到缓存
const addToCache = (route: any) => {
  const componentName = getComponentName(route)
  if (componentName && shouldCache(route)) {
    if (!cachedRoutes.value.includes(componentName)) {
      // 检查缓存数量限制
      if (cachedRoutes.value.length >= themeStore.maxCacheCount) {
        // 移除最旧的缓存（第一个）
        cachedRoutes.value.shift()
      }
      
      cachedRoutes.value.push(componentName)
    }
  }
}

// 从缓存中移除路由
const removeFromCache = (route: any) => {
  const componentName = getComponentName(route)
  if (componentName) {
    const index = cachedRoutes.value.indexOf(componentName)
    if (index > -1) {
      cachedRoutes.value.splice(index, 1)
    }
  }
}

// 清除所有缓存
const clearAllCache = () => {
  cachedRoutes.value = []
}

// 手动刷新缓存（保留当前页面）
const refreshCache = () => {
  const currentName = getComponentName(route)
  const newCache = currentName ? [currentName] : []
}

// 监听路由变化
watch(
  () => route.path,
  (newPath, oldPath) => {
    const oldRoute = { path: oldPath, meta: route.meta }
    const newRoute = route
    
    // 离开页面时，根据配置决定是否保留缓存
    if (oldPath && oldPath !== newPath) {
      const oldComponentName = getComponentName({ path: oldPath, meta: route.meta })
      if (oldComponentName && !shouldCache(oldRoute)) {
        removeFromCache(oldRoute)
      }
    }
    
    // 进入新页面时，添加到缓存
    addToCache(newRoute)
  },
  { immediate: true }
)

// 监听主题设置中的缓存配置
watch(
  () => themeStore.enableRouteCache,
  (enabled) => {
    if (!enabled) {
      clearAllCache()
    }
  }
)

// 监听标签页关闭事件（如果项目有标签页功能）
const handleTabClose = (tabName: string) => {
  const index = cachedRoutes.value.indexOf(tabName)
  if (index > -1) {
    cachedRoutes.value.splice(index, 1)
  }
}

// 提供方法给其他组件使用
defineExpose({
  cachedRoutes,
  addToCache,
  removeFromCache,
  clearAllCache,
  refreshCache,
  handleTabClose
})

// 生命周期
onMounted(() => {
  // 初始加载当前路由到缓存
  addToCache(route)
})
</script>

<style lang="scss">
@use './index.scss'
</style>