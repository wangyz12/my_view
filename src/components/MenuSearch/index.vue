<template>
  <div class="menu-search-simplest">
    <!-- 始终显示搜索输入框，但可以控制宽度 -->
    <div class="search-container" :class="{ expanded: isExpanded }">
      <!-- 搜索按钮（折叠状态） -->
      <el-button
        v-if="!isExpanded"
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

      <!-- 搜索输入框（展开状态） -->
      <div v-else class="search-input-wrapper">
        <el-input
          ref="searchInputRef"
          v-model="searchQuery"
          class="search-input"
          placeholder="搜索菜单..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          @clear="clearSearch"
          @keydown.esc="toggleSearch"
          @keydown.enter="handleEnter"
        >
          <template #suffix>
            <el-icon class="search-close" @click="toggleSearch">
              <Close />
            </el-icon>
          </template>
        </el-input>

        <!-- 搜索结果 -->
        <div v-if="showResults && filteredMenus.length > 0" class="search-results">
          <div class="results-list">
            <div
              v-for="(item, index) in filteredMenus"
              :key="item.id"
              class="result-item"
              @click="handleMenuClick(item)"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { Search, Close, Link } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 状态 - 默认展开，这样更容易测试
const isExpanded = ref(false)
const searchQuery = ref('')
const showResults = ref(false)
const searchInputRef = ref<InstanceType<typeof ElInput>>()

// 扁平化菜单
const flattenMenus = computed(() => {
  const result: any[] = []
  
  const flatten = (menus: any[]) => {
    menus.forEach(menu => {
      if (menu.hidden || menu.type !== 'menu') return
      result.push(menu)
      if (menu.children) flatten(menu.children)
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
  ).slice(0, 5)
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
  }
}

// 处理搜索
const handleSearch = () => {
  showResults.value = searchQuery.value.trim().length > 0
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
}

// 回车键
const handleEnter = () => {
  if (filteredMenus.value.length > 0) {
    handleMenuClick(filteredMenus.value[0])
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
</script>

<style lang="scss" scoped>
.menu-search-simplest {
  position: relative;
}

.search-container {
  transition: all 0.3s ease;
  
  &.expanded {
    width: 250px;
  }
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

.search-input-wrapper {
  position: relative;
  width: 100%;
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
  max-height: 300px;
  overflow-y: auto;
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
</style>