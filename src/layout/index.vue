<!-- src/layout/Layout.vue -->
<template>
  <div class="common-layout" :class="{ 'dark-mode': themeStore.isDarkMode, 'light-mode': themeStore.isLightMode }">
    <el-watermark
      v-if="isWater"
      :content="watermarkContent"
      :font="watermarkFont"
      :gap="[100, 100]"
      :rotate="-30"
      :z-index="10"
    >
      <LayoutContent />
    </el-watermark>
    <LayoutContent v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LayoutContent from './LayoutContent.vue'
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();
const isWater = computed(()=>{
  return themeStore.watermark.enabled
})
// 水印内容
const watermarkContent = computed(() => {
  // 如果用户自定义了水印文字
  if (themeStore.watermark.text) {
    return [themeStore.watermark.text]
  }
  // 否则使用默认（用户名+电话+日期）
  const userInfo = userStore.userInfo;
  return [
    userInfo?.username || '内部资料',
    userInfo?.phone || '',
    new Date().toLocaleDateString(),
  ];
});

// 水印字体配置 - 根据主题模式调整颜色
const watermarkFont = computed(() => ({
  color: themeStore.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'Microsoft Yahei, sans-serif',
}));
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

}
</style>
