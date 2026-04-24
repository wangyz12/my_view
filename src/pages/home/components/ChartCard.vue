<template>
  <div class="chart-card flex-card" :class="{ 'chart-loading': loading }">
    <!-- 骨架屏 -->
    <div v-if="loading" class="chart-skeleton">
      <div class="skeleton-title"></div>
      <div class="skeleton-chart"></div>
    </div>
    
    <!-- 图表容器 -->
    <div v-else class="chart-container">
      <div class="chart-header">
        <h3 class="chart-title">{{ title }}</h3>
        <div class="chart-actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <div ref="chartRef" class="chart-content" :style="{ height: height + 'px' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Props {
  title: string
  height?: number
  options: any
  loading?: boolean
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  loading: false,
  autoResize: true
})

const emit = defineEmits<{
  chartClick: [params: any]
}>()

// 图表实例
const chartRef = ref<HTMLElement>()
const chartInstance = ref<echarts.ECharts | null>(null)
let resizeTimer: ReturnType<typeof setTimeout> | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  if (props.loading) return
  
  // 销毁旧实例
  if (chartInstance.value && !chartInstance.value.isDisposed()) {
    chartInstance.value.dispose()
  }
  
  // 创建新实例
  chartInstance.value = echarts.init(chartRef.value)
  
  // 设置配置
  if (props.options) {
    chartInstance.value.setOption(props.options)
  }
  
  // 绑定点击事件
  chartInstance.value.on('click', (params: any) => {
    emit('chartClick', params)
  })
}

// 更新图表
const updateChart = (options?: any) => {
  if (!chartInstance.value || chartInstance.value.isDisposed()) return
  
  const newOptions = options || props.options
  if (newOptions) {
    chartInstance.value.setOption(newOptions, true)
  }
}

// 调整图表大小（带防抖和安全检查）
const resizeChart = () => {
  // 清除之前的定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  
  // 防抖处理
  resizeTimer = setTimeout(() => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      try {
        chartInstance.value.resize()
      } catch (error) {
        console.warn('图表调整大小失败:', error)
      }
    }
    resizeTimer = null
  }, 100)
}

// 销毁图表
const disposeChart = () => {
  // 清除定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
  
  if (chartInstance.value && !chartInstance.value.isDisposed()) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
}

// 监听配置变化
watch(() => props.options, (newOptions) => {
  if (newOptions && chartInstance.value && !chartInstance.value.isDisposed()) {
    updateChart(newOptions)
  } else if (newOptions && !props.loading) {
    // 如果图表还未初始化，等待初始化
    nextTick(() => {
      if (!chartInstance.value && !props.loading) {
        initChart()
      } else if (chartInstance.value && !chartInstance.value.isDisposed()) {
        updateChart(newOptions)
      }
    })
  }
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (newLoading) => {
  if (!newLoading && chartRef.value && (!chartInstance.value || chartInstance.value.isDisposed())) {
    nextTick(() => {
      initChart()
    })
  }
})

// 监听高度变化
watch(() => props.height, () => {
  resizeChart()
})

// 组件挂载
onMounted(() => {
  if (!props.loading) {
    nextTick(() => {
      initChart()
    })
  }
  
  // 监听窗口大小变化
  if (props.autoResize) {
    window.addEventListener('resize', resizeChart)
  }
})

// 组件卸载
onUnmounted(() => {
  // 移除窗口事件监听
  if (props.autoResize) {
    window.removeEventListener('resize', resizeChart)
  }
  disposeChart()
})

// 暴露方法给父组件
defineExpose({
  getInstance: () => chartInstance.value,
  resize: resizeChart,
  update: updateChart,
  dispose: disposeChart
})
</script>

<style scoped lang="scss">
// ==================== ChartCard 样式 ====================
.chart-card {
  &.chart-loading {
    min-height: v-bind('props.height + 60 + "px"');
  }
  
  .chart-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-base;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color-lighter;
  }
  
  .chart-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $text-color-primary;
  }
  
  .chart-actions {
    display: flex;
    gap: $spacing-xs;
  }
  
  .chart-content {
    width: 100%;
    flex: 1;
  }
  
  // 骨架屏样式
  .chart-skeleton {
    .skeleton-title {
      height: 24px;
      width: 120px;
      border-radius: $border-radius-sm;
      margin-bottom: $spacing-lg;
      @include skeleton-animation;
    }
    
    .skeleton-chart {
      height: v-bind('props.height + "px"');
      border-radius: $border-radius-lg;
      @include skeleton-animation;
    }
  }
}
</style>