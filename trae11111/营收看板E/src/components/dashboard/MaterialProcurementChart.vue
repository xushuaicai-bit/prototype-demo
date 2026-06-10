<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex space-x-2">
        <button class="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">菜单</button>
        <button class="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">高级</button>
      </div>
    </div>
    <div class="flex mb-2 justify-end">
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
    yAxis: [
      {
        type: 'value',
        name: '数量'
      },
      {
        type: 'value',
        name: '完成率(%)',
        max: 100,
        position: 'right'
      }
    ],
    series: [
      ...props.series.slice(0, 2).map(s => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        itemStyle: {
          color: s.color
        }
      })),
      {
        name: props.series[2]?.name,
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
