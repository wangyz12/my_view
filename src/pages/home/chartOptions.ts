// ECharts 配置生成工具

import * as echarts from 'echarts'
import { CHART_SERIES_COLORS } from './config'

// 用户增长折线图配置
export function getUserGrowthOptions(data: { date: string, count: number }[]):any {
  // 计算增长率
  const counts:any = data.map(item => item.count)
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0]
        const date = point.axisValue
        const value = point.value
        const index = point.dataIndex
        
        let tooltip = `<div style="margin-bottom: 8px;">
          <strong>${date}</strong>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: #409EFF; border-radius: 50%; margin-right: 8px;"></span>
          <span>用户数: <strong>${value}人</strong></span>
        </div>`
        
        // 显示增长率
        if (index > 0) {
          const prevValue:any = counts[index - 1]
          const growth:any = value - prevValue
          const growthPercent:any = ((growth / prevValue) * 100).toFixed(1)
          
          if (growth > 0) {
            tooltip += `<div style="margin-top: 4px; color: #67C23A;">
              📈 新增 ${growth}人 (${growthPercent}%)
            </div>`
          } else if (growth < 0) {
            tooltip += `<div style="margin-top: 4px; color: #F56C6C;">
              📉 减少 ${Math.abs(growth)}人 (${Math.abs(growthPercent)}%)
            </div>`
          } else {
            tooltip += `<div style="margin-top: 4px; color: #909399;">
              ➡ 无变化
            </div>`
          }
        }
        
        // 显示累计增长
        const totalGrowth = value - counts[0]
        const totalGrowthPercent = ((totalGrowth / counts[0]) * 100).toFixed(1)
        
        if (index > 0) {
          tooltip += `<div style="margin-top: 4px; color: #409EFF;">
            累计增长: ${totalGrowth > 0 ? '+' : ''}${totalGrowth}人 (${totalGrowthPercent}%)
          </div>`
        }
        
        return tooltip
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        formatter: '{value}人'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#409EFF',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          color: '#409EFF',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        },
        data: data.map(item => item.count)
      }
    ]
  }
}

// 部门分布饼图配置
export function getDeptDistributionOptions(data: { name: string, value: number }[]) {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#B37FEB']
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const name = params.name
        const value = params.value
        const percent = params.percent
        
        let tooltip = `<div style="margin-bottom: 8px;">
          <strong>${name}</strong>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 2px; margin-right: 8px;"></span>
          <span>人数: <strong>${value}人</strong></span>
        </div>`
        
        tooltip += `<div style="margin-top: 4px;">
          占比: <strong>${percent}%</strong>
        </div>`
        
        // 计算排名
        const data = params.data.data
        const sortedData = [...data].sort((a, b) => b.value - a.value)
        const rank = sortedData.findIndex(item => item.name === name) + 1
        
        if (rank === 1) {
          tooltip += `<div style="margin-top: 4px; color: #E6A23C; font-weight: bold;">
            🥇 排名第1
          </div>`
        } else if (rank === 2) {
          tooltip += `<div style="margin-top: 4px; color: #909399; font-weight: bold;">
            🥈 排名第2
          </div>`
        } else if (rank === 3) {
          tooltip += `<div style="margin-top: 4px; color: #B37FEB; font-weight: bold;">
            🥉 排名第3
          </div>`
        } else {
          tooltip += `<div style="margin-top: 4px; color: #606266;">
            排名第${rank}
          </div>`
        }
        
        return tooltip
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: data.map(item => item.name),
      textStyle: {
        color: '#606266'
      }
    },
    series: [
      {
        name: '数据分布',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  }
}

// 数据状态饼图配置（更紧凑的样式）
export function getDataStatusOptions(data: { name: string, value: number }[]) {
  const colors = ['#67C23A', '#E6A23C', '#F56C6C', '#909399']
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const name = params.name
        const value = params.value
        const percent = params.percent
        
        let tooltip = `<div style="margin-bottom: 8px;">
          <strong>${name}</strong>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 2px; margin-right: 8px;"></span>
          <span>数量: <strong>${value}</strong></span>
        </div>`
        
        tooltip += `<div style="margin-top: 4px;">
          占比: <strong>${percent}%</strong>
        </div>`
        
        // 根据状态显示不同图标
        let icon = '📊'
        if (name.includes('正常')) icon = '✅'
        if (name.includes('待审核')) icon = '⏳'
        if (name.includes('已锁定')) icon = '🔒'
        if (name.includes('已删除')) icon = '🗑️'
        
        tooltip += `<div style="margin-top: 4px; color: ${params.color};">
          ${icon} ${name}
        </div>`
        
        return tooltip
      }
    },
    legend: {
      show: false  // 隐藏图例，节省空间
    },
    series: [
      {
        name: '数据状态',
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          fontSize: 12
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5
        },
        emphasis: {
          scale: true,
          scaleSize: 5
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  }
}

// 角色分布柱状图配置（带平均值折线）
export function getRoleDistributionOptions(data: { name: string, value: number }[]) {
  const colors = CHART_SERIES_COLORS
  
  // 计算平均值
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const average = total / data.length
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const barData = params[0]
        const lineData = params[1]
        
        let tooltip = `<div style="margin-bottom: 8px;">
          <strong>${barData.name}</strong>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: ${barData.color}; border-radius: 2px; margin-right: 8px;"></span>
          <span>人数: <strong>${barData.value}人</strong></span>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 10px; height: 2px; background: #F56C6C; margin-right: 8px;"></span>
          <span>平均值: <strong>${lineData.value.toFixed(1)}人</strong></span>
        </div>`
        
        const difference = barData.value - average
        const percent:any = ((difference / average) * 100).toFixed(1)
        
        if (difference > 0) {
          tooltip += `<div style="margin-top: 8px; color: #67C23A;">
            ↑ 高于平均值 ${Math.abs(difference).toFixed(1)}人 (${percent}%)
          </div>`
        } else if (difference < 0) {
          tooltip += `<div style="margin-top: 8px; color: #F56C6C;">
            ↓ 低于平均值 ${Math.abs(difference).toFixed(1)}人 (${Math.abs(percent)}%)
          </div>`
        } else {
          tooltip += `<div style="margin-top: 8px; color: #909399;">
            = 等于平均值
          </div>`
        }
        
        return tooltip
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        formatter: '{value}人'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: (params: any) => {
            return colors[params.dataIndex % colors.length]
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#303133',
          fontWeight: 'bold',
          formatter: (params: any) => {
            const value = params.value
            const diff = value - average
            if (diff > 0) {
              return `{a|↑} ${value}`
            } else if (diff < 0) {
              return `{b|↓} ${value}`
            } else {
              return `{c|=} ${value}`
            }
          },
          rich: {
            a: {
              color: '#67C23A',
              fontSize: 12
            },
            b: {
              color: '#F56C6C',
              fontSize: 12
            },
            c: {
              color: '#909399',
              fontSize: 12
            }
          }
        },
        data: data.map(item => item.value)
      },
      {
        name: '平均值',
        type: 'line',
        symbol: 'none',
        lineStyle: {
          color: '#F56C6C',
          width: 2,
          type: 'dashed'
        },
        label: {
          show: true,
          position: 'end',
          formatter: '平均值: {c}',
          color: '#F56C6C',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#F56C6C',
          borderWidth: 1,
          borderRadius: 4,
          padding: [4, 8]
        },
        data: data.map(() => average)
      }
    ]
  }
}

// 系统访问趋势折线图配置（紧凑版）
export function getAccessTrendOptions(data: { date: string, count: number }[]):any {
  // 计算峰值和趋势
  const counts = data.map(item => item.count)
  const maxCount = Math.max(...counts)
  const minCount = Math.min(...counts)
  const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length
  
  return {
    animation: true,
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0]
        const time = point.axisValue
        const value = point.value
        
        let tooltip = `<div style="margin-bottom: 8px;">
          <strong>${time}</strong>
        </div>`
        
        tooltip += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: #B37FEB; border-radius: 50%; margin-right: 8px;"></span>
          <span>访问量: <strong>${value}次</strong></span>
        </div>`
        
        // 显示与平均值的比较
        const diffFromAvg:any = value - avgCount
        const percentFromAvg:any = ((diffFromAvg / avgCount) * 100).toFixed(1)
        
        if (value === maxCount) {
          tooltip += `<div style="margin-top: 4px; color: #F56C6C; font-weight: bold;">
            🏆 今日峰值
          </div>`
        } else if (value === minCount) {
          tooltip += `<div style="margin-top: 4px; color: #909399; font-weight: bold;">
            📉 今日低谷
          </div>`
        }
        
        if (diffFromAvg > 0) {
          tooltip += `<div style="margin-top: 4px; color: #67C23A;">
            ↑ 高于平均值 ${Math.abs(diffFromAvg).toFixed(1)}次 (${percentFromAvg}%)
          </div>`
        } else if (diffFromAvg < 0) {
          tooltip += `<div style="margin-top: 4px; color: #E6A23C;">
            ↓ 低于平均值 ${Math.abs(diffFromAvg).toFixed(1)}次 (${Math.abs(percentFromAvg)}%)
          </div>`
        }
        
        // 显示趋势分析
        const index = params[0].dataIndex
        if (index > 0) {
          const prevValue:any = counts[index - 1]
          const change = value - prevValue
          const changePercent:any = ((change / prevValue) * 100).toFixed(1)
          
          if (change > 0) {
            tooltip += `<div style="margin-top: 4px; color: #409EFF;">
              ↗ 较上一时段增长 ${change}次 (${changePercent}%)
            </div>`
          } else if (change < 0) {
            tooltip += `<div style="margin-top: 4px; color: #F56C6C;">
              ↘ 较上一时段减少 ${Math.abs(change)}次 (${Math.abs(changePercent)}%)
            </div>`
          }
        }
        
        return tooltip
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        fontSize: 11,
        formatter: '{value}次'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#B37FEB',
          borderColor: '#fff',
          borderWidth: 1
        },
        lineStyle: {
          color: '#B37FEB',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(179, 127, 235, 0.3)' },
            { offset: 1, color: 'rgba(179, 127, 235, 0.05)' }
          ])
        },
        markPoint: {
          data: [
            {
              type: 'max',
              name: '峰值',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#F56C6C'
              },
              label: {
                show: true,
                formatter: '峰值',
                color: '#F56C6C',
                fontWeight: 'bold'
              }
            },
            {
              type: 'min',
              name: '低谷',
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#909399'
              },
              label: {
                show: true,
                formatter: '低谷',
                color: '#909399',
                fontWeight: 'bold'
              }
            }
          ]
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#E6A23C',
            type: 'dashed',
            width: 1
          },
          data: [
            {
              yAxis: avgCount,
              name: '平均值',
              label: {
                show: true,
                position: 'end',
                formatter: '平均值',
                color: '#E6A23C',
                fontSize: 10
              }
            }
          ]
        },
        data: data.map(item => item.count)
      }
    ]
  }
}

// 实时数据折线图配置
export function getRealTimeDataOptions(timestamps: string[], data: number[], title: string, unit: string):any {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.axisValue}<br/>${title}: ${param.value}${unit}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timestamps,
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        formatter: `{value}${unit}`
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: title,
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: '#409EFF'
        },
        lineStyle: {
          color: '#409EFF',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        },
        data: data
      }
    ]
  }
}

// 生成随机时间戳（用于实时数据）
export function generateTimestamps(count: number, interval: number = 1000): string[] {
  const now = Date.now()
  const timestamps: string[] = []
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * interval)
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')
    timestamps.push(`${hours}:${minutes}:${seconds}`)
  }
  
  return timestamps
}

// 生成随机数据（用于实时数据）
export function generateRandomDataArray(count: number, min: number, max: number): number[] {
  const data: number[] = []
  let lastValue = (min + max) / 2
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (max - min) * 0.1
    lastValue = Math.max(min, Math.min(max, lastValue + change))
    data.push(parseFloat(lastValue.toFixed(2)))
  }
  
  return data
}