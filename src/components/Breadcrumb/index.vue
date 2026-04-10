<template>
  <div class="tag-view  px-2 py-1">
    <!-- 标签页列表 -->
    <div class="tag-tabs">
      <div 
        v-for="tab in breadcrumbStore.getTabs" 
        :key="tab.path"
        class="tag-item"
        :class="{ active: breadcrumbStore.activeTabPath === tab.path }"
        @click="handleTabClick(tab)"
      >
        <!-- 图标 -->
        <el-icon v-if="tab.icon" :size="14">
          <component :is="tab.icon" />
        </el-icon>
        <!-- 标题 -->
        <span class="tag-title">{{ tab.title }}</span>
        <!-- 关闭按钮（首页不可关闭） -->
        <el-icon 
          v-if="tab.closable" 
          class="close-btn"
          size="12"
          @click.stop="handleCloseTab(tab)"
        >
          <Close />
        </el-icon>
      </div>
    </div>
    <!-- 右侧操作菜单 -->
    <el-dropdown class="tag-actions" @command="handleCommand">
      <el-button text>
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">
            <el-icon><CircleClose /></el-icon>
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeAll">
            <el-icon><FolderDelete /></el-icon>
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBreadcrumbStore, type TabItem } from '@/store/modules/breadcrumb'
import { useUserStore } from '@/store/modules/user'
import { getIconComponentName } from '@/utils/iconMapper'
import { Close, ArrowDown, CircleClose, FolderDelete } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const breadcrumbStore = useBreadcrumbStore()
const userStore = useUserStore()
// 检查用户是否有权限访问当前路由
const checkRoutePermission = () => {
  const { permission, roles }:any = route.meta
  
  // 如果路由不需要权限检查，直接返回true
  if (!permission && !roles) {
    return true
  }
  
  // 检查权限标识
  if (permission) {
    if (!userStore.hasPermission(permission)) {
      return false
    }
  }
  
  // 检查角色
  if (roles) {
    if (!userStore.hasRole(roles)) {
      return false
    }
  }
  
  return true
}

// 监听路由变化，自动添加标签页（有权限的页面才添加）
watch(
  () => route.path,
  (newPath) => {
    // 从路由的meta中获取标题和图标
    const { title, icon } = route.meta
    
    if (title) {
      // 检查用户是否有权限访问该页面
      const hasPermission = checkRoutePermission()
      
      if (hasPermission) {
        // 使用图标映射工具获取正确的图标名称
        const mappedIcon = getIconComponentName(icon as string)
        
        breadcrumbStore.addTab({
          path: newPath,
          title: title as string,
          icon: mappedIcon,
          name: route.name as string
        })
      } else {
        // 如果没有权限，不添加标签页
        console.warn(`用户没有权限访问页面: ${title}, 路径: ${newPath}`)
      }
    }
  },
  { immediate: true }
)

// 检查标签页对应的路由权限
const checkTabPermission = (tab: TabItem) => {
  // 这里需要根据标签页信息检查权限
  // 由于标签页只保存了路径和标题，我们需要找到对应的路由信息
  // 暂时假设所有已添加的标签页都是用户有权限访问的
  // 实际项目中可能需要更复杂的权限检查
  return true
}

// 点击标签页
const handleTabClick = (tab: TabItem) => {
  // 检查用户是否还有权限访问该标签页
  const hasPermission = checkTabPermission(tab)
  
  if (hasPermission) {
    breadcrumbStore.setActiveTab(tab.path)
    router.push(tab.path)
  } else {
    // 如果没有权限，关闭该标签页并跳转到首页
    breadcrumbStore.closeTab(tab.path)
    router.push('/home')
  }
}

// 关闭标签页
const handleCloseTab = (tab: TabItem) => {
  // 获取当前激活的标签页路径
  const currentActivePath = breadcrumbStore.activeTabPath
  
  // 关闭标签页
  breadcrumbStore.closeTab(tab.path)
  
  // 获取关闭后的标签页列表
  const remainingTabs = breadcrumbStore.getTabs.value
  
  // 如果关闭的是当前激活的标签页
  if (currentActivePath === tab.path) {
    if (remainingTabs&&remainingTabs.length > 0) {
      // 跳转到新的激活标签页（首页或其他）
      router.push(breadcrumbStore.activeTabPath)
    } else {
      // 如果没有标签页了，跳转到首页
      router.push('/home')
    }
  }
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'closeOthers':
      breadcrumbStore.closeOtherTabs(breadcrumbStore.activeTabPath)
      break
    case 'closeAll':
      breadcrumbStore.closeAllTabs()
      router.push('/home')
      break
  }
}
</script>

<style scoped lang="scss">
@use './index.scss'
</style>