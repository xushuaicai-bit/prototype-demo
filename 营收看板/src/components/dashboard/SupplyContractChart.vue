<template>
  <div class="bg-white rounded-xl p-4 shadow-sm h-full">
    <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
      <div class="flex items-center gap-3">
        <div>
          <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ subTitle }}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-2 mb-3">
      <p class="text-sm text-blue-800">
        <span class="font-semibold">{{ currentUnit }}</span>
        应签<span class="font-semibold text-blue-600">{{ contractStats.shouldSign }}</span>个，
        未签<span class="font-semibold text-gray-600">{{ contractStats.pendingSign }}</span>个，
        合同签订及时率<span class="font-semibold text-blue-600">{{ contractStats.timelinessRate }}</span>%
      </p>
    </div>

    <div ref="chartRef" class="flex-1 min-h-[300px]"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  subTitle: String,
  categories: Array,
  series: Array,
  warningData: Object,
  currentUnit: {
    type: String,
    default: '全部'
  }
})

const emit = defineEmits(['drill-down', 'category-change'])

const chartRef = ref(null)
let chart = null

const legendItems = computed(() => [
  { name: '未签', color: '#9ca3af' },
  { name: '红色预警', color: '#ef4444' },
  { name: '橙色预警', color: '#f97316' },
  { name: '黄色预警', color: '#eab308' }
])

const isSingleUnit = computed(() => {
  return props.currentUnit !== '全部'
})

const contractStats = computed(() => {
  if (!props.warningData) {
    return { shouldSign: 0, signed: 0, pendingSign: 0, timelinessRate: 0 }
  }

  const data = props.warningData['全部'] || { shouldSign: 0, signed: 0, red: 0, orange: 0, yellow: 0 }
  const pending = data.red + data.orange + data.yellow
  const rate = data.shouldSign > 0 ? Math.round((data.signed / data.shouldSign) * 100) : 0

  return {
    shouldSign: data.shouldSign,
    signed: data.signed,
    pendingSign: pending,
    timelinessRate: rate
  }
})

const initChart = () => {
  if (!chartRef.value) return
  
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  
  let option = {}
  
  if (isSingleUnit.value) {
    const stats = contractStats.value
    const pending = stats.shouldSign - stats.signed

    option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const rate = params.value > 0 ? Math.round((params.value / stats.shouldSign) * 100) : 0
          return `${params.name}: ${params.value}个 (${rate}%)`
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: '5%'
      },
      series: [
        {
          name: '合同状态',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          data: [
            { value: pending, name: '未签', itemStyle: { color: '#9ca3af' } },
            { value: props.warningData['全部']?.red || 0, name: '红色预警', itemStyle: { color: '#ef4444' } },
            { value: props.warningData['全部']?.orange || 0, name: '橙色预警', itemStyle: { color: '#f97316' } },
            { value: props.warningData['全部']?.yellow || 0, name: '黄色预警', itemStyle: { color: '#eab308' } }
          ].filter(item => item.value > 0)
        }
      ]
    }
  } else {
    const unsignedSeries = props.series.find(s => s.name === '未签')
    const redSeries = props.series.find(s => s.name === '红色预警')
    const orangeSeries = props.series.find(s => s.name === '橙色预警')
    const yellowSeries = props.series.find(s => s.name === '黄色预警')
    
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          let result = `<div style="font-weight:bold;margin-bottom:8px;">${params[0].axisValue}</div>`
          let totalShouldSign = 0
          let totalSigned = 0
          let totalPending = 0
          
          params.forEach(param => {
            totalSigned += param.seriesName === '未签' ? param.value : 0
          totalPending += param.seriesName !== '未签' ? param.value : 0
          })
          totalShouldSign = totalSigned + totalPending
          
          params.forEach(param => {
            const rate = totalShouldSign > 0 ? Math.round((param.value / totalShouldSign) * 100) : 0
            result += `<div style="display:flex;justify-content:space-between;gap:20px;">
              <span>${param.marker}${param.seriesName}</span>
              <span style="font-weight:bold;">${param.value}个 (${rate}%)</span>
            </div>`
          })
          
          const timelinessRate = totalShouldSign > 0 ? Math.round((totalSigned / totalShouldSign) * 100) : 0
          result += `<div style="border-top:1px solid #eee;margin-top:8px;padding-top:8px;">
            <div style="display:flex;justify-content:space-between;">
              <span>应签总数</span>
              <span style="font-weight:bold;">${totalShouldSign}个</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>未签数量</span>
              <span style="font-weight:bold;color:#9ca3af;">${totalSigned}个</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>预警数量</span>
              <span style="font-weight:bold;">${totalPending}个</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>签订及时率</span>
              <span style="font-weight:bold;color:#3b82f6;">${timelinessRate}%</span>
            </div>
          </div>`
          
          return result
        }
      },
      legend: {
        show: true,
        bottom: 0,
        itemWidth: 14,
        itemHeight: 10,
        textStyle: { fontSize: 11 }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: props.categories,
        axisLabel: {
          rotate: 30,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        name: '合同数量'
      },
      series: [
        {
          name: '未签',
          type: 'bar',
          stack: 'total',
          data: unsignedSeries?.data || [],
          itemStyle: {
            color: '#9ca3af',
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        },
        {
          name: '黄色预警',
          type: 'bar',
          stack: 'total',
          data: yellowSeries?.data || [],
          itemStyle: {
            color: '#eab308'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        },
        {
          name: '橙色预警',
          type: 'bar',
          stack: 'total',
          data: orangeSeries?.data || [],
          itemStyle: {
            color: '#f97316'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        },
        {
          name: '红色预警',
          type: 'bar',
          stack: 'total',
          data: redSeries?.data || [],
          itemStyle: {
            color: '#ef4444',
            borderRadius: [0, 0, 4, 4]
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }
      ]
    }
  }
  
  chart.setOption(option)
  
  chart.on('click', (params) => {
    let filter = {}
    if (isSingleUnit.value) {
      if (params.name === '未签') {
        filter = { signStatus: '未签订' }
      } else if (params.name === '红色预警') {
        filter = { signStatus: '未签订', overdueDays: '60+' }
      } else if (params.name === '橙色预警') {
        filter = { signStatus: '未签订', overdueDays: '45-60' }
      } else if (params.name === '黄色预警') {
        filter = { signStatus: '未签订', overdueDays: '21-44' }
      }
    } else {
      if (params.name && params.name !== '全部') {
        filter.unit = params.name
      }
    }
    
    emit('drill-down', filter)
  })
}

const handleResize = () => {
  chart && chart.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart && chart.dispose()
})

watch(() => [props.series, props.categories, props.currentUnit], () => {
  if (chart) {
    initChart()
  }
}, { deep: true })
</script>