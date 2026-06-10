<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ subTitle }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="flex items-center text-xs" v-for="series in chartSeries" :key="series.name">
          <span class="w-3 h-3 rounded mr-1" :style="{ backgroundColor: series.color }"></span>
          <span class="text-gray-600">{{ series.name }}</span>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="h-64"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  subTitle: String,
  categories: Array,
  series: Array
})

const chartRef = ref(null)
let chart = null

const chartSeries = props.series

const initChart = () => {
  chart = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.categories
    },
    yAxis: {
      type: 'value'
    },
    series: props.series.map(s => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data,
      itemStyle: {
        color: s.color
      }
    }))
  }
  
  chart.setOption(option)
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
