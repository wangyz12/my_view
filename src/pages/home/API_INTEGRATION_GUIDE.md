# 首页API集成指南

## 🎯 快速开始

### 1. 创建API服务文件
在 `src/api/` 目录下创建 `home.ts`：

```typescript
// src/api/home.ts
import request from '@/utils/request'

// 首页统计数据接口
export interface HomeStatsResponse {
  userGrowth: Array<{ date: string; count: number }>
  accessTrend: Array<{ time: string; count: number }>
  deptDistribution: Array<{ name: string; value: number }>
  dataStatus: Array<{ name: string; value: number }>
  roleDistribution: Array<{ name: string; value: number }>
  recentActivities: Array<{
    id: string
    user: string
    type: string
    target: string
    time: string
    ip: string
    avatar: string
  }>
  quickLinks: Array<{
    id: string
    title: string
    icon: string
    path: string
    color: string
    description: string
  }>
}

// 获取首页统计数据
export function getHomeStats(): Promise<HomeStatsResponse> {
  return request.get('/api/home/stats')
}

// 获取数据更新（增量更新）
export function getHomeStatsUpdate(): Promise<Partial<HomeStatsResponse>> {
  return request.get('/api/home/stats/update')
}
```

### 2. 更新首页数据逻辑
修改 `src/pages/home/index.vue`：

```typescript
// 1. 导入API
import { getHomeStats, getHomeStatsUpdate } from '@/api/home'

// 2. 替换初始化函数
const initData = async () => {
  loading.value = true
  
  try {
    // 调用真实API获取数据
    const response = await getHomeStats()
    
    // 转换数据格式（如果需要）
    statsData.value = {
      userGrowth: {
        title: '用户增长趋势',
        data: response.userGrowth
      },
      accessTrend: {
        title: '系统访问趋势',
        data: response.accessTrend
      },
      deptDistribution: {
        title: '部门人员分布',
        data: response.deptDistribution
      },
      dataStatus: {
        title: '数据状态分布',
        data: response.dataStatus
      },
      roleDistribution: {
        title: '角色分布',
        data: response.roleDistribution
      },
      recentActivities: response.recentActivities,
      quickLinks: response.quickLinks
    }
    
  } catch (error) {
    console.error('获取首页数据失败:', error)
    
    // 降级：使用模拟数据
    statsData.value = initialStatsData
    
    // 显示友好提示
    ElMessage.warning('数据加载失败，显示模拟数据')
    
  } finally {
    loading.value = false
    
    // 隐藏骨架屏，显示内容
    setTimeout(() => {
      initialLoading.value = false
      setTimeout(() => {
        showContent.value = true
      }, 50)
    }, 300)
  }
}

// 3. 替换定时更新函数
const startAutoUpdate = () => {
  const interval = 30000 // 30秒更新一次
  
  updateInterval.value = setInterval(async () => {
    try {
      const response = await getHomeStatsUpdate()
      
      // 合并更新数据
      if (response.userGrowth) {
        statsData.value.userGrowth.data = response.userGrowth
      }
      if (response.accessTrend) {
        statsData.value.accessTrend.data = response.accessTrend
      }
      // ... 其他数据更新
      
    } catch (error) {
      console.error('更新数据失败:', error)
    }
  }, interval)
}
```

### 3. 配置环境变量
在 `.env` 文件中：

```env
# 开发环境 - 使用模拟数据
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_DATA=true

# 生产环境 - 使用真实API
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_USE_MOCK_DATA=false
```

## 📊 数据结构映射

### 后端API响应示例
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userGrowth": [
      {"date": "2026-04-01", "userCount": 120},
      {"date": "2026-04-02", "userCount": 135}
    ],
    "accessTrend": [
      {"time": "08:00", "accessCount": 45},
      {"time": "10:00", "accessCount": 120}
    ],
    "deptDistribution": [
      {"deptName": "技术部", "employeeCount": 45},
      {"deptName": "市场部", "employeeCount": 30}
    ],
    "roleDistribution": [
      {"roleName": "普通用户", "userCount": 85},
      {"roleName": "管理员", "userCount": 3}
    ],
    "recentActivities": [
      {
        "id": "1",
        "username": "张三",
        "actionType": "login",
        "target": "系统登录",
        "actionTime": "2026-04-13T12:00:00Z",
        "ipAddress": "192.168.1.100",
        "avatar": "/avatars/default.jpg"
      }
    ],
    "quickLinks": [
      {
        "id": "user",
        "name": "用户管理",
        "icon": "User",
        "route": "/system/user",
        "color": "#409EFF",
        "desc": "管理系统用户"
      }
    ]
  }
}
```

### 数据适配函数
创建 `src/pages/home/utils/dataAdapter.ts`：

```typescript
// 后端数据 -> 前端数据适配
export function adaptBackendData(backendData: any) {
  return {
    userGrowth: {
      title: '用户增长趋势',
      data: backendData.userGrowth?.map((item: any) => ({
        date: formatDate(item.date), // 格式化日期
        count: item.userCount || item.count
      })) || []
    },
    accessTrend: {
      title: '系统访问趋势',
      data: backendData.accessTrend?.map((item: any) => ({
        date: item.time,
        count: item.accessCount || item.count
      })) || []
    },
    deptDistribution: {
      title: '部门人员分布',
      data: backendData.deptDistribution?.map((item: any) => ({
        name: item.deptName || item.name,
        value: item.employeeCount || item.value
      })) || []
    },
    roleDistribution: {
      title: '角色分布',
      data: backendData.roleDistribution?.map((item: any) => ({
        name: item.roleName || item.name,
        value: item.userCount || item.value
      })) || []
    },
    recentActivities: backendData.recentActivities?.map((item: any) => ({
      id: item.id,
      user: item.username || item.user,
      type: item.actionType || item.type,
      target: item.target,
      time: item.actionTime || item.time,
      ip: item.ipAddress || item.ip,
      avatar: item.avatar
    })) || [],
    quickLinks: backendData.quickLinks?.map((item: any) => ({
      id: item.id,
      title: item.name || item.title,
      icon: item.icon,
      path: item.route || item.path,
      color: item.color,
      description: item.desc || item.description
    })) || []
  }
}

// 日期格式化
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}
```

## 🔧 配置管理

### 创建配置文件
`src/config/home.ts`：

```typescript
// 首页配置
export const HOME_CONFIG = {
  // 数据源配置
  dataSource: {
    // 是否使用API（环境变量控制）
    useApi: import.meta.env.VITE_USE_MOCK_DATA === 'false',
    
    // API配置
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL + '/home',
      timeout: 10000,
      retry: {
        count: 3,
        delay: 1000
      }
    },
    
    // 模拟数据配置
    mock: {
      enabled: import.meta.env.VITE_USE_MOCK_DATA === 'true',
      delay: 800 // 模拟延迟
    }
  },
  
  // 更新配置
  update: {
    enabled: true,
    interval: 30000, // 30秒
    useWebSocket: false // 是否使用WebSocket
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    duration: 5 * 60 * 1000, // 5分钟
    key: 'home_stats_cache'
  },
  
  // 错误处理
  error: {
    showMessage: true,
    fallbackToMock: true,
    logToConsole: true
  }
}
```

### 使用配置
```typescript
import { HOME_CONFIG } from '@/config/home'

const initData = async () => {
  loading.value = true
  
  if (HOME_CONFIG.dataSource.useApi) {
    // 使用API数据
    await loadFromApi()
  } else {
    // 使用模拟数据
    await loadFromMock()
  }
  
  loading.value = false
}
```

## 🚀 渐进式集成策略

### 阶段1：并行运行（开发阶段）
```typescript
// 同时支持API和模拟数据
const loadData = async () => {
  // 尝试API
  try {
    const apiData = await getHomeStats()
    return adaptBackendData(apiData)
  } catch (error) {
    // API失败时使用模拟数据
    console.warn('API失败，使用模拟数据:', error)
    return initialStatsData
  }
}
```

### 阶段2：环境切换（测试阶段）
```typescript
// 根据环境变量切换
const useRealData = import.meta.env.VITE_USE_REAL_DATA === 'true'

const loadData = async () => {
  if (useRealData) {
    return await loadFromApi()
  } else {
    return initialStatsData
  }
}
```

### 阶段3：完全集成（生产阶段）
```typescript
// 只使用API，添加完善的错误处理
const loadData = async () => {
  try {
    const data = await getHomeStats()
    return adaptBackendData(data)
  } catch (error) {
    // 记录错误并显示友好界面
    console.error('数据加载失败:', error)
    showErrorState()
    throw error
  }
}
```

## 🔌 WebSocket实时更新（可选）

### 1. 创建WebSocket服务
```typescript
// src/utils/websocket.ts
class HomeWebSocket {
  private ws: WebSocket | null = null
  
  connect(url: string) {
    this.ws = new WebSocket(url)
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
    
    this.ws.onclose = () => {
      console.log('WebSocket连接关闭')
      // 尝试重连
      setTimeout(() => this.connect(url), 5000)
    }
  }
  
  private handleMessage(data: any) {
    // 处理实时数据更新
    if (data.type === 'stats_update') {
      // 触发数据更新事件
      window.dispatchEvent(new CustomEvent('home-stats-update', {
        detail: data.payload
      }))
    }
  }
  
  disconnect() {
    this.ws?.close()
  }
}

export const homeWebSocket = new HomeWebSocket()
```

### 2. 在首页中使用
```typescript
import { homeWebSocket } from '@/utils/websocket'

onMounted(() => {
  // 连接WebSocket
  if (HOME_CONFIG.update.useWebSocket) {
    homeWebSocket.connect('ws://localhost:3000/ws/home')
    
    // 监听更新事件
    window.addEventListener('home-stats-update', (event: any) => {
      const newData = event.detail
      // 更新页面数据
      updateStatsData(newData)
    })
  }
})

onUnmounted(() => {
  // 断开连接
  homeWebSocket.disconnect()
  window.removeEventListener('home-stats-update')
})
```

## 📱 移动端优化

### 1. 减少数据量
```typescript
// 根据设备类型调整数据量
const isMobile = window.innerWidth < 768

const getHomeStats = async () => {
  const params = isMobile ? { limit: 5 } : {} // 移动端减少数据量
  return request.get('/api/home/stats', { params })
}
```

### 2. 懒加载图表
```vue
<!-- 移动端延迟加载图表 -->
<template>
  <div v-if="!isMobile || chartLoaded">
    <ChartCard :options="chartOptions" />
  </div>
</template>

<script setup>
const isMobile = ref(window.innerWidth < 768)
const chartLoaded = ref(false)

onMounted(() => {
  if (isMobile.value) {
    // 移动端延迟加载图表
    setTimeout(() => {
      chartLoaded.value = true
    }, 1000)
  } else {
    chartLoaded.value = true
  }
})
</script>
```

## 🧪 测试策略

### 1. API模拟测试
```typescript
// 测试环境使用MSW模拟API
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('/api/home/stats', (req, res, ctx) => {
    return res(
      ctx.json({
        userGrowth: [...],
        accessTrend: [...]
      })
    )
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())
```

### 2. 数据适配测试
```typescript
test('adaptBackendData should transform API response', () => {
  const apiResponse = {
    userGrowth: [{ date: '2026-04-01', userCount: 120 }]
  }
  
  const result = adaptBackendData(apiResponse)
  
  expect(result.userGrowth.data[0].date).toBe('04-01')
  expect(result.userGrowth.data[0].count).toBe(120)
})
```

### 3. 错误处理测试
```typescript
test('should fallback to mock data when API fails', async () => {
  // 模拟API失败
  vi.spyOn(api, 'getHomeStats').mockRejectedValue(new Error('Network error'))
  
  await initData()
  
  // 应该使用模拟数据
  expect(statsData.value).toEqual(initialStatsData)
})
```

## 📈 性能监控

### 添加性能标记
```typescript
const initData = async () => {
  const startTime = performance.now()
  
  try {
    await loadData()
  } finally {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // 发送到监控系统
    if (window.analytics) {
      window.analytics.track('home_data_load', {
        duration,
        dataSource: HOME_CONFIG.dataSource.useApi ? 'api' : 'mock',
        success: true
      })
    }
    
    // 控制台日志（开发环境）
    if (import.meta.env.DEV) {
      console.log(`首页数据加载耗时: ${duration.toFixed(2)}ms`)
    }
  }
}
```

### 监控指标
- 数据加载时间
- API成功率
- 缓存命中率
- 用户交互延迟

## 🆘 故障排除

### 常见问题

#### 1. CORS跨域问题
```javascript
// 后端需要配置CORS
app.use(cors({
  origin: ['http://localhost:5173'], // 前端地址
  credentials: true
}))
```

#### 2. 数据格式不匹配
- 使用数据适配器统一格式
- 添加数据验证
- 提供默认值

#### 3. API响应慢
- 添加加载状态
- 实现数据缓存
- 考虑分页加载

#### 4. 内存泄漏
- 及时清理定时器
- 断开WebSocket连接
- 移除事件监听器

### 调试工具
```typescript
// 开发调试工具
if (import.meta.env.DEV) {
  // 在控制台暴露调试方法
  window.debugHome = {
    reloadData: () => initData(),
    toggleDataSource: () => {
      HOME_CONFIG.dataSource.useApi = !HOME_CONFIG.dataSource.useApi
      initData()
    },
    getCurrentData: () => statsData.value,
    simulateError: () => {
      throw new Error('模拟错误')
    }
  }
}
```

## 📋 检查清单

### 集成前检查
- [ ] API接口文档已确认
- [ ] 数据格式已适配
- [ ] 错误处理已实现
- [ ] 降级方案已准备
- [ ] 测试用例已编写

### 集成后验证
- [ ] 数据正确显示
- [ ] 错误处理正常工作
- [ ] 性能符合要求
- [ ] 移动端适配良好
- [ ] 监控数据正常上报

---
 

*按照本指南步骤操作，可以平稳地将模拟数据迁移到真实API数据源。*