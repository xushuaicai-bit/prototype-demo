<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6 text-blue-500">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">营收管理看板</h2>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in categoryTabs"
          :key="item.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeCategory === item.name
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="activeCategory = item.name"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="item in subTabs"
          :key="item.name"
          :class="[
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            activeSub === item.name
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-500 hover:bg-gray-50'
          ]"
          @click="activeSub = item.name"
        >
          {{ item.name }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
      <div 
        v-for="card in statCards" 
        :key="card.title" 
        :class="[
          'bg-white rounded-xl p-4 shadow-sm transition-all cursor-pointer',
          card.drillable ? 'hover:shadow-lg hover:border-blue-200 border border-transparent' : ''
        ]"
        @click="card.drillable && handleDrill(card.drillTarget)"
      >
        <div class="flex justify-between items-start">
          <span :class="['text-sm', card.drillable ? 'text-blue-600' : 'text-gray-600']">{{ card.title }}</span>
          <div class="flex items-center">
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center', card.bgClass]">
              <svg :class="['w-6 h-6', card.iconClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="card.icon === 'trending-up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                <path v-else-if="card.icon === 'target'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="card.icon === 'bar-chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                <path v-else-if="card.icon === 'check-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                <path v-else-if="card.icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                <path v-else-if="card.icon === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="card.drillable" class="drill-indicator ml-2 relative group">
              <svg class="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <div class="drill-tooltip absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                点击查看详情
              </div>
            </div>
          </div>
        </div>
        <div :class="['mt-2 text-2xl font-bold', card.drillable ? 'text-blue-600' : 'text-gray-800']">{{ card.value }}<span class="text-sm font-normal text-gray-500 ml-1">{{ card.unit }}</span></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">施工类当年计划营收</h3>
        <ul class="space-y-2">
          <li v-for="item in planRevenue" :key="item.name" class="flex justify-between items-center text-sm">
            <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #1890ff;"></span>{{ item.name }}</span>
            <span class="text-gray-600">{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">施工类当年累计营收</h3>
        <ul class="space-y-2">
          <li v-for="item in actualRevenue" :key="item.name" class="flex justify-between items-center text-sm">
            <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #722ed1;"></span>{{ item.name }}</span>
            <span class="text-gray-600">{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">下月计划</h3>
        <ul class="space-y-2">
          <li v-for="item in nextMonthPlan" :key="item.name" class="flex justify-between items-center text-sm">
            <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #52c41a;"></span>{{ item.name }}</span>
            <span class="text-gray-600">{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">当年累计营收</h3>
        <ul class="space-y-2">
          <li v-for="item in yearTotalRevenue" :key="item.name" class="flex justify-between items-center text-sm">
            <span class="flex items-center"><span class="w-2 h-2 rounded-full mr-2" style="background: #13c2c2;"></span>{{ item.name }}</span>
            <span class="text-gray-600">{{ item.value }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">营收计划上报及时性</h3>
        <div class="flex gap-6 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" style="background: #f5222d;"></span>
            <span class="text-sm text-gray-600">红色预警</span>
            <span class="text-lg font-bold" style="color: #f5222d;">21</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" style="background: #fa8c16;"></span>
            <span class="text-sm text-gray-600">橙色预警</span>
            <span class="text-lg font-bold" style="color: #fa8c16;">12</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" style="background: #faad14;"></span>
            <span class="text-sm text-gray-600">黄色预警</span>
            <span class="text-lg font-bold" style="color: #faad14;">22</span>
          </div>
        </div>
        <div ref="timelinessChartRef" class="h-64"></div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-800 mb-3">X月营收构成情况</h3>
        <div class="flex items-center gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-500">7,108</div>
            <div class="text-sm text-gray-500">万元</div>
          </div>
          <div class="flex-1">
            <div v-for="(item, index) in pieDetails" :key="item.name" class="flex justify-between items-center py-1 text-sm">
              <span class="flex items-center">
                <span class="w-2 h-2 rounded-full mr-2" :style="{ background: pieColors[index] }"></span>
                {{ item.name }}
              </span>
              <span class="text-gray-600 font-medium">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div ref="pieChartRef" class="h-48 mt-4"></div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-800 mb-3">营收月度统计</h3>
      <div ref="revenueChartRef" class="h-64"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const activeCategory = ref('water')
const activeSub = ref('pipe')

const categoryTabs = [
  { name: '全部', count: 0 },
  { name: '管网事业部', count: 24 },
  { name: '生态事业部', count: 18 },
  { name: '区域事业部', count: 22 },
  { name: '市政事业部', count: 16 }
]

const subTabs = [
  { name: '管网事业部 (24)' },
  { name: '生态事业部 (18)' },
  { name: '区域事业部 (22)' },
  { name: '市政事业部 (16)' },
  { name: '环境建设 (15)' },
  { name: '管道工程 (19)' },
  { name: '管道分公司 (21)' },
  { name: '运营养护 (17)' },
  { name: '二次养护 (20)' }
]

const statCards = ref([
  { title: '施工类当年计划营收', value: '1,221,800', unit: '万元', icon: 'trending-up', bgClass: 'bg-blue-50', iconClass: 'text-blue-500', drillable: true, drillTarget: 'revenue-summary' },
  { title: '施工类当月完成营收', value: '875,420', unit: '万元', icon: 'target', bgClass: 'bg-green-50', iconClass: 'text-green-500', drillable: true, drillTarget: 'revenue-detail' },
  { title: '施工类当年累计营收', value: '3.56', unit: '万元', icon: 'bar-chart', bgClass: 'bg-purple-50', iconClass: 'text-purple-500', drillable: true, drillTarget: 'revenue-summary' },
  { title: '施工类当年累计完成营收', value: '3.56', unit: '万元', icon: 'check-circle', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-500' },
  { title: '截止当月剩余合同存量', value: '3.56', unit: '万元', icon: 'file-text', bgClass: 'bg-orange-50', iconClass: 'text-orange-500' },
  { title: '施工类下月计划', value: '3.56', unit: '万元', icon: 'calendar', bgClass: 'bg-pink-50', iconClass: 'text-pink-500', drillable: true, drillTarget: 'revenue-deviation' },
  { title: '当年累计营收', value: '3.56', unit: '万元', icon: 'dollar-sign', bgClass: 'bg-gray-50', iconClass: 'text-gray-500' }
])

const handleDrill = (target) => {
  console.log('Drill to:', target)
  alert(`正在跳转到: ${target}`)
}

const planRevenue = ref([
  { name: '新接项目', value: '6,000万元' },
  { name: '结转在建项目', value: '6,000万元' },
  { name: '完工未结算项目', value: '6,000万元' }
])

const actualRevenue = ref([
  { name: '新接项目', value: '6,000万元' },
  { name: '结转在建项目', value: '6,000万元' },
  { name: '完工未结算项目', value: '6,000万元' }
])

const nextMonthPlan = ref([
  { name: '新接项目', value: '6,000万元' },
  { name: '结转在建项目', value: '6,000万元' },
  { name: '完工未结算项目', value: '6,000万元' }
])

const yearTotalRevenue = ref([
  { name: '施工类', value: '3,000万元' },
  { name: '产品类', value: '2,000万元' },
  { name: '其他业态类', value: '1,000万元' }
])

const pieColors = ['#1890ff', '#722ed1', '#13c2c2', '#fa8c16', '#f5222d', '#faad14', '#52c41a', '#91d5ff', '#ffc53d']
const pieDetails = ref([
  { name: '管网事业部', value: '7 (11%) 789万' },
  { name: '生态事业部', value: '7 (11%) 789万' },
  { name: '区域事业部', value: '7 (11%) 789万' },
  { name: '市政事业部', value: '7 (11%) 789万' },
  { name: '环境建设', value: '7 (11%) 789万' },
  { name: '管道工程', value: '7 (11%) 789万' },
  { name: '管道分公司', value: '7 (11%) 789万' },
  { name: '运营养护', value: '7 (11%) 789万' },
  { name: '二次养护', value: '7 (11%) 789万' }
])

const timelinessChartRef = ref(null)
const revenueChartRef = ref(null)
const pieChartRef = ref(null)

const initCharts = () => {
  if (timelinessChartRef.value) {
    const timelinessChart = echarts.init(timelinessChartRef.value)
    timelinessChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['已上报', '未上报'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: ['管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设', '管道工程', '管道分公司', '运营养护', '二次养护'] },
      yAxis: { type: 'value', name: '计划数' },
      series: [
        { name: '已上报', type: 'bar', data: [180, 160, 150, 170, 165, 175, 185, 155, 168], itemStyle: { color: '#1890ff' } },
        { name: '未上报', type: 'bar', data: [60, 80, 90, 70, 75, 65, 55, 85, 72], itemStyle: { color: '#52c41a' } }
      ]
    })
  }

  if (revenueChartRef.value) {
    const revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['年初结转实施项目', '年初结转待结转项目', '当年新签项目'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: ['2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04'] },
      yAxis: { type: 'value', name: '万元' },
      series: [
        { name: '年初结转实施项目', type: 'bar', data: [1500, 2000, 2500, 3000, 3500, 4000], itemStyle: { color: '#1890ff' } },
        { name: '年初结转待结转项目', type: 'bar', data: [1000, 1500, 2000, 2000, 2500, 3000], itemStyle: { color: '#722ed1' } },
        { name: '当年新签项目', type: 'bar', data: [500, 1000, 1500, 2000, 2500, 3000], itemStyle: { color: '#13c2c2' } }
      ]
    })
  }

  if (pieChartRef.value) {
    const pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { name: '管网事业部', value: 789, itemStyle: { color: '#1890ff' } },
          { name: '生态事业部', value: 789, itemStyle: { color: '#722ed1' } },
          { name: '区域事业部', value: 789, itemStyle: { color: '#13c2c2' } },
          { name: '市政事业部', value: 789, itemStyle: { color: '#fa8c16' } },
          { name: '环境建设', value: 789, itemStyle: { color: '#f5222d' } },
          { name: '管道工程', value: 789, itemStyle: { color: '#faad14' } },
          { name: '管道分公司', value: 789, itemStyle: { color: '#52c41a' } },
          { name: '运营养护', value: 789, itemStyle: { color: '#91d5ff' } },
          { name: '二次养护', value: 789, itemStyle: { color: '#ffc53d' } }
        ]
      }]
    })
  }

  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  const charts = document.querySelectorAll('[_echarts_instance_]')
  charts.forEach(chart => {
    const instance = echarts.getInstanceByDom(chart)
    instance?.resize()
  })
}

onMounted(() => {
  setTimeout(() => {
    initCharts()
  }, 100)
})
</script>
