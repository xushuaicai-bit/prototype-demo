<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">市场管理看板</h2>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">公司:</span>
            <el-select v-model="selectedCompany" class="w-40">
              <el-option label="请选择组织" value="" />
              <el-option label="管网事业部" value="pipe-network" />
              <el-option label="生态事业部" value="ecology" />
              <el-option label="区域事业部" value="regional" />
              <el-option label="市政事业部" value="municipal" />
              <el-option label="环境建设" value="environment" />
              <el-option label="管道工程" value="pipe-engineering" />
              <el-option label="管道分公司" value="pipe-branch" />
              <el-option label="运营养护" value="operation" />
              <el-option label="二次养护" value="secondary" />
            </el-select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">年份:</span>
            <el-select v-model="selectedYear" class="w-24">
              <el-option label="2025年" value="2025" />
              <el-option label="2026年" value="2026" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-base font-semibold text-gray-800 mb-3">客户管理</h3>
        <div class="space-y-4">
          <div class="bg-blue-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-blue-600 font-medium">重点客户</span>
              <span class="text-lg font-bold text-blue-700">12个</span>
            </div>
            <div class="text-xs text-blue-500">12,000亿</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 font-medium">一般客户</span>
              <span class="text-lg font-bold text-gray-700">76个</span>
            </div>
            <div class="text-xs text-gray-500">79,49C亿</div>
          </div>
          <div class="text-xs text-gray-500 mt-2">重点客户数量89个, 预估体量90.23亿, 中标体量80.98亿</div>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">客户排名</h3>
          <div class="flex space-x-2">
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">履约体量</span>
            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">中标体量</span>
          </div>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, index) in customerRanking" :key="item.name" class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <span class="w-5 text-xs text-gray-400">{{ index + 1 }}</span>
              <span class="text-gray-600 ml-2 truncate max-w-32">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-blue-600 font-medium text-xs">{{ item.contract }}</span>
              <span class="text-orange-500 font-medium text-xs">{{ item.bid }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">市场跟踪项目</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in projectTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeProjectTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeProjectTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="projectChartRef" class="h-48"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">市场跟踪金额</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in amountTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeAmountTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeAmountTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="amountChartRef" class="h-48"></div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目立项管理</h3>
          <span class="text-xs text-gray-500">按类型</span>
        </div>
        <div class="flex items-center">
          <div ref="projectTypePieRef" class="w-40 h-40"></div>
          <div class="flex-1 ml-4">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(item, index) in projectTypeData" :key="item.name" class="flex items-center">
                <span :class="['w-3 h-3 rounded-full mr-2', pieColors[index]]"></span>
                <span class="text-xs text-gray-600">{{ item.name }}</span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">项目立项类型数量总计</span>
                <span class="font-bold text-blue-600">191个</span>
              </div>
              <div class="flex items-center justify-between text-sm mt-1">
                <span class="text-gray-500">(个数及占比)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目投标数量</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in bidTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeBidTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeBidTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="bidCountChartRef" class="h-48"></div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目投标金额</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in bidTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeBidAmountTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeBidAmountTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="bidAmountChartRef" class="h-48"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目立项金额总计</h3>
          <span class="text-xs text-gray-500">(金额及占比)</span>
        </div>
        <div class="flex items-center">
          <div ref="projectAmountPieRef" class="w-40 h-40"></div>
          <div class="flex-1 ml-4">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(item, index) in projectAmountData" :key="item.name" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span :class="['w-3 h-3 rounded-full mr-2', pieColors[index]]"></span>
                  <span class="text-xs text-gray-600">{{ item.name }}</span>
                </div>
                <span class="text-xs font-medium text-gray-800">{{ item.value }}</span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">项目立项金额总计</span>
                <span class="font-bold text-blue-600">18.0亿</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">总包合同数量</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in contractTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeContractTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeContractTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="contractCountChartRef" class="h-48"></div>
        <div class="mt-3 text-xs text-gray-500">
          城服水务总计应签合同500个, 已签合同300个, 未签合同200个。
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">总包合同金额</h3>
          <div class="flex space-x-4">
            <button 
              v-for="tab in contractTabs" 
              :key="tab.key"
              :class="[
                'text-xs px-3 py-1 rounded-full transition-all',
                activeContractAmountTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="activeContractAmountTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div ref="contractAmountChartRef" class="h-48"></div>
        <div class="mt-3 text-xs text-gray-500">
          城服水务总计应签合同12,000万元, 已签合同8,000万元, 未签合同4,000万元。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const selectedCompany = ref('')
const selectedYear = ref('2026')

const activeProjectTab = ref('company')
const projectTabs = [
  { key: 'company', label: '分公司' },
  { key: 'region', label: '按区域' }
]

const activeAmountTab = ref('company')
const amountTabs = [
  { key: 'company', label: '分公司' },
  { key: 'region', label: '按区域' }
]

const activeBidTab = ref('company')
const bidTabs = [
  { key: 'company', label: '分公司' },
  { key: 'type', label: '按项目类别' },
  { key: 'region', label: '按区域' }
]

const activeBidAmountTab = ref('company')

const activeContractTab = ref('company')
const contractTabs = [
  { key: 'company', label: '分公司' },
  { key: 'type', label: '按项目类别' },
  { key: 'region', label: '按区域' }
]

const activeContractAmountTab = ref('company')

const pieColors = ['#1890ff', '#722ed1', '#13c2c2', '#fa8c16']

const customerRanking = [
  { name: '上海市北自来水', contract: '47,938万元', bid: '47,938万元' },
  { name: '上海城投水务', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海城投水务(集团)', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海申通地铁', contract: '47,938万元', bid: '358,846万元' },
  { name: '上海浦东自来水', contract: '47,938万元', bid: '358,846万元' }
]

const projectTypeData = [
  { name: '框架', value: 99, percentage: '51.8%' },
  { name: '招标', value: 32, percentage: '16.8%' },
  { name: '直委委托', value: 58, percentage: '30.4%' },
  { name: '其他', value: 2, percentage: '1.0%' }
]

const projectAmountData = [
  { name: '框架', value: '9.21亿' },
  { name: '招标', value: '3.2亿' },
  { name: '直委委托', value: '5.8亿' },
  { name: '其他', value: '0.79亿' }
]

const projectChartRef = ref(null)
const amountChartRef = ref(null)
const projectTypePieRef = ref(null)
const bidCountChartRef = ref(null)
const bidAmountChartRef = ref(null)
const projectAmountPieRef = ref(null)
const contractCountChartRef = ref(null)
const contractAmountChartRef = ref(null)

let charts = []

const initBarChart = (ref, data, yAxisLabel) => {
  if (!ref.value) return null
  
  const chart = echarts.init(ref.value)
  charts.push(chart)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: data.legend,
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 10 }
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
      data: data.categories,
      axisLabel: { fontSize: 10, rotate: 30 },
      axisLine: { lineStyle: { color: '#ddd' } }
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel,
      nameTextStyle: { fontSize: 10 },
      axisLabel: { fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: data.series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      barWidth: '20%',
      itemStyle: {
        color: ['#1890ff', '#722ed1', '#13c2c2', '#fa8c16'][index % 4],
        borderRadius: [2, 2, 0, 0]
      }
    }))
  }
  
  chart.setOption(option)
  return chart
}

const initPieChart = (ref, data) => {
  if (!ref.value) return null
  
  const chart = echarts.init(ref.value)
  charts.push(chart)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 10, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: data.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: pieColors[index % pieColors.length] }
      }))
    }]
  }
  
  chart.setOption(option)
  return chart
}

const initCharts = () => {
  const projectData = {
    legend: ['A', 'A-', 'AA'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: 'A', data: [400, 350, 300, 380, 360, 390, 410, 340, 370] },
      { name: 'A-', data: [200, 250, 280, 220, 240, 210, 190, 260, 230] },
      { name: 'AA', data: [100, 150, 120, 100, 110, 90, 80, 130, 100] }
    ]
  }
  
  const amountData = {
    legend: ['A', 'A-', 'AA'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: 'A', data: [450, 400, 350, 420, 380, 430, 460, 390, 410] },
      { name: 'A-', data: [250, 300, 280, 260, 270, 250, 230, 290, 260] },
      { name: 'AA', data: [150, 180, 150, 140, 160, 130, 120, 170, 150] }
    ]
  }
  
  const bidCountData = {
    legend: ['A', 'A-', 'AA', 'AAA'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: 'A', data: [350, 300, 280, 320, 300, 330, 360, 290, 310] },
      { name: 'A-', data: [200, 220, 200, 180, 190, 170, 160, 210, 180] },
      { name: 'AA', data: [100, 120, 100, 80, 90, 70, 60, 110, 80] },
      { name: 'AAA', data: [50, 60, 50, 40, 45, 35, 30, 55, 40] }
    ]
  }
  
  const bidAmountData = {
    legend: ['A', 'A-', 'AA', 'AAA'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: 'A', data: [500, 450, 400, 480, 440, 490, 520, 460, 480] },
      { name: 'A-', data: [300, 320, 280, 300, 290, 280, 260, 310, 290] },
      { name: 'AA', data: [150, 180, 150, 160, 170, 150, 140, 170, 160] },
      { name: 'AAA', data: [80, 100, 80, 90, 85, 80, 70, 95, 85] }
    ]
  }
  
  const contractCountData = {
    legend: ['已签合同', '未签合同'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: '已签合同', data: [450, 350, 330, 280, 300, 290, 310, 340, 320] },
      { name: '未签合同', data: [300, 250, 200, 150, 180, 160, 140, 220, 190] }
    ]
  }
  
  const contractAmountData = {
    legend: ['已签合同', '未签合同'],
    categories: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'],
    series: [
      { name: '已签合同', data: [8000, 6000, 5500, 4000, 4500, 4200, 4800, 5800, 5200] },
      { name: '未签合同', data: [4000, 3000, 2500, 2000, 2200, 2100, 2400, 2900, 2600] }
    ]
  }
  
  initBarChart(projectChartRef, projectData, '项目数量')
  initBarChart(amountChartRef, amountData, '金额(亿)')
  initPieChart(projectTypePieRef, projectTypeData)
  initBarChart(bidCountChartRef, bidCountData, '数量')
  initBarChart(bidAmountChartRef, bidAmountData, '金额(亿)')
  initPieChart(projectAmountPieRef, projectAmountData)
  initBarChart(contractCountChartRef, contractCountData, '合同数量')
  initBarChart(contractAmountChartRef, contractAmountData, '金额(万元)')
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