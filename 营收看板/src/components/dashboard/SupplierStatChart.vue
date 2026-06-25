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

    <div v-if="isQualifiedChart" class="flex flex-wrap items-center gap-3 mb-3">
      <button
        v-for="level in levelOptions"
        :key="level.key"
        :class="[
          'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
          selectedLevel === level.key
            ? 'text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        ]"
        :style="selectedLevel === level.key ? { backgroundColor: level.color } : {}"
        @click="handleLevelChange(level.key)"
      >
        {{ level.label }}
      </button>
      <span class="text-sm text-gray-600 ml-auto">
        供应商总计<span class="font-semibold text-gray-800">{{ totalSupplierCount }}</span>个
      </span>
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
  },
  levels: {
    type: Object,
    default: () => ({})
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

const selectedCategory = ref('')

// 等级切换
const selectedLevel = ref('A')
const isQualifiedChart = computed(() => props.subTitle === '合格供应商统计')
const levelOptions = computed(() => {
  const lvls = props.levels || {}
  return [
    { key: 'A', label: `A级供应商${lvls.A?.supplierCount || 0}家`, color: '#3b82f6' },
    { key: 'B', label: `B级供应商${lvls.B?.supplierCount || 0}家`, color: '#10b981' },
    { key: 'C', label: `C级供应商${lvls.C?.supplierCount || 0}家`, color: '#f59e0b' }
  ]
})
const totalSupplierCount = computed(() => {
  const lvls = props.levels || {}
  return (lvls.A?.supplierCount || 0) + (lvls.B?.supplierCount || 0) + (lvls.C?.supplierCount || 0)
})

const isALevelChart = computed(() => {
  return isQualifiedChart.value
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

const currentLevelStats = computed(() => {
  const lvls = props.levels || {}
  const levelData = lvls[selectedLevel.value] || {}
  return {
    count: levelData.supplierCount || 0,
    color: levelData.color || '#3b82f6'
  }
})

const handleCategoryChange = (value) => {
  selectedCategory.value = value
  if (chart) {
    initChart()
  }
}

const handleLevelChange = (level) => {
  selectedLevel.value = level
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
    const levelData = props.levels?.[selectedLevel.value] || props.levels?.A || {}
    const levelColor = levelData.color || '#3b82f6'
    const levelName = `${selectedLevel.value}级供应商数量`

    // 柱子：供应商数量（按分类分布）
    seriesData.push({
      name: levelName,
      type: 'bar',
      data: levelData.countByCategory || [0, 0, 0, 0],
      itemStyle: { color: levelColor },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' }
      }
    })
    // 折线1：合同数（隐藏，仅悬浮窗显示）
    seriesData.push({
      name: '履约中合同数',
      type: 'line',
      showInLegend: false,
      data: levelData.contractCount || [0, 0, 0, 0],
      yAxisIndex: 1,
      itemStyle: { color: '#93c5fd', opacity: 0 },
      lineStyle: { width: 3, opacity: 0 },
      symbol: 'none',
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' }
      }
    })
    // 折线2：合同额
    seriesData.push({
      name: '履约中合同额(万元)',
      type: 'line',
      smooth: true,
      data: levelData.contractAmount || [0, 0, 0, 0],
      yAxisIndex: 1,
      itemStyle: { color: '#dbeafe' },
      lineStyle: { color: '#dbeafe', width: 2 },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' }
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
        crossStyle: { color: '#999' }
      },
      formatter: (params) => {
        let result = `<div style="font-weight:bold;margin-bottom:6px;">${params[0].name}</div>`
        params.forEach(param => {
          let val = param.value
          if (param.seriesName.includes('合同额')) val += '万元'
          else if (param.seriesName.includes('合同数')) val += '个'
          else if (param.seriesName.includes('供应商数量')) val += '家'
          result += `<div>${param.marker}${param.seriesName}: ${val}</div>`
        })
        if (isALevelChart.value && selectedLevel.value) {
          result += `<div style="margin-top:4px;padding-top:4px;border-top:1px dashed #eee;font-size:11px;color:#888;">当前查看: ${selectedLevel.value}级合格供应商</div>`
        }
        return result
      }
    },
    legend: {
      show: true,
      bottom: 0,
      itemWidth: 14,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
      data: isTop10Chart.value ? seriesData.map(s => s.name) : seriesData.filter(s => s.name !== '履约中合同数').map(s => s.name)
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
      if (params.seriesName.includes('供应商数量')) {
        emit('drill-down', { type: 'a-level', category: params.name, contractCategory: selectedCategory.value, supplierLevel: selectedLevel.value })
      } else if (params.seriesName.includes('合同数')) {
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

watch(() => [props.series, props.categories, props.topLine, selectedCategory.value, selectedLevel.value, props.levels], () => {
  if (chart) {
    initChart()
  }
}, { deep: true })
</script>