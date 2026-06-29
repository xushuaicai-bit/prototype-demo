<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <svg class="w-7 h-7 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 class="text-xl font-bold text-gray-800">市场跟踪管理</h1>
          </div>
          <button 
            class="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            @click="exportExcel"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出 Excel
          </button>
        </div>

        <div class="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-600">公司:</span>
            <el-select v-model="filters.company" class="w-48" placeholder="请选择组织">
              <el-option label="全部" value="" />
              <el-option label="管网事业部" value="pipe-network" />
              <el-option label="生态事业部" value="ecology" />
              <el-option label="区域事业部" value="regional" />
              <el-option label="市政事业部" value="municipal" />
              <el-option label="环境建设" value="environment" />
              <el-option label="管道工程" value="pipe-engineering" />
              <el-option label="管道分公司" value="pipe-branch" />
              <el-option label="运营养护" value="operation" />
              <el-option label="二次养护" value="secondary" />
              <el-option label="浦东供排水" value="pudong" />
              <el-option label="设备成套" value="equipment" />
            </el-select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-600">年份:</span>
            <el-select v-model="filters.year" class="w-32" placeholder="请选择年份">
              <el-option label="全部" value="" />
              <el-option label="2025年" value="2025" />
              <el-option label="2026年" value="2026" />
            </el-select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-600">项目类型:</span>
            <el-select v-model="filters.projectType" class="w-32" placeholder="请选择类型">
              <el-option label="全部" value="" />
              <el-option label="施工类" value="construction" />
              <el-option label="产品类" value="product" />
              <el-option label="服务类" value="service" />
            </el-select>
          </div>
          <button 
            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            @click="resetFilters"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置
          </button>
        </div>

        <div>
          <el-table
            :data="filteredData"
            border
            :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff', fontWeight: 'bold' }"
            :max-height="500"
            class="w-full"
          >
            <el-table-column
              label="序号"
              type="index"
              width="70"
              align="center"
            />
            <el-table-column
              label="分公司"
              prop="branch"
              width="180"
              :header-cell-style="{ backgroundColor: '#5B9BD5' }"
            />
            <el-table-column
              label="AAA"
              width="140"
              :header-cell-style="{ backgroundColor: '#4A8AC4' }"
            >
              <template #default="scope">
                <div class="flex flex-col items-center">
                  <span class="font-medium">{{ scope.row.aaa.count }}</span>
                  <span class="text-xs text-gray-500">{{ formatAmount(scope.row.aaa.amount) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="AA"
              width="140"
              :header-cell-style="{ backgroundColor: '#4A8AC4' }"
            >
              <template #default="scope">
                <div class="flex flex-col items-center">
                  <span class="font-medium">{{ scope.row.aa.count }}</span>
                  <span class="text-xs text-gray-500">{{ formatAmount(scope.row.aa.amount) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="A"
              width="140"
              :header-cell-style="{ backgroundColor: '#4A8AC4' }"
            >
              <template #default="scope">
                <div class="flex flex-col items-center">
                  <span class="font-medium">{{ scope.row.a.count }}</span>
                  <span class="text-xs text-gray-500">{{ formatAmount(scope.row.a.amount) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="小计"
              width="160"
              :header-cell-style="{ backgroundColor: '#3A7BC8' }"
            >
              <template #default="scope">
                <div class="flex flex-col items-center">
                  <span class="font-bold text-blue-600">{{ scope.row.subtotal.count }}</span>
                  <span class="text-xs text-gray-600 font-medium">{{ formatAmount(scope.row.subtotal.amount) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="占比"
              width="100"
              :header-cell-style="{ backgroundColor: '#3A7BC8' }"
            >
              <template #default="scope">
                <span class="text-sm text-gray-700">{{ scope.row.percentage }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>共 {{ filteredData.length - 1 }} 条记录</span>
          <span class="text-gray-500">单位：元</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  company: '',
  year: '',
  projectType: ''
})

const tableData = ref([
  { branch: '市政事业部', aaa: { count: 5, amount: 50000000 }, aa: { count: 8, amount: 32000000 }, a: { count: 12, amount: 18000000 }, subtotal: { count: 25, amount: 100000000 }, percentage: '17.4%' },
  { branch: '环境建设', aaa: { count: 3, amount: 24000000 }, aa: { count: 6, amount: 18000000 }, a: { count: 9, amount: 13500000 }, subtotal: { count: 18, amount: 55500000 }, percentage: '9.7%' },
  { branch: '区域事业部', aaa: { count: 4, amount: 32000000 }, aa: { count: 7, amount: 24500000 }, a: { count: 10, amount: 15000000 }, subtotal: { count: 21, amount: 71500000 }, percentage: '12.5%' },
  { branch: '城乡管道', aaa: { count: 2, amount: 16000000 }, aa: { count: 4, amount: 12000000 }, a: { count: 6, amount: 9000000 }, subtotal: { count: 12, amount: 37000000 }, percentage: '6.5%' },
  { branch: '水务管道', aaa: { count: 3, amount: 21000000 }, aa: { count: 5, amount: 15000000 }, a: { count: 8, amount: 12000000 }, subtotal: { count: 16, amount: 48000000 }, percentage: '8.4%' },
  { branch: '二次养护', aaa: { count: 1, amount: 6000000 }, aa: { count: 3, amount: 7500000 }, a: { count: 5, amount: 6000000 }, subtotal: { count: 9, amount: 19500000 }, percentage: '3.4%' },
  { branch: '运营养护', aaa: { count: 2, amount: 14000000 }, aa: { count: 4, amount: 10000000 }, a: { count: 6, amount: 7200000 }, subtotal: { count: 12, amount: 31200000 }, percentage: '5.4%' },
  { branch: '浦东供排水', aaa: { count: 4, amount: 28000000 }, aa: { count: 6, amount: 18000000 }, a: { count: 9, amount: 11700000 }, subtotal: { count: 19, amount: 57700000 }, percentage: '10.1%' },
  { branch: '生态环境事业部', aaa: { count: 5, amount: 35000000 }, aa: { count: 8, amount: 24000000 }, a: { count: 12, amount: 14400000 }, subtotal: { count: 25, amount: 73400000 }, percentage: '12.8%' },
  { branch: '管网运维事业部', aaa: { count: 3, amount: 18000000 }, aa: { count: 5, amount: 12500000 }, a: { count: 7, amount: 8400000 }, subtotal: { count: 15, amount: 38900000 }, percentage: '6.8%' },
  { branch: '设计咨询中心', aaa: { count: 2, amount: 10000000 }, aa: { count: 3, amount: 6000000 }, a: { count: 4, amount: 3200000 }, subtotal: { count: 9, amount: 19200000 }, percentage: '3.4%' },
  { branch: '水表厂', aaa: { count: 1, amount: 5000000 }, aa: { count: 2, amount: 3000000 }, a: { count: 3, amount: 1800000 }, subtotal: { count: 6, amount: 9800000 }, percentage: '1.7%' },
  { branch: '设备成套', aaa: { count: 2, amount: 12000000 }, aa: { count: 4, amount: 8000000 }, a: { count: 6, amount: 4800000 }, subtotal: { count: 12, amount: 24800000 }, percentage: '4.3%' },
  { branch: '合计', aaa: { count: 37, amount: 271000000 }, aa: { count: 63, amount: 178500000 }, a: { count: 94, amount: 124000000 }, subtotal: { count: 194, amount: 573500000 }, percentage: '100%' }
])

const filteredData = computed(() => {
  if (!filters.value.company && !filters.value.year && !filters.value.projectType) {
    return tableData.value
  }
  return tableData.value.filter(item => {
    if (item.branch === '合计') return true
    return true
  })
})

const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const resetFilters = () => {
  filters.value = {
    company: '',
    year: '',
    projectType: ''
  }
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>

<style scoped>
.el-table th {
  text-align: center !important;
}

.el-table td {
  padding: 8px 12px !important;
}
</style>