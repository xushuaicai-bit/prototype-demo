<template>
  <div class="bg-white rounded-xl p-3 shadow-sm h-full flex flex-col">
    <!-- 标题 -->
    <div class="flex items-center mb-2">
      <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
      <h3 class="text-sm font-semibold text-gray-800">风险预警及时性</h3>
    </div>

    <!-- 双环形图区域 -->
    <div class="flex-1 grid grid-cols-2 gap-3">

      <!-- ========== 环形图1：当前进入风险 ========== -->
      <div class="flex flex-col">
        <div ref="currentChartRef" class="flex-1 min-h-[100px]"></div>
        <!-- 图例说明 -->
        <div class="flex items-center justify-center gap-3 mt-1.5 pt-1.5 border-t border-gray-100">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            <span class="text-gray-600">完成<span class="font-bold text-green-600 ml-0.5">{{ currentCompleted }}</span>个</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>
            <span class="text-gray-600">剩余<span class="font-bold text-orange-600 ml-0.5">{{ currentRemaining }}</span>个</span>
          </span>
        </div>
      </div>

      <!-- ========== 环形图2：未来两周进入风险 ========== -->
      <div class="flex flex-col">
        <div ref="futureChartRef" class="flex-1 min-h-[100px]"></div>
        <!-- 图例说明 -->
        <div class="flex items-center justify-center gap-2 mt-1.5 pt-1.5 border-t border-gray-100">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            <span class="text-gray-600">I级<span class="font-bold text-red-600 ml-0.5">{{ futureI }}</span></span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
            <span class="text-gray-600">II级<span class="font-bold text-orange-600 ml-0.5">{{ futureII }}</span></span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            <span class="text-gray-600">III级<span class="font-bold text-yellow-600 ml-0.5">{{ futureIII }}</span></span>
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  timelinessData: Array,
  riskByLevel: {
    type: Array,
    default: () => []
  }
})

const currentChartRef = ref(null)
const futureChartRef = ref(null)
let currentChart = null
let futureChart = null

// ===== 数据提取 =====

// 当前进入风险数据
const currentTotal = computed(() => extractNumber(props.timelinessData?.[1]?.value) || 15)
const currentCompleted = computed(() => extractNumber(props.timelinessData?.[2]?.value) || 8)
const currentRemaining = computed(() => extractNumber(props.timelinessData?.[3]?.value) || 7)

// 未来两周进入风险数据
const futureTotal = computed(() => extractNumber(props.timelinessData?.[4]?.value) || 9)
const futureI = computed(() => extractNumber(props.timelinessData?.[5]?.value) || 2)
const futureII = computed(() => extractNumber(props.timelinessData?.[6]?.value) || 4)
const futureIII = computed(() => extractNumber(props.timelinessData?.[7]?.value) || 3)

function extractNumber(val) {
  if (!val) return 0
  const match = String(val).match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// ===== 环形图1：当前进入风险 =====
const initCurrentChart = () => {
  if (!currentChartRef.value) return
  if (currentChart) currentChart.dispose()
  currentChart = echarts.init(currentChartRef.value)

  const d = {
    total: currentTotal.value,
    completed: currentCompleted.value,
    remaining: currentRemaining.value
  }

  currentChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'center',
        formatter: () =>
          `{total|${d.total}个}\n` +
          `{label|当前进入}\n` +
          `{sub|风险数量}`,
        rich: {
          total: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 24,
            align: 'center'
          },
          label: {
            fontSize: 11,
            color: '#374151',
            fontWeight: '600',
            lineHeight: 16,
            align: 'center'
          },
          sub: {
            fontSize: 11,
            color: '#374151',
            lineHeight: 14,
            align: 'center'
          }
        }
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
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      },
      data: [
        { value: d.completed, name: '当年完成风险数量', itemStyle: { color: '#22c55e' } },
        { value: d.remaining, name: '当年剩余风险数量', itemStyle: { color: '#fb923c' } }
      ]
    }]
  })
}

// ===== 环形图2：未来两周进入风险 =====
const initFutureChart = () => {
  if (!futureChartRef.value) return
  if (futureChart) futureChart.dispose()
  futureChart = echarts.init(futureChartRef.value)

  const d = {
    total: futureTotal.value,
    levelI: futureI.value,
    levelII: futureII.value,
    levelIII: futureIII.value
  }

  futureChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)'
    },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'center',
        formatter: () =>
          `{total|${d.total}个}\n` +
          `{label|未来两周}\n` +
          `{sub|进入风险}`,
        rich: {
          total: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 24,
            align: 'center'
          },
          label: {
            fontSize: 11,
            color: '#374151',
            fontWeight: '600',
            lineHeight: 16,
            align: 'center'
          },
          sub: {
            fontSize: 11,
            color: '#374151',
            lineHeight: 14,
            align: 'center'
          }
        }
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
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      },
      data: [
        { value: d.levelI, name: 'I级未来两周进入风险数量', itemStyle: { color: '#ef4444' } },
        { value: d.levelII, name: 'II级未来两周进入风险数量', itemStyle: { color: '#f97316' } },
        { value: d.levelIII, name: 'III级未来两周进入风险数量', itemStyle: { color: '#eab308' } }
      ]
    }]
  })
}

// ===== 生命周期 =====
const handleResize = () => {
  currentChart && currentChart.resize()
  futureChart && futureChart.resize()
}

onMounted(() => {
  initCurrentChart()
  initFutureChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  currentChart && currentChart.dispose()
  futureChart && futureChart.dispose()
})

watch(() => [props.timelinessData, props.riskByLevel], () => {
  initCurrentChart()
  initFutureChart()
}, { deep: true })
</script>
