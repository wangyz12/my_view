<template>
  <div class="collapse-button-container">
    <!-- 折叠按钮 -->
    <div 
      class="collapse-btn"
      :class="[
        themeStore.isDarkMode ? 'dark' : 'light',
        { 'is-collapsed': userStore.isCollapse }
      ]"
      @click="toggleCollapse"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <el-icon :size="18" class="btn-icon">
        <component :is="userStore.isCollapse ? Expand : Fold" />
      </el-icon>
      
      <!-- 悬停提示 -->
      <Transition name="tooltip">
        <div 
          v-if="isHovering"
          class="tooltip"
        >
          {{ userStore.isCollapse ? '展开菜单' : '折叠菜单' }}
        </div>
      </Transition>
    </div>
    
    <!-- 分隔线 -->
    <div class="divider" :class="themeStore.isDarkMode ? 'divider-dark' : 'divider-light'"></div>
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
  gap: 12px;
}

/* ========== 按钮基础样式 ========== */
.collapse-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

/* 图标样式 */
.btn-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 折叠状态图标旋转动画 */
.collapse-btn.is-collapsed .btn-icon {
  transform: rotate(0deg);
}

.collapse-btn:not(.is-collapsed) .btn-icon {
  transform: rotate(0deg);
}

/* ========== 亮色主题 ========== */
.collapse-btn.light {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  color: #5a6874;
}

.collapse-btn.light:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.collapse-btn.light:active {
  transform: translateY(0);
  background-color: #d9ecff;
}

/* ========== 暗色主题 ========== */
.collapse-btn.dark {
  background-color: #2d3748;
  border: 1px solid #4a5568;
  color: #a0aec0;
}

.collapse-btn.dark:hover {
  background-color: #3b4a5e;
  border-color: #63b3ed;
  color: #63b3ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.collapse-btn.dark:active {
  transform: translateY(0);
  background-color: #2d3748;
}

/* ========== 悬停提示 ========== */
.tooltip {
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 10px;
  background-color: #1f2937;
  color: #f3f4f6;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  pointer-events: none;
  letter-spacing: 0.3px;
}

/* 亮色主题下提示框样式微调 */
.collapse-btn.light .tooltip {
  background-color: #1e293b;
}

/* 暗色主题下提示框 */
.collapse-btn.dark .tooltip {
  background-color: #0f172a;
}

/* ========== 过渡动画 ========== */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(-8px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}

/* ========== 分隔线 ========== */
.divider {
  width: 1px;
  height: 24px;
}

.divider-light {
  background: linear-gradient(to bottom, transparent, #dcdfe6, transparent);
}

.divider-dark {
  background: linear-gradient(to bottom, transparent, #4a5568, transparent);
}
</style>