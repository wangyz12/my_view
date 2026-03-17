<template>
  <div class="theme-settings">
    <!-- 更大的设置按钮 -->
    <el-button
      class="settings-btn"
      type="primary"
      plain
      size="small"
      @click="drawerVisible = true"
    >
      <el-icon :size="16"><Setting /></el-icon>
    </el-button>

    <!-- 设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="主题设置"
      size="320px"
      :with-header="true"
    >
      <div class="settings-content">
        <!-- 主题模式切换 -->
        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Moon v-if="themeStore.isDarkMode" /><Sunny v-else /></el-icon>
            主题模式
          </div>
          <div class="setting-options">
            <div
              class="layout-option"
              :class="{ active: themeStore.themeMode === 'dark' }"
              @click="themeStore.setThemeMode('dark')"
            >
              <div class="layout-preview dark-preview">
                <div class="preview-sidebar"></div>
                <div class="preview-main">
                  <div class="preview-header"></div>
                </div>
              </div>
              <span class="layout-name">暗黑</span>
            </div>
            <div
              class="layout-option"
              :class="{ active: themeStore.themeMode === 'light' }"
              @click="themeStore.setThemeMode('light')"
            >
              <div class="layout-preview light-preview">
                <div class="preview-sidebar"></div>
                <div class="preview-main">
                  <div class="preview-header"></div>
                </div>
              </div>
              <span class="layout-name">明亮</span>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 布局设置 -->
        <div class="setting-item">
          <div class="setting-label">布局模式</div>
          <div class="setting-options">
            <div
              class="layout-option"
              :class="{ active: themeStore.layout === 'side' }"
              @click="themeStore.setLayout('side')"
            >
              <div class="layout-preview side-preview">
                <div class="preview-sidebar"></div>
                <div class="preview-main">
                  <div class="preview-header"></div>
                </div>
              </div>
              <span class="layout-name">侧边栏</span>
            </div>
            <div
              class="layout-option"
              :class="{ active: themeStore.layout === 'top' }"
              @click="themeStore.setLayout('top')"
            >
              <div class="layout-preview top-preview">
                <div class="preview-header"></div>
                <div class="preview-main"></div>
              </div>
              <span class="layout-name">顶部栏</span>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- Logo 显示设置 -->
        <div class="setting-item">
          <div class="setting-label">显示 Logo</div>
          <el-switch v-model="themeStore.showLogo" />
        </div>

        <!-- 固定头部设置 -->
        <div class="setting-item">
          <div class="setting-label">固定头部</div>
          <el-switch v-model="themeStore.fixedHeader" />
        </div>

        <!-- 显示标签页设置 -->
        <div class="setting-item">
          <div class="setting-label">显示标签页</div>
          <el-switch v-model="themeStore.showTagsView" />
        </div>

        <el-divider />

        <!-- 主题色设置 -->
        <div class="setting-item">
          <div class="setting-label">主题色（仅影响按钮/控件）</div>
          <div class="color-options">
            <div
              v-for="color in themeColors"
              :key="color"
              class="color-option"
              :class="{ active: themeStore.themeColor === color }"
              :style="{ backgroundColor: color }"
              @click="themeStore.setThemeColor(color)"
            >
              <el-icon v-if="themeStore.themeColor === color"><Check /></el-icon>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 水印设置 -->
        <div class="setting-item">
          <div class="setting-label">
            <span>水印设置</span>
            <el-switch v-model="themeStore.watermark.enabled" />
          </div>
          <div v-if="themeStore.watermark.enabled" class="watermark-input">
            <el-input
              v-model="watermarkText"
              placeholder="留空则显示用户名"
              clearable
              @change="updateWatermark"
            >
              <template #prefix>
                <el-icon><Edit /></el-icon>
              </template>
            </el-input>
            <el-text type="info" size="small">
              自定义水印文字，留空则显示当前用户名
            </el-text>
          </div>
        </div>

        <el-divider />

        <!-- 重置按钮 -->
        <el-button type="primary" @click="themeStore.resetSettings" style="width: 100%">
          <el-icon><RefreshLeft /></el-icon>
          重置所有设置
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()
const drawerVisible = ref(false)
const watermarkText = ref(themeStore.watermark.text)

// 同步水印文字
watch(() => themeStore.watermark.text, (val) => {
  watermarkText.value = val
})

const updateWatermark = () => {
  themeStore.setWatermark(themeStore.watermark.enabled, watermarkText.value)
}

// 预设主题色
const themeColors = [
  '#409EFF', // 默认蓝
  '#67C23A', // 成功绿
  '#E6A23C', // 警告黄
  '#F56C6C', // 危险红
  '#909399', // 信息灰
  '#722ED1', // 紫色
  '#13C2C2', // 青色
  '#EB2F96', // 粉色
]
</script>

<style lang="scss" scoped>
.theme-settings {
  display: flex;
  align-items: center;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;

  .el-icon {
    margin-right: 4px;
  }
}

.settings-content {
  padding: 0 10px;
}

.setting-item {
  margin-bottom: 20px;

  .setting-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .el-icon {
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }
}

// 水印输入框
.watermark-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 布局选项
.setting-options {
  display: flex;
  gap: 16px;
}

.layout-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.layout-preview {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid var(--el-border-color);
}

// 暗黑模式预览
.dark-preview {
  display: flex;

  .preview-sidebar {
    width: 18px;
    height: 100%;
    background-color: #304156;
  }

  .preview-main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .preview-header {
      height: 12px;
      background-color: #304156;
      border-bottom: 1px solid var(--el-border-color);
    }
  }
}

// 明亮模式预览
.light-preview {
  display: flex;

  .preview-sidebar {
    width: 18px;
    height: 100%;
    background-color: #ffffff;
    border-right: 1px solid var(--el-border-color);
  }

  .preview-main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .preview-header {
      height: 12px;
      background-color: #ffffff;
      border-bottom: 1px solid var(--el-border-color);
    }
  }
}

// 侧边栏布局预览
.side-preview {
  display: flex;

  .preview-sidebar {
    width: 18px;
    height: 100%;
    background-color: #304156;
  }

  .preview-main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .preview-header {
      height: 12px;
      background-color: #fff;
      border-bottom: 1px solid var(--el-border-color);
    }
  }
}

// 顶部布局预览
.top-preview {
  display: flex;
  flex-direction: column;

  .preview-header {
    height: 12px;
    background-color: #304156;
  }

  .preview-main {
    flex: 1;
    background-color: #f5f7fa;
  }
}

.layout-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

// 主题色选项
.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    border-color: var(--el-text-color-primary);
  }
}
</style>
