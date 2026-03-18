<template>
  <div class="setting-page">
    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
          <el-button type="primary" @click="drawerVisible = true">
            <el-icon><Setting /></el-icon>
            打开主题设置
          </el-button>
        </div>
      </template>

      <div class="current-settings">
        <h3>当前设置</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="布局模式">
            <el-tag :type="themeStore.isSideLayout ? 'primary' : 'success'">
              {{ themeStore.isSideLayout ? '侧边栏布局' : '顶部导航布局' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Logo 显示">
            <el-tag :type="themeStore.showLogo ? 'success' : 'info'">
              {{ themeStore.showLogo ? '显示' : '隐藏' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="固定头部">
            <el-tag :type="themeStore.fixedHeader ? 'success' : 'info'">
              {{ themeStore.fixedHeader ? '固定' : '不固定' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="主题色">
            <div class="color-display">
              <span
                class="color-dot"
                :style="{ backgroundColor: themeStore.themeColor }"
              ></span>
              {{ themeStore.themeColor }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="标签页">
            <el-tag :type="themeStore.showTagsView ? 'success' : 'info'">
              {{ themeStore.showTagsView ? '显示' : '隐藏' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 主题设置抽屉 -->
    <ThemeSettingsDrawer v-model="drawerVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/store/modules/theme'
import ThemeSettingsDrawer from '@/components/ThemeSettings/index.vue'

const themeStore = useThemeStore()
const drawerVisible = ref(false)
</script>

<style lang="scss" scoped>
.setting-page {
  padding: 20px;
}

.setting-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-settings {
  h3 {
    margin-bottom: 20px;
    color: var(--el-text-color-primary);
  }
}

.color-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--el-border-color);
}
</style>