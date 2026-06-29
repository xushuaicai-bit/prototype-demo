<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">{{ currentYear }}年城市环境集团AAA/AA/A在投项目清单</h2>
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
          label="项目标的/限价（元）"
          prop="bidLimit"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.bidLimit) }}
          </template>
        </el-table-column>
        <el-table-column
          label="投标截止时间"
          prop="bidDeadline"
          width="140"
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
        <el-table-column
          label="投标状态"
          prop="bidStatus"
          width="120"
          align="center"
        >
          <template #default="scope">
            <span :class="getBidStatusClass(scope.row.bidStatus)">
              {{ scope.row.bidStatus }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <span class="text-gray-600">项目数量：<span class="font-bold text-blue-600">{{ tableData.length }}</span></span>
      <span class="text-gray-600">当月投标情况项目合计：<span class="font-bold text-blue-600">{{ formatNumber(totalAmount) }}</span> 元</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = new Date().getFullYear()

const tableData = ref([
  { region: '华东区', marketLevel: 'AAA', projectName: '浦东新区污水管网改造', customerName: '上海水务局', location: '上海浦东', businessType: '管网工程', bidLimit: 75000000, bidDeadline: '2026-06-15', legalUnit: '城市环境集团', accountUnit: '市政事业部', implementUnit: '管网事业部', bidStatus: '投标中' },
  { region: '华南区', marketLevel: 'AA', projectName: '广州南沙水环境治理', customerName: '广州水务局', location: '广州南沙', businessType: '水环境', bidLimit: 52000000, bidDeadline: '2026-06-18', legalUnit: '城市环境集团', accountUnit: '区域事业部', implementUnit: '生态事业部', bidStatus: '投标中' },
  { region: '华北区', marketLevel: 'AAA', projectName: '北京通州区供水工程', customerName: '北京水务集团', location: '北京通州', businessType: '供水工程', bidLimit: 88000000, bidDeadline: '2026-06-20', legalUnit: '城市环境集团', accountUnit: '城水管管道', implementUnit: '城水管管道', bidStatus: '准备投标' },
  { region: '华东区', marketLevel: 'AA', projectName: '宁波工业园区排水系统', customerName: '宁波工业园区', location: '浙江宁波', businessType: '排水工程', bidLimit: 42000000, bidDeadline: '2026-06-22', legalUnit: '城市环境集团', accountUnit: '水务管道', implementUnit: '管网事业部', bidStatus: '投标中' },
  { region: '西南区', marketLevel: 'A', projectName: '重庆两江新区水务项目', customerName: '重庆水务集团', location: '重庆渝北', businessType: '水务综合', bidLimit: 35000000, bidDeadline: '2026-06-25', legalUnit: '城市环境集团', accountUnit: '区域事业部', implementUnit: '设计咨询中心', bidStatus: '准备投标' },
  { region: '华中地区', marketLevel: 'AAA', projectName: '郑州智慧水务平台', customerName: '郑州水务局', location: '河南郑州', businessType: '信息化', bidLimit: 65000000, bidDeadline: '2026-06-28', legalUnit: '城市环境集团', accountUnit: '设计咨询中心', implementUnit: '设计咨询中心', bidStatus: '投标中' },
  { region: '华东区', marketLevel: 'AA', projectName: '合肥经开区供水扩建', customerName: '合肥供水集团', location: '安徽合肥', businessType: '供水工程', bidLimit: 48000000, bidDeadline: '2026-07-01', legalUnit: '城市环境集团', accountUnit: '城水管管道', implementUnit: '城水管管道', bidStatus: '准备投标' },
  { region: '华南区', marketLevel: 'AAA', projectName: '佛山污水处理厂升级', customerName: '佛山水务局', location: '广东佛山', businessType: '污水处理', bidLimit: 72000000, bidDeadline: '2026-07-05', legalUnit: '城市环境集团', accountUnit: '环境建设', implementUnit: '生态事业部', bidStatus: '投标中' },
  { region: '西北区', marketLevel: 'A', projectName: '兰州供水管道改造', customerName: '兰州城投集团', location: '甘肃兰州', businessType: '管网工程', bidLimit: 28000000, bidDeadline: '2026-07-08', legalUnit: '城市环境集团', accountUnit: '区域事业部', implementUnit: '管网事业部', bidStatus: '准备投标' },
  { region: '东北区', marketLevel: 'AA', projectName: '沈阳浑河水环境治理', customerName: '沈阳水务局', location: '辽宁沈阳', businessType: '水环境', bidLimit: 55000000, bidDeadline: '2026-07-10', legalUnit: '城市环境集团', accountUnit: '生态环境事业部', implementUnit: '环境建设', bidStatus: '投标中' }
])

const totalAmount = computed(() => {
  return tableData.value.reduce((sum, item) => sum + item.bidLimit, 0)
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

const getBidStatusClass = (status) => {
  switch (status) {
    case '投标中': return 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm'
    case '准备投标': return 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm'
    case '已提交': return 'bg-green-100 text-green-700 px-2 py-1 rounded text-sm'
    default: return ''
  }
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>
