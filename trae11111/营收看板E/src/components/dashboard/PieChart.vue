<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
      <span class="text-sm text-gray-500">重点/非重点</span>
    </div>
    <div class="flex items-center">
      <div ref="chartRef" class="w-48 h-48"></div>
      <div class="flex-1 ml-4">
        <div class="text-center mb-4">
          <div class="text-3xl font-bold text-blue-600">{{ total }}</div>
          <div class="text-sm text-gray-500">{{ unit }}</div>
        </div>
        <div class="space-y-2">
          <div 
            v-for="(item, index) in details" 
            :key="item.name"
            class="flex items-center justify-between text-sm"
          >
            <div class="flex items-center">
              <span :class="['w-3 h-3 rounded-full mr-2', colors[index]]"></span>
              <span class="text-gray-600">{{ item.name }}</span>
            </div>
            <span class="text-gray-800 font-medium">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  total: String,
  unit: String,
  chartData: Object,
  details: Array
})

const colors = ['#1890ff', '#722ed1', '#13c2c2', '#fa8c16']

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.chartData.series.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
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
