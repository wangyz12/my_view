<template>
  <div class="menu-search-simple">
    <!-- 搜索按钮 -->
    <el-tooltip
      v-if="!isExpanded"
      content="搜索菜单 (F2)"
      placement="bottom"
      :show-after="300"
    >
      <el-button
        class="search-btn"
        type="primary"
        plain
        size="small"
        :circle="true"
        @click="toggleSearch"
      >
        <el-icon :size="16">
          <Search />
        </el-icon>
      </el-button>
    </el-tooltip>

    <!-- 搜索框（展开时） -->
    <div v-else class="search-expanded">
      <div class="search-box">
        <el-input
          ref="searchInputRef"
          v-model="searchQuery"
          class="search-input"
          placeholder="输入菜单名称搜索..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          @clear="clearSearch"
          @keydown.esc="toggleSearch"
          @keydown.enter="handleEnter"
          @click.stop
        >
          <template #suffix>
            <el-icon
              class="search-close"
              @click="toggleSearch"
            >
              <Close />
            </el-icon>
          </template>
        </el-input>

        <!-- 搜索结果 -->
        <div
          v-if="showResults && filteredMenus.length > 0"
          class="search-results"
        >
          <div class="results-header">
            <span>↑↓键切换,Enter跳转,Esc退出</span>
          </div>
          <div class="results-list">
            <div
              v-for="(item, index) in filteredMenus"
              :key="item.id"
              class="result-item"
              :class="{ active: activeIndex === index }"
              @click="handleMenuClick(item)"
              @mouseenter="activeIndex = index"
            >
              <el-icon class="result-icon">
                <component :is="item.icon || 'Link'" />
              </el-icon>
              <div class="result-content">
                <div class="result-title">{{ item.title }}</div>
                <div class="result-path">{{ item.path }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果 -->
        <div
          v-else-if="showResults && searchQuery && filteredMenus.length === 0"
          class="no-results"
        >
          <el-empty description="未找到匹配的菜单" :image-size="50" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { Search, Close, Link } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 状态
const isExpanded = ref(false)
const searchQuery = ref('')
const showResults = ref(false)
const activeIndex = ref(-1)
const searchInputRef = ref<InstanceType<typeof ElInput>>()

// 扁平化菜单
const flattenMenus = computed(() => {
  const result: any[] = []
  
  const flatten = (menus: any[], parentTitle?: string) => {
    menus.forEach(menu => {
      if (menu.hidden || menu.type !== 'menu') return
      result.push({ ...menu, parentTitle })
      if (menu.children) flatten(menu.children, menu.title)
    })
  }
  
  flatten(userStore.menus || [])
  return result
})

// 过滤菜单
const filteredMenus = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase().trim()
  return flattenMenus.value.filter(menu => 
    menu.title?.toLowerCase().includes(query) ||
    menu.path?.toLowerCase().includes(query)
  ).slice(0, 8)
})

// 切换搜索
const toggleSearch = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    searchQuery.value = ''
    showResults.value = false
    activeIndex.value = -1
  }
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    showResults.value = true
    activeIndex.value = 0
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

// 回车键
const handleEnter = () => {
  if (activeIndex.value >= 0 && filteredMenus.value[activeIndex.value]) {
    handleMenuClick(filteredMenus.value[activeIndex.value])
  }
}

// 点击菜单
const handleMenuClick = (menu: any) => {
  if (menu.external) {
    window.open(menu.path, menu.target || '_blank')
  } else {
    router.push(menu.path)
  }
  toggleSearch()
}

// 键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'F2') {
    e.preventDefault()
    if (!isExpanded.value) {
      toggleSearch()
    }
  }
  
  if (!isExpanded.value || !showResults.value) return
  
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : filteredMenus.value.length - 1
      break
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = activeIndex.value < filteredMenus.value.length - 1 ? activeIndex.value + 1 : 0
      break
    case 'Escape':
      e.preventDefault()
      toggleSearch()
      break
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
.menu-search-simple {
  position: relative;
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.search-expanded {
  position: relative;
  width: 300px;
}

.search-box {
  position: relative;
}

.search-input {
  :deep(.el-input__wrapper) {
    border-radius: 20px;
    padding: 0 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:focus-within {
      box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.2);
    }
  }
}

.search-close {
  cursor: pointer;
  color: var(--el-text-color-secondary);
  
  &:hover {
    color: var(--el-color-primary);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--el-border-color);
  z-index: 9999;
  max-height: 400px;
  overflow-y: auto;
}

.results-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
  font-size: 14px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}

.results-list {
  padding: 8px 0;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--el-fill-color-light);
  }
  
  &.active {
    background: var(--el-fill-color);
  }
}

.result-icon {
  margin-right: 12px;
  color: var(--el-color-primary);
  font-size: 18px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-path {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--el-border-color);
  z-index: 9999;
  padding: 20px;
}

// 响应式
@media (max-width: 768px) {
  .search-expanded {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .search-expanded {
    width: 200px;
  }
}
</style>