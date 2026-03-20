<template>
  <div class="cache-demo">
    <div class="demo-header">
      <h1>🔄 路由缓存演示</h1>
      <p class="demo-subtitle">体验 Vue Router 的 keep-alive 缓存功能</p>
    </div>
    
    <div class="demo-content">
      <!-- 缓存状态显示 -->
      <div class="cache-status">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <span>📊 缓存状态</span>
              <el-tag :type="cacheEnabled ? 'success' : 'info'">
                {{ cacheEnabled ? '已启用' : '已禁用' }}
              </el-tag>
            </div>
          </template>
          
          <div class="status-info">
            <div class="info-item">
              <span class="info-label">当前页面名称:</span>
              <span class="info-value">{{ componentName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">是否在缓存中:</span>
              <el-tag :type="isCached ? 'success' : 'warning'">
                {{ isCached ? '是' : '否' }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">缓存页面数量:</span>
              <span class="info-value">{{ cachedCount }}/{{ maxCacheCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">页面访问次数:</span>
              <span class="info-value">{{ visitCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">最后访问时间:</span>
              <span class="info-value">{{ lastVisitTime }}</span>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 缓存控制 -->
      <div class="cache-control">
        <el-card class="control-card">
          <template #header>
            <div class="card-header">
              <span>🎮 缓存控制</span>
            </div>
          </template>
          
          <div class="control-buttons">
            <el-button 
              type="primary" 
              @click="refreshData"
              :loading="loading"
            >
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
            
            <el-button 
              type="success" 
              @click="toggleCache"
            >
              <el-icon><Switch /></el-icon>
              {{ cacheEnabled ? '禁用缓存' : '启用缓存' }}
            </el-button>
            
            <el-button 
              type="warning" 
              @click="clearCache"
            >
              <el-icon><Delete /></el-icon>
              清除缓存
            </el-button>
            
            <el-button 
              type="info" 
              @click="goToOtherPage"
            >
              <el-icon><Link /></el-icon>
              跳转到其他页面
            </el-button>
          </div>
          
          <div class="cache-tips">
            <el-alert title="缓存提示" type="info" :closable="false">
              <template #default>
                <ul>
                  <li>启用缓存后，页面切换时数据会被保留</li>
                  <li>刷新数据按钮会重新获取模拟数据</li>
                  <li>跳转到其他页面再返回，可以测试缓存效果</li>
                  <li>清除缓存会移除所有已缓存的页面</li>
                </ul>
              </template>
            </el-alert>
          </div>
        </el-card>
      </div>
      
      <!-- 模拟数据展示 -->
      <div class="data-display">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>📈 模拟数据</span>
              <el-text type="info">(数据变化会展示缓存效果)</el-text>
            </div>
          </template>
          
          <div class="data-content">
            <div class="data-list">
              <div v-for="item in dataList" :key="item.id" class="data-item">
                <div class="item-header">
                  <span class="item-title">{{ item.title }}</span>
                  <el-tag size="small" :type="item.type">
                    {{ item.type }}
                  </el-tag>
                </div>
                <div class="item-content">
                  <p>{{ item.content }}</p>
                </div>
                <div class="item-footer">
                  <span class="item-time">{{ item.time }}</span>
                  <span class="item-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
            
            <div class="data-stats">
              <el-descriptions title="数据统计" :column="2" border>
                <el-descriptions-item label="数据总数">
                  {{ dataList.length }}
                </el-descriptions-item>
                <el-descriptions-item label="最后更新时间">
                  {{ dataUpdateTime }}
                </el-descriptions-item>
                <el-descriptions-item label="数据状态">
                  <el-tag :type="dataStatus.type">
                    {{ dataStatus.text }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="缓存状态">
                  <el-tag :type="cacheStatus.type">
                    {{ cacheStatus.text }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 缓存原理说明 -->
      <div class="cache-explanation">
        <el-card class="explanation-card">
          <template #header>
            <div class="card-header">
              <span>📚 缓存原理</span>
            </div>
          </template>
          
          <div class="explanation-content">
            <h3>Vue Router + keep-alive 缓存机制</h3>
            
            <div class="principle-list">
              <div class="principle-item">
                <div class="principle-icon">🔒</div>
                <div class="principle-content">
                  <h4>组件缓存</h4>
                  <p>使用 Vue 的 <code>keep-alive</code> 组件包裹 <code>router-view</code>，当路由切换时，组件实例会被缓存而不是销毁。</p>
                </div>
              </div>
              
              <div class="principle-item">
                <div class="principle-icon">⚡</div>
                <div class="principle-content">
                  <h4>性能优化</h4>
                  <p>避免重复渲染和重新请求数据，提升页面切换的流畅度，特别适合数据量大的后台管理系统。</p>
                </div>
              </div>
              
              <div class="principle-item">
                <div class="principle-icon">🔄</div>
                <div class="principle-content">
                  <h4>生命周期</h4>
                  <p>缓存的组件会触发 <code>activated</code> 和 <code>deactivated</code> 生命周期钩子，而不是 <code>created</code> 和 <code>destroyed</code>。</p>
                </div>
              </div>
              
              <div class="principle-item">
                <div class="principle-icon">🎯</div>
                <div class="principle-content">
                  <h4>智能管理</h4>
                  <p>支持按需缓存、最大缓存数量限制、手动刷新缓存等高级功能，避免内存泄漏。</p>
                </div>
              </div>
            </div>
            
            <div class="code-example">
              <h4>代码示例：</h4>
              <pre><code>&lt;!-- 路由缓存组件 --&gt;
&lt;router-view v-slot="{ Component }"&gt;
  &lt;keep-alive :include="cachedRoutes"&gt;
    &lt;component :is="Component" /&gt;
  &lt;/keep-alive&gt;
&lt;/router-view&gt;</code></pre>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/modules/theme'
import { Refresh, Switch, Delete, Link } from '@element-plus/icons-vue'

const router = useRouter()
const themeStore = useThemeStore()

// 组件状态
const componentName = ref('CacheDemo')
const visitCount = ref(0)
const lastVisitTime = ref('')
const loading = ref(false)
const dataList = ref<any[]>([])

// 模拟数据生成
const generateMockData = () => {
  const types = ['success', 'warning', 'info', 'danger']
  const titles = ['用户数据', '订单统计', '系统日志', '性能监控', '业务报表']
  const contents = [
    '这是一条模拟数据，用于演示路由缓存效果。',
    '当页面被缓存时，这些数据会被保留。',
    '刷新页面会重新生成随机数据。',
    '跳转到其他页面再返回，可以看到缓存效果。',
    '数据变化会直观展示缓存的作用。'
  ]
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: Date.now() + i,
    title: titles[i % titles.length],
    type: types[i % types.length],
    content: contents[i % contents.length],
    time: new Date().toLocaleTimeString(),
    value: `$${Math.floor(Math.random() * 1000)}`
  }))
}

// 初始化数据
const initData = () => {
  dataList.value = generateMockData()
  visitCount.value++
  lastVisitTime.value = new Date().toLocaleTimeString()
}

// 刷新数据
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    dataList.value = generateMockData()
    loading.value = false
  }, 500)
}

// 缓存状态
const cacheEnabled = computed(() => themeStore.enableRouteCache)
const maxCacheCount = computed(() => themeStore.maxCacheCount)
const cachedCount = computed(() => {
  // 这里应该从路由缓存组件获取实际缓存数量
  // 为了演示，我们使用一个模拟值
  return Math.min(visitCount.value, maxCacheCount.value)
})

const isCached = computed(() => {
  // 模拟检查当前页面是否在缓存中
  return cacheEnabled.value && visitCount.value > 1
})

const dataUpdateTime = computed(() => {
  return new Date().toLocaleTimeString()
})

const dataStatus = computed(() => {
  return {
    type: 'success',
    text: '数据已加载'
  }
})

const cacheStatus = computed(() => {
  return {
    type: isCached.value ? 'success' : 'warning',
    text: isCached.value ? '页面已缓存' : '页面未缓存'
  }
})

// 缓存控制
const toggleCache = () => {
  themeStore.setRouteCache(!cacheEnabled.value)
}

const clearCache = () => {
  // 这里应该调用路由缓存组件的清除缓存方法
  visitCount.value = 0
  initData()
}

const goToOtherPage = () => {
  router.push('/home')
}

// 生命周期钩子
onMounted(() => {
  console.log('CacheDemo mounted')
  initData()
})

onActivated(() => {
  console.log('CacheDemo activated - 从缓存中恢复')
})

onDeactivated(() => {
  console.log('CacheDemo deactivated - 进入缓存')
})
</script>

<style lang="scss" scoped>
.cache-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: var(--el-text-color-primary);
    margin-bottom: 10px;
    font-size: 2em;
  }
  
  .demo-subtitle {
    color: var(--el-text-color-secondary);
    font-size: 1.1em;
  }
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cache-status,
.cache-control,
.data-display,
.cache-explanation {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.info-value {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.cache-tips {
  margin-top: 20px;
}

.data-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.data-item {
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-fill-color-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.item-content {
  margin-bottom: 10px;
  
  p {
    margin: 0;
    color: var(--el-text-color-regular);
    line-height: 1.5;
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.item-value {
  font-weight: 600;
  color: var(--el-color-primary);
}

.data-stats {
  margin-top: 20px;
}

.explanation-content {
  h3 {
    color: var(--el-text-color-primary);
    margin-bottom: 20px;
  }
}

.principle-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.principle-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
}

.principle-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.principle-content {
  h4 {
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
  }
  
  p {
    margin: 0;
    color: var(--el-text-color-regular);
    line-height: 1.5;
    font-size: 14px;
  }
}

.code-example {
  background: var(--el-fill-color-dark);
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  
  h4 {
    margin: 0 0 10px 0;
    color: var(--el-text-color-primary);
  }
  
  pre {
    margin: 0;
    overflow-x: auto;
    
    code {
      color: var(--el-text-color-primary);
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .data-list {
    grid-template-columns: 1fr;
  }
  
  .principle-list {
    grid-template-columns: 1fr;
  }
  
  .control-buttons {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>