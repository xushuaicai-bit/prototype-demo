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

    <!-- 大标签统计 -->
    <div class="flex gap-3 mb-3">
      <div class="flex-1 bg-blue-50 rounded-lg px-3 py-2 text-center cursor-pointer hover:shadow-md transition-shadow" @click="openExternalLink">
        <div class="text-xs text-gray-500">采购合同签订数量</div>
        <div class="text-lg font-bold text-blue-600">{{ currentSummary.signedCount || 0 }}</div>
      </div>
      <div class="flex-1 bg-green-50 rounded-lg px-3 py-2 text-center cursor-pointer hover:shadow-md transition-shadow" @click="openExternalLink">
        <div class="text-xs text-gray-500">项目合同执行数量</div>
        <div class="text-lg font-bold text-green-600">{{ currentSummary.executingCount || 0 }}</div>
      </div>
      <div class="flex-1 bg-orange-50 rounded-lg px-3 py-2 text-center">
        <div class="text-xs text-gray-500">集采完成率</div>
        <div class="text-lg font-bold text-orange-600">{{ currentSummary.completionRate || 0 }}%</div>
      </div>
    </div>

    <!-- 股份/环境切换按钮 -->
    <div class="flex gap-2 mb-3">
      <button
        v-for="key in groupKeys"
        :key="key"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded-lg transition-all',
          activeGroup === key
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
        ]"
        @click="switchGroup(key)"
      >
        {{ key }}{{ activeTab === '集采' ? '集采' : '集租' }}项目
      </button>
    </div>

    <div ref="chartRef" class="flex-1 min-h-[300px]"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { externalUrls, openExternal } from '@/config/externalUrls'

const props = defineProps({
  title: String,
  summary: Object,
  groups: Object,
  rentSummary: Object,
  rentGroups: Object,
  currentUnit: {
    type: String,
    default: '全部'
  }
})

const chartRef = ref(null)
let chart = null

const activeTab = ref('集采')
const activeGroup = ref('股份')

const currentTitle = computed(() => {
  if (activeTab.value === '集采') {
    return props.title || ''
  }
  return '设备集租合同情况'
})

const currentGroups = computed(() => {
  return activeTab.value === '集采' ? props.groups : props.rentGroups
})

const groupKeys = computed(() => {
  return Object.keys(currentGroups.value || {})
})

const currentGroup = computed(() => {
  return currentGroups.value?.[activeGroup.value] || {}
})

const currentSummary = computed(() => {
  const suffix = activeTab.value === '集采' ? '集采项目' : '集租项目'
  const key = activeGroup.value + suffix
  const summaryMap = activeTab.value === '集采' ? props.summary : props.rentSummary
  return summaryMap?.[key] || {}
})

const switchTab = (tab) => {
  activeTab.value = tab
  activeGroup.value = '股份'
  if (chart) {
    initChart()
  }
}

const switchGroup = (key) => {
  activeGroup.value = key
  if (chart) {
    initChart()
  }
}

const openExternalLink = () => {
  openExternal(externalUrls.suppliesFrameContract)
}

const initChart = () => {
  if (!chartRef.value) return

  if (chart) {
    chart.dispose()
  }

  chart = echarts.init(chartRef.value)

  const group = currentGroup.value
  const materials = group.materials || []
  const contractCount = group.contractCount || []
  const contractAmount = group.contractAmount || []
  const actualAmount = group.actualAmount || []
  const paidAmount = group.paidAmount || []

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
      data: materials,
      axisLabel: { fontSize: 11, interval: 0, rotate: materials.length > 5 ? 30 : 0 }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        axisLabel: { fontSize: 11 }
      },
      {
        type: 'value',
        name: '金额(万元)',
        position: 'right',
        axisLabel: { fontSize: 11 }
      }
    ],
    series: [
      {
        name: '合同签订数量',
        type: 'bar',
        data: contractCount,
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: '合同签订金额',
        type: 'line',
        yAxisIndex: 1,
        data: contractAmount,
        smooth: true,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { color: '#f59e0b', width: 2 }
      },
      {
        name: '实际采购金额',
        type: 'line',
        yAxisIndex: 1,
        data: actualAmount,
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { color: '#10b981', width: 2 }
      },
      {
        name: '已支付金额',
        type: 'line',
        yAxisIndex: 1,
        data: paidAmount,
        smooth: true,
        itemStyle: { color: '#ef4444' },
        lineStyle: { color: '#ef4444', width: 2 }
      }
    ]
  }

  chart.setOption(option)

  chart.on('click', () => {
    openExternal(externalUrls.suppliesFrameContract)
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

watch(() => [props.summary, props.groups, props.rentSummary, props.rentGroups], () => {
  if (chart) {
    initChart()
  }
}, { deep: true })
</script>
