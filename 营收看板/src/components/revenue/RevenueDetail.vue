<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">营收明细表</h2>
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

    <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select v-model="filters.unit" placeholder="请选择" class="w-40">
          <el-option label="全部" value="" />
          <el-option label="管网事业部" value="管网事业部" />
          <el-option label="生态事业部" value="生态事业部" />
          <el-option label="区域事业部" value="区域事业部" />
          <el-option label="市政事业部" value="市政事业部" />
          <el-option label="环境建设" value="环境建设" />
          <el-option label="管道工程" value="管道工程" />
          <el-option label="管道分公司" value="管道分公司" />
          <el-option label="运营养护" value="运营养护" />
          <el-option label="二次养护" value="二次养护" />
        </el-select>
      </div>

      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">项目状态：</label>
        <el-select v-model="filters.status" placeholder="请选择" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="在建" value="在建" />
          <el-option label="完工" value="完工" />
          <el-option label="待结算" value="待结算" />
          <el-option label="已结算" value="已结算" />
        </el-select>
      </div>

      <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">营收统计口径：</label>
          <el-select v-model="filters.revenueCaliber" placeholder="请选择" class="w-40">
            <el-option label="全部" value="" />
            <el-option label="新增立项" value="新增立项" />
            <el-option label="结转在建项目" value="结转在建项目" />
            <el-option label="完工待结算项目" value="完工待结算项目" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">是否协管项目：</label>
          <el-select v-model="filters.isCoManaged" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">项目名称：</label>
          <el-input v-model="filters.projectName" placeholder="请输入" class="w-48" />
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">项目编号：</label>
          <el-input v-model="filters.projectCode" placeholder="请输入" class="w-40" />
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">下调百分比：</label>
          <el-input-number v-model="filters.planAdjustmentRateMax" :min="0" :max="100" :precision="1" controls-position="right" class="w-32" />
        </div>

        <div class="flex items-center">
          <label class="text-sm text-gray-600 mr-2">预警等级：</label>
          <el-select v-model="filters.warningLevel" placeholder="请选择" class="w-32">
            <el-option label="全部" value="" />
            <el-option label="黄色预警" value="yellow" />
            <el-option label="橙色预警" value="orange" />
            <el-option label="正常" value="normal" />
          </el-select>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <button
            class="flex items-center px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            @click="handleSearch"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </button>
          <button
            class="flex items-center px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
            @click="handleReset"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置
          </button>
        </div>
    </div>

    <div class="overflow-x-auto" style="max-width: 100%;">
      <el-table
        :data="paginatedData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        :row-class-name="rowClassName"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          label="序号"
          type="index"
          fixed="left"
          width="70"
          align="center"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />

        <el-table-column
          label="项目编号"
          prop="projectCode"
          fixed="left"
          width="120"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />

        <el-table-column
          label="项目名称"
          prop="projectName"
          fixed="left"
          width="200"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        >
          <template #default="scope">
            <el-tooltip :content="scope.row.projectName" placement="top">
              <span class="truncate">{{ scope.row.projectName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          label="基层单位"
          prop="unit"
          width="140"
        >
          <template #default="scope">
            <el-tag size="small">{{ scope.row.unit }}</el-tag>
          </template>
        </el-table-column>



        <el-table-column
          label="项目状态"
          prop="status"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="营收统计口径"
          prop="revenueCaliber"
          width="140"
        >
          <template #default="scope">
            <el-tag type="primary" size="small">{{ scope.row.revenueCaliber }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="是否协管项目"
          prop="isCoManaged"
          width="100"
          align="center"
          :header-cell-style="{ backgroundColor: '#95DE64', color: '#fff' }"
          :cell-style="{ backgroundColor: '#F6FFED' }"
        >
          <template #default="scope">
            {{ scope.row.isCoManaged }}
          </template>
        </el-table-column>



        <el-table-column
          label="合同金额(不含税)"
          prop="contractAmount"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.contractAmount) }}
          </template>
        </el-table-column>

        <el-table-column
          label="结转至当年及以后营收"
          prop="carryForwardRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.carryForwardRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="当年计划营收"
          prop="annualPlanRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualPlanRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="当年预计完成营收"
          prop="annualEstimatedRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualEstimatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="计划较上期调整(%)"
          prop="planAdjustmentRate"
          width="140"
          align="right"
        >
          <template #default="scope">
            <span :class="{ 'text-red-600': scope.row.planAdjustmentRate < 0, 'text-green-600': scope.row.planAdjustmentRate > 0 }">
              {{ scope.row.planAdjustmentRate > 0 ? '+' : '' }}{{ scope.row.planAdjustmentRate.toFixed(1) }}%
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="当月完成营收"
          prop="monthActualRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthActualRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="年度累计营收"
          prop="annualAccumulatedRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="开工累计营收"
          prop="startAccumulatedRevenue"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.startAccumulatedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="当月上报股份营收"
          prop="monthReportedRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthReportedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="年度上报股份营收"
          prop="annualReportedRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualReportedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="累计上报股份营收"
          prop="totalReportedRevenue"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.totalReportedRevenue) }}
          </template>
        </el-table-column>

        <el-table-column
          label="截止当月剩余合同存量"
          prop="remainingContractAmount"
          width="160"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.remainingContractAmount) }}
          </template>
        </el-table-column>

        <el-table-column
          label="形象进度"
          prop="progress"
          width="120"
          align="center"
        >
          <template #default="scope">
            <div class="flex items-center justify-center">
              <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div 
                  class="h-full rounded-full" 
                  :class="scope.row.progress >= 80 ? 'bg-green-500' : scope.row.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
                  :style="{ width: scope.row.progress + '%' }"
                ></div>
              </div>
              <span class="text-sm">{{ scope.row.progress }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="预警等级"
          prop="warningLevel"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.warningLevel === '红色预警'" type="danger" size="small">红色预警</el-tag>
            <el-tag v-else-if="scope.row.warningLevel === '橙色预警'" type="warning" size="small">橙色预警</el-tag>
            <el-tag v-else-if="scope.row.warningLevel === '黄色预警'" size="small" class="bg-yellow-100 text-yellow-700 border-yellow-300">黄色预警</el-tag>
            <span v-else class="text-gray-400 text-sm">正常</span>
          </template>
        </el-table-column>
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
import { ref, computed, defineProps, onMounted, watch } from 'vue'
import { utils, writeFile } from 'xlsx'

const props = defineProps({
  initialFilter: {
    type: Object,
    default: () => ({})
  }
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

const months = [
  { key: 'month1', label: '1月上报营收' },
  { key: 'month2', label: '2月上报营收' },
  { key: 'month3', label: '3月上报营收' },
  { key: 'month4', label: '4月上报营收' },
  { key: 'month5', label: '5月上报营收' },
  { key: 'month6', label: '6月上报营收' },
  { key: 'month7', label: '7月上报营收' },
  { key: 'month8', label: '8月上报营收' },
  { key: 'month9', label: '9月上报营收' },
  { key: 'month10', label: '10月上报营收' },
  { key: 'month11', label: '11月上报营收' },
  { key: 'month12', label: '12月上报营收' }
]

const filters = ref({
  unit: '',
  status: '',
  revenueCaliber: '',
  isCoManaged: '',
  projectName: '',
  projectCode: '',
  planAdjustmentRateMax: null,
  warningLevel: ''
})

const editingCell = ref('')
const editValue = ref('')

const rawData = [
  {
    id: 1,
    projectCode: 'XM-2024-001',
    projectName: '浦东新区污水处理厂扩建',
    unit: '生态事业部',
    region: '浦东',
    owner: '上海市水务局',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '否',
    businessType: '水环境治理',
    contractAmount: 125000000,
    carryForwardRevenue: 50000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 32000000,
    totalReportedRevenue: 80000000,
    remainingContractAmount: 40000000,
    annualPlanRevenue: 68800000,
    annualEstimatedRevenue: 43800000,
    planAdjustmentRate: 3.2,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 56000000,
    progress: 68,
    startTime: '2023-06-15',
    month1: 2500000,
    month2: 2800000,
    month3: 3200000,
    month4: 3500000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 2,
    projectCode: 'XM-2024-002',
    projectName: '黄浦区老旧管网改造项目',
    unit: '管网事业部',
    region: '黄浦',
    owner: '上海市城投集团',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '管网改造',
    contractAmount: 86000000,
    carryForwardRevenue: 35000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    totalReportedRevenue: 61000000,
    remainingContractAmount: 23000000,
    annualPlanRevenue: 47300000,
    annualEstimatedRevenue: 34400000,
    planAdjustmentRate: -1.5,
    monthActualRevenue: 3500000,
    startAccumulatedRevenue: 46800000,
    progress: 62,
    startTime: '2023-08-20',
    month1: 2000000,
    month2: 2200000,
    month3: 2500000,
    month4: 2800000,
    month5: 3000000,
    month6: 3500000,
    month7: 3800000,
    month8: 4200000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 3,
    projectCode: 'XM-2024-003',
    projectName: '徐汇区雨水泵站新建工程',
    unit: '市政事业部',
    region: '徐汇',
    owner: '徐汇区市政工程管理中心',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 45000000,
    carryForwardRevenue: 15000000,
    annualAccumulatedRevenue: 45000000,
    quarterlyAccumulatedRevenue: 15000000,
    annualReportedRevenue: 42000000,
    totalReportedRevenue: 57000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 45000000,
    annualEstimatedRevenue: 45000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 5200000,
    startAccumulatedRevenue: 72000000,
    progress: 100,
    startTime: '2023-03-10',
    month1: 3500000,
    month2: 3800000,
    month3: 4200000,
    month4: 4500000,
    month5: 4800000,
    month6: 5200000,
    month7: 5500000,
    month8: 5500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 4,
    projectCode: 'XM-2024-004',
    projectName: '长宁区二次供水设施改造项目',
    unit: '二次养护',
    region: '长宁',
    owner: '长宁区水务管理局',
    status: '待结算',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '二次供水',
    contractAmount: 62000000,
    carryForwardRevenue: 20000000,
    annualAccumulatedRevenue: 58000000,
    quarterlyAccumulatedRevenue: 19500000,
    annualReportedRevenue: 55000000,
    totalReportedRevenue: 75000000,
    remainingContractAmount: 4000000,
    annualPlanRevenue: 59000000,
    annualEstimatedRevenue: 59500000,
    planAdjustmentRate: 0,
    monthActualRevenue: 5800000,
    startAccumulatedRevenue: 105800000,
    progress: 94,
    startTime: '2022-11-15',
    month1: 4200000,
    month2: 4500000,
    month3: 4800000,
    month4: 5200000,
    month5: 5500000,
    month6: 5800000,
    month7: 6200000,
    month8: 6500000,
    month9: 5000000,
    month10: 4500000,
    month11: 0,
    month12: 0
  },
  {
    id: 5,
    projectCode: 'XM-2024-005',
    projectName: '闵行区供水管道新建工程',
    unit: '管道工程',
    region: '闵行',
    owner: '闵行区水务局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '管道建设',
    contractAmount: 98000000,
    carryForwardRevenue: 40000000,
    annualAccumulatedRevenue: 32000000,
    quarterlyAccumulatedRevenue: 11000000,
    annualReportedRevenue: 30000000,
    totalReportedRevenue: 30000000,
    remainingContractAmount: 66000000,
    annualPlanRevenue: 53900000,
    annualEstimatedRevenue: 40600000,
    planAdjustmentRate: 5.8,
    monthActualRevenue: 3800000,
    startAccumulatedRevenue: 35200000,
    progress: 33,
    startTime: '2024-01-05',
    month1: 2200000,
    month2: 2500000,
    month3: 2800000,
    month4: 3200000,
    month5: 3500000,
    month6: 3800000,
    month7: 4200000,
    month8: 4500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 6,
    projectCode: 'XM-2024-006',
    projectName: '浦东新区供水管网维修工程',
    unit: '区域事业部',
    region: '浦东',
    owner: '浦东水务集团',
    status: '已结算',
    revenueCaliber: '结转在建项目',
    isCoManaged: '否',
    businessType: '管网维修',
    contractAmount: 35000000,
    carryForwardRevenue: 10000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 33000000,
    totalReportedRevenue: 43000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 35000000,
    annualEstimatedRevenue: 35000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 57800000,
    progress: 100,
    startTime: '2023-04-25',
    month1: 3000000,
    month2: 3200000,
    month3: 3500000,
    month4: 3800000,
    month5: 4000000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 7,
    projectCode: 'XM-2024-007',
    projectName: '松江区水环境治理项目',
    unit: '环境建设',
    region: '松江',
    owner: '松江区生态环境局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '是',
    businessType: '水环境治理',
    contractAmount: 156000000,
    carryForwardRevenue: 60000000,
    annualAccumulatedRevenue: 48000000,
    quarterlyAccumulatedRevenue: 16500000,
    annualReportedRevenue: 45000000,
    totalReportedRevenue: 45000000,
    remainingContractAmount: 108000000,
    annualPlanRevenue: 85700000,
    annualEstimatedRevenue: 59100000,
    planAdjustmentRate: 6.5,
    monthActualRevenue: 5200000,
    startAccumulatedRevenue: 50400000,
    progress: 31,
    startTime: '2024-02-10',
    month1: 3500000,
    month2: 3800000,
    month3: 4200000,
    month4: 4500000,
    month5: 4800000,
    month6: 5200000,
    month7: 5500000,
    month8: 5800000,
    month9: 5000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 8,
    projectCode: 'XM-2024-008',
    projectName: '嘉定区污水提升泵站工程',
    unit: '运营养护',
    region: '嘉定',
    owner: '嘉定区水务局',
    status: '在建',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 78000000,
    carryForwardRevenue: 30000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 33000000,
    totalReportedRevenue: 63000000,
    remainingContractAmount: 43000000,
    annualPlanRevenue: 39000000,
    annualEstimatedRevenue: 41300000,
    planAdjustmentRate: 2.1,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 49700000,
    progress: 45,
    startTime: '2023-07-18',
    month1: 2800000,
    month2: 3000000,
    month3: 3300000,
    month4: 3600000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 9,
    projectCode: 'XM-2024-009',
    projectName: '青浦区供水管网改造工程',
    unit: '管道分公司',
    region: '青浦',
    owner: '青浦区水务局',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '否',
    businessType: '管道改造',
    contractAmount: 55000000,
    carryForwardRevenue: 25000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    totalReportedRevenue: 51000000,
    remainingContractAmount: 27000000,
    annualPlanRevenue: 30200000,
    annualEstimatedRevenue: 35300000,
    planAdjustmentRate: -2.3,
    monthActualRevenue: 3500000,
    startAccumulatedRevenue: 44800000,
    progress: 51,
    startTime: '2023-09-01',
    month1: 2000000,
    month2: 2200000,
    month3: 2500000,
    month4: 2800000,
    month5: 3000000,
    month6: 3500000,
    month7: 3800000,
    month8: 4200000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 10,
    projectCode: 'XM-2024-010',
    projectName: '奉贤区污水处理设施扩建项目',
    unit: '生态事业部',
    region: '奉贤',
    owner: '奉贤区生态环境局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '是',
    businessType: '污水处理',
    contractAmount: 138000000,
    carryForwardRevenue: 55000000,
    annualAccumulatedRevenue: 42000000,
    quarterlyAccumulatedRevenue: 14500000,
    annualReportedRevenue: 40000000,
    totalReportedRevenue: 40000000,
    remainingContractAmount: 96000000,
    annualPlanRevenue: 75900000,
    annualEstimatedRevenue: 51200000,
    planAdjustmentRate: 4.5,
    monthActualRevenue: 4800000,
    startAccumulatedRevenue: 46600000,
    progress: 31,
    startTime: '2024-01-15',
    month1: 3200000,
    month2: 3500000,
    month3: 3800000,
    month4: 4200000,
    month5: 4500000,
    month6: 4800000,
    month7: 5200000,
    month8: 5500000,
    month9: 5000000,
    month10: 4500000,
    month11: 4000000,
    month12: 0
  },
  {
    id: 11,
    projectCode: 'XM-2024-011',
    projectName: '金山区雨水管网新建工程',
    unit: '管网事业部',
    region: '金山',
    owner: '金山区市政工程管理中心',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '管网建设',
    contractAmount: 68000000,
    carryForwardRevenue: 28000000,
    annualAccumulatedRevenue: 68000000,
    quarterlyAccumulatedRevenue: 23000000,
    annualReportedRevenue: 65000000,
    totalReportedRevenue: 93000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 68000000,
    annualEstimatedRevenue: 68000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 6200000,
    startAccumulatedRevenue: 109200000,
    progress: 100,
    startTime: '2023-02-20',
    month1: 4500000,
    month2: 4800000,
    month3: 5200000,
    month4: 5500000,
    month5: 5800000,
    month6: 6200000,
    month7: 6500000,
    month8: 6800000,
    month9: 7000000,
    month10: 7200000,
    month11: 7500000,
    month12: 7000000
  },
  {
    id: 12,
    projectCode: 'XM-2024-012',
    projectName: '虹口区二次供水改造项目',
    unit: '二次养护',
    region: '虹口',
    owner: '虹口区水务管理局',
    status: '待结算',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '二次供水',
    contractAmount: 42000000,
    carryForwardRevenue: 18000000,
    annualAccumulatedRevenue: 38000000,
    quarterlyAccumulatedRevenue: 13000000,
    annualReportedRevenue: 36000000,
    totalReportedRevenue: 54000000,
    remainingContractAmount: 4000000,
    annualPlanRevenue: 38800000,
    annualEstimatedRevenue: 39100000,
    planAdjustmentRate: 0,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 64600000,
    progress: 91,
    startTime: '2023-05-10',
    month1: 2800000,
    month2: 3000000,
    month3: 3300000,
    month4: 3600000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 5000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 13,
    projectCode: 'XM-2024-013',
    projectName: '杨浦区河道整治工程',
    unit: '环境建设',
    region: '杨浦',
    owner: '杨浦区绿化和市容管理局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '水环境治理',
    contractAmount: 89000000,
    carryForwardRevenue: 35000000,
    annualAccumulatedRevenue: 32000000,
    quarterlyAccumulatedRevenue: 11000000,
    annualReportedRevenue: 30000000,
    totalReportedRevenue: 30000000,
    remainingContractAmount: 57000000,
    annualPlanRevenue: 48900000,
    annualEstimatedRevenue: 40300000,
    planAdjustmentRate: 7.2,
    monthActualRevenue: 3800000,
    startAccumulatedRevenue: 33600000,
    progress: 36,
    startTime: '2024-03-01',
    month1: 2200000,
    month2: 2500000,
    month3: 2800000,
    month4: 3200000,
    month5: 3500000,
    month6: 3800000,
    month7: 4200000,
    month8: 4500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 14,
    projectCode: 'XM-2024-014',
    projectName: '宝山区泵站更新改造项目',
    unit: '运营养护',
    region: '宝山',
    owner: '宝山区水务局',
    status: '已结算',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 52000000,
    carryForwardRevenue: 20000000,
    annualAccumulatedRevenue: 52000000,
    quarterlyAccumulatedRevenue: 18000000,
    annualReportedRevenue: 50000000,
    totalReportedRevenue: 70000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 52000000,
    annualEstimatedRevenue: 52000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 5200000,
    startAccumulatedRevenue: 88400000,
    progress: 100,
    startTime: '2023-01-10',
    month1: 3500000,
    month2: 3800000,
    month3: 4200000,
    month4: 4500000,
    month5: 4800000,
    month6: 5200000,
    month7: 5500000,
    month8: 5800000,
    month9: 6000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 15,
    projectCode: 'XM-2024-015',
    projectName: '静安区燃气管网改造工程',
    unit: '管道分公司',
    region: '静安',
    owner: '静安区市政工程管理中心',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '管道改造',
    contractAmount: 72000000,
    carryForwardRevenue: 30000000,
    annualAccumulatedRevenue: 38000000,
    quarterlyAccumulatedRevenue: 13000000,
    annualReportedRevenue: 36000000,
    totalReportedRevenue: 66000000,
    remainingContractAmount: 34000000,
    annualPlanRevenue: 39600000,
    annualEstimatedRevenue: 44400000,
    planAdjustmentRate: -3.5,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 50200000,
    progress: 53,
    startTime: '2023-10-01',
    month1: 2800000,
    month2: 3000000,
    month3: 3300000,
    month4: 3600000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 5000000,
    month10: 4500000,
    month11: 4000000,
    month12: 0
  },
  {
    id: 16,
    projectCode: 'XM-2024-016',
    projectName: '普陀区供水设施新建工程',
    unit: '管道工程',
    region: '普陀',
    owner: '普陀区水务局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '管道建设',
    contractAmount: 95000000,
    carryForwardRevenue: 40000000,
    annualAccumulatedRevenue: 35000000,
    quarterlyAccumulatedRevenue: 12000000,
    annualReportedRevenue: 33000000,
    totalReportedRevenue: 33000000,
    remainingContractAmount: 62000000,
    annualPlanRevenue: 52200000,
    annualEstimatedRevenue: 44800000,
    planAdjustmentRate: 5.0,
    monthActualRevenue: 4200000,
    startAccumulatedRevenue: 38500000,
    progress: 37,
    startTime: '2024-02-15',
    month1: 2500000,
    month2: 2800000,
    month3: 3200000,
    month4: 3500000,
    month5: 3800000,
    month6: 4200000,
    month7: 4500000,
    month8: 4800000,
    month9: 5000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 17,
    projectCode: 'XM-2024-017',
    projectName: '崇明区生态修复工程',
    unit: '生态事业部',
    region: '崇明',
    owner: '崇明区生态环境局',
    status: '在建',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '生态修复',
    contractAmount: 110000000,
    carryForwardRevenue: 45000000,
    annualAccumulatedRevenue: 40000000,
    quarterlyAccumulatedRevenue: 14000000,
    annualReportedRevenue: 38000000,
    totalReportedRevenue: 38000000,
    remainingContractAmount: 70000000,
    annualPlanRevenue: 44000000,
    annualEstimatedRevenue: 47200000,
    planAdjustmentRate: 1.8,
    monthActualRevenue: 4300000,
    startAccumulatedRevenue: 43200000,
    progress: 36,
    startTime: '2023-11-01',
    month1: 3000000,
    month2: 3200000,
    month3: 3500000,
    month4: 3800000,
    month5: 4000000,
    month6: 4300000,
    month7: 4600000,
    month8: 4800000,
    month9: 5000000,
    month10: 1800000,
    month11: 0,
    month12: 0
  },
  {
    id: 18,
    projectCode: 'XM-2024-018',
    projectName: '浦东新区河道清淤工程',
    unit: '区域事业部',
    region: '浦东',
    owner: '浦东新区水务局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '河道治理',
    contractAmount: 55000000,
    carryForwardRevenue: 25000000,
    annualAccumulatedRevenue: 22000000,
    quarterlyAccumulatedRevenue: 7500000,
    annualReportedRevenue: 20000000,
    totalReportedRevenue: 20000000,
    remainingContractAmount: 33000000,
    annualPlanRevenue: 30200000,
    annualEstimatedRevenue: 27900000,
    planAdjustmentRate: 4.0,
    monthActualRevenue: 3000000,
    startAccumulatedRevenue: 24200000,
    progress: 40,
    startTime: '2024-04-01',
    month1: 1800000,
    month2: 2000000,
    month3: 2200000,
    month4: 2500000,
    month5: 2800000,
    month6: 3000000,
    month7: 3200000,
    month8: 2500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 19,
    projectCode: 'XM-2024-019',
    projectName: '徐汇区排水管网改造',
    unit: '市政事业部',
    region: '徐汇',
    owner: '徐汇区市政管理局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '是',
    businessType: '管网改造',
    contractAmount: 78000000,
    carryForwardRevenue: 32000000,
    annualAccumulatedRevenue: 30000000,
    quarterlyAccumulatedRevenue: 10500000,
    annualReportedRevenue: 28000000,
    totalReportedRevenue: 28000000,
    remainingContractAmount: 48000000,
    annualPlanRevenue: 42900000,
    annualEstimatedRevenue: 37500000,
    planAdjustmentRate: 6.3,
    monthActualRevenue: 3900000,
    startAccumulatedRevenue: 33000000,
    progress: 38,
    startTime: '2024-03-15',
    month1: 2400000,
    month2: 2700000,
    month3: 3000000,
    month4: 3300000,
    month5: 3600000,
    month6: 3900000,
    month7: 4200000,
    month8: 4900000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 20,
    projectCode: 'XM-2024-020',
    projectName: '浦东新区绿化工程',
    unit: '区域事业部',
    region: '浦东',
    owner: '浦东新区绿化局',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '绿化工程',
    contractAmount: 28000000,
    carryForwardRevenue: 12000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    totalReportedRevenue: 38000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 28000000,
    annualEstimatedRevenue: 28000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 3300000,
    startAccumulatedRevenue: 46200000,
    progress: 100,
    startTime: '2023-05-20',
    month1: 2000000,
    month2: 2200000,
    month3: 2500000,
    month4: 2800000,
    month5: 3000000,
    month6: 3300000,
    month7: 3500000,
    month8: 3800000,
    month9: 2900000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 21,
    projectCode: 'XM-2024-021',
    projectName: '宝山区自来水厂扩建',
    unit: '市政事业部',
    region: '宝山',
    owner: '宝山区水务局',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '是',
    businessType: '水厂建设',
    contractAmount: 180000000,
    carryForwardRevenue: 80000000,
    annualAccumulatedRevenue: 150000000,
    quarterlyAccumulatedRevenue: 52000000,
    annualReportedRevenue: 145000000,
    totalReportedRevenue: 135000000,
    remainingContractAmount: 30000000,
    annualPlanRevenue: 152000000,
    annualEstimatedRevenue: 152000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 16000000,
    startAccumulatedRevenue: 285000000,
    progress: 83,
    startTime: '2022-09-01',
    month1: 10000000,
    month2: 12000000,
    month3: 13000000,
    month4: 14000000,
    month5: 15000000,
    month6: 16000000,
    month7: 18000000,
    month8: 20000000,
    month9: 15000000,
    month10: 12000000,
    month11: 0,
    month12: 0
  },
  {
    id: 22,
    projectCode: 'XM-2024-022',
    projectName: '嘉定区智慧水务项目',
    unit: '环境建设',
    region: '嘉定',
    owner: '嘉定区信息中心',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '否',
    businessType: '信息化',
    contractAmount: 38000000,
    carryForwardRevenue: 20000000,
    annualAccumulatedRevenue: 20000000,
    quarterlyAccumulatedRevenue: 6800000,
    annualReportedRevenue: 18000000,
    totalReportedRevenue: 18000000,
    remainingContractAmount: 18000000,
    annualPlanRevenue: 20900000,
    annualEstimatedRevenue: 24600000,
    planAdjustmentRate: -1.8,
    monthActualRevenue: 2600000,
    startAccumulatedRevenue: 28400000,
    progress: 53,
    startTime: '2023-08-15',
    month1: 1600000,
    month2: 1800000,
    month3: 2000000,
    month4: 2200000,
    month5: 2400000,
    month6: 2600000,
    month7: 2800000,
    month8: 2600000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 23,
    projectCode: 'XM-2024-023',
    projectName: '静安区道路管网改造',
    unit: '管网事业部',
    region: '静安',
    owner: '静安区建交委',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '管网改造',
    contractAmount: 85000000,
    carryForwardRevenue: 35000000,
    annualAccumulatedRevenue: 32000000,
    quarterlyAccumulatedRevenue: 10800000,
    annualReportedRevenue: 30000000,
    totalReportedRevenue: 30000000,
    remainingContractAmount: 53000000,
    annualPlanRevenue: 46700000,
    annualEstimatedRevenue: 40300000,
    planAdjustmentRate: 5.5,
    monthActualRevenue: 4100000,
    startAccumulatedRevenue: 35200000,
    progress: 38,
    startTime: '2024-01-10',
    month1: 2600000,
    month2: 2900000,
    month3: 3200000,
    month4: 3500000,
    month5: 3800000,
    month6: 4100000,
    month7: 4400000,
    month8: 5500000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 24,
    projectCode: 'XM-2024-024',
    projectName: '松江区泵站维护项目',
    unit: '运营养护',
    region: '松江',
    owner: '松江区水务局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '是',
    businessType: '泵站维护',
    contractAmount: 22000000,
    carryForwardRevenue: 10000000,
    annualAccumulatedRevenue: 18000000,
    quarterlyAccumulatedRevenue: 6000000,
    annualReportedRevenue: 17000000,
    totalReportedRevenue: 18000000,
    remainingContractAmount: 4000000,
    annualPlanRevenue: 12100000,
    annualEstimatedRevenue: 21600000,
    planAdjustmentRate: 3.0,
    monthActualRevenue: 2000000,
    startAccumulatedRevenue: 19800000,
    progress: 82,
    startTime: '2023-10-01',
    month1: 1500000,
    month2: 1600000,
    month3: 1700000,
    month4: 1800000,
    month5: 1900000,
    month6: 2000000,
    month7: 2100000,
    month8: 2400000,
    month9: 2000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 25,
    projectCode: 'XM-2024-025',
    projectName: '浦东新区污水管网维护',
    unit: '运营养护',
    region: '浦东',
    owner: '浦东排水公司',
    status: '完工',
    revenueCaliber: '结转在建项目',
    isCoManaged: '否',
    businessType: '管网维护',
    contractAmount: 45000000,
    carryForwardRevenue: 25000000,
    annualAccumulatedRevenue: 38000000,
    quarterlyAccumulatedRevenue: 13000000,
    annualReportedRevenue: 36000000,
    totalReportedRevenue: 36000000,
    remainingContractAmount: 7000000,
    annualPlanRevenue: 38000000,
    annualEstimatedRevenue: 38000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 4300000,
    startAccumulatedRevenue: 60800000,
    progress: 84,
    startTime: '2023-06-15',
    month1: 3000000,
    month2: 3200000,
    month3: 3500000,
    month4: 3800000,
    month5: 4000000,
    month6: 4300000,
    month7: 4600000,
    month8: 4800000,
    month9: 4800000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 26,
    projectCode: 'XM-2024-026',
    projectName: '闵行区二次供水改造',
    unit: '二次养护',
    region: '闵行',
    owner: '闵行区住房保障局',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '是',
    businessType: '二次供水',
    contractAmount: 52000000,
    carryForwardRevenue: 22000000,
    annualAccumulatedRevenue: 48000000,
    quarterlyAccumulatedRevenue: 17000000,
    annualReportedRevenue: 46000000,
    totalReportedRevenue: 49200000,
    remainingContractAmount: 2000000,
    annualPlanRevenue: 48500000,
    annualEstimatedRevenue: 48500000,
    planAdjustmentRate: 0,
    monthActualRevenue: 5200000,
    startAccumulatedRevenue: 77300000,
    progress: 92,
    startTime: '2023-07-01',
    month1: 3600000,
    month2: 4000000,
    month3: 4300000,
    month4: 4600000,
    month5: 4900000,
    month6: 5200000,
    month7: 5500000,
    month8: 5800000,
    month9: 6100000,
    month10: 2000000,
    month11: 0,
    month12: 0
  },
  {
    id: 27,
    projectCode: 'XM-2024-027',
    projectName: '嘉定区雨水管网新建',
    unit: '管道工程',
    region: '嘉定',
    owner: '嘉定区水务局',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '管网建设',
    contractAmount: 65000000,
    carryForwardRevenue: 30000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    totalReportedRevenue: 26000000,
    remainingContractAmount: 37000000,
    annualPlanRevenue: 35700000,
    annualEstimatedRevenue: 34000000,
    planAdjustmentRate: -4.0,
    monthActualRevenue: 3700000,
    startAccumulatedRevenue: 30800000,
    progress: 43,
    startTime: '2023-12-01',
    month1: 2200000,
    month2: 2500000,
    month3: 2800000,
    month4: 3100000,
    month5: 3400000,
    month6: 3700000,
    month7: 4000000,
    month8: 4300000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 28,
    projectCode: 'XM-2024-028',
    projectName: '青浦区管道安全检测',
    unit: '管道分公司',
    region: '青浦',
    owner: '青浦区水务局',
    status: '完工',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '检测服务',
    contractAmount: 18000000,
    carryForwardRevenue: 8000000,
    annualAccumulatedRevenue: 18000000,
    quarterlyAccumulatedRevenue: 6200000,
    annualReportedRevenue: 17000000,
    totalReportedRevenue: 17000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 18000000,
    annualEstimatedRevenue: 18000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 1900000,
    startAccumulatedRevenue: 29700000,
    progress: 100,
    startTime: '2023-04-01',
    month1: 1400000,
    month2: 1500000,
    month3: 1600000,
    month4: 1700000,
    month5: 1800000,
    month6: 1900000,
    month7: 2000000,
    month8: 2200000,
    month9: 2900000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 29,
    projectCode: 'XM-2024-029',
    projectName: '奉贤区污水泵站改造',
    unit: '管道分公司',
    region: '奉贤',
    owner: '奉贤区水务局',
    status: '在建',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '泵站改造',
    contractAmount: 42000000,
    carryForwardRevenue: 18000000,
    annualAccumulatedRevenue: 28000000,
    quarterlyAccumulatedRevenue: 9500000,
    annualReportedRevenue: 26000000,
    totalReportedRevenue: 26000000,
    remainingContractAmount: 14000000,
    annualPlanRevenue: 29400000,
    annualEstimatedRevenue: 31500000,
    planAdjustmentRate: 1.5,
    monthActualRevenue: 3200000,
    startAccumulatedRevenue: 39200000,
    progress: 67,
    startTime: '2023-08-20',
    month1: 2200000,
    month2: 2400000,
    month3: 2600000,
    month4: 2800000,
    month5: 3000000,
    month6: 3200000,
    month7: 3400000,
    month8: 3600000,
    month9: 2800000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 30,
    projectCode: 'XM-2024-030',
    projectName: '金山区环境监测站建设',
    unit: '环境建设',
    region: '金山',
    owner: '金山区生态环境局',
    status: '待结算',
    revenueCaliber: '新增立项',
    isCoManaged: '是',
    businessType: '监测站建设',
    contractAmount: 48000000,
    carryForwardRevenue: 20000000,
    annualAccumulatedRevenue: 38000000,
    quarterlyAccumulatedRevenue: 13500000,
    annualReportedRevenue: 35000000,
    totalReportedRevenue: 35000000,
    remainingContractAmount: 10000000,
    annualPlanRevenue: 39100000,
    annualEstimatedRevenue: 39500000,
    planAdjustmentRate: 0,
    monthActualRevenue: 4300000,
    startAccumulatedRevenue: 62300000,
    progress: 79,
    startTime: '2023-09-15',
    month1: 2800000,
    month2: 3100000,
    month3: 3400000,
    month4: 3700000,
    month5: 4000000,
    month6: 4300000,
    month7: 4600000,
    month8: 4900000,
    month9: 4200000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 31,
    projectCode: 'XM-2024-031',
    projectName: '徐汇区二次供水设施',
    unit: '二次养护',
    region: '徐汇',
    owner: '徐汇区房管局',
    status: '在建',
    revenueCaliber: '新增立项',
    isCoManaged: '否',
    businessType: '二次供水',
    contractAmount: 36000000,
    carryForwardRevenue: 15000000,
    annualAccumulatedRevenue: 22000000,
    quarterlyAccumulatedRevenue: 7500000,
    annualReportedRevenue: 20000000,
    totalReportedRevenue: 20000000,
    remainingContractAmount: 16000000,
    annualPlanRevenue: 19800000,
    annualEstimatedRevenue: 27700000,
    planAdjustmentRate: 6.8,
    monthActualRevenue: 2800000,
    startAccumulatedRevenue: 24600000,
    progress: 61,
    startTime: '2023-11-01',
    month1: 1800000,
    month2: 2000000,
    month3: 2200000,
    month4: 2400000,
    month5: 2600000,
    month6: 2800000,
    month7: 3000000,
    month8: 3200000,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 32,
    projectCode: 'XM-2024-032',
    projectName: '普陀区雨水泵站新建',
    unit: '管道工程',
    region: '普陀',
    owner: '普陀区水务局',
    status: '完工',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '泵站建设',
    contractAmount: 72000000,
    carryForwardRevenue: 32000000,
    annualAccumulatedRevenue: 68000000,
    quarterlyAccumulatedRevenue: 23000000,
    annualReportedRevenue: 65000000,
    totalReportedRevenue: 65000000,
    remainingContractAmount: 4000000,
    annualPlanRevenue: 68000000,
    annualEstimatedRevenue: 68000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 6500000,
    startAccumulatedRevenue: 111900000,
    progress: 94,
    startTime: '2023-02-10',
    month1: 5000000,
    month2: 5300000,
    month3: 5600000,
    month4: 5900000,
    month5: 6200000,
    month6: 6500000,
    month7: 6800000,
    month8: 7100000,
    month9: 7400000,
    month10: 8200000,
    month11: 0,
    month12: 0
  },
  {
    id: 33,
    projectCode: 'XM-2024-033',
    projectName: '长宁区管网改造工程',
    unit: '管网事业部',
    region: '长宁',
    owner: '长宁区建交委',
    status: '已结算',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '管网改造',
    contractAmount: 58000000,
    carryForwardRevenue: 25000000,
    annualAccumulatedRevenue: 58000000,
    quarterlyAccumulatedRevenue: 19500000,
    annualReportedRevenue: 56000000,
    totalReportedRevenue: 56000000,
    remainingContractAmount: 0,
    annualPlanRevenue: 58000000,
    annualEstimatedRevenue: 58000000,
    planAdjustmentRate: 0,
    monthActualRevenue: 5700000,
    startAccumulatedRevenue: 104400000,
    progress: 100,
    startTime: '2022-12-01',
    month1: 4200000,
    month2: 4500000,
    month3: 4800000,
    month4: 5100000,
    month5: 5400000,
    month6: 5700000,
    month7: 6000000,
    month8: 6300000,
    month9: 6600000,
    month10: 7400000,
    month11: 0,
    month12: 0
  },
  {
    id: 34,
    projectCode: 'XM-2024-034',
    projectName: '浦东新区自来水厂升级',
    unit: '市政事业部',
    region: '浦东',
    owner: '浦东水务集团',
    status: '在建',
    revenueCaliber: '结转在建项目',
    isCoManaged: '是',
    businessType: '水厂升级',
    contractAmount: 125000000,
    carryForwardRevenue: 55000000,
    annualAccumulatedRevenue: 52000000,
    quarterlyAccumulatedRevenue: 18000000,
    annualReportedRevenue: 48000000,
    totalReportedRevenue: 48000000,
    remainingContractAmount: 77000000,
    annualPlanRevenue: 68700000,
    annualEstimatedRevenue: 65100000,
    planAdjustmentRate: -2.8,
    monthActualRevenue: 5800000,
    startAccumulatedRevenue: 71800000,
    progress: 42,
    startTime: '2023-10-15',
    month1: 3800000,
    month2: 4200000,
    month3: 4600000,
    month4: 5000000,
    month5: 5400000,
    month6: 5800000,
    month7: 6200000,
    month8: 7000000,
    month9: 6000000,
    month10: 0,
    month11: 0,
    month12: 0
  },
  {
    id: 35,
    projectCode: 'XM-2024-035',
    projectName: '黄浦区智慧监测平台',
    unit: '环境建设',
    region: '黄浦',
    owner: '黄浦区生态环境局',
    status: '在建',
    revenueCaliber: '完工待结算项目',
    isCoManaged: '否',
    businessType: '信息化',
    contractAmount: 28000000,
    carryForwardRevenue: 12000000,
    annualAccumulatedRevenue: 20000000,
    quarterlyAccumulatedRevenue: 6800000,
    annualReportedRevenue: 18000000,
    totalReportedRevenue: 18000000,
    remainingContractAmount: 8000000,
    annualPlanRevenue: 22400000,
    annualEstimatedRevenue: 21200000,
    planAdjustmentRate: 2.5,
    monthActualRevenue: 2100000,
    startAccumulatedRevenue: 30400000,
    progress: 71,
    startTime: '2023-07-01',
    month1: 1600000,
    month2: 1700000,
    month3: 1800000,
    month4: 1900000,
    month5: 2000000,
    month6: 2100000,
    month7: 2200000,
    month8: 2300000,
    month9: 2400000,
    month10: 0,
    month11: 0,
    month12: 0
  }
]

const calculateTotalReportedRevenue = (data) => {
  const currentMonth = new Date().getMonth() + 1
  return data.map(item => {
    let total = 0
    let monthReported = 0
    for (let i = 1; i <= 12; i++) {
      const val = item[`month${i}`] || 0
      total += val
      if (i === currentMonth) {
        monthReported = val
      }
    }

    // 预警等级计算
    const now = new Date()
    const currentYear = now.getFullYear()
    const yearStart = new Date(currentYear, 0, 1)
    const startTimeVal = item.startTime ? new Date(item.startTime) : null
    const isNewProject = item.revenueCaliber === '新增立项'

    let oneMonth = 30 * 24 * 60 * 60 * 1000
    let twoMonths = 2 * oneMonth
    let threeMonths = 3 * oneMonth

    let warningLevel = ''
    if (!item.annualPlanRevenue || item.annualPlanRevenue <= 0) {
      if (isNewProject && startTimeVal) {
        const elapsed = now.getTime() - startTimeVal.getTime()
        if (elapsed > twoMonths) warningLevel = '橙色预警'
        else if (elapsed > oneMonth) warningLevel = '黄色预警'
      } else {
        const yearElapsed = now.getTime() - yearStart.getTime()
        if (yearElapsed > oneMonth) warningLevel = '橙色预警'
        else if (yearElapsed > oneMonth / 2) warningLevel = '黄色预警'
      }
    }

    // 基于营收完成率的预警（针对有计划营收的项目）
    if (!warningLevel && item.annualPlanRevenue > 0) {
      const rate = (item.annualAccumulatedRevenue || 0) / item.annualPlanRevenue
      const monthNow = now.getMonth() + 1
      const expectedRate = monthNow / 12
      if (rate < expectedRate * 0.5) {
        warningLevel = '橙色预警'
      } else if (rate < expectedRate * 0.75) {
        warningLevel = '黄色预警'
      }
    }

    return {
      ...item,
      totalReportedRevenue: total,
      monthReportedRevenue: monthReported,
      warningLevel: warningLevel
    }
  })
}

const filteredData = computed(() => {
  let data = calculateTotalReportedRevenue(rawData)
  
  if (filters.value.unit) {
    data = data.filter(item => item.unit === filters.value.unit)
  }
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  if (filters.value.revenueCaliber) {
    data = data.filter(item => item.revenueCaliber === filters.value.revenueCaliber)
  }
  if (filters.value.isCoManaged) {
    data = data.filter(item => item.isCoManaged === filters.value.isCoManaged)
  }
  if (filters.value.sector) {
    data = data.filter(item => item.sector === filters.value.sector)
  }
  if (filters.value.businessType) {
    data = data.filter(item => item.businessType === filters.value.businessType)
  }
  
  if (filters.value.statusNotIn && filters.value.statusNotIn.length > 0) {
    data = data.filter(item => !filters.value.statusNotIn.includes(item.status))
  }
  
  if (filters.value.hasPlanRevenue !== undefined) {
    if (filters.value.hasPlanRevenue) {
      data = data.filter(item => item.annualPlanRevenue && item.annualPlanRevenue > 0)
    } else {
      data = data.filter(item => !item.annualPlanRevenue || item.annualPlanRevenue <= 0)
    }
  }

  // 项目名称模糊搜索
  if (filters.value.projectName) {
    data = data.filter(item => item.projectName.includes(filters.value.projectName))
  }
  // 项目编号模糊搜索
  if (filters.value.projectCode) {
    data = data.filter(item => item.projectCode.includes(filters.value.projectCode))
  }
  // 下调百分比过滤
  if (filters.value.planAdjustmentRateMax !== null && filters.value.planAdjustmentRateMax !== undefined) {
    data = data.filter(item => item.planAdjustmentRate < filters.value.planAdjustmentRateMax)
  }
  // 预警等级过滤（复用已有逻辑，但改为直接匹配 warningLevel 字段）
  if (filters.value.warningLevel) {
    data = data.filter(item => {
      if (filters.value.warningLevel === 'yellow') return item.warningLevel === '黄色预警'
      if (filters.value.warningLevel === 'orange') return item.warningLevel === '橙色预警'
      if (filters.value.warningLevel === 'normal') return !item.warningLevel || item.warningLevel === ''
      return true
    })
  }

  return data
})

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return calculateTotalReportedRevenue(rawData).slice(start, end)
})

// 切换页码时重置到第1页
watch([() => filters.value.unit, () => filters.value.status, () => filters.value.revenueCaliber,
      () => filters.value.isCoManaged, () => filters.value.projectName, () => filters.value.projectCode,
      () => filters.value.warningLevel], () => {
  currentPage.value = 1
})

const formatNumber = (num) => {
  if (num === undefined || num === null || num === 0) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusType = (status) => {
  const types = {
    '在建': 'warning',
    '完工': 'success',
    '待结算': 'info',
    '已结算': 'primary'
  }
  return types[status] || 'default'
}

const rowClassName = ({ row }) => {
  if (row.isCoManaged === '是') {
    return 'co-managed-row'
  }
  return ''
}

const startEdit = (row, field) => {
  editingCell.value = `${row.id}-${field}`
  editValue.value = row[field]
}

const finishEdit = (row, field) => {
  row[field] = parseFloat(editValue.value) || 0
  editingCell.value = ''
}

const getSummaries = (param) => {
  const { columns, data } = param
  if (!columns || !data || data.length === 0) {
    return columns ? columns.map(() => '') : []
  }

  // 需要求和的数值字段（其余文本字段显示 '-'）
  const numericProps = [
    'contractAmount', 'carryForwardRevenue', 'annualPlanRevenue',
    'annualEstimatedRevenue', 'planAdjustmentRate', 'monthActualRevenue',
    'annualAccumulatedRevenue', 'startAccumulatedRevenue', 'monthReportedRevenue',
    'annualReportedRevenue', 'totalReportedRevenue', 'remainingContractAmount',
    'progress'
  ]

  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }

    const prop = column.prop || column.property
    if (!prop || !numericProps.includes(prop)) {
      sums[index] = '-'
      return
    }

    const values = data.map(item => {
      const val = item[prop]
      if (val === undefined || val === null || val === '') return 0
      const num = parseFloat(val)
      return isNaN(num) ? 0 : num
    })

    const total = values.reduce((prev, curr) => prev + curr, 0)

    // 百分比字段求平均值，金额字段求和
    if (prop === 'planAdjustmentRate' || prop === 'progress') {
      const avg = data.length > 0 ? total / data.length : 0
      sums[index] = avg.toFixed(1)
    } else {
      sums[index] = total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  })
  return sums
}

const handleSearch = () => {
  // 搜索：filteredData computed 已自动响应 filters 变化
}

const handleReset = () => {
  filters.value = {
    unit: '',
    status: '',
    revenueCaliber: '',
    isCoManaged: '',
    projectName: '',
    projectCode: '',
    planAdjustmentRateMax: null,
    warningLevel: ''
  }
}

const exportExcel = () => {
  // Sheet1: 营收明细表（实际）
  const sheet1Data = rawData.map((item, index) => ({
    '序号': index + 1,
    '项目编号': item.projectCode,
    '项目名称': item.projectName,
    '基层单位': item.unit,
    '所属区域': item.region,
    '业主名称': item.owner,
    '项目状态': item.status,
    '营收统计口径': item.revenueCaliber,
    '是否协管项目': item.isCoManaged,
    '业务类型': item.businessType,
    '合同金额(不含税)': item.contractAmount || 0,
    '结转至当年及以后营收': item.carryForwardRevenue || 0,
    '当年计划营收': item.annualPlanRevenue || 0,
    '当年预计完成营收': item.annualEstimatedRevenue || 0,
    '年度累计营收': item.annualAccumulatedRevenue || 0,
    '开工累计营收': item.startAccumulatedRevenue || 0,
    '年度上报股份营收': item.annualReportedRevenue || 0,
    '累计上报股份营收': (() => {
      let total = 0
      for (let i = 1; i <= 12; i++) total += (item[`month${i}`] || 0)
      return total
    })(),
    '1月完成营收': item.month1 || 0,
    '2月完成营收': item.month2 || 0,
    '3月完成营收': item.month3 || 0,
    '4月完成营收': item.month4 || 0,
    '5月完成营收': item.month5 || 0,
    '6月完成营收': item.month6 || 0,
    '7月完成营收': item.month7 || 0,
    '8月完成营收': item.month8 || 0,
    '9月完成营收': item.month9 || 0,
    '10月完成营收': item.month10 || 0,
    '11月完成营收': item.month11 || 0,
    '12月完成营收': item.month12 || 0
  }))

  // Sheet2: 营收明细表（计划）
  const sheet2Data = rawData.map((item, index) => ({
    '序号': index + 1,
    '项目编号': item.projectCode,
    '项目名称': item.projectName,
    '基层单位': item.unit,
    '所属区域': item.region,
    '业主名称': item.owner,
    '项目状态': item.status,
    '营收统计口径': item.revenueCaliber,
    '是否协管项目': item.isCoManaged,
    '业务类型': item.businessType,
    '合同金额(不含税)': item.contractAmount || 0,
    '结转至当年及以后营收': item.carryForwardRevenue || 0,
    '年度累计营收': item.annualAccumulatedRevenue || 0,
    '年度上报股份营收': item.annualReportedRevenue || 0,
    '累计上报股份营收': (() => {
      let total = 0
      for (let i = 1; i <= 12; i++) total += (item[`month${i}`] || 0)
      return total
    })(),
    '1月上报营收': item.month1 || 0,
    '2月上报营收': item.month2 || 0,
    '3月上报营收': item.month3 || 0,
    '4月上报营收': item.month4 || 0,
    '5月上报营收': item.month5 || 0,
    '6月上报营收': item.month6 || 0,
    '7月上报营收': item.month7 || 0,
    '8月上报营收': item.month8 || 0,
    '9月上报营收': item.month9 || 0,
    '10月上报营收': item.month10 || 0,
    '11月上报营收': item.month11 || 0,
    '12月上报营收': item.month12 || 0
  }))

  const ws1 = utils.json_to_sheet(sheet1Data)
  const ws2 = utils.json_to_sheet(sheet2Data)

  // 设置列宽
  ws1['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
  ws2['!cols'] = ws1['!cols']

  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws1, '营收明细表（实际）')
  utils.book_append_sheet(wb, ws2, '营收明细表（计划）')

  writeFile(wb, `营收明细表_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

onMounted(() => {
  const savedFilters = localStorage.getItem('revenueDetailFilters')
  if (savedFilters) {
    try {
      filters.value = { ...filters.value, ...JSON.parse(savedFilters) }
    } catch (e) {
      console.error('Failed to parse saved filters:', e)
    }
  }
  
  if (props.initialFilter.unit) {
    filters.value.unit = props.initialFilter.unit
  }
  
  if (props.initialFilter.statisticType) {
    const statisticTypeMap = {
      '新接项目': '新增立项',
      '结转在建项目': '结转在建项目',
      '完工未结算项目': '完工待结算项目'
    }
    filters.value.revenueCaliber = statisticTypeMap[props.initialFilter.statisticType] || props.initialFilter.statisticType
  }
  
  if (props.initialFilter.statusNotIn) {
    filters.value.statusNotIn = props.initialFilter.statusNotIn
  }
  
  if (props.initialFilter.hasPlanRevenue !== undefined) {
    filters.value.hasPlanRevenue = props.initialFilter.hasPlanRevenue
  }
  
  if (props.initialFilter.warningLevel) {
    filters.value.warningLevel = props.initialFilter.warningLevel
  }
})

watch(filters, (newFilters) => {
  localStorage.setItem('revenueDetailFilters', JSON.stringify(newFilters))
}, { deep: true })
</script>

<style scoped>
.co-managed-row {
  background-color: #F6FFED;
}

/* 合计行样式 */
:deep(.el-table__footer-wrapper) {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
:deep(.el-table__footer) {
  background-color: #f9fafb !important;
}
:deep(.el-table__footer-wrapper td) {
  background-color: #f9fafb !important;
  font-weight: bold !important;
  color: #374151 !important;
}
:deep(.el-table__footer-wrapper th) {
  background-color: #f9fafb !important;
}
</style>