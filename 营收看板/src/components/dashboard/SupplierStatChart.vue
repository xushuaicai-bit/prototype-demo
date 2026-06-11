<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex flex-wrap justify-between items-start gap-3 mb-3">
      <div>
        <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ subTitle }}</p>
      </div>
    </div>

    <div v-if="isTop10Chart" class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="cat in categoryOptions"
        :key="cat.value"
        :class="[
          'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
          selectedCategory === cat.value
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        ]"
        @click="handleCategoryChange(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>
    
    <div v-if="isALevelChart" class="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg px-4 py-2 mb-3">
      <p class="text-sm text-purple-800">
        <span class="font-semibold">{{ currentUnit }}</span>
        A级供应商数量<span class="font-semibold text-purple-600">{{ aLevelStats.count }}</span>个，
        A级供应商占比<span class="font-semibold text-purple-600">{{ aLevelStats.ratio }}</span>%
      </p>
    </div>
    
    <div ref="chartRef" class="flex-1 min-h-[300px]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  subTitle: String,
  categories: Array,
  series: Array,
  topLine: Array,
  drillType: String,
  currentUnit: {
    type: String,
    default: '全部'
  }
})

const emit = defineEmits(['drill-down'])

const chartRef = ref(null)
let chart = null

const categoryOptions = [
  { value: '全部', label: '全部' },
  { value: '专业分包', label: '专业分包' },
  { value: '劳务分包', label: '劳务分包' },
  { value: '周转材料/设备租赁', label: '周转材料/设备租赁' },
  { value: '材料/设备采购', label: '材料/设备采购' }
]

const selectedCategory = ref('全部')

const isALevelChart = computed(() => {
  return props.subTitle === 'A级承包商统计'
})

const isTop10Chart = computed(() => {
  return props.subTitle === '按合同额排名'
})

const displaySeries = computed(() => {
  if (isALevelChart.value) {
    return props.series.slice(0, 2)
  }
  return props.series
})

const currentUnit = computed(() => props.currentUnit || '全部')

const aLevelStats = computed(() => {
  const totalA = props.series?.find(s => s.name === 'A级承包商数量')?.data?.reduce((sum, val) => sum + val, 0) || 0
  const totalSuppliers = 250
  const ratio = totalSuppliers > 0 ? Math.round((totalA / totalSuppliers) * 100) : 0
  return {
    count: totalA,
    ratio: ratio
  }
})

const handleCategoryChange = (value) => {
  selectedCategory.value = value
  if (chart) {
    initChart()
  }
}

const initChart = () => {
  if (!chartRef.value) return
  
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  
  let seriesData = []
  let yAxis = [{ type: 'value', name: '数量', axisLabel: { fontSize: 11, interval: 0 } }]
  
  if (isALevelChart.value) {
    props.series.forEach((s, index) => {
      if (s.name === '履约中合同额（非集采）') {
        seriesData.push({
          name: s.name,
          type: 'line',
          smooth: true,
          data: s.data,
          yAxisIndex: 1,
          itemStyle: {
            color: s.color
          },
          lineStyle: {
            color: s.color,
            width: 3
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        })
      } else {
        seriesData.push({
          name: s.name,
          type: 'bar',
          data: s.data,
          itemStyle: {
            color: s.color
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        })
      }
    })
    
    yAxis.push({
      type: 'value',
      name: '金额(万元)',
      position: 'right',
      axisLabel: {
        fontSize: 11,
        interval: 0,
        formatter: '{value}'
      }
    })
  } else {
    // Top10 模式：柱子=履约中合同数，折线=履约中合同额
    yAxis = [{ type: 'value', name: '数量', axisLabel: { fontSize: 11, interval: 0 } }]
    yAxis.push({
      type: 'value',
      name: '金额(万元)',
      position: 'right',
      axisLabel: { fontSize: 11, interval: 0, formatter: '{value}' }
    })

    props.series.forEach((s) => {
      if (s.name.includes('合同额')) {
        seriesData.push({
          name: s.name,
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: s.data,
          itemStyle: { color: s.color },
          lineStyle: { color: s.color, width: 3 },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        })
      } else {
        seriesData.push({
          name: s.name,
          type: 'bar',
          data: s.data,
          itemStyle: { color: s.color },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        })
      }
    })
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
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
      right: '8%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.categories,
      axisLabel: {
        rotate: isTop10Chart.value ? 35 : (isALevelChart.value ? 20 : 0),
        fontSize: isTop10Chart.value ? 10 : 12
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: yAxis,
    series: seriesData
  }
  
  chart.setOption(option)
  
  chart.on('click', (params) => {
    if (isALevelChart.value) {
      if (params.seriesName === 'A级承包商数量') {
        emit('drill-down', { type: 'a-level', category: params.name, contractCategory: selectedCategory.value })
      } else if (params.seriesName === '履约中合同数（非集采）') {
        emit('drill-down', { type: 'contract-count', category: params.name, contractCategory: selectedCategory.value })
      }
    } else if (isTop10Chart.value) {
      emit('drill-down', { type: 'top10-supplier', supplierName: params.name, contractCategory: selectedCategory.value })
    }
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

watch(() => [props.series, props.categories, props.topLine, selectedCategory.value], () => {
  if (chart) {
    initChart()
  }
}, { deep: true })
</script>