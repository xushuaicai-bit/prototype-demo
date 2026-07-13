<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">城市环境投标情况汇总</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：万元</span>
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
      <table class="w-full border-collapse" style="min-width: 1400px;">
        <thead>
          <tr>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">序号</th>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">基层单位</th>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">年份</th>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">年度指标（万元）</th>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">指标完成数（万元）</th>
            <th rowspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">指标完成率（%）</th>
            <th colspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">中标情况</th>
            <th colspan="6" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">在投情况</th>
            <th colspan="2" class="bg-blue-600 text-white px-4 py-3 text-center border border-blue-700">合计</th>
          </tr>
          <tr>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">合计（万元）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">项目数量（个）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">AAA投标量（万元）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">AAA项目数量（个）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">AA投标量（万元）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">AA项目数量（个）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">A投标量（万元）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">A项目数量（个）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">投标量（万元）</th>
            <th class="bg-blue-500 text-white px-4 py-2 text-center border border-blue-600">项目数量（个）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td class="px-4 py-2 text-center border border-gray-200">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.grassrootsUnit }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.year }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.target) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.completed) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.rate }}%</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.winningTotal) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.winningCount }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.aaaBidAmount) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.aaaBidCount }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.aaBidAmount) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.aaBidCount }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ formatNumber(row.aBidAmount) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200">{{ row.aBidCount }}</td>
            <td class="px-4 py-2 text-center border border-gray-200 font-medium">{{ formatNumber(row.totalBidAmount) }}</td>
            <td class="px-4 py-2 text-center border border-gray-200 font-medium">{{ row.totalBidCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { grassrootsUnit: '市政事业部', year: '2026', target: 50000, completed: 32000, rate: 64, winningTotal: 18000, winningCount: 8, aaaBidAmount: 15000, aaaBidCount: 5, aaBidAmount: 12000, aaBidCount: 6, aBidAmount: 8000, aBidCount: 4, totalBidAmount: 35000, totalBidCount: 15 },
  { grassrootsUnit: '环境建设', year: '2026', target: 60000, completed: 45000, rate: 75, winningTotal: 25000, winningCount: 10, aaaBidAmount: 18000, aaaBidCount: 6, aaBidAmount: 15000, aaBidCount: 7, aBidAmount: 10000, aBidCount: 5, totalBidAmount: 43000, totalBidCount: 18 },
  { grassrootsUnit: '区域事业部', year: '2026', target: 55000, completed: 38500, rate: 70, winningTotal: 22000, winningCount: 9, aaaBidAmount: 16000, aaaBidCount: 5, aaBidAmount: 14000, aaBidCount: 7, aBidAmount: 9000, aBidCount: 5, totalBidAmount: 39000, totalBidCount: 17 },
  { grassrootsUnit: '城水管管道', year: '2026', target: 70000, completed: 52500, rate: 75, winningTotal: 30000, winningCount: 12, aaaBidAmount: 20000, aaaBidCount: 7, aaBidAmount: 18000, aaBidCount: 8, aBidAmount: 12000, aBidCount: 6, totalBidAmount: 50000, totalBidCount: 21 },
  { grassrootsUnit: '水务管道', year: '2026', target: 65000, completed: 45500, rate: 70, winningTotal: 26000, winningCount: 11, aaaBidAmount: 17000, aaaBidCount: 6, aaBidAmount: 15000, aaBidCount: 7, aBidAmount: 11000, aBidCount: 5, totalBidAmount: 43000, totalBidCount: 18 },
  { grassrootsUnit: '运营养护', year: '2026', target: 80000, completed: 60000, rate: 75, winningTotal: 35000, winningCount: 14, aaaBidAmount: 22000, aaaBidCount: 8, aaBidAmount: 20000, aaBidCount: 9, aBidAmount: 13000, aBidCount: 6, totalBidAmount: 55000, totalBidCount: 23 },
  { grassrootsUnit: '浦东供排水', year: '2026', target: 75000, completed: 52500, rate: 70, winningTotal: 32000, winningCount: 13, aaaBidAmount: 19000, aaaBidCount: 7, aaBidAmount: 17000, aaBidCount: 8, aBidAmount: 12000, aBidCount: 6, totalBidAmount: 48000, totalBidCount: 21 },
  { grassrootsUnit: '生态环境事业部', year: '2026', target: 90000, completed: 67500, rate: 75, winningTotal: 38000, winningCount: 15, aaaBidAmount: 24000, aaaBidCount: 8, aaBidAmount: 22000, aaBidCount: 10, aBidAmount: 14000, aBidCount: 7, totalBidAmount: 60000, totalBidCount: 25 },
  { grassrootsUnit: '管网运维事业部', year: '2026', target: 85000, completed: 59500, rate: 70, winningTotal: 36000, winningCount: 14, aaaBidAmount: 21000, aaaBidCount: 7, aaBidAmount: 19000, aaBidCount: 9, aBidAmount: 13000, aBidCount: 6, totalBidAmount: 53000, totalBidCount: 22 },
  { grassrootsUnit: '设计咨询中心', year: '2026', target: 95000, completed: 71250, rate: 75, winningTotal: 42000, winningCount: 16, aaaBidAmount: 26000, aaaBidCount: 9, aaBidAmount: 24000, aaBidCount: 10, aBidAmount: 15000, aBidCount: 7, totalBidAmount: 65000, totalBidCount: 26 }
])

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>
