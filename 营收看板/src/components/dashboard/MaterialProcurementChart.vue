<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-base font-semibold text-gray-800">{{ currentTitle }}</h3>
      <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            activeTab === '集采'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          ]"
          @click="switchTab('集采')"
        >
          集采
        </button>
        <button
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            activeTab === '集租'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          ]"
          @click="switchTab('集租')"
        >
          集租
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="cat in currentCategoryOptions"
        :key="cat.value"
        :class="[
          'px-3 py-1 text-xs font-medium rounded-lg transition-all',
          activeCategory === cat.value
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        ]"
        @click="handleCategoryChange(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="bg-green-50 border-l-4 border-green-500 rounded-r-lg px-4 py-2 mb-3">
      <p class="text-sm text-green-800">
        <span class="font-semibold">{{ currentUnit }}</span>
        签订{{ currentTabName }}合同<span class="font-semibold text-green-600">{{ procurementStats.signed }}</span>个，
        履约中<span class="font-semibold text-green-600">{{ procurementStats.executing }}</span>个，
        {{ currentTabName }}执行率<span class="font-semibold text-green-600">{{ procurementStats.executionRate }}</span>%
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
  categories: Array,
  series: Array,
  categoryOptions: Object,
  currentUnit: {
    type: String,
    default: '全部'
  }
})

const chartRef = ref(null)
let chart = null

const activeTab = ref('集采')
const activeCategory = ref('全部')

const currentTabName = computed(() => activeTab.value)

const currentCategoryOptions = computed(() => {
  return props.categoryOptions?.[activeTab.value] || []
})

const currentTitle = computed(() => {
  if (activeTab.value === '集采') {
    return props.title || ''
  }
  return '设备集租合同情况'
})

const displaySeries = computed(() => {
  if (!props.series) return []
  return props.series.map(s => ({
    ...s,
    name: s.name?.replace('集采', activeTab.value)
  }))
})

const getDisplayCategories = () => {
  if (!props.categories) return []
  return props.categories.map(cat => cat.replace('集采', activeTab.value))
}

const procurementStats = computed(() => {
  const stats = {
    '集采': { signed: 120, executing: 105, executionRate: 88 },
    '集租': { signed: 85, executing: 72, executionRate: 85 }
  }
  return stats[activeTab.value] || { signed: 0, executing: 0, executionRate: 0 }
})

const currentUnit = computed(() => props.currentUnit || '全部')

const switchTab = (tab) => {
  activeTab.value = tab
  activeCategory.value = '全部'
  if (chart) {
    initChart()
  }
}

const handleCategoryChange = (value) => {
  activeCategory.value = value
}

const initChart = () => {
  if (!chartRef.value) return
  
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  
  const displayCategories = getDisplayCategories()
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
      data: displayCategories
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        axisLabel: { fontSize: 11, interval: 0 }
      },
      {
        type: 'value',
        name: '完成率(%)',
        max: 100,
        position: 'right',
        axisLabel: { fontSize: 11, interval: 0 }
      }
    ],
    series: [
      ...props.series.slice(0, 2).map(s => ({
        name: s.name?.replace('集采', activeTab.value),
        type: 'bar',
        data: s.data,
        itemStyle: {
          color: s.color
        }
      })),
      {
        name: props.series[2]?.name?.replace('集采', activeTab.value),
        type: 'line',
        yAxisIndex: 1,
        data: props.series[2]?.data || [],
        itemStyle: {
          color: props.series[2]?.color
        },
        lineStyle: {
          color: props.series[2]?.color
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  chart.on('click', () => {
    window.open('https://www.smart-worksite.com/hj/#/micro/supplies/biz/enterprise/supplies/frame-contract/index', '_blank')
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

watch(() => [props.series, props.categories], () => {
  if (chart) {
    initChart()
  }
}, { deep: true })
</script>