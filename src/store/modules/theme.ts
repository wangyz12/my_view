import { defineStore } from 'pinia'

// 布局类型：side-侧边栏, top-顶部导航
type LayoutType = 'side' | 'top'

// 主题模式：light-明亮, dark-暗黑
type ThemeMode = 'light' | 'dark'

interface ThemeState {
  // 布局类型
  layout: LayoutType
  // 是否显示 Logo
  showLogo: boolean
  // 是否固定头部
  fixedHeader: boolean
  // 主题色（只影响按钮、链接等控件）
  themeColor: string
  // 是否开启标签页
  showTagsView: boolean
  // 主题模式（暗黑/明亮）- 控制菜单和header颜色
  themeMode: ThemeMode
  // 水印设置
  watermark: {
    enabled: boolean
    text: string
  }
  // 路由缓存设置
  enableRouteCache: boolean
  maxCacheCount: number
  pagePadding:number
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    layout: 'side', // 默认侧边栏布局
    showLogo: true, // 默认显示 Logo
    fixedHeader: true, // 默认固定头部
    themeColor: '#409EFF', // 默认主题色
    showTagsView: true, // 默认显示标签页
    themeMode: 'light', // 默认浅色主题（菜单和header为深色）
    watermark: {
      enabled: true,
      text: '', // 空字符串表示使用默认（用户名）
    },
    // 路由缓存设置
    enableRouteCache: true, // 默认启用路由缓存
    maxCacheCount: 10, // 最大缓存页面数量
    pagePadding:10
  }),

  getters: {
    // 是否为侧边栏布局
    isSideLayout: (state) => state.layout === 'side',
    // 是否为顶部布局
    isTopLayout: (state) => state.layout === 'top',
    // 是否为暗黑模式
    isDarkMode: (state) => state.themeMode === 'dark',
    // 是否为明亮模式
    isLightMode: (state) => state.themeMode === 'light',
    // 菜单背景色
    menuBgColor: (state) => state.themeMode === 'dark' ? '#304156' : 'rgba(0,0,0,0)',
    // 菜单文字色
    menuTextColor: (state) => state.themeMode === 'dark' ? '#bfcbd9' : '#303133',
    // 菜单激活色
    menuActiveColor: (state) => state.themeMode === 'dark' ? '#409EFF' : state.themeColor,
    // Header背景色
    headerBgColor: (state) => state.themeMode === 'dark' ? '#304156' : 'rgba(0,0,0,0)',
    // Logo背景色
    logoBgColor: (state) => state.themeMode === 'dark' ? '#1f2d3d' : 'rgba(0,0,0,0)',
    // Logo文字色
    logoTextColor: (state) => state.themeMode === 'dark' ? 'rgba(0,0,0,0)' : '#303133',
    // 是否启用路由缓存
    isRouteCacheEnabled: (state) => state.enableRouteCache,
  },

  actions: {
    // 设置布局类型
    setLayout(layout: LayoutType) {
      this.layout = layout
    },
    setPagePadding(data:number){
      this.pagePadding = data
    },
    // 切换布局
    toggleLayout() {
      this.layout = this.layout === 'side' ? 'top' : 'side'
    },

    // 设置 Logo 显示状态
    setShowLogo(show: boolean) {
      this.showLogo = show
    },

    // 切换 Logo 显示
    toggleLogo() {
      this.showLogo = !this.showLogo
    },

    // 设置固定头部
    setFixedHeader(fixed: boolean) {
      this.fixedHeader = fixed
    },

    // 设置主题色（只影响控件颜色，不影响菜单和header）
    setThemeColor(color: string) {
      this.themeColor = color
      // 更新 Element Plus 主题色
      const el = document.documentElement
      el.style.setProperty('--el-color-primary', color)
    },

    // 设置标签页显示
    setShowTagsView(show: boolean) {
      this.showTagsView = show
    },

    // 设置主题模式
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode
      // 更新 Element Plus 的 dark 模式
      const html = document.documentElement
      if (mode === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    },

    // 切换主题模式
    toggleThemeMode() {
      this.setThemeMode(this.themeMode === 'dark' ? 'light' : 'dark')
    },

    // 设置水印
    setWatermark(enabled: boolean, text?: string) {
      this.watermark.enabled = enabled
      if (text !== undefined) {
        this.watermark.text = text
      }
    },

    // 设置路由缓存
    setRouteCache(enabled: boolean) {
      this.enableRouteCache = enabled
    },
    
    // 设置最大缓存数量
    setMaxCacheCount(count: number) {
      this.maxCacheCount = Math.max(1, Math.min(count, 20)) // 限制在1-20之间
    },
    
    // 切换路由缓存
    toggleRouteCache() {
      this.enableRouteCache = !this.enableRouteCache
    },

    // 重置所有设置
    resetSettings() {
      this.layout = 'side'
      this.showLogo = true
      this.fixedHeader = true
      this.themeColor = '#409EFF'
      this.showTagsView = true
      this.themeMode = 'dark'
      this.watermark = { enabled: true, text: '' }
      this.enableRouteCache = true
      this.maxCacheCount = 10
      this.setThemeColor('#409EFF')
      this.setThemeMode('dark')
    },
  },

  // 数据持久化
  persist: {
    key: 'theme-store',
    paths: ['layout', 'showLogo', 'fixedHeader', 'themeColor', 'showTagsView', 'themeMode', 'watermark', 'enableRouteCache', 'maxCacheCount'],
  },
})
