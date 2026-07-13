<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in unitTabs"
          :key="tab.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeUnit === tab.key
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          ]"
          @click="activeUnit = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex-1 space-y-4">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800">总体情况</h3>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>已完成数量</span>
              <span class="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
              <span>未完成数量</span>
            </div>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 px-2 font-medium text-gray-600">单位</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600">项目数量</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600" colspan="7">本周未完成情况</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600"></th>
                <th class="text-center py-2 px-2 font-medium text-gray-600"></th>
              </tr>
              <tr class="border-b text-xs text-gray-500">
                <th class="py-2 px-2"></th>
                <th class="py-2 px-2"></th>
                <th class="py-2 px-2">一</th>
                <th class="py-2 px-2">二</th>
                <th class="py-2 px-2">三</th>
                <th class="py-2 px-2">四</th>
                <th class="py-2 px-2">五</th>
                <th class="py-2 px-2">六</th>
                <th class="py-2 px-2">日</th>
                <th class="py-2 px-2"></th>
                <th class="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in overviewData" :key="row.unit" class="border-b hover:bg-gray-50">
                <td class="py-2 px-2 text-gray-700">{{ row.unit }}</td>
                <td class="py-2 px-2 text-center text-gray-700">{{ row.total }}</td>
                <td v-for="(day, i) in row.week" :key="i" class="py-2 px-2 text-center">
                  <span v-if="day.completed || day.uncompleted" class="text-xs">
                    <span v-if="day.completed" class="text-green-600">{{ day.completed }}</span>
                    <span v-if="day.completed && day.uncompleted"> / </span>
                    <span v-if="day.uncompleted" class="text-red-500">{{ day.uncompleted }}</span>
                  </span>
                </td>
                <td class="py-2 px-2 text-center text-green-600">{{ row.completed }}</td>
                <td class="py-2 px-2 text-center text-red-500">{{ row.uncompleted }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <button
              :class="[
                'px-4 py-1.5 text-sm rounded-lg transition-all',
                projectListTab === 'uncompleted'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="projectListTab = 'uncompleted'"
            >
              未完成项目列表
            </button>
            <button
              :class="[
                'px-4 py-1.5 text-sm rounded-lg transition-all',
                projectListTab === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="projectListTab = 'completed'"
            >
              已完成项目列表
            </button>
          </div>

          <div class="flex items-center gap-3 mb-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">所属组织:</span>
              <select class="border rounded px-2 py-1 text-gray-700 text-xs">
                <option>请选择组织</option>
                <option>上海域浦</option>
                <option>市政集团</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">项目名称:</span>
              <input type="text" placeholder="请输入项目名称" class="border rounded px-2 py-1 text-gray-700 text-xs w-32" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-600">预报日期:</span>
              <select class="border rounded px-2 py-1 text-gray-700 text-xs">
                <option>2026 第29周</option>
                <option>2026 第28周</option>
              </select>
              <button class="text-xs text-blue-500 hover:text-blue-600">日期范围</button>
            </div>
            <button class="px-4 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">查询</button>
            <button class="px-4 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">重置</button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-gray-50 border-b">
                  <th class="py-2 px-2 text-left font-medium text-gray-600">序号</th>
                  <th class="py-2 px-2 text-left font-medium text-gray-600">日期</th>
                  <th class="py-2 px-2 text-left font-medium text-gray-600">星期</th>
                  <th class="py-2 px-2 text-left font-medium text-gray-600">项目名称</th>
                  <th class="py-2 px-2 text-left font-medium text-gray-600">预报单位</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">计划状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">排班状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">班会状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">验收状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">旁站状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">核验状态</th>
                  <th class="py-2 px-2 text-center font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in projectList" :key="index" class="border-b hover:bg-gray-50">
                  <td class="py-2 px-2 text-gray-600">{{ index + 1 }}</td>
                  <td class="py-2 px-2 text-gray-600">{{ item.date }}</td>
                  <td class="py-2 px-2 text-gray-600">{{ item.weekday }}</td>
                  <td class="py-2 px-2 text-gray-700">{{ item.projectName }}</td>
                  <td class="py-2 px-2 text-gray-600">{{ item.unit }}</td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.planStatus)">{{ item.planStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.scheduleStatus)">{{ item.scheduleStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.meetingStatus)">{{ item.meetingStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.acceptanceStatus)">{{ item.acceptanceStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.witnessStatus)">{{ item.witnessStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <span :class="statusClass(item.verifyStatus)">{{ item.verifyStatus }}</span>
                  </td>
                  <td class="py-2 px-2 text-center">
                    <button class="text-blue-500 hover:text-blue-600 mr-2">打印</button>
                    <button class="text-blue-500 hover:text-blue-600">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between mt-4 text-sm">
            <span class="text-gray-500">共 152 条记录</span>
            <div class="flex items-center gap-1">
              <button class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">首页</button>
              <button class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">上一页</button>
              <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
              <button class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">2</button>
              <button class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">3</button>
              <span class="px-2 text-gray-400">...</span>
              <button class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">下一页</button>
              <select class="border rounded px-2 py-1 text-gray-600 text-xs ml-2">
                <option>50条/页</option>
                <option>100条/页</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="w-80 flex-shrink-0 space-y-4">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-4">排名列表</h3>
          <div class="text-xs text-gray-500 mb-3">各单位完成情况排名（按周更新）</div>
          <div class="space-y-3">
            <div v-for="(rank, index) in rankList" :key="index" class="flex items-center gap-3">
              <span
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  index < 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ index + 1 }}
              </span>
              <span class="flex-1 text-sm text-gray-700">{{ rank.name }}</span>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: rank.rate + '%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 w-14 text-right">{{ rank.rate }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800">完成情况趋势图</h3>
            <div class="flex gap-1">
              <button class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">近一半月</button>
              <button class="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">近一月</button>
              <button class="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">近一年</button>
            </div>
          </div>
          <div class="text-xs text-gray-500 mb-2">过去30天日均完成项目数量234个</div>
          <div ref="trendChartRef" class="h-48"></div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800">访问量统计</h3>
          </div>
          <div class="text-xs text-gray-500 mb-2">过去30天累计访问79483次,项目7583次, 管理层10903次</div>
          <div ref="visitChartRef" class="h-48"></div>
          <div class="flex items-center justify-center gap-4 mt-2 text-xs">
            <div class="flex items-center gap-1">
              <span class="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span class="text-gray-500">项目层</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span class="text-gray-500">管理层</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span class="text-gray-500">总体</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const activeUnit = ref('total')
const projectListTab = ref('uncompleted')
const trendChartRef = ref(null)
const visitChartRef = ref(null)

const unitTabs = [
  { key: 'total', label: '总体情况' },
  { key: 'yupu', label: '上海域浦' },
  { key: 'shizheng', label: '市政集团' },
  { key: 'luqiao', label: '上海路桥' },
  { key: 'huanjing', label: '城市环境' },
  { key: 'nengjian', label: '上海能建' },
  { key: 'changning', label: '畅凝物资' }
]

const overviewData = [
  {
    unit: '上海域浦',
    total: 78,
    week: [
      { completed: 38, uncompleted: 40 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 38,
    uncompleted: 40
  },
  {
    unit: '市政集团',
    total: 76,
    week: [
      { completed: 40, uncompleted: 34 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 40,
    uncompleted: 34
  },
  {
    unit: '上海路桥',
    total: 54,
    week: [
      { completed: 32, uncompleted: 24 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 32,
    uncompleted: 24
  },
  {
    unit: '城市环境',
    total: 30,
    week: [
      { completed: 11, uncompleted: 19 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 11,
    uncompleted: 19
  },
  {
    unit: '上海能建',
    total: 9,
    week: [
      { completed: 5, uncompleted: 3 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 5,
    uncompleted: 3
  },
  {
    unit: '畅凝物资',
    total: 9,
    week: [
      { completed: 6, uncompleted: 3 },
      {}, {}, {}, {}, {}, {}
    ],
    completed: 6,
    uncompleted: 3
  }
]

const rankList = [
  { name: '城市环境', rate: 63.3 },
  { name: '上海隧道', rate: 51.3 },
  { name: '市政集团', rate: 45.9 },
  { name: '上海路桥', rate: 42.9 },
  { name: '上海能建', rate: 37.5 },
  { name: '畅凝物资', rate: 33.3 }
]

const projectList = [
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '无锡5号线4标-5号工地...',
    unit: '上海隧道-江苏分公司',
    planStatus: '进行中',
    scheduleStatus: '进行中',
    meetingStatus: '未开展',
    acceptanceStatus: '未开展',
    witnessStatus: '未开展',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '南翔外宅公寓（城中村）...',
    unit: '上海隧道-市政分公司',
    planStatus: '进行中',
    scheduleStatus: '进行中',
    meetingStatus: '未开展',
    acceptanceStatus: '未开展',
    witnessStatus: '未开展',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '上海市轨道交通市域线（嘉闵...',
    unit: '上海路桥-总承包二部',
    planStatus: '已完成',
    scheduleStatus: '已完成',
    meetingStatus: '未开展',
    acceptanceStatus: '进行中',
    witnessStatus: '进行中',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '上海轨道交通市域线嘉定...',
    unit: '上海路桥-总承包二部',
    planStatus: '已完成',
    scheduleStatus: '已完成',
    meetingStatus: '已完成',
    acceptanceStatus: '进行中',
    witnessStatus: '进行中',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '横一至横六条燃气管道工程',
    unit: '上海隧管-江苏分公司',
    planStatus: '已完成',
    scheduleStatus: '已完成',
    meetingStatus: '已完成',
    acceptanceStatus: '已完成',
    witnessStatus: '进行中',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '无锡市盛岸路轨道交通3号线...',
    unit: '上海隧管-江苏分公司',
    planStatus: '已完成',
    scheduleStatus: '已完成',
    meetingStatus: '未开展',
    acceptanceStatus: '未开展',
    witnessStatus: '未开展',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '上海市轨道交通21号线...',
    unit: '上海隧道-市政分公司',
    planStatus: '已完成',
    scheduleStatus: '已完成',
    meetingStatus: '未开展',
    acceptanceStatus: '未开展',
    witnessStatus: '未开展',
    verifyStatus: '未开展'
  },
  {
    date: '2026-07-13',
    weekday: '星期一',
    projectName: '北社区B0601地块N6...',
    unit: '城市环境-环境建设',
    planStatus: '进行中',
    scheduleStatus: '进行中',
    meetingStatus: '未开展',
    acceptanceStatus: '未开展',
    witnessStatus: '未开展',
    verifyStatus: '未开展'
  }
]

const statusClass = (status) => {
  const map = {
    '已完成': 'px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs',
    '进行中': 'px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs',
    '未开展': 'px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-xs'
  }
  return map[status] || 'px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-xs'
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)
  const dates = []
  const projectData = []
  const totalData = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    const base = 200 + Math.floor(Math.random() * 80)
    projectData.push(base)
    totalData.push(base + 30 + Math.floor(Math.random() * 50))
  }
  totalData[totalData.length - 1] = totalData[totalData.length - 2] - 100
  projectData[projectData.length - 1] = projectData[projectData.length - 2] - 60

  chart.setOption({
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
      data: dates,
      axisLabel: {
        fontSize: 10,
        color: '#999',
        interval: 6
      },
      axisLine: {
        lineStyle: { color: '#eee' }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLabel: {
          fontSize: 10,
          color: '#999'
        },
        splitLine: {
          lineStyle: { color: '#f0f0f0' }
        }
      },
      {
        type: 'value',
        name: '',
        axisLabel: {
          fontSize: 10,
          color: '#999',
          formatter: '{value}%'
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '项目层',
        type: 'bar',
        data: projectData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#60A5FA' },
            { offset: 1, color: '#3B82F6' }
          ])
        },
        barWidth: '60%'
      },
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 1,
        data: totalData.map(v => Math.min(100, Math.round(v / 300 * 100))),
        smooth: true,
        lineStyle: { color: '#F97316' },
        itemStyle: { color: '#F97316' }
      }
    ]
  })
}

const initVisitChart = () => {
  if (!visitChartRef.value) return
  const chart = echarts.init(visitChartRef.value)
  const dates = []
  const projectData = []
  const manageData = []
  const totalData = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}-${d.getDate()}`)
    const project = 200 + Math.floor(Math.random() * 150) + Math.sin(i / 5) * 80
    const manage = 300 + Math.floor(Math.random() * 100) + Math.cos(i / 4) * 50
    projectData.push(Math.round(project))
    manageData.push(Math.round(manage))
    totalData.push(Math.round(project + manage))
  }

  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: false
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
      data: dates,
      axisLabel: {
        fontSize: 10,
        color: '#999',
        interval: 6
      },
      axisLine: {
        lineStyle: { color: '#eee' }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#999'
      },
      splitLine: {
        lineStyle: { color: '#f0f0f0' }
      }
    },
    series: [
      {
        name: '项目层',
        type: 'line',
        data: projectData,
        smooth: true,
        lineStyle: { color: '#60A5FA', width: 2 },
        itemStyle: { color: '#60A5FA' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(96, 165, 250, 0.3)' },
            { offset: 1, color: 'rgba(96, 165, 250, 0.05)' }
          ])
        }
      },
      {
        name: '管理层',
        type: 'line',
        data: manageData,
        smooth: true,
        lineStyle: { color: '#FB923C', width: 2 },
        itemStyle: { color: '#FB923C' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251, 146, 60, 0.3)' },
            { offset: 1, color: 'rgba(251, 146, 60, 0.05)' }
          ])
        }
      },
      {
        name: '总体',
        type: 'line',
        data: totalData,
        smooth: true,
        lineStyle: { color: '#9CA3AF', width: 2 },
        itemStyle: { color: '#9CA3AF' }
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => {
    initTrendChart()
    initVisitChart()
  })
})
</script>
