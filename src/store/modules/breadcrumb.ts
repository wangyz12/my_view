import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getIconComponentName } from '@/utils/iconMapper'

export interface TabItem {
  path: string
  title: string
  icon?: string
  name?: string  // 路由名称
  closable?: boolean  // 是否可关闭
}

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  // 标签页列表，默认包含首页
  const tabs = ref<TabItem[]>([
    {
      path: '/home',
      title: '首页',
      icon: getIconComponentName('home'),
      name: 'Home',
      closable: false  // 首页不可关闭
    }
  ])
  
  // 当前激活的标签页路径
  const activeTabPath = ref<string>('/home')

  // 获取标签页列表
  const getTabs:any = computed(() => tabs.value)
  
  // 获取当前激活的标签页
  const getActiveTab:any = computed(() => 
    tabs.value.find(tab => tab.path === activeTabPath.value)
  )

  // 添加标签页
  const addTab = (tab: TabItem) => {
    // 检查是否已存在
    const exists = tabs.value.some(t => t.path === tab.path)
    if (!exists) {
      // 新标签页默认可以关闭
      tabs.value.push({
        ...tab,
        closable: true
      })
    }
    // 设置为当前激活的标签页
    activeTabPath.value = tab.path
  }

  // 关闭标签页
  const closeTab = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index === -1) return
    
    // 获取当前激活的标签页
    const wasActive = activeTabPath.value === path
    
    // 移除标签页
    tabs.value.splice(index, 1)
    
    // 如果关闭的是当前激活的标签页
    if (wasActive) {
      if (tabs.value.length > 0) {
        // 优先选择前一个，如果没有则选后一个
        const newIndex = Math.min(index, tabs.value.length - 1)
        activeTabPath.value = tabs.value[newIndex]!.path
      } else {
        // 如果没有标签页了，设置为首页
        activeTabPath.value = '/home'
      }
    }
  }

  // 关闭其他标签页
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter(tab => 
      tab.path === path || !tab.closable  // 保留当前页和不可关闭的页（如首页）
    )
    activeTabPath.value = path
  }

  // 关闭所有标签页（保留首页）
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(tab => !tab.closable)
    activeTabPath.value = '/home'
  }

  // 设置当前激活的标签页
  const setActiveTab = (path: string) => {
    activeTabPath.value = path
  }

  // 更新标签页标题（用于动态路由，如详情页）
  const updateTabTitle = (path: string, title: string) => {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) {
      tab.title = title
    }
  }

  // 重置标签页（退出登录时调用）
  const resetTabs = () => {
    tabs.value = [
      {
        path: '/home',
        title: '首页',
        icon: getIconComponentName('home'),
        name: 'Home',
        closable: false  // 首页不可关闭
      }
    ]
    activeTabPath.value = '/home'
  }

  return {
    tabs,
    activeTabPath,
    getTabs,
    getActiveTab,
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    setActiveTab,
    updateTabTitle,
    resetTabs
  }
}, {
  // 数据持久化
  persist: {
    key: 'breadcrumb-store',
    paths: ['tabs', 'activeTabPath'],
  },
})