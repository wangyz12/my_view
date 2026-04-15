// src/utils/echarts.ts

/**
 * ECharts 图表配置生成工具
 * 
 * 提供后台管理系统中常用的图表配置生成函数，包括：
 * - 用户增长趋势图（折线图）
 * - 部门分布图（饼图）
 * - 数据状态分布图（饼图）
 * - 角色分布图（柱状图 + 平均值折线）
 * - 系统访问趋势图（折线图）
 * - 实时数据图（折线图）
 * 
 * 所有配置均经过优化，支持动画、自定义 Tooltip 等功能
 * 
 * @module EChartsUtils
 * @author Your Name
 * @version 1.0.0
 */

import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent,
  TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

// ==================== 注册 ECharts 组件 ====================

/**
 * 注册 ECharts 所需组件
 * 按需导入可减少打包体积
 */
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent,
  TitleComponent,
  CanvasRenderer
])

// ==================== 类型定义 ====================

/** 用户增长图表数据项 */
export interface UserGrowthData {
  /** 日期，格式：YYYY-MM-DD */
  date: string
  /** 用户数量 */
  count: number
}

/** 部门分布图表数据项 */
export interface DeptDistributionData {
  /** 部门名称 */
  name: string
  /** 部门人数 */
  value: number
}

/** 角色分布图表数据项 */
export interface RoleDistributionData {
  /** 角色名称 */
  name: string
  /** 角色人数 */
  value: number
}

/** 访问趋势图表数据项 */
export interface AccessTrendData {
  /** 日期或时间段 */
  date: string
  /** 访问次数 */
  count: number
}

/** 实时数据图表配置 */
export interface RealTimeDataConfig {
  /** 时间戳数组（X轴数据） */
  timestamps: string[]
  /** 数据数组（Y轴数据） */
  data: number[]
  /** 图表标题 */
  title: string
  /** 数据单位 */
  unit: string
}

// ==================== 常量配置 ====================

/**
 * 图表颜色常量
 * 统一管理图表颜色，便于主题切换
 */
const CHART_COLORS = {
  /** 主题蓝色 - 用于主要数据 */
  primary: '#409EFF',
  /** 成功绿色 - 用于正向增长 */
  success: '#67C23A',
  /** 警告橙色 - 用于警告信息 */
  warning: '#E6A23C',
  /** 危险红色 - 用于下降或异常 */
  danger: '#F56C6C',
  /** 信息灰色 - 用于次要信息 */
  info: '#909399',
  /** 紫色 - 用于访问趋势等 */
  purple: '#B37FEB',
  /** 白色 - 用于边框和背景 */
  white: '#FFFFFF'
}

/**
 * 标准网格配置
 * 适用于大多数图表，左右留白3%，上下留白10%
 */
const COMMON_GRID = {
  left: '3%',
  right: '4%',
  bottom: '3%',
  top: '10%',
  containLabel: true
}

/**
 * 紧凑网格配置
 * 适用于小尺寸图表或需要更多空间的场景
 */
const COMPACT_GRID = {
  left: '2%',
  right: '2%',
  bottom: '2%',
  top: '5%',
  containLabel: true
}

/**
 * 生成 X 轴配置
 * @param data - X 轴数据数组
 * @param boundaryGap - 是否在两端的刻度之间留白
 * @returns X 轴配置对象
 */
const getCommonXAxis = (data: string[], boundaryGap: boolean = false) => ({
  type: 'category' as const,
  boundaryGap,
  data,
  axisLine: { lineStyle: { color: '#dcdfe6' } },
  axisLabel: { color: '#606266' }
})

/**
 * 生成 Y 轴配置
 * @param formatter - 数值格式化函数或字符串模板
 * @returns Y 轴配置对象
 */
const getCommonYAxis = (formatter?: string) => ({
  type: 'value' as const,
  axisLine: { lineStyle: { color: '#dcdfe6' } },
  axisLabel: { 
    color: '#606266',
    formatter: formatter || '{value}'
  },
  splitLine: {
    lineStyle: { color: '#f0f0f0', type: 'dashed' as const }
  }
})

// ==================== 工具函数 ====================

/**
 * 计算增长率
 * @param current - 当前值
 * @param previous - 前一个值
 * @returns 增长率百分比，保留一位小数
 * 
 * @example
 * calculateGrowth(120, 100) // 返回 20
 * calculateGrowth(80, 100)  // 返回 -20
 */
const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number(((current - previous) / previous * 100).toFixed(1))
}

/**
 * 创建趋势图 Tooltip 格式化函数
 * 用于生成用户增长图表的自定义提示框内容
 * 
 * @param counts - 历史数据数组（用于计算环比）
 * @param unit - 数据单位，默认为"人"
 * @returns Tooltip 格式化函数
 * 
 * @example
 * const tooltip = createTrendTooltip([100, 120, 150], '人')
 * // 鼠标悬停时显示：日期 + 用户数 + 环比增长
 */
const createTrendTooltip = (
  counts: number[],
  unit: string = '人'
): any => {
  return (params: unknown) => {
    // 安全类型检查，防止数据异常
    if (!params || !Array.isArray(params) || params.length === 0) {
      return ''
    }
    
    const param = params[0] as any
    const date = param.axisValue
    const value = param.value
    const index = param.dataIndex
    
    // 构建基础 Tooltip
    let tooltip = `<div style="margin-bottom: 8px;"><strong>${date}</strong></div>`
    tooltip += `<div style="margin-bottom: 4px;">用户数: <strong>${value}${unit}</strong></div>`
    
    // 显示环比增长（与前一天对比）
    if (index > 0 && counts[index - 1] !== undefined) {
      const prevValue = counts[index - 1] as number
      const growth = value - prevValue
      const growthPercent = calculateGrowth(value, prevValue)
      
      if (growth > 0) {
        tooltip += `<div style="margin-top: 4px; color: ${CHART_COLORS.success};">📈 新增 ${growth}${unit} (${growthPercent}%)</div>`
      } else if (growth < 0) {
        tooltip += `<div style="margin-top: 4px; color: ${CHART_COLORS.danger};">📉 减少 ${Math.abs(growth)}${unit} (${Math.abs(growthPercent)}%)</div>`
      }
    }
    
    return tooltip
  }
}

// ==================== 图表配置函数 ====================

/**
 * 生成用户增长折线图配置
 * 
 * 功能特点：
 * - 平滑曲线，带面积填充效果
 * - 自定义 Tooltip，显示环比增长
 * - 支持动画效果
 * 
 * @param data - 用户增长数据数组
 * @returns ECharts 配置对象
 * 
 * @example
 * const data = [
 *   { date: '2024-01-01', count: 100 },
 *   { date: '2024-01-02', count: 120 }
 * ]
 * const option = getUserGrowthOptions(data)
 * chart.setOption(option)
 */
export function getUserGrowthOptions(data: UserGrowthData[]): EChartsOption {
  const counts = data.map(item => item.count)
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      formatter: createTrendTooltip(counts, '人')
    },
    grid: COMMON_GRID,
    xAxis: getCommonXAxis(data.map(item => item.date), false),
    yAxis: getCommonYAxis('{value}人'),
    series: [{
      name: '用户数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: CHART_COLORS.primary, borderColor: CHART_COLORS.white, borderWidth: 2 },
      lineStyle: { color: CHART_COLORS.primary, width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ])
      },
      data: counts
    }]
  }
}

/**
 * 生成部门分布饼图配置
 * 
 * 功能特点：
 * - 环形饼图样式
 * - 图例可滚动（适用于部门较多的情况）
 * - 悬停放大效果
 * 
 * @param data - 部门分布数据数组
 * @returns ECharts 配置对象
 * 
 * @example
 * const data = [
 *   { name: '技术部', value: 45 },
 *   { name: '市场部', value: 28 }
 * ]
 * const option = getDeptDistributionOptions(data)
 * chart.setOption(option)
 */
export function getDeptDistributionOptions(data: DeptDistributionData[]): EChartsOption {
  const colors = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info, CHART_COLORS.purple]
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const { name, value, percent } = params as any
        return `<strong>${name}</strong><br/>人数: ${value}人<br/>占比: ${percent}%`
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: data.map(item => item.name),
      textStyle: { color: '#606266' }
    },
    series: [{
      name: '部门分布',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['40%', '50%'],
      itemStyle: { borderRadius: 10, borderColor: CHART_COLORS.white, borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
      data: data.map((item, index) => ({
        ...item,
        itemStyle: { color: colors[index % colors.length] }
      }))
    }]
  }
}

/**
 * 生成数据状态分布饼图配置（紧凑版）
 * 
 * 功能特点：
 * - 紧凑样式，适合小尺寸容器
 * - 隐藏图例，直接显示百分比标签
 * - 适合展示状态分布（正常/异常/待处理等）
 * 
 * @param data - 状态分布数据数组
 * @returns ECharts 配置对象
 * 
 * @example
 * const data = [
 *   { name: '正常', value: 85 },
 *   { name: '异常', value: 15 }
 * ]
 * const option = getDataStatusOptions(data)
 * chart.setOption(option)
 */
export function getDataStatusOptions(data: DeptDistributionData[]): EChartsOption {
  const colors = [CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info]
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const { name, value, percent } = params as any
        return `<strong>${name}</strong><br/>数量: ${value}<br/>占比: ${percent}%`
      }
    },
    legend: { show: false },
    series: [{
      name: '数据状态',
      type: 'pie',
      radius: ['60%', '80%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 8, borderColor: CHART_COLORS.white, borderWidth: 2 },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {d}%',
        fontSize: 12
      },
      labelLine: { show: true, length: 10, length2: 5 },
      data: data.map((item, index) => ({
        ...item,
        itemStyle: { color: colors[index % colors.length] }
      }))
    }]
  }
}

/**
 * 生成角色分布柱状图配置（带平均值折线）
 * 
 * 功能特点：
 * - 柱状图 + 平均值折线
 * - 高于平均值显示 ↑，低于平均值显示 ↓
 * - 各柱使用不同颜色区分
 * 
 * @param data - 角色分布数据数组
 * @returns ECharts 配置对象
 * 
 * @example
 * const data = [
 *   { name: '管理员', value: 5 },
 *   { name: '普通用户', value: 120 }
 * ]
 * const option = getRoleDistributionOptions(data)
 * chart.setOption(option)
 */
export function getRoleDistributionOptions(data: RoleDistributionData[]): EChartsOption {
  const values = data.map(item => item.value)
  const total = values.reduce((sum, val) => sum + val, 0)
  const average = total / data.length
  
  const colors = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info, CHART_COLORS.purple]
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: COMMON_GRID,
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: { rotate: 45, interval: 0 }
    },
    yAxis: getCommonYAxis('{value}人'),
    series: [
      {
        name: '人数',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0] as [number, number, number, number],
          color: (params: any) => {
            const index = params?.dataIndex ?? 0
            return colors[index % colors.length] || CHART_COLORS.primary
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const value = params?.value ?? 0
            const diff = value - average
            if (diff > 0) return `↑ ${value}`
            if (diff < 0) return `↓ ${value}`
            return `= ${value}`
          }
        },
        data: values
      },
      {
        name: '平均值',
        type: 'line',
        symbol: 'none',
        lineStyle: { color: CHART_COLORS.danger, width: 2, type: 'dashed' },
        data: Array(data.length).fill(average)
      }
    ]
  }
}

/**
 * 生成系统访问趋势折线图配置（紧凑版）
 * 
 * 功能特点：
 * - 紧凑样式，适合小尺寸容器
 * - 标注峰值和低谷
 * - 显示平均值参考线
 * 
 * @param data - 访问趋势数据数组
 * @returns ECharts 配置对象
 * 
 * @example
 * const data = [
 *   { date: '00:00', count: 120 },
 *   { date: '01:00', count: 80 }
 * ]
 * const option = getAccessTrendOptions(data)
 * chart.setOption(option)
 */
export function getAccessTrendOptions(data: AccessTrendData[]): EChartsOption {
  const counts = data.map(item => item.count)
  const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        if (!params || !Array.isArray(params) || params.length === 0) {
          return ''
        }
        const param = params[0] as any
        return `<strong>${param.axisValue}</strong><br/>访问量: ${param.value}次`
      }
    },
    grid: COMPACT_GRID,
    xAxis: getCommonXAxis(data.map(item => item.date), false),
    yAxis: getCommonYAxis('{value}次'),
    series: [{
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: CHART_COLORS.purple },
      lineStyle: { color: CHART_COLORS.purple, width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(179, 127, 235, 0.3)' },
          { offset: 1, color: 'rgba(179, 127, 235, 0.05)' }
        ])
      },
      markPoint: {
        data: [
          { type: 'max', name: '峰值', symbolSize: 8, itemStyle: { color: CHART_COLORS.danger } },
          { type: 'min', name: '低谷', symbolSize: 8, itemStyle: { color: CHART_COLORS.info } }
        ]
      },
      markLine: {
        silent: true,
        lineStyle: { color: CHART_COLORS.warning, type: 'dashed', width: 1 },
        data: [{ yAxis: avgCount, name: '平均值' }]
      },
      data: counts
    }]
  }
}

/**
 * 生成实时数据折线图配置
 * 
 * 功能特点：
 * - 适合展示实时数据（如 CPU 使用率、在线人数等）
 * - 平滑曲线，无数据点标记
 * - 面积填充效果
 * 
 * @param config - 实时数据配置对象
 * @returns ECharts 配置对象
 * 
 * @example
 * const config = {
 *   timestamps: ['10:00', '10:01', '10:02'],
 *   data: [45, 52, 48],
 *   title: 'CPU使用率',
 *   unit: '%'
 * }
 * const option = getRealTimeDataOptions(config)
 * chart.setOption(option)
 */
export function getRealTimeDataOptions(config: RealTimeDataConfig): EChartsOption {
  const { timestamps, data, title, unit } = config
  
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        if (!params || !Array.isArray(params) || params.length === 0) {
          return ''
        }
        const param = params[0] as any
        return `${param.axisValue}<br/>${title}: ${param.value}${unit}`
      }
    },
    grid: COMMON_GRID,
    xAxis: getCommonXAxis(timestamps, false),
    yAxis: getCommonYAxis(`{value}${unit}`),
    series: [{
      name: title,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: CHART_COLORS.primary, width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ])
      },
      data
    }]
  }
}

// ==================== 辅助函数 ====================

/**
 * 生成随机时间戳数组（用于实时数据演示）
 * 
 * @param count - 时间戳数量
 * @param interval - 时间间隔（毫秒），默认 1000ms
 * @returns 格式化的时间戳数组（HH:MM:SS）
 * 
 * @example
 * const timestamps = generateTimestamps(10, 1000)
 * // 返回：['14:30:00', '14:29:59', '14:29:58', ...]
 */
export function generateTimestamps(count: number, interval: number = 1000): string[] {
  const now = Date.now()
  const timestamps: string[] = []
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * interval)
    timestamps.push(`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`)
  }
  
  return timestamps
}

/**
 * 生成随机数据数组（用于实时数据演示）
 * 
 * 使用随机游走算法生成连续的数据点，保证数据平滑过渡
 * 
 * @param count - 数据点数量
 * @param min - 最小值
 * @param max - 最大值
 * @returns 随机数据数组，保留两位小数
 * 
 * @example
 * const data = generateRandomDataArray(20, 0, 100)
 * // 返回：[45.23, 46.78, 44.12, ...]
 */
export function generateRandomDataArray(count: number, min: number, max: number): number[] {
  const data: number[] = []
  let lastValue = (min + max) / 2
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (max - min) * 0.1
    lastValue = Math.max(min, Math.min(max, lastValue + change))
    data.push(Number(lastValue.toFixed(2)))
  }
  
  return data
}