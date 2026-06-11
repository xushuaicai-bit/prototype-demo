<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">项目投标管理</h2>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">组织:</span>
            <el-select v-model="selectedOrg" class="w-40">
              <el-option label="全部组织" value="" />
              <el-option label="管网事业部" value="pipe-network" />
              <el-option label="生态事业部" value="ecology" />
              <el-option label="区域事业部" value="regional" />
              <el-option label="市政事业部" value="municipal" />
            </el-select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">年份:</span>
            <el-select v-model="selectedYear" class="w-24">
              <el-option label="2025年" value="2025" />
              <el-option label="2026年" value="2026" />
            </el-select>
          </div>
          <button 
            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            @click="refreshData"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-500">在投项目数量</div>
            <div class="text-2xl font-bold text-blue-600">{{ stats.inBidCount }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-500">中标项目数量</div>
            <div class="text-2xl font-bold text-green-600">{{ stats.winningCount }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-500">在投项目金额</div>
            <div class="text-2xl font-bold text-purple-600">{{ stats.inBidAmount }}亿</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-xs text-gray-500">中标项目金额</div>
            <div class="text-2xl font-bold text-orange-600">{{ stats.winningAmount }}亿</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">项目类型分布</h3>
        </div>
        <div ref="projectTypePie" class="h-64"></div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-800">市场等级分布</h3>
        </div>
        <div ref="marketLevelPie" class="h-64"></div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-base font-semibold text-gray-800">投标项目清单</h3>
        </div>
        <button 
          class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          @click="exportExcel"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出 Excel
        </button>
      </div>

      <div class="overflow-x-auto">
        <el-table
          :data="projectList"
          border
          :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
          :max-height="500"
          @row-click="viewProjectDetail"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column
            label="项目编号"
            prop="projectCode"
            width="120"
            align="center"
          />
          <el-table-column
            label="项目名称"
            prop="projectName"
            min-width="200"
          />
          <el-table-column
            label="市场等级"
            prop="marketLevel"
            width="100"
            align="center"
          >
            <template #default="scope">
              <span :class="getMarketLevelClass(scope.row.marketLevel)">
                {{ scope.row.marketLevel }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="业务类型"
            prop="businessType"
            width="120"
            align="center"
          />
          <el-table-column
            label="项目所在地"
            prop="location"
            width="120"
            align="center"
          />
          <el-table-column
            label="客户名称"
            prop="customerName"
            width="150"
          />
          <el-table-column
            label="投标金额（万元）"
            prop="bidAmount"
            width="140"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.bidAmount) }}
            </template>
          </el-table-column>
          <el-table-column
            label="投标截止时间"
            prop="bidDeadline"
            width="140"
            align="center"
          />
          <el-table-column
            label="投标状态"
            prop="bidStatus"
            width="100"
            align="center"
          >
            <template #default="scope">
              <span :class="getBidStatusClass(scope.row.bidStatus)">
                {{ scope.row.bidStatus }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center"
          >
            <template #default="scope">
              <button 
                class="text-blue-500 hover:text-blue-700 text-sm"
                @click.stop="viewProjectDetail(scope.row)"
              >
                详情
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="项目详情"
      :visible.sync="showDetail"
      width="600px"
    >
      <div v-if="selectedProject" class="space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-semibold text-gray-800">{{ selectedProject.projectName }}</h4>
            <span class="text-sm text-gray-500">{{ selectedProject.projectCode }}</span>
          </div>
          <span :class="['px-2 py-1 rounded text-sm', getMarketLevelClass(selectedProject.marketLevel)]">
            {{ selectedProject.marketLevel }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">业务类型</div>
            <div class="text-sm font-medium">{{ selectedProject.businessType }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">项目所在地</div>
            <div class="text-sm font-medium">{{ selectedProject.location }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">客户名称</div>
            <div class="text-sm font-medium">{{ selectedProject.customerName }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">投标金额</div>
            <div class="text-sm font-medium">{{ formatNumber(selectedProject.bidAmount) }} 万元</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">投标截止时间</div>
            <div class="text-sm font-medium">{{ selectedProject.bidDeadline }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">投标状态</div>
            <div class="text-sm font-medium">{{ selectedProject.bidStatus }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">法人单位</div>
            <div class="text-sm font-medium">{{ selectedProject.legalUnit }}</div>
          </div>
          <div class="border p-3 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">实施主体</div>
            <div class="text-sm font-medium">{{ selectedProject.implementUnit }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const selectedOrg = ref('')
const selectedYear = ref('2026')
const showDetail = ref(false)
const selectedProject = ref(null)

const stats = ref({
  inBidCount: 28,
  winningCount: 15,
  inBidAmount: 28.5,
  winningAmount: 18.2
})

const projectList = ref([
  { projectCode: 'XM2026001', projectName: '浦东新区污水管网改造工程', marketLevel: 'AAA', businessType: '管网工程', location: '上海浦东', customerName: '上海水务局', bidAmount: 7500, bidDeadline: '2026-06-15', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '管网事业部' },
  { projectCode: 'XM2026002', projectName: '广州南沙水环境治理项目', marketLevel: 'AA', businessType: '水环境', location: '广州南沙', customerName: '广州水务局', bidAmount: 5200, bidDeadline: '2026-06-18', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '生态事业部' },
  { projectCode: 'XM2026003', projectName: '北京通州区供水工程', marketLevel: 'AAA', businessType: '供水工程', location: '北京通州', customerName: '北京水务集团', bidAmount: 8800, bidDeadline: '2026-06-20', bidStatus: '准备投标', legalUnit: '城市环境集团', implementUnit: '城水管管道' },
  { projectCode: 'XM2026004', projectName: '宁波工业园区排水系统', marketLevel: 'AA', businessType: '排水工程', location: '浙江宁波', customerName: '宁波工业园区', bidAmount: 4200, bidDeadline: '2026-06-22', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '管网事业部' },
  { projectCode: 'XM2026005', projectName: '重庆两江新区水务项目', marketLevel: 'A', businessType: '水务综合', location: '重庆渝北', customerName: '重庆水务集团', bidAmount: 3500, bidDeadline: '2026-06-25', bidStatus: '准备投标', legalUnit: '城市环境集团', implementUnit: '设计咨询中心' },
  { projectCode: 'XM2026006', projectName: '郑州智慧水务平台', marketLevel: 'AAA', businessType: '信息化', location: '河南郑州', customerName: '郑州水务局', bidAmount: 6500, bidDeadline: '2026-06-28', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '设计咨询中心' },
  { projectCode: 'XM2026007', projectName: '合肥经开区供水扩建', marketLevel: 'AA', businessType: '供水工程', location: '安徽合肥', customerName: '合肥供水集团', bidAmount: 4800, bidDeadline: '2026-07-01', bidStatus: '准备投标', legalUnit: '城市环境集团', implementUnit: '城水管管道' },
  { projectCode: 'XM2026008', projectName: '佛山污水处理厂升级', marketLevel: 'AAA', businessType: '污水处理', location: '广东佛山', customerName: '佛山水务局', bidAmount: 7200, bidDeadline: '2026-07-05', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '生态事业部' },
  { projectCode: 'XM2026009', projectName: '兰州供水管道改造', marketLevel: 'A', businessType: '管网工程', location: '甘肃兰州', customerName: '兰州城投集团', bidAmount: 2800, bidDeadline: '2026-07-08', bidStatus: '准备投标', legalUnit: '城市环境集团', implementUnit: '管网事业部' },
  { projectCode: 'XM2026010', projectName: '沈阳浑河水环境治理', marketLevel: 'AA', businessType: '水环境', location: '辽宁沈阳', customerName: '沈阳水务局', bidAmount: 5500, bidDeadline: '2026-07-10', bidStatus: '投标中', legalUnit: '城市环境集团', implementUnit: '环境建设' }
])

const projectTypePie = ref(null)
const marketLevelPie = ref(null)
let charts = []

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getMarketLevelClass = (level) => {
  switch (level) {
    case 'AAA': return 'bg-red-100 text-red-700 px-2 py-1 rounded text-sm'
    case 'AA': return 'bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm'
    case 'A': return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm'
    default: return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm'
  }
}

const getBidStatusClass = (status) => {
  switch (status) {
    case '投标中': return 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm'
    case '准备投标': return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm'
    case '已提交': return 'bg-green-100 text-green-700 px-2 py-1 rounded text-sm'
    default: return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm'
  }
}

const viewProjectDetail = (row) => {
  selectedProject.value = row
  showDetail.value = true
}

const refreshData = () => {
  alert('数据已刷新')
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}

const initCharts = () => {
  const projectTypeData = [
    { name: '管网工程', value: 45 },
    { name: '水环境', value: 25 },
    { name: '供水工程', value: 15 },
    { name: '污水处理', value: 10 },
    { name: '信息化', value: 5 }
  ]

  const marketLevelData = [
    { name: 'AAA', value: 35 },
    { name: 'AA', value: 40 },
    { name: 'A', value: 25 }
  ]

  const colors = ['#1890ff', '#722ed1', '#13c2c2', '#fa8c16', '#f5222d']

  if (projectTypePie.value) {
    const chart = echarts.init(projectTypePie.value)
    charts.push(chart)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: { bottom: 0, itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 10 } },
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: projectTypeData.map((item, index) => ({
          name: item.name, value: item.value, itemStyle: { color: colors[index % colors.length] }
        }))
      }]
    })
  }

  if (marketLevelPie.value) {
    const chart = echarts.init(marketLevelPie.value)
    charts.push(chart)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: { bottom: 0, itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 10 } },
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: marketLevelData.map((item, index) => ({
          name: item.name, value: item.value, itemStyle: { color: ['#f5222d', '#fa8c16', '#faad14'][index] }
        }))
      }]
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