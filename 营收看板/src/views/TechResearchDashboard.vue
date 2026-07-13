<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center gap-4 mb-4">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">技术科研看板</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filterTabs"
          :key="item.name"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedFilter === item.name
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="handleFilterChange(item.name)"
        >
          {{ item.name }}
          <span v-if="item.count > 0" class="ml-1 opacity-75">({{ item.count }})</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800">施工方案</h3>
            <div class="flex gap-2">
              <button
                v-for="tab in techTabs"
                :key="tab.key"
                :class="[
                  'px-3 py-1 text-sm rounded-lg transition-all',
                  activeTechTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                @click="activeTechTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <button
              :class="[
                'px-3 py-1 text-sm rounded-lg transition-all',
                techChartType === 'company'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="techChartType = 'company'"
            >
              9家基层单位
            </button>
            <button
              :class="[
                'px-3 py-1 text-sm rounded-lg transition-all',
                techChartType === 'business'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="techChartType = 'business'"
            >
              8大业态
            </button>
          </div>
          
          <div ref="techChartRef" class="flex-1 min-h-[280px]"></div>
          
          <div class="mt-4 text-sm text-gray-600">
            {{ currentTechSummary }}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h3 class="font-semibold text-gray-800 mb-4">知识库使用情况</h3>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ techData.knowledgeBase.totalUpload }}</div>
            <div class="text-xs text-gray-500">总上传件数</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ techData.knowledgeBase.totalDownload }}</div>
            <div class="text-xs text-gray-500">总下载次数</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ techData.knowledgeBase.downloadUsers }}</div>
            <div class="text-xs text-gray-500">下载人数</div>
          </div>
        </div>
        <div ref="knowledgeChartRef" class="h-[180px]"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">基层单位科研项目数量</h3>
          <button 
            class="text-xs text-blue-500 hover:text-blue-600"
            @click="openResearchProjectList()"
          >
            查看全部
          </button>
        </div>
        <div ref="projectChartRef" class="h-[280px]"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">科研成果统计</h3>
          <button 
            class="text-xs text-blue-500 hover:text-blue-600"
            @click="openAchievementList()"
          >
            查看详情
          </button>
        </div>
        <div class="flex gap-2 mb-4">
          <button
            :class="[
              'px-3 py-1 text-sm rounded-lg transition-all',
              achievementTab === 'type'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
            @click="achievementTab = 'type'"
          >
            按成果类型
          </button>
          <button
            :class="[
              'px-3 py-1 text-sm rounded-lg transition-all',
              achievementTab === 'company'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
            @click="achievementTab = 'company'"
          >
            按基层单位
          </button>
        </div>
        <div ref="achievementChartRef" class="h-[220px]"></div>
      </div>

    </div>

    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800">科研费用管控</h3>
        <select
          v-model="selectedQuarter"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="q in researchData.expenses.quarters" :key="q" :value="q">
            {{ q }}
          </option>
        </select>
      </div>
      <div class="flex flex-wrap gap-4 mb-3 text-sm">
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-sm" style="background:#3b82f6"></span>
          <span class="text-gray-600">专项实际</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-sm" style="background:#10b981"></span>
          <span class="text-gray-600">配套实际</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-4 h-[2px]" style="background:#f59e0b"></span>
          <span class="text-gray-600">计划指标线</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-sm" style="background:#bfdbfe"></span>
          <span class="text-gray-600">未达标(弱化)</span>
        </div>
      </div>
      <div ref="expenseChartRef" class="w-full h-[380px]"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { techDashboardData, researchDashboardData } from '../data/mockData.js'
import { externalUrls, openExternal } from '@/config/externalUrls'

const selectedFilter = ref('全部')

const filterTabs = ref([
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
])

const activeTechTab = ref('approval')
const techChartType = ref('company')
const achievementTab = ref('type')
const selectedQuarter = ref('Q1')

const techTabs = [
  { key: 'approval', label: '审批完成率' },
  { key: 'scheme', label: '方案退回率' },
  { key: 'disclosure', label: '交底情况' }
]

const techData = techDashboardData
const researchData = researchDashboardData

const techChartRef = ref(null)
const knowledgeChartRef = ref(null)
const projectChartRef = ref(null)
const achievementChartRef = ref(null)
const expenseChartRef = ref(null)

let techChart = null
let knowledgeChart = null
let projectChart = null
let achievementChart = null
let expenseChart = null

const currentTechData = computed(() => {
  const dataMap = {
    approval: {
      company: techData.approvalByCompany,
      business: techData.approvalByBusiness
    },
    scheme: {
      company: techData.schemeByCompany,
      business: techData.schemeByBusiness
    },
    disclosure: {
      company: techData.disclosureByCompany,
      business: techData.disclosureByBusiness
    }
  }
  return dataMap[activeTechTab.value][techChartType.value]
})

const currentTechSummary = computed(() => {
  const summaries = {
    approval: `审批完成总数${currentTechData.value.summary.total}个，平均完成率${currentTechData.value.summary.avgRate}`,
    scheme: `方案退回次数${currentTechData.value.summary.total}次，平均退回率${currentTechData.value.summary.avgRate}`,
    disclosure: `方案交底总数${currentTechData.value.summary.total}个，平均交底率${currentTechData.value.summary.avgCount}`
  }
  return summaries[activeTechTab.value]
})

const currentExpense = computed(() => {
  return researchData.expenses.quarterlyData[selectedQuarter.value]
})

const handleFilterChange = (name) => {
  selectedFilter.value = name
}

const openResearchProjectList = (company = '') => {
  openExternal(externalUrls.researchProject(company))
}

const openAchievementList = (type = '') => {
  openExternal(externalUrls.researchAchievement(type))
}

const initTechChart = () => {
  if (!techChartRef.value) return
  techChart = echarts.init(techChartRef.value)
  updateTechChart()
  
  techChart.on('click', (params) => {
    const category = params.name
    let url = ''
    if (activeTechTab.value === 'approval') {
      url = externalUrls.techSchemePlan(category)
    } else if (activeTechTab.value === 'disclosure') {
      url = externalUrls.techSchemeSpecial(category)
    }
    if (url) {
      openExternal(url)
    }
  })
}

const updateTechChart = () => {
  if (!techChart) return
  
  const data = currentTechData.value
  const colors = {
    approval: ['#3b82f6', '#60a5fa'],
    scheme: ['#f59e0b', '#fbbf24'],
    disclosure: ['#10b981', '#6ee7b7']
  }

  // 右侧纵轴名称及折线名称配置
  const rateConfig = {
    approval: { name: '审批完成率', color: '#ef4444' },
    scheme: { name: '退回率', color: '#8b5cf6' },
    disclosure: { name: '交底率', color: '#f59e0b' }
  }

  // 根据当前 tab 计算比率数据（折线数据）
  const rateData = data.series[0].data.map((val, i) => {
    const total = val + data.series[1].data[i]
    return total > 0 ? Number(((val / total) * 100).toFixed(1)) : 0
  })

  const currentRate = rateConfig[activeTechTab.value]
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [...data.series.map(s => s.name), currentRate.name]
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量'
      },
      {
        type: 'value',
        name: currentRate.name,
        axisLabel: {
          formatter: '{value}%'
        },
        max: 100,
        min: 0
      }
    ],
    series: [
      ...data.series.map((s, i) => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        itemStyle: {
          color: colors[activeTechTab.value][i]
        }
      })),
      {
        name: currentRate.name,
        type: 'line',
        yAxisIndex: 1,
        data: rateData,
        itemStyle: {
          color: currentRate.color
        },
        line: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  }
  
  techChart.setOption(option, true)
}

const initKnowledgeChart = () => {
  if (!knowledgeChartRef.value) return
  knowledgeChart = echarts.init(knowledgeChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: techData.knowledgeBase.categories,
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 9
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '上传文件数量',
        type: 'bar',
        data: techData.knowledgeBase.uploadData,
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: '下载次数',
        type: 'bar',
        data: techData.knowledgeBase.downloadData,
        itemStyle: {
          color: '#93c5fd'
        }
      }
    ]
  }
  
  knowledgeChart.setOption(option)
  
  knowledgeChart.on('click', () => {
    openExternal(externalUrls.techProcedure)
  })
}

const initProjectChart = () => {
  if (!projectChartRef.value) return
  projectChart = echarts.init(projectChartRef.value)
  
  const data = researchData.projects.byCompany
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '项目数量',
        type: 'bar',
        data: data.map(d => d.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#93c5fd' }
          ])
        }
      }
    ]
  }
  
  projectChart.setOption(option)
  
  projectChart.on('click', (params) => {
    openResearchProjectList(params.name)
  })
}

const initAchievementChart = () => {
  if (!achievementChartRef.value) return
  achievementChart = echarts.init(achievementChartRef.value)
  updateAchievementChart()
}

const updateAchievementChart = () => {
  if (!achievementChart) return
  
  let option
  if (achievementTab.value === 'type') {
    const data = researchData.achievements.byType
    option = {
      tooltip: {
        trigger: 'item'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: data.map(d => ({
            value: d.count,
            itemStyle: { color: d.color }
          }))
        }
      ]
    }
  } else {
    const data = researchData.achievements.byCompany.filter(d => d.total > 0)
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'center',
        textStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '科研成果',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map((d, i) => ({
            value: d.total,
            name: d.name,
            itemStyle: { color: colors[i % colors.length] }
          }))
        }
      ]
    }
  }
  
  achievementChart.setOption(option)
}

const EXP_COLOR = {
  special: '#3b82f6',
  support: '#10b981',
  mutedSpecial: '#bfdbfe',
  mutedSupport: '#a7f3d0',
  planLine: '#f59e0b',
  risk: '#ef4444',
  ok: '#10b981'
}

const buildExpenseData = (quarter) => {
  const list = researchData.expenses.byCompany[quarter] || []
  const categories = list.map(item => item.name)
  return { categories, list }
}

const initExpenseChart = () => {
  if (!expenseChartRef.value) return
  expenseChart = echarts.init(expenseChartRef.value)
  updateExpenseChart()
  expenseChart.on('click', (params) => {
    if (params.componentSubType !== 'bar') return
    const d = buildExpenseData(selectedQuarter.value)
    const idx = d.categories.indexOf(params.name)
    if (idx < 0) return
    const type = params.seriesName === '专项' ? 'special' : 'supporting'
    const item = d.list[idx][type]
    const plan = item.plan
    const actual = item.actual
    const rate = plan ? Math.round(actual / plan * 100) : 0
    const dev = actual - plan
    const NL = '\n'
    window.alert(
      '基层单位：' + params.name + NL +
      '类型：' + params.seriesName + NL +
      '计划值：' + plan + '万' + NL +
      '实际值：' + actual + '万' + NL +
      '完成率：' + rate + '%' + NL +
      '偏差：' + dev + '万'
    )
  })
}

const updateExpenseChart = () => {
  if (!expenseChart) return
  const d = buildExpenseData(selectedQuarter.value)
  const list = d.list
  const categories = d.categories

  const specialData = list.map(item => {
    const plan = item.special.plan
    const actual = item.special.actual
    const rate = plan ? actual / plan : 0
    return {
      value: actual,
      itemStyle: { color: rate >= 1 ? EXP_COLOR.special : EXP_COLOR.mutedSpecial }
    }
  })

  const supportData = list.map(item => {
    const plan = item.supporting.plan
    const actual = item.supporting.actual
    const rate = plan ? actual / plan : 0
    return {
      value: actual,
      itemStyle: { color: rate >= 1 ? EXP_COLOR.support : EXP_COLOR.mutedSupport }
    }
  })

  const customData = []
  list.forEach((item, i) => {
    customData.push([i, item.special.plan, -1])
    customData.push([i, item.supporting.plan, 1])
  })

  const labelFormatter = (params) => {
    const idx = params.dataIndex
    const type = params.seriesName === '专项' ? 'special' : 'supporting'
    const item = list[idx][type]
    const plan = item.plan
    const actual = item.actual
    const rate = plan ? Math.round(actual / plan * 100) : 0
    const dev = actual - plan
    const rateKey = rate >= 100 ? 'rateOk' : 'rateRisk'
    const devKey = dev < 0 ? 'devRisk' : 'devOk'
    const devSign = dev >= 0 ? '+' : ''
    return '{' + rateKey + '|' + rate + '%}\n{val|' + actual + '万}\n{' + devKey + '|' + devSign + dev + '万}'
  }

  const richConfig = {
    rateOk: { color: EXP_COLOR.ok, fontSize: 12, fontWeight: 'bold', lineHeight: 16 },
    rateRisk: { color: EXP_COLOR.risk, fontSize: 12, fontWeight: 'bold', lineHeight: 16 },
    val: { color: '#374151', fontSize: 11, lineHeight: 14 },
    devOk: { color: EXP_COLOR.ok, fontSize: 10, lineHeight: 12 },
    devRisk: { color: EXP_COLOR.risk, fontSize: 10, lineHeight: 12 }
  }

  const tooltipFormatter = (params) => {
    const idx = params.dataIndex
    const type = params.seriesName === '专项' ? 'special' : 'supporting'
    const item = list[idx][type]
    const plan = item.plan
    const actual = item.actual
    const rate = plan ? Math.round(actual / plan * 100) : 0
    const dev = actual - plan
    return '<b>' + params.name + ' - ' + params.seriesName + '</b><br/>' +
      '计划值：' + plan + '万<br/>' +
      '实际值：' + actual + '万<br/>' +
      '完成率：' + rate + '%<br/>' +
      '偏差：' + dev + '万'
  }

  const option = {
    tooltip: { trigger: 'item', formatter: tooltipFormatter },
    grid: { left: '4%', right: '4%', bottom: '8%', top: '18%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { interval: 0, rotate: 25, fontSize: 10 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'value',
      name: '万元',
      nameTextStyle: { fontSize: 10, color: '#9ca3af' },
      axisLabel: { fontSize: 10, color: '#9ca3af' },
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: '专项',
        type: 'bar',
        data: specialData,
        barWidth: 20,
        barGap: '30%',
        label: { show: true, position: 'top', formatter: labelFormatter, rich: richConfig }
      },
      {
        name: '配套',
        type: 'bar',
        data: supportData,
        barWidth: 20,
        label: { show: true, position: 'top', formatter: labelFormatter, rich: richConfig }
      },
      {
        name: '计划线',
        type: 'custom',
        data: customData,
        z: 10,
        renderItem: (params, api) => {
          const catIdx = api.value(0)
          const planVal = api.value(1)
          const side = api.value(2)
          const point = api.coord([catIdx, planVal])
          const halfWidth = 10
          const offset = 13 * side
          return {
            type: 'line',
            shape: {
              x1: point[0] - halfWidth + offset,
              y1: point[1],
              x2: point[0] + halfWidth + offset,
              y2: point[1]
            },
            style: { stroke: EXP_COLOR.planLine, lineWidth: 2 }
          }
        }
      }
    ]
  }

  expenseChart.setOption(option, true)
}


const handleResize = () => {
  techChart?.resize()
  knowledgeChart?.resize()
  projectChart?.resize()
  achievementChart?.resize()
  expenseChart?.resize()
}

watch([activeTechTab, techChartType], () => {
  updateTechChart()
})

watch(achievementTab, () => {
  updateAchievementChart()
})

watch(selectedQuarter, () => updateExpenseChart())

onMounted(() => {
  setTimeout(() => {
    initTechChart()
    initKnowledgeChart()
    initProjectChart()
    initAchievementChart()
    initExpenseChart()
    window.addEventListener('resize', handleResize)
  }, 100)
})

onUnmounted(() => {
  techChart?.dispose()
  knowledgeChart?.dispose()
  projectChart?.dispose()
  achievementChart?.dispose()
  expenseChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>
