<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">{{ currentYear }}年 中标项目清单</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：元</span>
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
          width="100"
          align="center"
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
          width="200"
        />
        <el-table-column
          label="客户名称"
          prop="customerName"
          width="150"
        />
        <el-table-column
          label="项目所在地"
          prop="location"
          width="120"
          align="center"
        />
        <el-table-column
          label="业务类型"
          prop="businessType"
          width="120"
          align="center"
        />
        <el-table-column
          label="中标价（元）"
          prop="bidPrice"
          width="150"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.bidPrice) }}
          </template>
        </el-table-column>
        <el-table-column
          label="中标时间"
          prop="bidDate"
          width="120"
          align="center"
        />
        <el-table-column
          label="法人单位"
          prop="legalUnit"
          width="120"
          align="center"
        />
        <el-table-column
          label="账户单位"
          prop="accountUnit"
          width="120"
          align="center"
        />
        <el-table-column
          label="实施主体"
          prop="implementUnit"
          width="120"
          align="center"
        />
      </el-table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <span class="text-gray-600">项目数量：<span class="font-bold text-blue-600">{{ tableData.length }}</span></span>
      <span class="text-gray-600">中标项目合计：<span class="font-bold text-blue-600">{{ formatNumber(totalAmount) }}</span> 元</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = new Date().getFullYear()

const tableData = ref([
  { region: '华东区', marketLevel: 'AAA', projectName: '浦东新区供水管道改造工程', customerName: '上海市政工程局', location: '上海浦东', businessType: '管网工程', bidPrice: 85000000, bidDate: '2026-05-15', legalUnit: '城市环境集团', accountUnit: '市政事业部', implementUnit: '管网事业部' },
  { region: '华东区', marketLevel: 'AAA', projectName: '闵行区污水处理厂扩建', customerName: '上海水务局', location: '上海闵行', businessType: '污水处理', bidPrice: 62000000, bidDate: '2026-05-18', legalUnit: '城市环境集团', accountUnit: '环境建设', implementUnit: '生态事业部' },
  { region: '华南区', marketLevel: 'AA', projectName: '广州智慧水务平台', customerName: '广州市政集团', location: '广州天河', businessType: '信息化', bidPrice: 45000000, bidDate: '2026-05-20', legalUnit: '城市环境集团', accountUnit: '区域事业部', implementUnit: '设计咨询中心' },
  { region: '华北区', marketLevel: 'AAA', projectName: '北京城区供水管网升级', customerName: '北京水务集团', location: '北京朝阳', businessType: '管网工程', bidPrice: 98000000, bidDate: '2026-05-22', legalUnit: '城市环境集团', accountUnit: '城水管管道', implementUnit: '管网事业部' },
  { region: '华东区', marketLevel: 'AA', projectName: '苏州工业园区水环境治理', customerName: '苏州工业园区', location: '江苏苏州', businessType: '水环境', bidPrice: 52000000, bidDate: '2026-05-25', legalUnit: '城市环境集团', accountUnit: '水务管道', implementUnit: '生态事业部' },
  { region: '西南区', marketLevel: 'A', projectName: '成都天府新区供水工程', customerName: '成都城投集团', location: '四川成都', businessType: '供水工程', bidPrice: 38000000, bidDate: '2026-05-28', legalUnit: '城市环境集团', accountUnit: '区域事业部', implementUnit: '城水管管道' },
  { region: '华东区', marketLevel: 'AA', projectName: '西湖景区水环境提升', customerName: '杭州西湖景区', location: '浙江杭州', businessType: '水环境', bidPrice: 28000000, bidDate: '2026-06-01', legalUnit: '城市环境集团', accountUnit: '生态环境事业部', implementUnit: '环境建设' },
  { region: '华中地区', marketLevel: 'AAA', projectName: '武汉长江新区排水系统', customerName: '武汉水务局', location: '湖北武汉', businessType: '排水工程', bidPrice: 72000000, bidDate: '2026-06-05', legalUnit: '城市环境集团', accountUnit: '市政事业部', implementUnit: '管网事业部' },
  { region: '华南区', marketLevel: 'AAA', projectName: '深圳前海智慧水务', customerName: '深圳水务集团', location: '广东深圳', businessType: '信息化', bidPrice: 110000000, bidDate: '2026-06-10', legalUnit: '城市环境集团', accountUnit: '设计咨询中心', implementUnit: '设计咨询中心' },
  { region: '西北区', marketLevel: 'A', projectName: '西安护城河治理工程', customerName: '西安城投集团', location: '陕西西安', businessType: '水环境', bidPrice: 35000000, bidDate: '2026-06-12', legalUnit: '城市环境集团', accountUnit: '环境建设', implementUnit: '生态事业部' }
])

const totalAmount = computed(() => {
  return tableData.value.reduce((sum, item) => sum + item.bidPrice, 0)
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
