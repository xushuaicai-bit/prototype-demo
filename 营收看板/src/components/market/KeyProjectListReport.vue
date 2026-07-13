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

    <div>
      <el-table
        :data="tableData"
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
