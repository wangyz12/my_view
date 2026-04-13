// 首页模拟数据
import { 
  DEFAULT_AVATAR,
  QUICK_ACCESS_LINKS,
  ACTIVITY_TYPE_CONFIG,
  type ActivityType
} from './config'

// 统计数据模拟
export const mockStatsData = {
  // 用户增长数据（用于折线图）
  userGrowth: {
    title: '用户增长趋势',
    data: [
      { date: '04-01', count: 120 },
      { date: '04-02', count: 135 },
      { date: '04-03', count: 150 },
      { date: '04-04', count: 165 },
      { date: '04-05', count: 180 },
      { date: '04-06', count: 195 },
      { date: '04-07', count: 210 }
    ]
  },
  
  // 系统访问趋势数据（用于第二排折线图）
  accessTrend: {
    title: '系统访问趋势',
    data: [
      { date: '08:00', count: 45 },
      { date: '10:00', count: 120 },
      { date: '12:00', count: 85 },
      { date: '14:00', count: 150 },
      { date: '16:00', count: 180 },
      { date: '18:00', count: 95 },
      { date: '20:00', count: 60 }
    ]
  },
  
  // 部门分布数据（用于饼图）
  deptDistribution: {
    title: '部门人员分布',
    data: [
      { name: '技术部', value: 45 },
      { name: '市场部', value: 30 },
      { name: '销售部', value: 25 },
      { name: '人事部', value: 20 },
      { name: '财务部', value: 15 }
    ]
  },
  
  // 数据状态分布（用于第二排饼图）
  dataStatus: {
    title: '数据状态分布',
    data: [
      { name: '正常', value: 78 },
      { name: '待审核', value: 15 },
      { name: '已锁定', value: 5 },
      { name: '已删除', value: 2 }
    ]
  },
  
  // 角色分布数据（用于柱状图）
  roleDistribution: {
    title: '角色分布',
    data: [
      { name: '普通用户', value: 85 },
      { name: '开发人员', value: 25 },
      { name: '测试人员', value: 15 },
      { name: '项目经理', value: 8 },
      { name: '部门经理', value: 5 },
      { name: '管理员', value: 3 },
      { name: '超级管理员', value: 1 }
    ]
  },
  
  // 最近活动数据
  recentActivities: [
    { 
      id: '1', 
      user: '张三', 
      type: 'login' as ActivityType, 
      target: '系统', 
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), 
      ip: '192.168.1.100',
      avatar: DEFAULT_AVATAR
    },
    { 
      id: '2', 
      user: '李四', 
      type: 'create' as ActivityType, 
      target: '新用户: test001', 
      time: new Date(Date.now() - 25 * 60 * 1000).toISOString(), 
      ip: '192.168.1.101',
      avatar: DEFAULT_AVATAR
    },
    { 
      id: '3', 
      user: '王五', 
      type: 'update' as ActivityType, 
      target: '部门信息: 技术部', 
      time: new Date(Date.now() - 60 * 60 * 1000).toISOString(), 
      ip: '192.168.1.102',
      avatar: DEFAULT_AVATAR
    },
    { 
      id: '4', 
      user: '赵六', 
      type: 'delete' as ActivityType, 
      target: '测试数据', 
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
      ip: '192.168.1.103',
      avatar: DEFAULT_AVATAR
    },
    { 
      id: '5', 
      user: '孙七', 
      type: 'permission' as ActivityType, 
      target: '角色权限', 
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), 
      ip: '192.168.1.104',
      avatar: DEFAULT_AVATAR
    }
  ],
  
  // 快速访问链接（使用配置）
  quickLinks: QUICK_ACCESS_LINKS
}

// 生成随机数据（用于模拟实时更新）
export function generateRandomData(baseData: any) {
  const randomFactor = () => 0.9 + Math.random() * 0.2 // 0.9-1.1的随机因子
  
  return {
    userGrowth: {
      ...baseData.userGrowth,
      data: baseData.userGrowth.data.map((item: any) => ({
        ...item,
        count: Math.round(item.count * randomFactor())
      }))
    },
    
    accessTrend: {
      ...baseData.accessTrend,
      data: baseData.accessTrend.data.map((item: any) => ({
        ...item,
        count: Math.round(item.count * randomFactor())
      }))
    },
    
    deptDistribution: {
      ...baseData.deptDistribution,
      data: baseData.deptDistribution.data.map((item: any) => ({
        ...item,
        value: Math.round(item.value * randomFactor())
      }))
    },
    
    dataStatus: {
      ...baseData.dataStatus,
      data: baseData.dataStatus.data.map((item: any) => ({
        ...item,
        value: Math.round(item.value * randomFactor())
      }))
    },
    
    roleDistribution: {
      ...baseData.roleDistribution,
      data: baseData.roleDistribution.data.map((item: any) => ({
        ...item,
        value: Math.round(item.value * randomFactor())
      }))
    },
    
    recentActivities: [...baseData.recentActivities],
    quickLinks: [...baseData.quickLinks]
  }
}

// 初始化数据
export const initialStatsData = generateRandomData(mockStatsData)