<template>
  <div class="menu-search-simple">
    <!-- 搜索按钮 -->
    <el-tooltip content="搜索菜单 (F2)" placement="bottom" :show-after="300">
      <el-icon :size="16" :style="iconColorStyle" class="search-btn-wrapper search-icon" @click="openSearchDialog">
        <Search />
      </el-icon>
    </el-tooltip>
    <!-- 搜索弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="搜索菜单"
      width="500px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="menu-search-dialog"
      @close="handleDialogClose"
    >
      <div class="search-container">
        <el-input
          ref="searchInputRef"
          v-model="searchQuery"
          placeholder="输入菜单名称搜索...（支持快捷键 F2 打开）"
          :prefix-icon="Search"
          clearable
          size="large"
          @input="handleSearch"
          @clear="clearSearch"
          @keydown.enter="handleEnter"
        />
        
        <!-- 搜索结果 -->
        <div v-if="showResults && filteredMenus.length > 0" class="results-container">
          <div class="results-header">
            <span>搜索结果（共 {{ filteredMenus.length }} 项）</span>
            <span class="shortcut-hint">↑↓ 切换 | Enter 跳转</span>
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
              <div class="result-action">
                <el-button size="small" text type="primary">跳转</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无结果 -->
        <div v-else-if="showResults && searchQuery && filteredMenus.length === 0" class="no-results">
          <el-empty description="未找到匹配的菜单" :image-size="60" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/modules/theme'
import { Search } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 状态
const dialogVisible = ref(false)
const searchQuery = ref('')
const showResults = ref(false)
const activeIndex = ref(-1)
const searchInputRef = ref<InstanceType<typeof ElInput>>()
// 动态计算图标颜色（响应主题变化）
const iconColorStyle = computed(() => {
  if (themeStore.isDarkMode) {
    return { color: '#f0f2f5' }  // 深色模式：亮白色
  }
  return { color: '#1f2d3d' }     // 浅色模式：深灰色
})
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
  )
})

// 打开搜索弹窗
const openSearchDialog = () => {
  dialogVisible.value = true
  searchQuery.value = ''
  showResults.value = false
  activeIndex.value = -1
  nextTick(() => {
    searchInputRef.value&&searchInputRef.value.focus()
  })
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
  searchQuery.value = ''
  showResults.value = false
  activeIndex.value = -1
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
  handleDialogClose()
}

// 键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  // F2 打开搜索
  if (e.key === 'F2') {
    e.preventDefault()
    if (!dialogVisible.value) {
      openSearchDialog()
    }
  }
  
  if (!dialogVisible.value || !showResults.value) return
  
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
      handleDialogClose()
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
@use './index.scss';
</style>