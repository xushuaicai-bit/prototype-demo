<template>
  <div class="bg-white rounded-xl p-3 shadow-sm flex flex-col h-full">
    <!-- 标题 -->
    <div class="flex items-center mb-2">
      <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
      <h3 class="text-sm font-semibold text-gray-800">{{ title }}</h3>
    </div>

    <!-- 主内容区：左右两栏 -->
    <div class="flex-1 grid grid-cols-2 gap-3 overflow-hidden">

      <!-- ========== 第一组：项目登记 ========== -->
      <div class="flex flex-col bg-gray-50 rounded-lg p-2.5 border border-gray-100">
        <!-- 组标题 -->
        <div class="text-xs font-semibold text-gray-600 mb-2 pb-1.5 border-b border-gray-200">项目登记</div>

        <!-- 环形图 -->
        <div ref="registrationChartRef"
             class="flex-1 min-h-[120px] cursor-pointer hover:opacity-90"
             @click="$emit('drill-to-pending')"></div>

        <!-- 登记预警 -->
        <div class="flex items-center justify-center gap-2.5 mt-2 pt-2 border-t border-gray-200">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-red-500 mr-0.5"></span>
            <span class="font-bold text-red-600">{{ registrationAlerts.red }}</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-500 mr-0.5"></span>
            <span class="font-bold text-orange-600">{{ registrationAlerts.orange }}</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mr-0.5"></span>
            <span class="font-bold text-yellow-600">{{ registrationAlerts.yellow }}</span>
          </span>
        </div>

        <!-- 基本信息完成率 -->
        <div class="mt-2 pt-2 border-t border-gray-200">
          <div class="text-center py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div class="text-sm font-bold text-blue-600">{{ subItems[6].value }}</div>
            <div class="text-[10px] text-gray-500 leading-tight">{{ subItems[6].name }}</div>
          </div>
        </div>
      </div>

      <!-- ========== 第二组：项目筹划 ========== -->
      <div class="flex flex-col bg-gray-50 rounded-lg p-2.5 border border-gray-100">
        <!-- 组标题 -->
        <div class="text-xs font-semibold text-gray-600 mb-2 pb-1.5 border-b border-gray-200">项目筹划</div>

        <!-- 环形图 -->
        <div ref="planningChartRef"
             class="flex-1 min-h-[120px] hover:opacity-90"></div>

        <!-- 筹划预警 -->
        <div class="flex items-center justify-center gap-2.5 mt-2 pt-2 border-t border-gray-200">
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-red-500 mr-0.5"></span>
            <span class="font-bold text-red-600">{{ planningAlerts.red }}</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-orange-500 mr-0.5"></span>
            <span class="font-bold text-orange-600">{{ planningAlerts.orange }}</span>
          </span>
          <span class="flex items-center text-xs">
            <span class="w-2 h-2 rounded-full bg-yellow-500 mr-0.5"></span>
            <span class="font-bold text-yellow-600">{{ planningAlerts.yellow }}</span>
          </span>
        </div>

        <!-- 项目筹划完成率 -->
        <div class="mt-2 pt-2 border-t border-gray-200">
          <div class="text-center py-1.5 bg-gray-100 rounded-lg">
            <div class="text-sm font-bold text-blue-700">{{ subItems[5].value }}</div>
            <div class="text-[10px] text-gray-500 leading-tight">{{ subItems[5].name }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  registrationAlerts: Object,
  planningAlerts: Object,
  subItems: Array
})

defineEmits(['drill-to-pending'])

const registrationChartRef = ref(null)
const planningChartRef = ref(null)
let registrationChart = null
let planningChart = null

// 登记数据：已登记=208, 待登记=300, 总计=508
const registrationData = computed(() => {
  const pending = Number(props.subItems?.[0]?.value) || 0
  const done = Number(props.subItems?.[1]?.value) || 0
  const total = Number(props.subItems?.[2]?.value) || (pending + done)
  const rate = total > 0 ? Math.round((done / total) * 100) : 0
  return { done, pending, total, rate }
})

// 筹划数据：已完成=应筹划-待筹划, 待筹划=300
const planningData = computed(() => {
  const shouldPlan = Number(props.subItems?.[3]?.value) || 0
  const pendingPlan = Number(props.subItems?.[4]?.value) || 0
  const donePlan = shouldPlan - pendingPlan
  const rate = shouldPlan > 0 ? Math.round((donePlan / shouldPlan) * 100) : 0
  return { done: donePlan, pending: pendingPlan, total: shouldPlan, rate }
})

const initRegistrationChart = () => {
  if (!registrationChartRef.value) return
  if (registrationChart) registrationChart.dispose()
  registrationChart = echarts.init(registrationChartRef.value)

  const d = registrationData.value
  registrationChart.setOption({
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
          `{done|已登记${d.done}}\n` +
          `{pending|未登记${d.pending}}`,
        rich: {
          rate: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 20,
            align: 'center'
          },
          done: {
            fontSize: 10,
            color: '#374151',
            fontWeight: '600',
            lineHeight: 16,
            align: 'center'
          },
          pending: {
            fontSize: 10,
            color: '#374151',
            lineHeight: 16,
            align: 'center'
          }
        }
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      },
      data: [
        { value: d.done, name: '已登记', itemStyle: { color: '#22c55e' } },
        { value: d.pending, name: '未登记', itemStyle: { color: '#e5e7eb' } }
      ]
    }]
  })

  registrationChart.on('click', () => {
    // emit handled by parent container click
  })
}

const initPlanningChart = () => {
  if (!planningChartRef.value) return
  if (planningChart) planningChart.dispose()
  planningChart = echarts.init(planningChartRef.value)

  const d = planningData.value
  planningChart.setOption({
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
          `{done|已筹划${d.done}}\n` +
          `{pending|未筹划${d.pending}}`,
        rich: {
          rate: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 20,
            align: 'center'
          },
          done: {
            fontSize: 10,
            color: '#374151',
            fontWeight: '600',
            lineHeight: 16,
            align: 'center'
          },
          pending: {
            fontSize: 10,
            color: '#374151',
            lineHeight: 16,
            align: 'center'
          }
        }
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      },
      data: [
        { value: d.done, name: '已完成筹划', itemStyle: { color: '#3b82f6' } },
        { value: d.pending, name: '待筹划', itemStyle: { color: '#e5e7eb' } }
      ]
    }]
  })
}

const handleResize = () => {
  registrationChart && registrationChart.resize()
  planningChart && planningChart.resize()
}

onMounted(() => {
  initRegistrationChart()
  initPlanningChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  registrationChart && registrationChart.dispose()
  planningChart && planningChart.dispose()
})

watch(() => [props.subItems, props.registrationAlerts, props.planningAlerts], () => {
  initRegistrationChart()
  initPlanningChart()
}, { deep: true })
</script>
