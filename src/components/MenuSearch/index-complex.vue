<template>
  <div class="menu-search" ref="searchWrapperRef">
    <!-- 搜索按钮/输入框 -->
    <div class="search-container" :class="{ expanded: isExpanded }">
      <!-- 搜索按钮（折叠状态） -->
      <el-tooltip
        v-if="!isExpanded"
        content="搜索菜单"
        placement="bottom"
        :show-after="500"
      >
        <el-button
          class="search-btn"
          type="primary"
          plain
          size="small"
          :circle="true"
          @click.stop="expandSearch"
        >
          <el-icon :size="16">
            <Search />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 搜索输入框（展开状态） -->
      <div v-else class="search-input-wrapper" @click.stop>
        <el-input
          ref="searchInputRef"
          v-model="searchQuery"
          class="search-input"
          placeholder="搜索菜单..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          @clear="clearSearch"
          @keydown.esc="collapseSearch"
          @keydown.enter="handleEnter"
          @click.stop
        >
          <template #suffix>
            <el-icon
              class="search-close"
              @click.stop="collapseSearch"
            >
              <Close />
            </el-icon>
          </template>
        </el-input>

        <!-- 搜索结果下拉框 -->
        <div
          v-if="showResults && filteredMenus.length > 0"
          class="search-results"
          :style="{ width: resultsWidth }"
          @click.stop
        >
          <div class="results-header">
            <span class="results-title">搜索结果</span>
            <span class="results-count">{{ filteredMenus.length }} 个匹配项</span>
          </div>
          
          <div class="results-list">
            <div
              v-for="(item, index) in filteredMenus"
              :key="item.id"
              class="result-item"
              :class="{ active: activeIndex === index }"
              @click.stop="handleMenuClick(item)"
              @mouseenter="activeIndex = index"
            >
              <div class="result-icon">
                <el-icon v-if="item.icon">
                  <component :is="item.icon" />
                </el-icon>
                <el-icon v-else>
                  <Link />
                </el-icon>
              </div>
              
              <div class="result-content">
                <div class="result-title">
                  <span class="title-text">{{ item.title }}</span>
                  <el-tag
                    v-if="item.type === 'external'"
                    size="small"
                    type="info"
                    class="external-tag"
                  >
                    外部
                  </el-tag>
                </div>
                
                <div class="result-path">
                  <el-text type="info" size="small" truncated>
                    {{ item.path }}
                  </el-text>
                </div>
                
                <div v-if="item.parentTitle" class="result-parent">
                  <el-text type="info" size="small">
                    位于: {{ item.parentTitle }}
                  </el-text>
                </div>
              </div>
              
              <div class="result-action">
                <el-icon>
                  <Right />
                </el-icon>
              </div>
            </div>
          </div>
          
          <div class="results-footer">
            <el-text type="info" size="small">
              使用 ↑↓ 键导航，Enter 键选择，Esc 键关闭
            </el-text>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div
          v-else-if="showResults && searchQuery && filteredMenus.length === 0"
          class="no-results"
          :style="{ width: resultsWidth }"
          @click.stop
        >
          <el-empty
            description="未找到匹配的菜单"
            :image-size="60"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/modules/theme'
import { Search, Close, Link, Right } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

// 路由
const router = useRouter()

// Store
const userStore = useUserStore()
const themeStore = useThemeStore()

// 响应式数据
const isExpanded = ref(false)
const searchQuery = ref('')
const showResults = ref(false)
const activeIndex = ref(-1)
const searchInputRef = ref<InstanceType<typeof ElInput>>()
const searchWrapperRef = ref<HTMLElement>()

// 计算属性
const resultsWidth = computed(() => {
  return '320px'
})

// 扁平化菜单数据（用于搜索）
const flattenMenus = computed(() => {
  const result: any[] = []
  
  const flatten = (menus: any[], parentTitle?: string) => {
    menus.forEach(menu => {
      if (menu.hidden || menu.type !== 'menu') return
      
      // 添加当前菜单
      result.push({
        ...menu,
        parentTitle,
        fullPath: menu.path
      })
      
      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        flatten(menu.children, menu.title)
      }
    })
  }
  
  flatten(userStore.menus || [])
  return result
})

// 过滤菜单
const filteredMenus = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  return flattenMenus.value.filter(menu => {
    // 搜索标题和路径
    return (
      menu.title?.toLowerCase().includes(query) ||
      menu.path?.toLowerCase().includes(query)
    )
  }).slice(0, 10) // 限制最多显示10个结果
})

// 展开搜索
const expandSearch = () => {
  console.log('展开搜索')
  isExpanded.value = true
  showResults.value = false
  activeIndex.value = -1
  
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// 折叠搜索
const collapseSearch = () => {
  console.log('折叠搜索')
  isExpanded.value = false
  searchQuery.value = ''
  showResults.value = false
  activeIndex.value = -1
}

// 处理搜索输入
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    showResults.value = true
    activeIndex.value = 0 // 默认选中第一个
  } else {
    showResults.value = false
    activeIndex.value = -1
  }
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
  activeIndex.value = -1
}

// 处理回车键
const handleEnter = () => {
  if (activeIndex.value >= 0 && filteredMenus.value[activeIndex.value]) {
    handleMenuClick(filteredMenus.value[activeIndex.value])
  }
}

// 处理菜单点击
const handleMenuClick = (menu: any) => {
  console.log('点击菜单:', menu)
  if (menu.external) {
    // 外部链接
    if (menu.target === '_blank') {
      window.open(menu.path, '_blank')
    } else {
      window.location.href = menu.path
    }
  } else {
    // 内部路由
    router.push(menu.path)
  }
  
  // 关闭搜索
  collapseSearch()
}

// 键盘导航
const handleKeyDown = (event: KeyboardEvent) => {
  if (!isExpanded.value || !showResults.value) return
  
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      if (activeIndex.value > 0) {
        activeIndex.value--
      } else {
        activeIndex.value = filteredMenus.value.length - 1
      }
      break
      
    case 'ArrowDown':
      event.preventDefault()
      if (activeIndex.value < filteredMenus.value.length - 1) {
        activeIndex.value++
      } else {
        activeIndex.value = 0
      }
      break
      
    case 'Escape':
      event.preventDefault()
      collapseSearch()
      break
      
    case 'F2':
      event.preventDefault()
      if (!isExpanded.value) {
        expandSearch()
      }
      break
  }
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (!isExpanded.value || !searchWrapperRef.value) return
  
  const target = event.target as HTMLElement
  
  // 如果点击在组件外部，关闭搜索
  if (!searchWrapperRef.value.contains(target)) {
    collapseSearch()
  }
}

// 生命周期
onMounted(() => {
  console.log('菜单搜索组件已挂载')
  document.addEventListener('keydown', handleKeyDown)
  // 使用 setTimeout 延迟添加点击事件，避免立即触发
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 100)
})

onUnmounted(() => {
  console.log('菜单搜索组件已卸载')
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.menu-search {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}

.search-container {
  position: relative;
  transition: all 0.3s ease;
  
  &.expanded {
    width: 320px;
  }
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  :deep(.el-input__wrapper) {
    border-radius: 20px;
    padding-left: 16px;
    padding-right: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:focus-within {
      box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.2);
    }
  }
  
  :deep(.el-input__inner) {
    padding-left: 8px;
  }
}

.search-close {
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--el-color-primary);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 9999;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--el-border-color);
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-fill-color-light);
}

.results-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.results-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--el-border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: var(--el-fill-color-light);
  }
  
  &.active {
    background: var(--el-fill-color);
  }
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.title-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-tag {
  flex-shrink: 0;
}

.result-path {
  margin-bottom: 2px;
}

.result-parent {
  font-size: 12px;
}

.result-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.results-footer {
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-fill-color-lighter);
  text-align: center;
}

.no-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 9999;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--el-border-color);
  padding: 24px;
  animation: slideDown 0.3s ease;
}

.search-hint {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 暗黑模式适配
:global(.dark) {
  .search-results,
  .no-results {
    background: var(--el-bg-color);
    border-color: var(--el-border-color);
  }
  
  .results-header {
    background: var(--el-fill-color-darker);
  }
  
  .result-item:hover,
  .result-item.active {
    background: var(--el-fill-color-darker);
  }
  
  .result-icon {
    background: var(--el-fill-color-darker);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-container.expanded {
    width: 280px;
  }
  
  .search-results,
  .no-results {
    width: 280px !important;
  }
}

@media (max-width: 480px) {
  .search-container.expanded {
    width: 240px;
  }
  
  .search-results,
  .no-results {
    width: 240px !important;
  }
  
  .result-item {
    padding: 10px 12px;
  }
}
</style>