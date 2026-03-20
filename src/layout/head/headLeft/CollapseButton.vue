<template>
  <div class="collapse-button-container">
    <!-- 明显的折叠按钮 -->
    <div 
      class="collapse-button flex items-center justify-center cursor-pointer transition-all duration-200"
      :class="[
        userStore.isCollapse ? 'collapsed' : 'expanded',
        themeStore.isDarkMode ? 'dark' : 'light'
      ]"
      @click="toggleCollapse"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <!-- 按钮主体 -->
      <div class="button-body relative">
        <!-- 图标 -->
        <el-icon class="icon" :size="20">
          <component :is="userStore.isCollapse ? Expand : Fold" />
        </el-icon>
        
        <!-- 文字提示（悬停时显示） -->
        <div 
          v-if="isHovering"
          class="tooltip absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50"
        >
          {{ userStore.isCollapse ? '展开菜单' : '折叠菜单' }}
        </div>
      </div>
      
    </div>
    
    <!-- 分隔线 -->
    <div class="divider h-6 w-px mx-3" :class="themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-300'"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/modules/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()
const isHovering = ref(false)

const toggleCollapse = () => {
  userStore.set_isCollapse(!userStore.isCollapse)
}
</script>

<style scoped>
.collapse-button-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.collapse-button {
  padding: 8px 12px;
  border-radius: 8px;
  user-select: none;
}

.collapse-button.light {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border: 1px solid #dcdfe6;
  color: #606266;
}

.collapse-button.light:hover {
  background: linear-gradient(135deg, #e4e7ed 0%, #d3d6dd 100%);
  border-color: #c0c4cc;
  color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collapse-button.light:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.collapse-button.dark {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border: 1px solid #4a5568;
  color: #cbd5e0;
}

.collapse-button.dark:hover {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border-color: #718096;
  color: #63b3ed;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.collapse-button.dark:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.collapse-button.collapsed .icon {
  animation: rotateIn 0.3s ease;
}

.collapse-button.expanded .icon {
  animation: rotateOut 0.3s ease;
}

@keyframes rotateIn {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

@keyframes rotateOut {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.tooltip {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-10px, -50%);
  }
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

.status-indicator {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.collapse-button:hover .status-indicator {
  opacity: 1;
}
</style>