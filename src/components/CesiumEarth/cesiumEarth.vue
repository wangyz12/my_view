<template>
  <div id="cesium-container" ref="earthContainer"></div>

  <!-- 控制面板 -->
  <div class="control-panel">
    <el-button @click="startAll">起飞</el-button>
    <el-button @click="pauseAll">暂停</el-button>
    <el-button @click="resetAll">重置</el-button>
    <el-button @click="triggerRandomAlarm" type="danger">随机报警</el-button>
  </div>

  <!-- 实时信息面板 -->
  <div class="info-panel" v-if="selectedDrone">
    <div class="title">无人机实时信息</div>
    <div>名称：{{ selectedDrone.name }}</div>
    <div>电量：{{ selectedDrone.battery }} %</div>
    <div>经度：{{ info.lon }}</div>
    <div>纬度：{{ info.lat }}</div>
    <div>高度：{{ info.height }} m</div>
    <div>状态：{{ droneStatus }}</div>
  </div>

  <!-- 报警信息面板 -->
  <div class="alarm-panel" v-if="alarmActive">
    <div class="title">🚨 区域报警</div>
    <div>报警位置：{{ alarmPosition.lon.toFixed(6) }}, {{ alarmPosition.lat.toFixed(6) }}</div>
    <div>处理无人机：{{ respondingDrone?.name || '等待中...' }}</div>
    <div>状态：{{ alarmStatus }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import * as Cesium from 'cesium'

// ======================
// TS类型定义
// ======================
interface Drone {
  id: string
  name: string
  color: Cesium.Color
  battery: number
  route: { lon: number; lat: number; height: number }[]
  status: 'patrolling' | 'responding' | 'inspecting' | 'returning'
}

interface AlarmArea {
  lon: number
  lat: number
  radius: number // 公里
}

// ======================
// 全局实例
// ======================
const earthContainer = ref<HTMLElement | null>(null)
let viewer: any = null
let droneEntities: { entity: Cesium.Entity; positions: Cesium.Cartesian3[]; drone: Drone }[] = []
let refreshInterval: number | null = null
let loopInterval: number | null = null

// ======================
// 选中无人机 & 实时信息
// ======================
const selectedDrone = ref<Drone | null>(null)
const info = reactive({ lon: '--', lat: '--', height: '--' })
const droneStatus = ref('正常巡逻')

// ======================
// 报警相关状态
// ======================
const alarmActive = ref(false)
const alarmPosition = reactive({ lon: 0, lat: 0 })
const alarmRadius = 0.5 // 公里
const alarmEntity = ref<Cesium.Entity | null>(null)
const alarmPulseInterval = ref<number | null>(null)
const respondingDrone = ref<Drone | null>(null)
const alarmStatus = ref('等待响应')
// 记录无人机离开巡逻路线时的位置和巡逻进度
const droneInterruptInfo = ref<Record<string, {
  position: Cesium.Cartesian3
  routeIndex: number
  progress: number // 在当前路径段上的进度 0-1
}>>({})

// ======================
// 起点
// ======================
const HOME = { lon: 116.400, lat: 39.910, height: 150 }

// ======================
// 极简简单路线（去+回，不重叠）
// ======================
function getSimpleRoute(lon: number, lat: number) {
  return [
    HOME,
    { lon: HOME.lon + lon, lat: HOME.lat + lat, height: 150 },
    { lon: HOME.lon + lon, lat: HOME.lat + lat - 0.0015, height: 150 },
    HOME
  ]
}

// 三台无人机
const droneList: Drone[] = [
  { id: 'drone-001', name: '巡检一号', color: Cesium.Color.RED, battery: 86, route: getSimpleRoute(0.004, 0.003), status: 'patrolling' },
  { id: 'drone-002', name: '物流二号', color: Cesium.Color.BLUE, battery: 92, route: getSimpleRoute(0.005, 0), status: 'patrolling' },
  { id: 'drone-003', name: '消防三号', color: Cesium.Color.LIME, battery: 78, route: getSimpleRoute(0.004, -0.003), status: 'patrolling' },
]

// ======================
// 初始化地球
// ======================
const initCesium = () => {
  if (!earthContainer.value) return
  viewer = new Cesium.Viewer(earthContainer.value, {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    timeline: false, animation: false, baseLayerPicker: false, geocoder: false, homeButton: true,
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'
  flyToPosition(HOME.lon, HOME.lat, 1500)
  setTimeout(createAllDrones, 600)
}

const flyToPosition = (lon: number, lat: number, height: number, duration = 2) => {
  if (!viewer) return
  viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, height), duration })
}

// ======================
// 创建无人机
// ======================
const createAllDrones = () => {
  if (!viewer) return
  viewer.entities.removeAll()
  droneEntities = []
  selectedDrone.value = null

  droneList.forEach(drone => {
    const positions = drone.route.map(p => Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height))
    viewer.entities.add({ polyline: { positions, width: 3, material: drone.color.withAlpha(0.5) } })

    const entity = viewer.entities.add({
      id: drone.id, name: drone.name,
      position: positions[0],
      point: { pixelSize: 20, color: drone.color, outlineColor: Cesium.Color.WHITE, outlineWidth: 3 },
      label: { text: drone.name, pixelOffset: new Cesium.Cartesian2(0, -30), fillColor: Cesium.Color.WHITE },
    })
    droneEntities.push({ entity, positions, drone })
  })

  // 绑定点击事件
  bindSelectEvent()
}

// ======================
// 点击选择无人机
// ======================
const bindSelectEvent = () => {
  if (!viewer) return
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
    const res = viewer!.scene.pick(e.position)
    if (res && res.id) {
      const entity = res.id as Cesium.Entity
      selectedDrone.value = droneList.find(d => d.id === entity.id) || null
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// ======================
// 单次飞行任务（飞一圈就结束）
// ======================
const flyOneLoop = () => {
  if (!viewer) return

  // 重置所有无人机到起点
  droneEntities.forEach((item: any) => {
    item.entity.position = item.positions[0]
  })

  // 开始飞
  viewer.clock.shouldAnimate = true
  viewer.clock.currentTime = Cesium.JulianDate.clone(viewer.clock.startTime)

  droneEntities.forEach(({ entity, positions }) => {
    const prop = new Cesium.SampledPositionProperty()
    const total = 80
    const step = total / positions.length
    const start = viewer!.clock.startTime

    positions.forEach((p, i) => {
      const t = Cesium.JulianDate.addSeconds(start, i * step, new Cesium.JulianDate())
      prop.addSample(t, p)
    })

    entity.position = prop
  })
}

// ======================
// 检测是否回到起点 → 重置再起飞
// ======================
const startAutoLoopCheck = () => {
  if (loopInterval) clearInterval(loopInterval)
  loopInterval = window.setInterval(() => {
    if (!viewer || !viewer.clock.shouldAnimate) return

    const diff = Cesium.JulianDate.secondsDifference(
      viewer.clock.currentTime,
      viewer.clock.startTime
    )

    if (diff >= 80) {
      flyOneLoop()
    }
  }, 500)
}

// ======================
// 实时信息刷新（恢复！）
// ======================
const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = window.setInterval(() => {
    if (!selectedDrone.value || !viewer) return
    const e = viewer.entities.getById(selectedDrone.value.id)
    if (!e || !e.position) return

    const pos = e.position.getValue(viewer.clock.currentTime)
    if (!pos) return
    const c = Cesium.Cartographic.fromCartesian(pos)
    info.lon = Cesium.Math.toDegrees(c.longitude).toFixed(6)
    info.lat = Cesium.Math.toDegrees(c.latitude).toFixed(6)
    info.height = c.height.toFixed(1)
  }, 100)
}

// ======================
// 控制按钮
// ======================
const startAll = () => {
  if (!viewer) return
  flyOneLoop()
}

const pauseAll = () => {
  if (viewer) viewer.clock.shouldAnimate = false
}

const resetAll = () => {
  createAllDrones()
}

// ======================
// 报警相关函数
// ======================

// 生成随机报警位置
const generateRandomAlarmPosition = () => {
  // 在HOME位置附近随机生成报警位置
  const offsetLon = (Math.random() - 0.5) * 0.01 // ±0.005度
  const offsetLat = (Math.random() - 0.5) * 0.01 // ±0.005度
  
  return {
    lon: HOME.lon + offsetLon,
    lat: HOME.lat + offsetLat
  }
}

// 创建呼吸效果的报警区域
const createAlarmArea = (lon: number, lat: number) => {
  if (!viewer) return
  
  // 清除之前的报警区域
  if (alarmEntity.value) {
    viewer.entities.remove(alarmEntity.value)
  }
  
  // 创建淡红色呼吸效果的圆形区域
  const position = Cesium.Cartesian3.fromDegrees(lon, lat)
  alarmEntity.value = viewer.entities.add({
    position,
    ellipse: {
      semiMinorAxis: alarmRadius * 1000, // 转换为米
      semiMajorAxis: alarmRadius * 1000,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(() => {
          // 呼吸效果：透明度在0.2到0.6之间变化
          const alpha = 0.4 + 0.2 * Math.sin(Date.now() / 500)
          return Cesium.Color.fromCssColorString('#ff6b6b').withAlpha(alpha)
        }, false)
      ),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString('#ff4757').withAlpha(0.8),
      outlineWidth: 3,
      height: 0,
      extrudedHeight: 50 // 给一点高度，看起来更立体
    }
  })
  
  // 添加闪烁的报警标记
  viewer.entities.add({
    position,
    billboard: {
      image: '/vite.svg', // 可以使用自定义报警图标
      scale: 1.5,
      color: new Cesium.CallbackProperty(() => {
        const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 300)
        return Cesium.Color.fromCssColorString('#ff3838').withAlpha(alpha)
      }, false)
    },
    label: {
      text: '🚨 报警区域',
      font: '16px sans-serif',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      pixelOffset: new Cesium.Cartesian2(0, 40)
    }
  })
}

// 触发随机报警
const triggerRandomAlarm = () => {
  if (alarmActive.value) {
    console.log('已有报警正在处理中')
    return
  }
  
  // 生成随机报警位置
  const pos = generateRandomAlarmPosition()
  alarmPosition.lon = pos.lon
  alarmPosition.lat = pos.lat
  
  // 激活报警
  alarmActive.value = true
  alarmStatus.value = '等待无人机响应'
  
  // 创建报警区域
  createAlarmArea(pos.lon, pos.lat)
  
  // 选择最近的无人机去处理
  selectRespondingDrone(pos.lon, pos.lat)
}

// 选择最近的无人机去处理报警
const selectRespondingDrone = (alarmLon: number, alarmLat: number) => {
  if (!viewer) return
  
  // 获取所有无人机当前位置
  let closestDrone: Drone | null = null
  let minDistance = Infinity
  
  droneList.forEach(drone => {
    const entity = viewer!.entities.getById(drone.id)
    if (entity && entity.position) {
      const pos = entity.position.getValue(viewer!.clock.currentTime)
      if (pos) {
        const cartographic = Cesium.Cartographic.fromCartesian(pos)
        const droneLon = Cesium.Math.toDegrees(cartographic.longitude)
        const droneLat = Cesium.Math.toDegrees(cartographic.latitude)
        
        // 简单计算距离（近似）
        const distance = Math.sqrt(
          Math.pow(droneLon - alarmLon, 2) + Math.pow(droneLat - alarmLat, 2)
        )
        
        if (distance < minDistance) {
          minDistance = distance
          closestDrone = drone
        }
      }
    }
  })
  
  if (closestDrone) {
    respondingDrone.value = closestDrone
    closestDrone.status = 'responding'
    alarmStatus.value = `${closestDrone.name} 正在前往报警区域`
    
    // 记录无人机离开巡逻路线时的位置
    const entity = viewer!.entities.getById(closestDrone.id)
    if (entity && entity.position) {
      const currentPos = entity.position.getValue(viewer!.clock.currentTime)
      if (currentPos) {
        // 找到无人机在巡逻路线上的位置
        const droneEntity = droneEntities.find(de => de.drone.id === closestDrone!.id)
        if (droneEntity) {
          // 计算当前在哪个路径段上
          let closestSegmentIndex = 0
          let minDistance = Infinity
          
          for (let i = 0; i < droneEntity.positions.length - 1; i++) {
            const start = droneEntity.positions[i]
            const end = droneEntity.positions[i + 1]
            
            // 计算点到线段的距离（简化处理）
            const distance = Cesium.Cartesian3.distance(currentPos, start)
            if (distance < minDistance) {
              minDistance = distance
              closestSegmentIndex = i
            }
          }
          
          // 记录中断信息
          droneInterruptInfo.value[closestDrone.id] = {
            position: currentPos,
            routeIndex: closestSegmentIndex,
            progress: 0.5 // 默认在路径段中间
          }
        }
      }
    }
    
    // 让无人机飞往报警区域
    sendDroneToAlarm(closestDrone, alarmLon, alarmLat)
  }
}

// 发送无人机到报警区域
const sendDroneToAlarm = (drone: Drone, alarmLon: number, alarmLat: number) => {
  if (!viewer) return
  
  const droneEntity = droneEntities.find(de => de.drone.id === drone.id)
  if (!droneEntity) return
  
  // 获取无人机实体
  const entity = viewer.entities.getById(drone.id)
  if (!entity) return
  
  // 获取无人机当前位置
  let currentPos
  if (entity.position) {
    currentPos = entity.position.getValue(viewer.clock.currentTime)
  }
  
  // 如果获取不到当前位置，使用起点
  if (!currentPos) {
    currentPos = droneEntity.positions[0]
  }
  
  const currentCarto = Cesium.Cartographic.fromCartesian(currentPos)
  const currentHeight = currentCarto.height || 150
  
  // 创建飞往报警区域的路径
  const alarmPos = Cesium.Cartesian3.fromDegrees(alarmLon, alarmLat, currentHeight)
  
  // 更新无人机状态
  drone.status = 'responding'
  if (selectedDrone.value?.id === drone.id) {
    droneStatus.value = '前往报警区域'
  }
  
  // 暂停这个无人机的自动巡逻（通过设置新的位置属性）
  // 使用简单的动画让无人机飞往报警区域
  const startTime = Date.now()
  const duration = 5000 // 5秒
  
  const animateDrone = () => {
    if (!viewer || !entity) return
    
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 线性插值
    const newPos = new Cesium.Cartesian3()
    Cesium.Cartesian3.lerp(currentPos, alarmPos, progress, newPos)
    
    // 更新无人机位置
    entity.position = newPos
    
    if (progress < 1) {
      // 继续动画
      requestAnimationFrame(animateDrone)
    } else {
      // 到达报警区域
      drone.status = 'inspecting'
      alarmStatus.value = `${drone.name} 到达报警区域`
      
      if (selectedDrone.value?.id === drone.id) {
        droneStatus.value = '到达报警区域'
      }
      
      // 立即清除报警区域（红色呼吸效果）
      if (alarmEntity.value) {
        viewer.entities.remove(alarmEntity.value)
        alarmEntity.value = null
      }
      
      // 立即解除报警并返回
      resolveAlarm(drone)
    }
  }
  
  // 开始动画
  animateDrone()
}

// 解除报警，无人机返回巡逻
const resolveAlarm = (drone: Drone) => {
  if (!viewer) return
  
  // 报警解除状态更新
  alarmStatus.value = '报警已解除'
  
  // 更新无人机状态
  drone.status = 'returning'
  if (selectedDrone.value?.id === drone.id) {
    droneStatus.value = '返回巡逻路线'
  }
  
  // 获取无人机当前位置（报警区域）
  const entity = viewer.entities.getById(drone.id)
  if (!entity) return
  
  const currentPos = entity.position || droneEntities.find(de => de.drone.id === drone.id)?.positions[0]
  if (!currentPos) return
  
  // 找到无人机的原始巡逻路线
  const droneEntity = droneEntities.find(de => de.drone.id === drone.id)
  if (!droneEntity) return
  
  // 获取中断时的位置信息
  const interruptInfo = droneInterruptInfo.value[drone.id]
  let returnPos
  
  if (interruptInfo) {
    // 返回中断时的位置
    returnPos = interruptInfo.position
  } else {
    // 如果没有记录中断位置，返回路线的起点
    returnPos = droneEntity.positions[0]
  }
  
  // 使用requestAnimationFrame让无人机平滑返回
  const startTime = Date.now()
  const duration = 3000 // 3秒返回（比去的时候快一点）
  
  const animateReturn = () => {
    if (!viewer || !entity) return
    
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 线性插值
    const currentPosValue = typeof currentPos === 'function' ? currentPos.getValue(viewer.clock.currentTime) : currentPos
    const startPos = currentPosValue || droneEntity.positions[0]
    
    const newPos = new Cesium.Cartesian3()
    Cesium.Cartesian3.lerp(startPos, returnPos, progress, newPos)
    
    // 更新无人机位置
    entity.position = newPos
    
    if (progress < 1) {
      // 继续动画
      requestAnimationFrame(animateReturn)
    } else {
      // 已返回中断位置，恢复巡逻
      restoreDronePatrolFromInterrupt(drone)
    }
  }
  
  // 开始返回动画
  animateReturn()
}

// 从中断位置恢复无人机巡逻
const restoreDronePatrolFromInterrupt = (drone: Drone) => {
  if (!viewer) return
  
  // 重置状态
  drone.status = 'patrolling'
  alarmActive.value = false
  respondingDrone.value = null
  alarmStatus.value = '等待响应'
  
  if (selectedDrone.value?.id === drone.id) {
    droneStatus.value = '正常巡逻'
  }
  
  // 找到无人机的实体
  const entity = viewer.entities.getById(drone.id)
  if (!entity) return
  
  // 找到无人机的原始路线数据
  const droneEntity = droneEntities.find(de => de.drone.id === drone.id)
  if (!droneEntity) return
  
  // 获取中断信息
  const interruptInfo = droneInterruptInfo.value[drone.id]
  
  if (interruptInfo) {
    // 从中断位置继续巡逻
    // 计算从中断位置开始的剩余路线
    const remainingPositions = droneEntity.positions.slice(interruptInfo.routeIndex)
    
    if (remainingPositions.length > 0) {
      // 创建新的位置属性，从中断位置开始
      const prop = new Cesium.SampledPositionProperty()
      const totalPerSegment = 80 / droneEntity.positions.length // 每个路径段的时间
      
      // 获取当前时间
      const startTime = viewer.clock.currentTime
      
      // 第一个点：中断位置（立即）
      prop.addSample(startTime, interruptInfo.position)
      
      // 剩余的点
      for (let i = 1; i < remainingPositions.length; i++) {
        const time = Cesium.JulianDate.addSeconds(startTime, i * totalPerSegment, new Cesium.JulianDate())
        prop.addSample(time, remainingPositions[i])
      }
      
      // 设置无人机位置
      entity.position = prop
      
      // 确保时钟在运行
      viewer.clock.shouldAnimate = true
      
      console.log(`无人机 ${drone.name} 从中断位置恢复巡逻`)
      return
    }
  }
  
  // 如果没有中断信息或处理失败，从头开始巡逻
  restoreDronePatrolFromStart(drone)
}

// 从头开始恢复无人机巡逻
const restoreDronePatrolFromStart = (drone: Drone) => {
  if (!viewer) return
  
  // 找到无人机的实体
  const entity = viewer.entities.getById(drone.id)
  if (!entity) return
  
  // 找到无人机的原始路线数据
  const droneEntity = droneEntities.find(de => de.drone.id === drone.id)
  if (!droneEntity) return
  
  // 重新设置无人机的位置属性，从头开始
  const prop = new Cesium.SampledPositionProperty()
  const total = 80 // 一圈80秒
  const stepTime = total / droneEntity.positions.length
  
  // 获取当前时间
  const startTime = viewer.clock.currentTime
  
  // 为巡逻路线的每个点设置时间
  droneEntity.positions.forEach((position, i) => {
    const time = Cesium.JulianDate.addSeconds(startTime, i * stepTime, new Cesium.JulianDate())
    prop.addSample(time, position)
  })
  
  // 设置无人机位置
  entity.position = prop
  
  // 确保时钟在运行
  viewer.clock.shouldAnimate = true
  
  console.log(`无人机 ${drone.name} 从头开始恢复巡逻`)
}

// ======================
// 生命周期
// ======================
onMounted(() => {
  initCesium()
  startAutoRefresh()    // 实时信息
  startAutoLoopCheck()  // 自动循环
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (loopInterval) clearInterval(loopInterval)
  if (viewer) viewer.destroy()
})
</script>

<style scoped>
#cesium-container {
  width: 100%;
  height: 100vh;
}
</style>

<style>
.control-panel {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 8px;
}

.info-panel {
  position: absolute;
  right: 20px;
  bottom: 80px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.7;
}

.info-panel .title {
  font-weight: bold;
  margin-bottom: 8px;
}

.alarm-panel {
  position: absolute;
  left: 220px;
  bottom: 20px;
  z-index: 999;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 71, 87, 0.9));
  color: #fff;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4);
  animation: pulse 2s infinite;
  min-width: 250px;
}

.alarm-panel .title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(255, 71, 87, 0.7);
  }
  100% {
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4);
  }
}
</style>