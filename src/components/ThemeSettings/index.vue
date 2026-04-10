<template>
  <div class="theme-settings">
    <!-- 设置按钮 -->
    <el-icon :size="18" class="setting cursor-pointer"  :style="iconColorStyle" @click="drawerVisible = true"><Setting /></el-icon>
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
        
        <!-- 页面间距 -->
        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Cpu /></el-icon>
            页面间距
          </div>
          <div class="cache-settings">
            <el-slider
              v-model="themeStore.pagePadding"
              :min="0"
              :max="50"
              :step="1"
              show-stops
              show-input
              size="small"
              style="margin-top: 8px;"
            />
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

        <!-- ========== 新增：页面动画设置 ========== -->
        <div class="setting-item">
          <div class="setting-label">
            <el-icon><VideoPlay /></el-icon>
            页面切换动画
          </div>
          <el-select
            v-model="pageAnimation"
            placeholder="请选择动画效果"
            size="default"
            style="width: 100%"
            @change="handleAnimationChange"
          >
            <el-option
              v-for="item in animationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div class="animation-option-item">
                <span class="animation-icon">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
                <span v-if="item.description" class="animation-desc">{{ item.description }}</span>
              </div>
            </el-option>
          </el-select>
        </div>

        <!-- 动画时长设置（仅在非无动画时显示） -->
        <div class="setting-item" v-if="themeStore.pageAnimation !== 'none'">
          <div class="setting-label">
            动画时长
          </div>
          <div class="duration-slider">
            <el-slider
              v-model="animationDuration"
              :min="100"
              :max="500"
              :step="25"
              :format-tooltip="(val:any) => `${val}ms`"
              @change="handleDurationChange"
            />
            <span class="duration-value">{{ themeStore.animationDuration }}ms</span>
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

        <!-- 路由缓存设置 -->
        <div class="setting-item">
          <div class="setting-label">
            <el-icon><Cpu /></el-icon>
            路由缓存
          </div>
          <div class="cache-settings">
            <div class="cache-switch">
              <el-switch v-model="themeStore.enableRouteCache" />
              <span class="cache-label">启用页面缓存</span>
            </div>
            <div v-if="themeStore.enableRouteCache" class="cache-count">
              <el-text type="info" size="small">最大缓存页面数</el-text>
              <el-slider
                v-model="themeStore.maxCacheCount"
                :min="1"
                :max="20"
                :step="1"
                show-stops
                show-input
                size="small"
                style="margin-top: 8px;"
              />
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 重置按钮 -->
        <el-button type="primary" @click="handleReset" style="width: 100%">
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
import { Cpu, VideoPlay } from '@element-plus/icons-vue'
const themeStore = useThemeStore()
const drawerVisible = ref(false)
const watermarkText = ref(themeStore.watermark.text)

// ========== 动画设置 ==========
const pageAnimation = ref(themeStore.pageAnimation)
const animationDuration = ref(themeStore.animationDuration)
// 动态计算图标颜色（响应主题变化）
const iconColorStyle = computed(() => {
  if (themeStore.isDarkMode) {
    return { color: '#f0f2f5' }  // 深色模式：亮白色
  }
  return { color: '#1f2d3d' }     // 浅色模式：深灰色
})
// 动画选项
const animationOptions = [
  { value: 'fade', label: '淡入淡出', icon: '🌫️', description: '平滑淡入淡出' },
  { value: 'fade-slide', label: '淡入上浮', icon: '📤', description: '淡入+轻微上浮' },
  { value: 'scale', label: '缩放淡入', icon: '🔍', description: '缩放+淡入效果' },
  { value: 'slide-x', label: '水平滑动', icon: '⬅️➡️', description: '左右滑动切换' },
  { value: 'slide-y', label: '垂直滑动', icon: '⬆️⬇️', description: '上下滑动切换' },
  { value: 'none', label: '无动画', icon: '⏹️', description: '直接切换，无动画' },
]

// 处理动画类型变更
const handleAnimationChange = (val: string) => {
  themeStore.setPageAnimation(val as any)
}

// 处理动画时长变更
const handleDurationChange = (val: number) => {
  themeStore.setAnimationDuration(val)
}

// ========== 重置所有设置 ==========
const handleReset = () => {
  themeStore.resetSettings()
  // 同步本地状态
  pageAnimation.value = themeStore.pageAnimation
  animationDuration.value = themeStore.animationDuration
  watermarkText.value = themeStore.watermark.text
}

// 同步水印文字
watch(() => themeStore.watermark.text, (val) => {
  watermarkText.value = val
})

// 同步动画设置（当外部修改时）
watch(() => themeStore.pageAnimation, (val) => {
  pageAnimation.value = val
})

watch(() => themeStore.animationDuration, (val) => {
  animationDuration.value = val
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
@import url(./index.scss);


</style>