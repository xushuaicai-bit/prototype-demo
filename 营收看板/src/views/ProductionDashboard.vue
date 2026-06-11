<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">生产看板</h2>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">公司:</span>
            <select class="border rounded px-2 py-1 text-sm">
              <option>城乡水务</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">年份:</span>
            <select class="border rounded px-2 py-1 text-sm">
              <option>2026年</option>
              <option>2025年</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div v-for="stat in projectStats" :key="stat.title" class="bg-white rounded-xl p-4 shadow-sm">
        <div class="text-sm text-gray-500 mb-1">{{ stat.title }}</div>
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-gray-800">{{ stat.value }}</span>
          <span class="text-sm text-gray-500 ml-1">{{ stat.unit }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">管理提示及时性</h3>
          <div class="flex space-x-4 text-xs">
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              红色: {{ managementTimelinessData.redAlert }}
            </span>
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
              橙色: {{ managementTimelinessData.orangeAlert }}
            </span>
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
              黄色: {{ managementTimelinessData.yellowAlert }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="item in managementTimelinessData.subItems" :key="item.name" class="bg-gray-50 rounded-lg p-2 text-center">
            <div class="text-xs text-gray-500">{{ item.name }}</div>
            <div class="text-sm font-semibold text-gray-800">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">风险预警</h3>
        <div class="space-y-3">
          <div v-for="item in riskAlertTimeliness" :key="item.title" class="flex items-center justify-between text-sm">
            <span class="text-gray-600 truncate max-w-40">{{ item.title }}</span>
            <span class="font-medium text-gray-800">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">风险等级分布</h3>
        <div class="space-y-3">
          <div v-for="item in riskByLevel" :key="item.level" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">{{ item.level }}</span>
                <span class="text-gray-800">{{ item.count }}个</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getRiskColor(item.level)"
                  :style="{ width: `${(item.completed / item.count) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">已完成 {{ item.completed }}个</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">风险开工令预警</h3>
          <div class="flex space-x-4 text-xs">
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              红色: {{ windRiskAlert.redAlert }}
            </span>
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
              橙色: {{ windRiskAlert.orangeAlert }}
            </span>
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
              黄色: {{ windRiskAlert.yellowAlert }}
            </span>
          </div>
        </div>
        <div ref="riskAlertChartRef" class="h-48"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">里程碑节点进度</h3>
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-gray-500">{{ productionProgress.milestone.title }}</div>
            <div class="text-2xl font-bold text-blue-600">{{ productionProgress.completed.count }}/{{ productionProgress.milestone.total }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">完成率</div>
            <div class="text-2xl font-bold text-green-600">{{ Math.round((productionProgress.completed.count / productionProgress.completed.total) * 100) }}%</div>
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="flex-1">
            <div class="w-full bg-gray-100 rounded-full h-3">
              <div class="bg-blue-500 h-3 rounded-full" :style="{ width: `${(productionProgress.completed.count / productionProgress.completed.total) * 100}%` }"></div>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <span>红色预警: {{ productionProgress.alerts.red }}</span>
          <span>橙色预警: {{ productionProgress.alerts.orange }}</span>
          <span>黄色预警: {{ productionProgress.alerts.yellow }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">重点管控里程碑</h3>
          <span class="text-xs text-red-500">未上报: {{ keyProjectProgress.unreportedCount }}个</span>
        </div>
        <div class="text-center py-4">
          <div class="text-3xl font-bold text-blue-600">{{ keyProjectProgress.completed.count }}</div>
          <div class="text-sm text-gray-500">完成/{{ keyProjectProgress.milestone.total }}个</div>
          <div class="text-xs text-gray-400">重点项目 {{ keyProjectProgress.keyProjectCount }}个</div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <span>红色: {{ keyProjectProgress.alerts.red }}</span>
          <span>橙色: {{ keyProjectProgress.alerts.orange }}</span>
          <span>黄色: {{ keyProjectProgress.alerts.yellow }}</span>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">证照办理进度</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="cert in certificateData" :key="cert.name" class="bg-gray-50 rounded-lg p-3">
            <div class="text-sm font-medium text-gray-800 mb-2">{{ cert.name }}</div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-lg font-bold text-blue-600">{{ cert.completed }}</span>
              <span class="text-sm text-gray-500">/{{ cert.total }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${cert.percentage}%` }"></div>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ cert.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">巡检计划完成情况</h3>
        <div class="flex items-center justify-around">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-800">{{ inspectionData.totalCount }}</div>
            <div class="text-sm text-gray-500">计划巡检</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ inspectionData.completedCount }}</div>
            <div class="text-sm text-gray-500">已完成</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-500">{{ inspectionData.pendingCount }}</div>
            <div class="text-sm text-gray-500">待巡检</div>
          </div>
        </div>
        <div class="mt-4 flex justify-center">
          <div ref="inspectionChartRef" class="w-32 h-32"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">生产进度趋势</h3>
        <div ref="productionTrendChartRef" class="h-48"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
  projectStats,
  managementTimelinessData,
  riskAlertTimeliness,
  riskByLevel,
  windRiskAlert,
  productionProgress,
  keyProjectProgress,
  certificateData,
  inspectionData
} from '../data/mockData.js'

const riskAlertChartRef = ref(null)
const inspectionChartRef = ref(null)
const productionTrendChartRef = ref(null)

let charts = []

const getRiskColor = (level) => {
  const colors = {
    'I级风险': 'bg-red-500',
    'II级风险': 'bg-orange-500',
    'III级风险': 'bg-yellow-500'
  }
  return colors[level] || 'bg-gray-500'
}

const initCharts = () => {
  if (riskAlertChartRef.value) {
    const riskChart = echarts.init(riskAlertChartRef.value)
    charts.push(riskChart)
    riskChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['红色预警', '橙色预警', '黄色预警'], bottom: 0, itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 10 } },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        { name: '红色预警', type: 'bar', data: [5, 8, 4, 4, 6, 7, 3, 9, 5], itemStyle: { color: '#ef4444', borderRadius: [2, 2, 0, 0] } },
        { name: '橙色预警', type: 'bar', data: [12, 10, 15, 9, 11, 13, 8, 14, 10], itemStyle: { color: '#f97316', borderRadius: [2, 2, 0, 0] } },
        { name: '黄色预警', type: 'bar', data: [15, 18, 14, 16, 12, 17, 19, 13, 15], itemStyle: { color: '#eab308', borderRadius: [2, 2, 0, 0] } }
      ]
    })
  }

  if (inspectionChartRef.value) {
    const inspectionChart = echarts.init(inspectionChartRef.value)
    charts.push(inspectionChart)
    inspectionChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { name: '已完成', value: inspectionData.completedCount, itemStyle: { color: '#10b981' } },
          { name: '待巡检', value: inspectionData.pendingCount, itemStyle: { color: '#f59e0b' } }
        ],
        label: { show: true, fontSize: 10 },
        labelLine: { show: true }
      }]
    })
  }

  if (productionTrendChartRef.value) {
    const trendChart = echarts.init(productionTrendChartRef.value)
    charts.push(trendChart)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['计划完成', '实际完成'], bottom: 0, itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 10 } },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        { name: '计划完成', type: 'line', smooth: true, data: [85, 88, 90, 92, 95, 98], lineStyle: { color: '#1890ff' } },
        { name: '实际完成', type: 'line', smooth: true, data: [80, 82, 85, 88, 92, 96], lineStyle: { color: '#10b981' } }
      ]
    })
  }
}

const handleResize = () => {
  charts.forEach(chart => chart?.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart?.dispose())
})
</script>
