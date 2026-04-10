<template>
  <div class="canvas-container">
    <canvas ref="bgCanvas" class="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const bgCanvas = ref<HTMLCanvasElement>()
let resizeTimer: number | null = null

const initCanvas = () => {
  if (!bgCanvas.value) return
  const canvas = bgCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 自适应画布尺寸
  const setCanvasSize = () => {
    const container = canvas.parentElement
    if (!container) return
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    drawWave(ctx, canvas.width, canvas.height)
  }

  // 核心绘制：精准还原图片弧度
  const drawWave = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    // 1. 白色背景（完全匹配原图）
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    // 2. 精准匹配原图的蓝色 #4A7ABC
    const waveColor = '#4A7ABC'

    // 3. 单条连续三次贝塞尔曲线，完美还原弧度变化
    ctx.beginPath()
    // 起点：画布左上角 (0, 0)
    ctx.moveTo(0, 0)

    // 核心曲线：一次性绘制完整波浪，无任何断点
    // 控制点1：控制左上大弧的弧度
    // 控制点2：控制中间平缓过渡
    // 终点：画布右边缘，完美匹配原图的终止位置
    ctx.bezierCurveTo(
      w * 0.08, h * 0.3,   // 第一个控制点：左上弧的弧度
      w * 0.25, h * 0.5,   // 第二个控制点：中间平缓过渡
      w * 0.5, h           // 终点：右边缘，和原图终止位置完全一致
    )

    // 4. 闭合路径：从终点向下到右下角，再向左回到起点
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()

    // 5. 填充蓝色，完成绘制
    ctx.fillStyle = waveColor
    ctx.fill()
  }

  // 窗口缩放防抖重绘
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(setCanvasSize, 100)
  }

  // 初始化
  setCanvasSize()
  window.addEventListener('resize', handleResize)

  // 组件卸载清理
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) clearTimeout(resizeTimer)
  })
}

onMounted(() => {
  initCanvas()
})
</script>

<style scoped>
.canvas-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #ffffff; /* 兜底白色背景 */
}
.canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>