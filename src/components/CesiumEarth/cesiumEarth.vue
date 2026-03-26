<template>
  <div id="cesium-container" ref="earthContainer"></div>

  <!-- 控制面板 -->
  <div class="control-panel">
    <el-button @click="startAll">起飞</el-button>
    <el-button @click="pauseAll">暂停</el-button>
    <el-button @click="resetAll">重置</el-button>
  </div>

  <!-- 实时信息面板 -->
  <div class="info-panel" v-if="selectedDrone">
    <div class="title">无人机实时信息</div>
    <div>名称：{{ selectedDrone.name }}</div>
    <div>电量：{{ selectedDrone.battery }} %</div>
    <div>经度：{{ info.lon }}</div>
    <div>纬度：{{ info.lat }}</div>
    <div>高度：{{ info.height }} m</div>
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
}

// ======================
// 全局实例
// ======================
const earthContainer = ref<HTMLElement | null>(null)
let viewer: any= null
let droneEntities: { entity: Cesium.Entity; positions: Cesium.Cartesian3[]; drone: Drone }[] = []
let refreshInterval: number | null = null
let loopInterval: number | null = null

// ======================
// 选中无人机 & 实时信息
// ======================
const selectedDrone = ref<Drone | null>(null)
const info = reactive({ lon: '--', lat: '--', height: '--' })

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
  { id: 'drone-001', name: '巡检一号', color: Cesium.Color.RED, battery: 86, route: getSimpleRoute(0.004, 0.003) },
  { id: 'drone-002', name: '物流二号', color: Cesium.Color.BLUE, battery: 92, route: getSimpleRoute(0.005, 0) },
  { id: 'drone-003', name: '消防三号', color: Cesium.Color.LIME, battery: 78, route: getSimpleRoute(0.004, -0.003) },
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
  droneEntities.forEach((item:any) => {
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
#cesium-container { width: 100%; height: 100vh; }
</style>

<style>
.control-panel {
  position: absolute; right: 20px; bottom: 20px; z-index: 999;
  background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px;
}
.info-panel {
  position: absolute; right: 20px; bottom: 80px; z-index: 999;
  background: rgba(0,0,0,0.75); color: #fff; padding: 12px 16px; border-radius: 8px;
  font-size: 14px; line-height: 1.7;
}
.info-panel .title { font-weight: bold; margin-bottom: 8px; }
</style>