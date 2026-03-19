<!-- src/pages/login/components/BusinessBackground/BusinessBackground.vue -->
<template>
  <div 
    ref="backgroundRef"
    class="business-background"
    @mousemove="handleMouseMove"
  >
    <!-- 深色渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
    
    <!-- ===== 流星雨 ===== -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="meteor in meteors"
        :key="meteor.id"
        class="absolute"
        :style="{
          left: `${meteor.x}%`,
          top: `${meteor.y}%`,
          width: `${meteor.length}px`,
          height: '2px',
          transform: `rotate(${meteor.angle}deg)`,
          opacity: meteor.opacity,
          transition: 'opacity 0.1s linear',
          zIndex: meteor.isHit ? 20 : 1
        }"
      >
        <!-- 流星头部（亮星） -->
        <div 
          class="absolute right-0 w-4 h-4 rounded-full"
          :style="{
            background: `radial-gradient(circle at center, 
              ${meteor.color} 0%, 
              ${meteor.color}80 50%, 
              transparent 100%)`,
            transform: 'translate(50%, -35%)',
            filter: 'blur(2px)',
            boxShadow: `0 0 20px ${meteor.color}`
          }"
        ></div>
        
        <!-- 流星尾迹（渐变线） -->
        <div 
          class="absolute inset-0"
          :style="{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${meteor.color}20 20%, 
              ${meteor.color} 50%, 
              ${meteor.color}20 80%, 
              transparent 100%)`,
            filter: 'blur(1px)',
            boxShadow: `0 0 15px ${meteor.color}`
          }"
        ></div>
      </div>
    </div>
    
    <!-- ===== 烟花效果 ===== -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        v-for="firework in fireworks"
        :key="firework.id"
        class="absolute"
        :style="{
          left: `${firework.x}px`,
          top: `${firework.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }"
      >
        <!-- 烟花粒子 -->
        <div 
          v-for="(particle, index) in firework.particles"
          :key="index"
          class="absolute"
          :style="{
            left: '0',
            top: '0',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: particle.shape === 'circle' ? '50%' : '0',
            transform: `rotate(${particle.angle}deg) translateX(${particle.distance}px)`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.glow}px ${particle.color}`,
            filter: 'blur(1px)',
            transition: 'all 0.05s linear'
          }"
          :class="{
            'star-shape': particle.shape === 'star',
            'diamond-shape': particle.shape === 'diamond'
          }"
        ></div>
      </div>
    </div>
    
    <!-- ===== 背景星辰 ===== -->
    <div class="absolute inset-0">
      <div 
        v-for="i in 50"
        :key="'star-' + i"
        class="absolute rounded-full"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          background: `radial-gradient(circle at center, 
            ${colors[Math.floor(Math.random() * colors.length)]} 0%, 
            transparent 100%)`,
          opacity: Math.random() * 0.5 + 0.2,
          filter: 'blur(0.5px)',
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const backgroundRef = ref<HTMLElement>()

// 流星配置
interface Meteor {
  id: number
  x: number
  y: number
  length: number
  angle: number
  color: any
  opacity: number
  speed: number
  isHit: boolean
}

// 烟花粒子配置
interface FireworkParticle {
  size: number
  color: any
  angle: number
  distance: number
  opacity: number
  shape: 'circle' | 'star' | 'diamond'
  glow: number
}

// 烟花配置
interface Firework {
  id: number
  x: number
  y: number
  particles: FireworkParticle[]
  createTime: number
}

const meteors = ref<Meteor[]>([])
const fireworks = ref<Firework[]>([])
let meteorId = 0
let fireworkId = 0
let animationFrameId: number
let mouseX = 0
let mouseY = 0

// 颜色配置
const colors = [
  '#3b82f6', // 蓝
  '#8b5cf6', // 紫
  '#ec4899', // 粉
  '#06b6d4', // 青
  '#f59e0b', // 橙
  '#10b981', // 绿
  '#ef4444', // 红
  '#f97316'  // 橙黄
]

// 生成流星
const generateMeteor = () => {
  meteorId++
  
  // 从左上角区域随机开始（x: -10% 到 20%, y: -10% 到 20%）
  const startX = -10 + Math.random() * 30
  const startY = -10 + Math.random() * 30
  
  meteors.value.push({
    id: meteorId,
    x: startX,
    y: startY,
    length: Math.random() * 80 + 60, // 流星长度 60-140px
    angle: 45, // 固定45度角，从左上到右下
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.4 + 0.4, // 0.4-0.8
    speed: Math.random() * 0.15 + 0.1, // 移动速度
    isHit: false
  })
  
  // 限制流星数量
  if (meteors.value.length > 30) {
    meteors.value = meteors.value.slice(-30)
  }
}

// 创建烟花效果
const createFirework = (x: number, y: number, hitMeteorId: number) => {
  // 标记被击中的流星消失
  const meteorIndex = meteors.value.findIndex(m => m.id === hitMeteorId)
  if (meteorIndex !== -1) {
    meteors.value.splice(meteorIndex, 1)
  }
  
  fireworkId++
  
  const particles: FireworkParticle[] = []
  const particleCount = 36 // 粒子数量
  
  // 烟花主色
  const mainColor = colors[Math.floor(Math.random() * colors.length)]
  const secondaryColor = colors[Math.floor(Math.random() * colors.length)]
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * 360
    const shape = Math.random() > 0.7 
      ? (Math.random() > 0.5 ? 'star' : 'diamond') 
      : 'circle'
    
    particles.push({
      size: Math.random() * 8 + 4, // 4-12px
      color: i % 3 === 0 ? secondaryColor : mainColor,
      angle,
      distance: 0,
      opacity: 1,
      shape,
      glow: Math.random() * 15 + 10 // 10-25px
    })
  }
  
  fireworks.value.push({
    id: fireworkId,
    x,
    y,
    particles,
    createTime: Date.now()
  })
  
  // 限制烟花数量
  if (fireworks.value.length > 5) {
    fireworks.value = fireworks.value.slice(-5)
  }
}

// 处理鼠标移动
const handleMouseMove = (event: MouseEvent) => {
  if (!backgroundRef.value) return
  
  const rect = backgroundRef.value.getBoundingClientRect()
  mouseX = event.clientX - rect.left
  mouseY = event.clientY - rect.top
  
  // 检查流星是否击中鼠标
  checkMeteorHit()
}

// 检查流星是否击中鼠标
const checkMeteorHit = () => {
  if (!backgroundRef.value) return
  
  const rect = backgroundRef.value.getBoundingClientRect()
  const mouseXPercent = (mouseX / rect.width) * 100
  const mouseYPercent = (mouseY / rect.height) * 100
  
  meteors.value.forEach(meteor => {
    if (meteor.isHit) return // 已经击中的忽略
    
    // 流星的位置（百分比转像素）
    const meteorXPixel = (meteor.x / 100) * rect.width
    const meteorYPixel = (meteor.y / 100) * rect.height
    
    // 计算距离（像素）
    const distance = Math.sqrt(
      Math.pow(meteorXPixel - mouseX, 2) + 
      Math.pow(meteorYPixel - mouseY, 2)
    )
    
    // 如果流星头部距离鼠标小于40px，判定为击中
    if (distance < 40) {
      meteor.isHit = true
      createFirework(mouseX, mouseY, meteor.id)
    }
  })
}

// 更新流星位置
const updateMeteors = () => {
  const rect = backgroundRef.value?.getBoundingClientRect()
  if (!rect) return
  
  meteors.value.forEach(meteor => {
    if (meteor.isHit) return // 击中的流星不移动
    
    // 沿45度角移动（x和y增加相同的量）
    meteor.x += meteor.speed * 0.8
    meteor.y += meteor.speed
    
    // 如果流星移出屏幕右下角，重置到左上角
    if (meteor.x > 110 || meteor.y > 110) {
      meteor.x = -10 + Math.random() * 20
      meteor.y = -10 + Math.random() * 20
      meteor.color = colors[Math.floor(Math.random() * colors.length)]
      meteor.opacity = Math.random() * 0.4 + 0.4
      meteor.speed = Math.random() * 0.15 + 0.1
    }
  })
}

// 更新烟花效果
const updateFireworks = () => {
  const now = Date.now()
  
  fireworks.value = fireworks.value.filter(firework => {
    const age = now - firework.createTime
    
    if (age > 1000) { // 1秒后消失
      return false
    }
    
    const progress = age / 1000 // 0-1
    
    // 更新烟花粒子
    firework.particles.forEach(particle => {
      if (progress < 0.2) {
        // 爆炸扩散阶段 (0-0.2秒)
        particle.distance = 40 * (progress / 0.2)
        particle.opacity = 1
      } else if (progress < 0.6) {
        // 保持阶段 (0.2-0.6秒)
        particle.distance = 40 + 20 * ((progress - 0.2) / 0.4)
        particle.opacity = 1
      } else {
        // 消失阶段 (0.6-1秒)
        particle.distance = 60 + 20 * ((progress - 0.6) / 0.4)
        particle.opacity = 1 - ((progress - 0.6) / 0.4)
      }
      
      // 粒子旋转
      particle.angle += 2
    })
    
    return true
  })
}

// 动画循环
const animate = () => {
  // 随机生成新流星
  if (Math.random() < 0.02) { // 2%概率每帧生成
    generateMeteor()
  }
  
  updateMeteors()
  updateFireworks()
  
  animationFrameId = requestAnimationFrame(animate)
}

// 初始化
onMounted(() => {
  // 初始生成一些流星
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      generateMeteor()
    }, i * 200)
  }
  
  // 添加自定义动画样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    
    .star-shape {
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    
    .diamond-shape {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }
  `
  document.head.appendChild(style)
  
  // 启动动画
  animationFrameId = requestAnimationFrame(animate)
})

// 清理
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  meteors.value = []
  fireworks.value = []
})
</script>

<style scoped>
.business-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: auto;
}
</style>