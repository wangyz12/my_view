// 首页配置文件
// 所有可循环展示的数据都在这里定义

import defaultAvatar from '@/assets/default/avatar.jpeg'

// 默认头像路径
export const DEFAULT_AVATAR = defaultAvatar

// 用户状态配置
export const USER_STATUS_CONFIG = {
  active: {
    text: '在线',
    class: 'status-active',
    color: '#67C23A'
  },
  inactive: {
    text: '离线',
    class: 'status-inactive',
    color: '#909399'
  },
  busy: {
    text: '忙碌',
    class: 'status-busy',
    color: '#E6A23C'
  },
  away: {
    text: '离开',
    class: 'status-away',
    color: '#F56C6C'
  }
} as const

// 快速访问链接配置
export const QUICK_ACCESS_LINKS = [
  {
    id: 'user',
    title: '用户管理',
    icon: 'User',
    path: '/system/user',
    color: '#409EFF',
    description: '管理系统用户'
  },
  {
    id: 'role',
    title: '角色管理',
    icon: 'Lock',
    path: '/system/role',
    color: '#67C23A',
    description: '管理用户角色'
  },
  {
    id: 'dept',
    title: '部门管理',
    icon: 'OfficeBuilding',
    path: '/system/dept',
    color: '#E6A23C',
    description: '管理部门结构'
  },
  {
    id: 'menu',
    title: '菜单管理',
    icon: 'Menu',
    path: '/system/menu',
    color: '#B37FEB',
    description: '管理系统菜单'
  }
] as const

// 系统介绍配置
export const SYSTEM_INTRO_CONFIG = {
  title: '系统介绍',
  version: 'v2.5.0',
  description: '这是一个基于 Vue 3 + Element Plus 的后台管理系统，提供完整的用户、角色、权限管理功能。',
  features: [
    {
      title: '用户管理',
      description: '支持用户增删改查、角色分配、状态管理'
    },
    {
      title: '权限控制',
      description: '基于角色的细粒度权限控制，支持菜单级权限'
    },
    {
      title: '数据统计',
      description: '丰富的图表展示，实时数据监控'
    },
    {
      title: '响应式设计',
      description: '支持PC、平板、手机等多种设备'
    }
  ],
  stats: [
    {
      label: '用户数',
      value: 'x,xxx',
      icon: 'User'
    },
    {
      label: '角色数',
      value: 'x',
      icon: 'Lock'
    },
    {
      label: '部门数',
      value: 'xx',
      icon: 'OfficeBuilding'
    },
    {
      label: '在线数',
      value: 'xxx',
      icon: 'Monitor'
    }
  ]
} as const

// 最近活动类型配置
export const ACTIVITY_TYPE_CONFIG = {
  login: {
    text: '登录',
    icon: 'Login',
    color: '#409EFF'
  },
  logout: {
    text: '退出',
    icon: 'Logout',
    color: '#909399'
  },
  create: {
    text: '创建',
    icon: 'Plus',
    color: '#67C23A'
  },
  update: {
    text: '更新',
    icon: 'Edit',
    color: '#E6A23C'
  },
  delete: {
    text: '删除',
    icon: 'Delete',
    color: '#F56C6C'
  },
  permission: {
    text: '权限',
    icon: 'Key',
    color: '#B37FEB'
  }
} as const

// 图表颜色配置
export const CHART_COLORS = {
  primary: '#409EFF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  purple: '#B37FEB',
  pink: '#FF85C0',
  cyan: '#36CFC9'
} as const

// 图表系列颜色（用于柱状图、饼图等）
export const CHART_SERIES_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.pink
] as const

// 页面布局配置
export const LAYOUT_CONFIG = {
  // 卡片高度
  cardHeights: {
    firstRow: 240,    // 第一排卡片高度
    secondRow: 240,   // 第二排卡片高度
    thirdRow: 300     // 第三排卡片高度
  },
  // 间距
  spacing: {
    rowGap: 16,       // 行间距
    colGap: 16,       // 列间距
    cardPadding: 20   // 卡片内边距
  },
  // 响应式断点
  breakpoints: {
    sm: 768,
    md: 992,
    lg: 1200
  }
} as const

// 类型定义
export type UserStatus = keyof typeof USER_STATUS_CONFIG
export type ActivityType = keyof typeof ACTIVITY_TYPE_CONFIG
export type QuickAccessLink = typeof QUICK_ACCESS_LINKS[number]
export type SystemIntroFeature = typeof SYSTEM_INTRO_CONFIG.features[number]
export type SystemIntroStat = typeof SYSTEM_INTRO_CONFIG.stats[number]