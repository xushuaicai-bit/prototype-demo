<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex space-x-4">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span class="text-sm text-gray-600">红色预警</span>
          <span class="ml-1 text-lg font-bold text-red-500">{{ redAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
          <span class="text-sm text-gray-600">橙色预警</span>
          <span class="ml-1 text-lg font-bold text-orange-400">{{ orangeAlert }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
          <span class="text-sm text-gray-600">黄色预警</span>
          <span class="ml-1 text-lg font-bold text-yellow-500">{{ yellowAlert }}</span>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="h-64"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  redAlert: Number,
  orangeAlert: Number,
  yellowAlert: Number,
  chartData: Object
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已上报', '已上报'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.chartData.categories
    },
    yAxis: {
      type: 'value',
      name: '计划数'
    },
    series: props.chartData.series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      itemStyle: {
        color: index === 0 ? '#1890ff' : '#52c41a'
      }
    }))
  }
  
  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.chartData, () => {
  initChart()
}, { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>
