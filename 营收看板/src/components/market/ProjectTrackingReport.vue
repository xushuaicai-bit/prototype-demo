<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">项目跟踪数据表</h2>
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

    <div class="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-600">基层单位:</span>
        <el-select v-model="filters.grassrootsUnit" class="w-48" placeholder="请选择基层单位">
          <el-option label="全部" value="" />
          <el-option label="市政事业部" value="市政事业部" />
          <el-option label="环境建设" value="环境建设" />
          <el-option label="区域事业部" value="区域事业部" />
          <el-option label="城水管管道" value="城水管管道" />
          <el-option label="水务管道" value="水务管道" />
          <el-option label="二次养护" value="二次养护" />
          <el-option label="运营养护" value="运营养护" />
          <el-option label="浦东供排水" value="浦东供排水" />
          <el-option label="生态环境事业部" value="生态环境事业部" />
          <el-option label="管网运维事业部" value="管网运维事业部" />
          <el-option label="设计咨询中心" value="设计咨询中心" />
          <el-option label="水表厂" value="水表厂" />
          <el-option label="设备成套" value="设备成套" />
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
        :row-class-name="rowClassName"
        :max-height="600"
        class="w-full"
      >
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        />
        <el-table-column
          label="基层单位"
          prop="branch"
          width="180"
          :header-cell-style="{ backgroundColor: '#5B9BD5' }"
        />
        <el-table-column
          label="AAA"
          :header-cell-style="{ backgroundColor: '#4A8AC4' }"
        >
          <el-table-column label="项目数量" width="100" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.aaa.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目金额" width="120" align="center">
            <template #default="scope">
              <span class="text-xs text-gray-500">{{ formatNumber(scope.row.aaa.amount) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="AA"
          :header-cell-style="{ backgroundColor: '#4A8AC4' }"
        >
          <el-table-column label="项目数量" width="100" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.aa.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目金额" width="120" align="center">
            <template #default="scope">
              <span class="text-xs text-gray-500">{{ formatNumber(scope.row.aa.amount) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="A"
          :header-cell-style="{ backgroundColor: '#4A8AC4' }"
        >
          <el-table-column label="项目数量" width="100" align="center">
            <template #default="scope">
              <span class="font-medium">{{ scope.row.a.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目金额" width="120" align="center">
            <template #default="scope">
              <span class="text-xs text-gray-500">{{ formatNumber(scope.row.a.amount) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="小计"
          :header-cell-style="{ backgroundColor: '#3A7BC8' }"
        >
          <el-table-column label="项目数量" width="100" align="center">
            <template #default="scope">
              <span class="font-bold text-blue-600">{{ scope.row.subtotal.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目金额" width="120" align="center">
            <template #default="scope">
              <span class="text-xs text-blue-600 font-medium">{{ formatNumber(scope.row.subtotal.amount) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
      <span>共 {{ filteredData.length - 1 }} 条记录</span>
      <span class="text-gray-500">单位：元</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  grassrootsUnit: ''
})

const tableData = ref([
  { branch: '市政事业部', aaa: { count: 5, amount: 50000000 }, aa: { count: 8, amount: 32000000 }, a: { count: 12, amount: 18000000 }, subtotal: { count: 25, amount: 100000000 } },
  { branch: '环境建设', aaa: { count: 3, amount: 24000000 }, aa: { count: 6, amount: 18000000 }, a: { count: 9, amount: 13500000 }, subtotal: { count: 18, amount: 55500000 } },
  { branch: '区域事业部', aaa: { count: 4, amount: 32000000 }, aa: { count: 7, amount: 24500000 }, a: { count: 10, amount: 15000000 }, subtotal: { count: 21, amount: 71500000 } },
  { branch: '城水管管道', aaa: { count: 2, amount: 16000000 }, aa: { count: 4, amount: 12000000 }, a: { count: 6, amount: 9000000 }, subtotal: { count: 12, amount: 37000000 } },
  { branch: '水务管道', aaa: { count: 3, amount: 21000000 }, aa: { count: 5, amount: 15000000 }, a: { count: 8, amount: 12000000 }, subtotal: { count: 16, amount: 48000000 } },
  { branch: '二次养护', aaa: { count: 1, amount: 6000000 }, aa: { count: 3, amount: 7500000 }, a: { count: 5, amount: 6000000 }, subtotal: { count: 9, amount: 19500000 } },
  { branch: '运营养护', aaa: { count: 2, amount: 14000000 }, aa: { count: 4, amount: 10000000 }, a: { count: 6, amount: 7200000 }, subtotal: { count: 12, amount: 31200000 } },
  { branch: '浦东供排水', aaa: { count: 4, amount: 28000000 }, aa: { count: 6, amount: 18000000 }, a: { count: 9, amount: 11700000 }, subtotal: { count: 19, amount: 57700000 } },
  { branch: '生态环境事业部', aaa: { count: 5, amount: 35000000 }, aa: { count: 8, amount: 24000000 }, a: { count: 12, amount: 14400000 }, subtotal: { count: 25, amount: 73400000 } },
  { branch: '管网运维事业部', aaa: { count: 3, amount: 18000000 }, aa: { count: 5, amount: 12500000 }, a: { count: 7, amount: 8400000 }, subtotal: { count: 15, amount: 38900000 } },
  { branch: '设计咨询中心', aaa: { count: 2, amount: 10000000 }, aa: { count: 3, amount: 6000000 }, a: { count: 4, amount: 3200000 }, subtotal: { count: 9, amount: 19200000 } },
  { branch: '水表厂', aaa: { count: 1, amount: 5000000 }, aa: { count: 2, amount: 3000000 }, a: { count: 3, amount: 1800000 }, subtotal: { count: 6, amount: 9800000 } },
  { branch: '设备成套', aaa: { count: 2, amount: 12000000 }, aa: { count: 4, amount: 8000000 }, a: { count: 6, amount: 4800000 }, subtotal: { count: 12, amount: 24800000 } },
  { branch: '合计', aaa: { count: 37, amount: 271000000 }, aa: { count: 63, amount: 178500000 }, a: { count: 94, amount: 124000000 }, subtotal: { count: 194, amount: 573500000 } }
])

const filteredData = computed(() => {
  if (!filters.value.grassrootsUnit) {
    return tableData.value
  }
  return tableData.value.filter(item => {
    if (item.branch === '合计') return true
    return item.branch === filters.value.grassrootsUnit
  })
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const resetFilters = () => {
  filters.value = {
    grassrootsUnit: ''
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
