<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-4 mb-4">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">市场管理看板</h2>
        <div class="flex items-center gap-2 ml-4">
          <span class="text-sm text-gray-500">项目总数：</span>
          <span class="text-lg font-bold text-blue-600">182个</span>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filterTabs"
          :key="item.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedFilter === item.name
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="selectedFilter = item.name"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-semibold text-gray-800">客户管理</h3>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-lg p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-blue-600 font-medium">重点客户</span>
                <span class="text-lg font-bold text-blue-700">89个</span>
              </div>
              <div class="text-xs text-blue-500">12,000亿</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-600 font-medium">一般客户</span>
                <span class="text-lg font-bold text-gray-700">76个</span>
              </div>
              <div class="text-xs text-gray-500">79,49亿</div>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-2">重点客户数量89个，跟踪体量90.23亿，中标体量80.98亿</div>
          
          <div class="mt-4 pt-4 border-t">
            <h4 class="text-sm font-semibold text-gray-800 mb-3">客户排名</h4>
            <ul class="space-y-2">
              <li v-for="(item, idx) in customerRanking" :key="item.name" class="flex items-center justify-between text-sm">
                <div class="flex items-center">
                  <span class="w-5 text-xs text-gray-400">{{ idx + 1 }}</span>
                  <span class="text-gray-600 ml-2 truncate max-w-36">{{ item.name }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-blue-600 font-medium text-xs">{{ item.contract }}</span>
                  <span class="text-orange-500 font-medium text-xs">{{ item.bid }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">重点跟踪项目</h3>
        <div ref="keyProjectChartRef" class="h-64"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- 预警指标 -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 cursor-pointer hover:bg-orange-100 transition-colors" @click="drillDownToPotential">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span class="text-sm font-medium text-orange-700">本月应投标数量</span>
            </div>
            <span class="text-lg font-bold text-orange-600">{{ monthlyBidCount }}</span>
          </div>
          <div class="text-xs text-orange-500 mt-1">月度更新 · 点击查看详情</div>
        </div>
        
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">市场跟踪（数量+金额）</h3>
          <div class="flex space-x-4">
            <button
              v-for="tab in projectTabs"
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeProjectTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeProjectTab = tab.key; updateMarketTrackingChart()"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="projectChartRef" class="h-64"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- 预警指标 -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span class="text-sm font-medium text-yellow-700">已立项合同3月以上未签订</span>
            </div>
            <span class="text-lg font-bold text-yellow-600">{{ unsignedContractCount }}</span>
          </div>
          <div class="text-xs text-yellow-500 mt-1">月度更新</div>
        </div>
        
        <h3 class="text-base font-semibold text-gray-800 mb-3">项目立项（数量+金额）</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm text-gray-600 text-center mb-2">个数及占比</h4>
            <div ref="projectTypePieRef" class="h-48"></div>
          </div>
          <div>
            <h4 class="text-sm text-gray-600 text-center mb-2">金额及占比</h4>
            <div ref="projectAmountPieRef" class="h-48"></div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <div v-for="(item, index) in projectTypeData" :key="item.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <span :class="['w-3 h-3 rounded-full mr-2', pieColors[index]]"></span>
              <span class="text-xs text-gray-600">{{ item.name }}</span>
            </div>
            <div class="text-xs text-right">
              <span class="text-gray-800 font-medium">{{ item.count }}个</span>
              <span class="text-gray-400 ml-1">({{ item.amount }}亿)</span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t flex justify-between text-sm">
          <div>
            <span class="text-gray-500">总个数：</span>
            <span class="font-bold text-blue-600">182个</span>
          </div>
          <div>
            <span class="text-gray-500">总金额：</span>
            <span class="font-bold text-blue-600">41.0亿</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- 预警指标 -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 cursor-pointer hover:bg-red-100 transition-colors" @click="drillDownToBid">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span class="text-sm font-medium text-red-700">应开标数量</span>
            </div>
            <span class="text-lg font-bold text-red-600">{{ shouldOpenBidCount }}</span>
          </div>
          <div class="text-xs text-red-500 mt-1">按天更新 · 点击查看详情</div>
        </div>
        
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目投标（数量+金额）</h3>
          <div class="flex space-x-4">
            <button
              v-for="tab in bidTabs"
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeBidTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeBidTab = tab.key; updateBidChart()"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="bidChartRef" class="h-64"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">总包合同（数量+金额）</h3>
          <div class="flex space-x-4">
            <button
              v-for="tab in contractTabs"
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeContractTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeContractTab = tab.key; updateContractChart()"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="contractChartRef" class="h-64"></div>
        <div class="mt-3 text-xs text-gray-500">
          城服水务总计应签合同500个，已签合同300个，未签合同200个。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const selectedFilter = ref('全部')
const activeProjectTab = ref('company')
const activeBidTab = ref('company')
const activeContractTab = ref('company')

// 预警指标数据
const monthlyBidCount = ref(25)
const shouldOpenBidCount = ref(12)
const unsignedContractCount = ref(8)

// 下钻函数
const drillDownToPotential = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/project/potential', '_blank')
}

const drillDownToBid = () => {
  window.open('https://www.smart-worksite.com/hj/#/micro/market/biz/ent/market/project/bid', '_blank')
}

const filterTabs = [
  { name: '全部', count: 182 },
  { name: '管网事业部', count: 24 },
  { name: '生态事业部', count: 18 },
  { name: '区域事业部', count: 22 },
  { name: '市政事业部', count: 16 },
  { name: '环境建设', count: 15 },
  { name: '管道工程', count: 19 },
  { name: '管道分公司', count: 21 },
  { name: '运营养护', count: 17 },
  { name: '二次养护', count: 20 }
]

const projectTabs = [
  { key: 'company', label: '分公司' },
  { key: 'region', label: '按区域' },
  { key: 'type', label: '按项目类型' }
]

const bidTabs = [
  { key: 'company', label: '分公司' },
  { key: 'region', label: '按区域' },
  { key: 'type', label: '按项目类型' }
]

const contractTabs = [
  { key: 'company', label: '分公司' },
  { key: 'region', label: '按区域' },
  { key: 'type', label: '按项目类型' }
]

const pieColors = ['#8e9fbc', '#c49797', '#91a890', '#c7a779', '#a48caf']

const customerRanking = [
  { name: '上海市北自来水', contract: '47,938万元', bid: '47,938万元' },
  { name: '上海城投水务', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海城投水务(集团)', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海申通地铁', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海浦东自来水', contract: '47,938万元', bid: '358,846万元' }
]

const regionCategories = ['长三角区域总部', '中原区域总部', '大湾区区域总部', '上海', '境外区域', '其他城市区域']
const projectTypeCategories = ['水务', '水环境治理', '水利', '固废处理与处置', '土壤修复', '城市更新', '市政路桥房建', '其他']
const companyCategories = ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护']

const projectTypeData = [
  { name: '框架', count: 65, amount: 12.5, percentage: '35.7%' },
  { name: '投标', count: 42, amount: 9.8, percentage: '23.1%' },
  { name: '直接委托', count: 38, amount: 8.5, percentage: '20.9%' },
  { name: '项目建议书', count: 25, amount: 6.2, percentage: '13.7%' },
  { name: '其他', count: 12, amount: 2.5, percentage: '6.6%' }
]

const projectChartRef = ref(null)
const projectTypePieRef = ref(null)
const bidChartRef = ref(null)
const projectAmountPieRef = ref(null)
const contractChartRef = ref(null)
const keyProjectChartRef = ref(null)

let charts = []

const getCategories = (tabKey) => {
  switch (tabKey) {
    case 'region':
      return regionCategories
    case 'type':
      return projectTypeCategories
    default:
      return companyCategories
  }
}

const initDualAxisChart = (ref, data, leftName, rightName) => {
  if (!ref.value) return null

  const chart = echarts.init(ref.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(item => {
          if (item.seriesName && item.seriesName.includes('金额')) {
            result += item.marker + item.seriesName + ': ' + item.value + '亿<br/>'
          } else {
            result += item.marker + item.seriesName + ': ' + item.value + '个<br/>'
          }
        })
        return result
      }
    },
    legend: {
      data: data.legend,
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        fontSize: 10,
        rotate: 30,
        color: '#374151'
      },
      axisLine: { lineStyle: { color: '#d1d5db' } }
    },
    yAxis: [
      {
        type: 'value',
        name: leftName,
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#4b5563' },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      {
        type: 'value',
        name: rightName,
        nameTextStyle: { fontSize: 11, color: '#374151' },
        axisLabel: { fontSize: 10, color: '#4b5563', formatter: '{value}亿' },
        axisLine: { show: false },
        splitLine: { show: false }
      }
    ],
    series: data.series.map((item, index) => ({
      name: item.name,
      type: item.yAxisIndex === 0 ? 'bar' : 'line',
      data: item.data,
      yAxisIndex: item.yAxisIndex || 0,
      stack: item.yAxisIndex === 0 && !item.name.includes('金额') ? 'total' : undefined,
      barWidth: '45%',
      itemStyle: {
        color: item.color || ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5],
        borderRadius: item.yAxisIndex === 0 ? [4, 4, 0, 0] : 0
      },
      lineStyle: item.yAxisIndex === 1 ? { width: 3 } : {},
      smooth: item.yAxisIndex === 1 ? true : false,
      symbol: item.yAxisIndex === 1 ? 'circle' : 'none',
      symbolSize: item.yAxisIndex === 1 ? 8 : 0
    }))
  }

  chart.setOption(option)
  return chart
}

const initSingleAxisChart = (ref, data, yAxisName) => {
  if (!ref.value) return null

  const chart = echarts.init(ref.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(item => {
          result += item.marker + item.seriesName + ': ' + item.value + '个<br/>'
        })
        return result
      }
    },
    legend: {
      data: data.legend,
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        fontSize: 10,
        rotate: 30,
        color: '#374151'
      },
      axisLine: { lineStyle: { color: '#d1d5db' } }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { fontSize: 11, color: '#374151' },
      axisLabel: { fontSize: 10, color: '#4b5563' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: data.series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      stack: 'total',
      barWidth: '45%',
      itemStyle: {
        color: item.color || ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5],
        borderRadius: [4, 4, 0, 0]
      }
    }))
  }

  chart.setOption(option)
  return chart
}

const init3DPieChart = (ref, data, type = 'count') => {
  if (!ref.value) return null

  const chart = echarts.init(ref.value)
  charts.push(chart)

  const chartData = data.map(item => ({
    name: item.name,
    value: type === 'count' ? item.count : item.amount
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      formatter: function (params) {
        const item = data.find(d => d.name === params.name)
        if (type === 'count') {
          return params.name + '<br/>个数：' + item.count + '个<br/>占比：' + params.percent.toFixed(1) + '%'
        } else {
          return params.name + '<br/>金额：' + item.amount + '亿<br/>占比：' + params.percent.toFixed(1) + '%'
        }
      }
    },
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '52%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#f9fafb',
        borderWidth: 3
      },
      label: {
        show: true,
        formatter: function (params) {
          const item = data.find(d => d.name === params.name)
          if (type === 'count') {
            return params.name + '\n' + item.count + '个'
          } else {
            return params.name + '\n' + item.amount + '亿'
          }
        },
        fontSize: 11,
        lineHeight: 18,
        color: '#4b5563'
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        label: {
          show: true,
          fontSize: 12,
          fontWeight: '600'
        }
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 8,
        smooth: 0.5,
        lineStyle: {
          color: '#d1d5db'
        }
      },
      data: chartData.map((item, index) => ({
        ...item,
        itemStyle: { color: pieColors[index % pieColors.length] }
      }))
    }]
  }

  chart.setOption(option)
  return chart
}

const updateMarketTrackingChart = () => {
  const categories = getCategories(activeProjectTab.value)

  let aData, aaData, aaaData, amountData
  if (activeProjectTab.value === 'region') {
    aData = [25, 20, 22, 18, 14, 16]
    aaData = [12, 10, 11, 9, 7, 8]
    aaaData = [8, 8, 9, 8, 7, 8]
    amountData = [12.5, 10.2, 11.8, 9.5, 7.2, 8.6]
  } else if (activeProjectTab.value === 'type') {
    aData = [45, 38, 35, 25, 18, 26, 40, 22]
    aaData = [25, 20, 18, 13, 10, 14, 23, 12]
    aaaData = [15, 14, 12, 10, 10, 12, 15, 8]
    amountData = [25.3, 18.5, 15.2, 12.8, 9.5, 14.2, 22.5, 10.8]
  } else {
    aData = [200, 180, 150, 190, 180, 200, 210, 170, 185]
    aaData = [120, 100, 90, 110, 100, 110, 120, 95, 105]
    aaaData = [80, 70, 60, 80, 80, 80, 80, 75, 80]
    amountData = [85.2, 72.5, 65.8, 78.3, 68.5, 75.2, 82.6, 68.9, 72.3]
  }

  const chartData = {
    legend: ['A级项目', 'AA级项目', 'AAA级项目', '跟踪金额'],
    categories: categories,
    series: [
      { name: 'A级项目', data: aData, yAxisIndex: 0, color: '#3b82f6' },
      { name: 'AA级项目', data: aaData, yAxisIndex: 0, color: '#10b981' },
      { name: 'AAA级项目', data: aaaData, yAxisIndex: 0, color: '#f59e0b' },
      { name: '跟踪金额', data: amountData, yAxisIndex: 1, color: '#8b5cf6' }
    ]
  }

  if (charts[1]) {
    charts[1].dispose()
    charts.splice(1, 1)
  }

  const chart = initDualAxisChart(projectChartRef, chartData, '项目数量(个)', '金额(亿)')
  if (chart) {
    charts[1] = chart
  }
}

const updateBidChart = () => {
  const categories = getCategories(activeBidTab.value)

  let aData, aaData, aaaData, amountData
  if (activeBidTab.value === 'region') {
    aData = [30, 26, 28, 24, 20, 22]
    aaData = [14, 12, 13, 11, 9, 10]
    aaaData = [8, 7, 7, 7, 6, 6]
    amountData = [15.8, 12.5, 14.2, 11.8, 9.2, 10.5]
  } else if (activeBidTab.value === 'type') {
    aData = [50, 42, 36, 28, 22, 30, 46, 26]
    aaData = [28, 22, 20, 15, 12, 17, 25, 14]
    aaaData = [14, 14, 12, 9, 8, 11, 14, 8]
    amountData = [28.5, 20.8, 17.2, 14.5, 11.2, 16.2, 25.8, 12.5]
  } else {
    aData = [180, 150, 140, 160, 150, 165, 180, 145, 155]
    aaData = [100, 90, 85, 100, 95, 100, 115, 90, 95]
    aaaData = [70, 60, 55, 60, 55, 65, 65, 55, 60]
    amountData = [92.5, 78.2, 72.8, 85.5, 72.5, 82.5, 92.8, 75.2, 80.5]
  }

  const chartData = {
    legend: ['A级投标', 'AA级投标', 'AAA级投标', '投标金额'],
    categories: categories,
    series: [
      { name: 'A级投标', data: aData, yAxisIndex: 0, color: '#3b82f6' },
      { name: 'AA级投标', data: aaData, yAxisIndex: 0, color: '#10b981' },
      { name: 'AAA级投标', data: aaaData, yAxisIndex: 0, color: '#f59e0b' },
      { name: '投标金额', data: amountData, yAxisIndex: 1, color: '#8b5cf6' }
    ]
  }

  if (charts[2]) {
    charts[2].dispose()
    charts.splice(2, 1)
  }

  const chart = initDualAxisChart(bidChartRef, chartData, '数量(个)', '金额(亿)')
  if (chart) {
    charts[2] = chart
  }
}

const updateContractChart = () => {
  const categories = getCategories(activeContractTab.value)

  let signedData, unsignedData, signedAmountData, unsignedAmountData
  if (activeContractTab.value === 'region') {
    signedData = [52, 45, 48, 42, 35, 38]
    unsignedData = [18, 15, 16, 14, 12, 13]
    signedAmountData = [8250, 6800, 7200, 5800, 4500, 5200]
    unsignedAmountData = [3250, 2800, 3200, 2400, 1900, 2200]
  } else if (activeContractTab.value === 'type') {
    signedData = [92, 78, 68, 52, 42, 58, 85, 48]
    unsignedData = [32, 28, 24, 18, 15, 20, 30, 17]
    signedAmountData = [14250, 11800, 9800, 7200, 5800, 8200, 12800, 6800]
    unsignedAmountData = [5250, 4500, 3800, 2800, 2200, 3200, 4800, 2600]
  } else {
    signedData = [450, 350, 330, 280, 300, 290, 310, 340, 320]
    unsignedData = [150, 120, 110, 95, 100, 98, 105, 115, 108]
    signedAmountData = [8000, 6000, 5500, 4000, 4500, 4200, 4800, 5800, 5200]
    unsignedAmountData = [4000, 3000, 2500, 2000, 2200, 2100, 2400, 2900, 2600]
  }

  const chartData = {
    legend: ['已签合同', '未签合同', '已签金额', '未签金额'],
    categories: categories,
    series: [
      { name: '已签合同', data: signedData, yAxisIndex: 0 },
      { name: '未签合同', data: unsignedData, yAxisIndex: 0 },
      { name: '已签金额', data: signedAmountData.map(v => (v / 1000).toFixed(1)), yAxisIndex: 1 },
      { name: '未签金额', data: unsignedAmountData.map(v => (v / 1000).toFixed(1)), yAxisIndex: 1 }
    ]
  }

  if (charts[4]) {
    charts[4].dispose()
    charts.splice(4, 1)
  }

  const chart = initDualAxisChart(contractChartRef, chartData, '合同数量(个)', '金额(亿)')
  if (chart) {
    charts[4] = chart
  }
}

const initCharts = () => {
  const keyProjectData = {
    legend: ['A级项目', 'AA级项目', 'AAA级项目'],
    categories: companyCategories,
    series: [
      { name: 'A级项目', data: [45, 38, 32, 40, 35, 42, 46, 36, 38], yAxisIndex: 0, color: '#3b82f6' },
      { name: 'AA级项目', data: [25, 20, 18, 25, 22, 24, 28, 20, 22], yAxisIndex: 0, color: '#10b981' },
      { name: 'AAA级项目', data: [15, 14, 15, 13, 13, 16, 14, 12, 15], yAxisIndex: 0, color: '#f59e0b' }
    ]
  }

  // 使用单列图表
  const keyProjectChart = initSingleAxisChart(keyProjectChartRef, keyProjectData, '项目数量(个)')
  if (keyProjectChart) {
    charts[0] = keyProjectChart
  }

  updateMarketTrackingChart()
  updateBidChart()
  updateContractChart()

  init3DPieChart(projectTypePieRef, projectTypeData, 'count')
  init3DPieChart(projectAmountPieRef, projectTypeData, 'amount')
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
