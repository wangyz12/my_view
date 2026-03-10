<!-- src/components/BusinessBackground.vue -->
<template>
  <div class="business-bg absolute inset-0 overflow-hidden">
    <!-- 基础渐变层 -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
    
    <!-- 网格背景 -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute inset-0" :style="gridStyle"></div>
    </div>
    
    <!-- 动态光点 -->
    <div class="absolute inset-0">
      <div
        v-for="i in 12"
        :key="i"
        class="absolute rounded-full blur-3xl animate-float"
        :class="`light-spot-${i}`"
        :style="getLightSpotStyle(i)"
      ></div>
    </div>
    
    <!-- 流动线条 Canvas -->
    <canvas
      ref="flowLinesCanvas"
      class="absolute inset-0 pointer-events-none"
      :style="{ opacity: 0.6 }"
    ></canvas>
    
    <!-- 鼠标水波纹 Canvas -->
    <canvas
      ref="rippleCanvas"
      class="absolute inset-0"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    ></canvas>
    
    <!-- 扫描线效果 -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="scan-line"></div>
    </div>
    
    <!-- 装饰性线条 -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <!-- 流动的SVG线条 -->
      <path
        v-for="i in 3"
        :key="`flow-path-${i}`"
        :d="getFlowPath(i)"
        class="stroke-cyan-400/20"
        stroke-width="2"
        fill="none"
      >
        <animate
          attributeName="d"
          :values="getFlowPathValues(i)"
          dur="20s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </path>
    </svg>
    
    <!-- 数字代码雨效果（极简版） -->
    <div class="absolute inset-0 opacity-10 code-rain">
      <div
        v-for="col in 10"
        :key="col"
        class="absolute top-0 text-xs text-cyan-400 font-mono"
        :style="{ left: `${col * 10}%`, animationDelay: `${col * 0.3}s` }"
      >
        <div v-for="row in 20" :key="row" class="code-char">
          {{ getRandomChar() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Canvas引用
const flowLinesCanvas = ref<HTMLCanvasElement>()
const rippleCanvas = ref<HTMLCanvasElement>()

// 网格样式
const gridStyle = computed(() => ({
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px'
}))

// 流动线条动画
let flowLinesCtx: CanvasRenderingContext2D | null = null
let flowAnimationFrame: number
let flowLines: FlowLine[] = []

interface FlowLine {
  points: { x: number; y: number }[]
  color: any
  width: number
  speed: number
  offset: number
  phase: number
}

const initFlowLines = (width: number, height: number) => {
  const lines: FlowLine[] = []
  const colors = [
    'rgba(59, 130, 246, 0.3)',  // 蓝色
    'rgba(139, 92, 246, 0.3)',  // 紫色
    'rgba(6, 182, 212, 0.3)',   // 青色
    'rgba(168, 85, 247, 0.3)',  // 紫罗兰
  ]
  
  // 创建多条流动线条
  for (let i = 0; i < 8; i++) {
    const points: { x: number; y: number }[] = []
    const startY = height * (0.2 + Math.random() * 0.6)
    const amplitude = 50 + Math.random() * 100
    const frequency = 0.002 + Math.random() * 0.003
    
    for (let x = -100; x < width + 100; x += 20) {
      const y = startY + Math.sin(x * frequency) * amplitude
      points.push({ x, y })
    }
    
    lines.push({
      points,
      color: colors[Math.floor(Math.random() * colors.length)],
      width: 1 + Math.random() * 2,
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * 100,
      phase: Math.random() * Math.PI * 2
    })
  }
  
  return lines
}

const drawFlowLines = () => {
  if (!flowLinesCtx || !flowLinesCanvas.value) return
  
  const canvas = flowLinesCanvas.value
  const ctx = flowLinesCtx
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  flowLines.forEach(line => {
    ctx.beginPath()
    ctx.strokeStyle = line.color
    ctx.lineWidth = line.width
    
    // 更新线条点，产生流动效果
    const updatedPoints:any = line.points.map(point => {
      const time = Date.now() * 0.001 * line.speed
      const newY = point.y + Math.sin(point.x * 0.01 + time + line.phase) * 10
      return { x: point.x, y: newY }
    })
    
    ctx.moveTo(updatedPoints[0].x, updatedPoints[0].y)
    for (let i = 1; i < updatedPoints.length; i++) {
      ctx.lineTo(updatedPoints[i].x, updatedPoints[i].y)
    }
    
    ctx.stroke()
  })
  
  flowAnimationFrame = requestAnimationFrame(drawFlowLines)
}

// 鼠标水波纹效果
let rippleCtx: CanvasRenderingContext2D | null = null
let rippleAnimationFrame: number
let mouseX = -1000
let mouseY = -1000
let ripples: Ripple[] = []

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  strength: number
  speed: number
}

const initRipples = () => {
  ripples = []
}

const createRipple = (x: number, y: number) => {
  ripples.push({
    x,
    y,
    radius: 0,
    maxRadius: 150,
    strength: 1,
    speed: 2
  })
}

const drawRipples = () => {
  if (!rippleCtx || !rippleCanvas.value) return
  
  const canvas = rippleCanvas.value
  const ctx = rippleCtx
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制水波纹
  ripples = ripples.filter(ripple => {
    ripple.radius += ripple.speed
    ripple.strength *= 0.98
    
    if (ripple.radius < ripple.maxRadius && ripple.strength > 0.01) {
      // 绘制波纹
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      
      // 创建渐变效果
      const gradient = ctx.createRadialGradient(
        ripple.x, ripple.y, 0,
        ripple.x, ripple.y, ripple.radius
      )
      gradient.addColorStop(0, `rgba(59, 130, 246, ${ripple.strength * 0.3})`)
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${ripple.strength * 0.2})`)
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.stroke()
      
      // 绘制内部光晕
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, ripple.radius * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(59, 130, 246, ${ripple.strength * 0.1})`
      ctx.fill()
      
      return true
    }
    return false
  })
  
  // 如果鼠标在画布内，持续产生波纹
  if (mouseX > 0 && mouseX < (rippleCanvas.value?.width || 0) &&
      mouseY > 0 && mouseY < (rippleCanvas.value?.height || 0)) {
    if (Math.random() > 0.7) {
      createRipple(
        mouseX + (Math.random() - 0.5) * 30,
        mouseY + (Math.random() - 0.5) * 30
      )
    }
  }
  
  rippleAnimationFrame = requestAnimationFrame(drawRipples)
}

// 鼠标事件处理
const handleMouseMove = (e: MouseEvent) => {
  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // 创建主波纹
  if (Math.random() > 0.5) {
    createRipple(mouseX, mouseY)
  }
}

const handleMouseLeave = () => {
  mouseX = -1000
  mouseY = -1000
}

// 获取流动路径
const getFlowPath = (index: number) => {
  const width = window.innerWidth
  const height = window.innerHeight
  const y = height * (0.3 + index * 0.2)
  
  return `M0,${y} Q${width * 0.25},${y - 50} ${width * 0.5},${y} T${width},${y}`
}

const getFlowPathValues = (index: number) => {
  const width = window.innerWidth
  const height = window.innerHeight
  const y = height * (0.3 + index * 0.2)
  
  return [
    `M0,${y} Q${width * 0.25},${y - 50} ${width * 0.5},${y} T${width},${y}`,
    `M0,${y} Q${width * 0.25},${y + 50} ${width * 0.5},${y} T${width},${y}`,
    `M0,${y} Q${width * 0.25},${y - 50} ${width * 0.5},${y} T${width},${y}`
  ].join(';')
}

// 生成随机字符
const getRandomChar = () => {
  const chars = '01アイウエオカキクケコサシスセソタチツテト'
  return chars[Math.floor(Math.random() * chars.length)]
}

// 光点样式
const getLightSpotStyle = (index: number) => {
  const positions = [
    { top: '10%', left: '15%', size: '300px', color: 'rgba(59, 130, 246, 0.15)' },
    { top: '60%', left: '80%', size: '400px', color: 'rgba(139, 92, 246, 0.15)' },
    { top: '30%', left: '70%', size: '350px', color: 'rgba(6, 182, 212, 0.1)' },
    { top: '80%', left: '20%', size: '450px', color: 'rgba(168, 85, 247, 0.1)' },
    { top: '40%', left: '40%', size: '500px', color: 'rgba(59, 130, 246, 0.1)' },
    { top: '20%', left: '85%', size: '300px', color: 'rgba(139, 92, 246, 0.12)' },
    { top: '70%', left: '10%', size: '400px', color: 'rgba(6, 182, 212, 0.12)' },
    { top: '15%', left: '45%', size: '350px', color: 'rgba(168, 85, 247, 0.1)' },
    { top: '85%', left: '60%', size: '450px', color: 'rgba(59, 130, 246, 0.1)' },
    { top: '45%', left: '25%', size: '400px', color: 'rgba(139, 92, 246, 0.12)' },
    { top: '25%', left: '55%', size: '350px', color: 'rgba(6, 182, 212, 0.1)' },
    { top: '55%', left: '75%', size: '400px', color: 'rgba(168, 85, 247, 0.1)' }
  ]
  
  const pos:any = positions[(index - 1) % positions.length]
  return {
    top: pos.top,
    left: pos.left,
    width: pos.size,
    height: pos.size,
    background: `radial-gradient(circle, ${pos.color} 0%, transparent 70%)`,
    animation: `float ${15 + index * 2}s infinite alternate ${index * 0.5}s`,
    transform: 'translate(-50%, -50%)'
  }
}

// 初始化Canvas
onMounted(() => {
  // 设置Canvas尺寸
  const setCanvasSize = () => {
    if (flowLinesCanvas.value) {
      flowLinesCanvas.value.width = window.innerWidth
      flowLinesCanvas.value.height = window.innerHeight
    }
    if (rippleCanvas.value) {
      rippleCanvas.value.width = window.innerWidth
      rippleCanvas.value.height = window.innerHeight
    }
  }
  
  setCanvasSize()
  
  // 初始化上下文
  if (flowLinesCanvas.value) {
    flowLinesCtx = flowLinesCanvas.value.getContext('2d')
    flowLines = initFlowLines(window.innerWidth, window.innerHeight)
    drawFlowLines()
  }
  
  if (rippleCanvas.value) {
    rippleCtx = rippleCanvas.value.getContext('2d')
    initRipples()
    drawRipples()
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setCanvasSize()
    if (flowLinesCanvas.value) {
      flowLines = initFlowLines(window.innerWidth, window.innerHeight)
    }
  })
})

onUnmounted(() => {
  if (flowAnimationFrame) {
    cancelAnimationFrame(flowAnimationFrame)
  }
  if (rippleAnimationFrame) {
    cancelAnimationFrame(rippleAnimationFrame)
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent
  );
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(1000%);
  }
}

/* 浮动动画 */
@keyframes float {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

/* 代码雨动画 */
.code-rain {
  pointer-events: none;
}

.code-char {
  opacity: 0;
  animation: fadeInOut 3s linear infinite;
  margin: 5px 0;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
    transform: translateY(-20px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每一列设置不同的动画延迟 */
.code-rain > div:nth-child(1) .code-char { animation-delay: 0s; }
.code-rain > div:nth-child(2) .code-char { animation-delay: 0.3s; }
.code-rain > div:nth-child(3) .code-char { animation-delay: 0.6s; }
.code-rain > div:nth-child(4) .code-char { animation-delay: 0.9s; }
.code-rain > div:nth-child(5) .code-char { animation-delay: 1.2s; }
.code-rain > div:nth-child(6) .code-char { animation-delay: 1.5s; }
.code-rain > div:nth-child(7) .code-char { animation-delay: 1.8s; }
.code-rain > div:nth-child(8) .code-char { animation-delay: 2.1s; }
.code-rain > div:nth-child(9) .code-char { animation-delay: 2.4s; }
.code-rain > div:nth-child(10) .code-char { animation-delay: 2.7s; }

/* 光点自定义动画延迟 */
.light-spot-1 { animation-delay: 0s; }
.light-spot-2 { animation-delay: 0.5s; }
.light-spot-3 { animation-delay: 1s; }
.light-spot-4 { animation-delay: 1.5s; }
.light-spot-5 { animation-delay: 2s; }
.light-spot-6 { animation-delay: 2.5s; }
.light-spot-7 { animation-delay: 3s; }
.light-spot-8 { animation-delay: 3.5s; }
.light-spot-9 { animation-delay: 4s; }
.light-spot-10 { animation-delay: 4.5s; }
.light-spot-11 { animation-delay: 5s; }
.light-spot-12 { animation-delay: 5.5s; }
</style>