<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">重点跟踪项目清单</h2>
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

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">所属区域：</label>
        <el-select v-model="filters.region" placeholder="请选择" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="华东区" value="华东区" />
          <el-option label="华南区" value="华南区" />
          <el-option label="华北区" value="华北区" />
          <el-option label="西南区" value="西南区" />
          <el-option label="华中地区" value="华中地区" />
          <el-option label="西北区" value="西北区" />
          <el-option label="东北区" value="东北区" />
        </el-select>
      </div>
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">客户名称：</label>
        <el-input v-model="filters.customerName" placeholder="请输入" class="w-40" />
      </div>
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">市场等级：</label>
        <el-select v-model="filters.marketLevel" placeholder="请选择" class="w-28">
          <el-option label="全部" value="" />
          <el-option label="AAA" value="AAA" />
          <el-option label="AA" value="AA" />
          <el-option label="A" value="A" />
        </el-select>
      </div>
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目名称：</label>
        <el-input v-model="filters.projectName" placeholder="请输入" class="w-48" />
      </div>
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select v-model="filters.grassrootsUnit" placeholder="请选择" class="w-40">
          <el-option label="全部" value="" />
          <el-option label="市政事业部" value="市政事业部" />
          <el-option label="环境建设" value="环境建设" />
          <el-option label="区域事业部" value="区域事业部" />
          <el-option label="城水管管道" value="城水管管道" />
          <el-option label="水务管道" value="水务管道" />
          <el-option label="生态环境事业部" value="生态环境事业部" />
          <el-option label="设计咨询中心" value="设计咨询中心" />
        </el-select>
      </div>
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目阶段：</label>
        <el-select v-model="filters.projectStage" placeholder="请选择" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="投标中" value="投标中" />
          <el-option label="跟踪中" value="跟踪中" />
          <el-option label="准备投标" value="准备投标" />
        </el-select>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <button
          class="flex items-center px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
          @click="resetFilters"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置
        </button>
      </div>
    </div>

    <div>
      <el-table
        :data="paginatedData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :max-height="600"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        />
        <el-table-column
          label="所属区域"
          prop="region"
          width="120"
          align="center"
        />
        <el-table-column
          label="客户名称"
          prop="customerName"
          width="150"
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
          label="项目名称"
          prop="projectName"
          width="250"
        />
        <el-table-column
          label="基层单位"
          prop="grassrootsUnit"
          width="120"
          align="center"
        />
        <el-table-column
          label="项目规模（元）"
          prop="projectScale"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.projectScale) }}
          </template>
        </el-table-column>
        <el-table-column
          label="项目阶段"
          prop="projectStage"
          width="120"
          align="center"
        />
        <el-table-column
          label="投标时间（预计）"
          prop="bidTime"
          width="150"
          align="center"
        />
        <el-table-column
          label="核算组织"
          prop="accountUnit"
          width="120"
          align="center"
        />
      </el-table>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const filters = ref({
  region: '',
  customerName: '',
  marketLevel: '',
  projectName: '',
  grassrootsUnit: '',
  projectStage: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const tableData = ref([
  { region: '华东区', customerName: '上海市政工程局', marketLevel: 'AAA', projectName: '浦东新区供水管道改造工程', grassrootsUnit: '市政事业部', projectScale: 85000000, projectStage: '投标中', bidTime: '2026-06-15', accountUnit: '市政事业部' },
  { region: '华东区', customerName: '上海水务局', marketLevel: 'AAA', projectName: '闵行区污水处理厂扩建项目', grassrootsUnit: '环境建设', projectScale: 62000000, projectStage: '跟踪中', bidTime: '2026-07-20', accountUnit: '环境建设' },
  { region: '华南区', customerName: '广州市政集团', marketLevel: 'AA', projectName: '广州智慧水务平台建设', grassrootsUnit: '区域事业部', projectScale: 45000000, projectStage: '准备投标', bidTime: '2026-06-30', accountUnit: '区域事业部' },
  { region: '华北区', customerName: '北京水务集团', marketLevel: 'AAA', projectName: '北京城区供水管网升级', grassrootsUnit: '城水管管道', projectScale: 98000000, projectStage: '投标中', bidTime: '2026-06-10', accountUnit: '城水管管道' },
  { region: '华东区', customerName: '苏州工业园区', marketLevel: 'AA', projectName: '苏州工业园区水环境治理', grassrootsUnit: '水务管道', projectScale: 52000000, projectStage: '跟踪中', bidTime: '2026-08-05', accountUnit: '水务管道' },
  { region: '西南区', customerName: '成都城投集团', marketLevel: 'A', projectName: '成都天府新区供水工程', grassrootsUnit: '区域事业部', projectScale: 38000000, projectStage: '准备投标', bidTime: '2026-07-15', accountUnit: '区域事业部' },
  { region: '华东区', customerName: '杭州西湖景区', marketLevel: 'AA', projectName: '西湖景区水环境提升', grassrootsUnit: '生态环境事业部', projectScale: 28000000, projectStage: '投标中', bidTime: '2026-06-25', accountUnit: '生态环境事业部' },
  { region: '华中地区', customerName: '武汉水务局', marketLevel: 'AAA', projectName: '武汉长江新区排水系统', grassrootsUnit: '市政事业部', projectScale: 72000000, projectStage: '跟踪中', bidTime: '2026-08-20', accountUnit: '市政事业部' },
  { region: '华南区', customerName: '深圳水务集团', marketLevel: 'AAA', projectName: '深圳前海智慧水务项目', grassrootsUnit: '设计咨询中心', projectScale: 110000000, projectStage: '准备投标', bidTime: '2026-09-01', accountUnit: '设计咨询中心' },
  { region: '西北区', customerName: '西安城投集团', marketLevel: 'A', projectName: '西安护城河治理工程', grassrootsUnit: '环境建设', projectScale: 35000000, projectStage: '投标中', bidTime: '2026-06-20', accountUnit: '环境建设' }
])

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.value.region && item.region !== filters.value.region) return false
    if (filters.value.customerName && !item.customerName.includes(filters.value.customerName)) return false
    if (filters.value.marketLevel && item.marketLevel !== filters.value.marketLevel) return false
    if (filters.value.projectName && !item.projectName.includes(filters.value.projectName)) return false
    if (filters.value.grassrootsUnit && item.grassrootsUnit !== filters.value.grassrootsUnit) return false
    if (filters.value.projectStage && item.projectStage !== filters.value.projectStage) return false
    return true
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

const resetFilters = () => {
  filters.value = {
    region: '',
    customerName: '',
    marketLevel: '',
    projectName: '',
    grassrootsUnit: '',
    projectStage: ''
  }
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0 })
}

const getMarketLevelClass = (level) => {
  switch (level) {
    case 'AAA': return 'bg-red-100 text-red-700 px-2 py-1 rounded text-sm'
    case 'AA': return 'bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm'
    case 'A': return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm'
    default: return ''
  }
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>
