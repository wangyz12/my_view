<template>
  <div 
    class="page-layout" 
    :class="[
      `layout-${layoutType}`,
      { 'has-padding': padding }
    ]"
    :style="{ '--page-padding': paddingValue }"
  >
    <!-- 搜索表单区域（可选） -->
    <div v-if="$slots.search" class="search-area">
      <slot name="search" />
    </div>
    
    <!-- 主要内容区域 -->
    <div class="content-area">
      <slot />
    </div>
    
    <!-- 底部区域 表格的时候可用可不用 分页可以在主要内容区域去展示分页 -->
    <div v-if="$slots.footer" class="footer-area">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type LayoutType = 'page' | 'table'

const props = withDefaults(defineProps<{
  // 布局类型：page-普通布局，table-表格专用布局
  type?: LayoutType
  // 是否启用内边距
  padding?: boolean
  // 自定义内边距值
  paddingSize?: number
}>(), {
  type: 'page',
  padding: true,
  paddingSize: 0
})

const layoutType = computed(() => props.type)
const paddingValue = computed(() => `${props.paddingSize}px`)
</script>

<style lang="scss" scoped>
.page-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 搜索区域样式
  .search-area {
    flex-shrink: 0;
    margin-bottom: 16px;
  }
  
  // 内容区域样式
  .content-area {
    flex: 1;
    min-height: 0;  // 防止 flex 溢出
    display: flex;
    flex-direction: column;
  }
  
  // 底部区域样式
  .footer-area {
    flex-shrink: 0;
    margin-top: 16px;
  }
  
  // ========== 普通布局 ==========
  &.layout-page {
    .content-area {
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    &.has-padding {
      .search-area,
      .footer-area {
        padding-left: var(--page-padding);
        padding-right: var(--page-padding);
      }
      
      .content-area {
        padding: 0 var(--page-padding);
      }
    }
  }
  
  // ========== 表格专用布局 ==========
  &.layout-table {
    .search-area {
      padding: var(--page-padding) var(--page-padding) 0;
    }
    
    .content-area {
      padding: 0 var(--page-padding);
      overflow: hidden;  // 让表格自己控制滚动
    }
    
    .footer-area {
      padding: 0 var(--page-padding) var(--page-padding);
    }
  }
}
</style>