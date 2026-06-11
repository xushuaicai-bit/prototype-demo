<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">营收汇总表</h2>
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

    <div class="flex gap-4 mb-4">
      <div class="flex-1">
        <el-tabs v-model="activeTab" type="card" class="w-full">
          <el-tab-pane label="施工类总营收" name="construction"></el-tab-pane>
          <el-tab-pane label="产品类总营收" name="product"></el-tab-pane>
          <el-tab-pane label="其他业态总营收" name="other"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div v-if="activeTab === 'construction'" class="mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <label class="text-sm text-gray-600 mr-2">基层单位：</label>
        <el-select 
          v-model="selectedUnits" 
          multiple 
          placeholder="请选择基层单位" 
          class="w-80"
          collapse-tags
        >
          <el-option 
            v-for="unit in allUnits" 
            :key="unit" 
            :label="unit" 
            :value="unit" 
          />
        </el-select>
        <button 
          class="ml-2 flex items-center px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          @click="handleSearch"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          搜索
        </button>
        <button
          class="ml-2 flex items-center px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
          @click="handleReset"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'construction'" class="overflow-x-auto" style="max-width: 100%;">
      <el-table
        :data="paginatedConstructionData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
      >
        <el-table-column
          label="基层单位"
          prop="name"
          fixed="left"
          width="200"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        >
          <template #default="scope">
            <span 
              class="ml-2 cursor-pointer text-blue-600 hover:underline"
              @click="drillDown(scope.row.name)"
            >{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="营收指标"
          prop="revenueTarget"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.revenueTarget) }}
          </template>
        </el-table-column>

        <el-table-column
          label="指标完成率"
          prop="completionRate"
          width="140"
          align="center"
        >
          <template #default="scope">
            <div class="flex flex-col items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getRateClass(scope.row.completionRate)"
                  :style="{ width: Math.min(scope.row.completionRate, 100) + '%' }"
                ></div>
              </div>
              <span :class="getRateTextClass(scope.row.completionRate)" class="text-sm">
                {{ scope.row.completionRate.toFixed(2) }}%
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="结转至当年及以后营收">
          <el-table-column
            label="结转在建项目"
            prop="carryForwardConstruction"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.carryForwardConstruction) }}
            </template>
          </el-table-column>
          <el-table-column
            label="完工待结算项目"
            prop="completedPendingSettlement"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.completedPendingSettlement) }}
            </template>
          </el-table-column>
          <el-table-column
            label="结转至当年及以后营收合计"
            prop="carryForwardTotal"
            width="160"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.carryForwardTotal) }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="本年度计划营收">
          <el-table-column
            label="结转在建项目"
            prop="planConstruction"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.planConstruction) }}
            </template>
          </el-table-column>
          <el-table-column
            label="完工待结算项目"
            prop="planCompleted"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.planCompleted) }}
            </template>
          </el-table-column>
          <el-table-column
            label="新接项目"
            prop="planNew"
            width="120"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.planNew) }}
            </template>
          </el-table-column>
          <el-table-column
            label="本年度计划营收-合计"
            prop="planTotal"
            width="160"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.planTotal) }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="本年度累计完成营收">
          <el-table-column
            label="结转在建项目"
            prop="actualConstruction"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.actualConstruction) }}
            </template>
          </el-table-column>
          <el-table-column
            label="完工待结算项目"
            prop="actualCompleted"
            width="130"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.actualCompleted) }}
            </template>
          </el-table-column>
          <el-table-column
            label="新接项目"
            prop="actualNew"
            width="120"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.actualNew) }}
            </template>
          </el-table-column>
          <el-table-column
            label="本年度累计完成营收-合计"
            prop="actualTotal"
            width="160"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.actualTotal) }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="上报营收及剩余合同存量">
          <el-table-column
            label="本年上报股份营收"
            prop="reportedRevenue"
            width="140"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.reportedRevenue) }}
            </template>
          </el-table-column>
          <el-table-column
            label="新接项目合同额（去税）"
            prop="newContractAmount"
            width="140"
            align="right"
          >
            <template #default="scope">
              {{ formatNumber(scope.row.newContractAmount) }}
            </template>
          </el-table-column>
          <el-table-column
          label="截止本月剩余合同存量"
          prop="remainingContract"
          width="140"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.remainingContract) }}
          </template>
        </el-table-column>
        <el-table-column
          label="下月计划"
          prop="nextMonthPlan"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.nextMonthPlan) }}
          </template>
        </el-table-column>
      </el-table-column>
      </el-table>

      <!-- 固定底部合计行 -->
      <div v-if="constructionTotals" class="total-footer-row">
        <table style="width: 100%; min-width: 2500px; table-layout: fixed; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="width: 200px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5;">合计</td>
              <td style="width: 120px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.revenueTarget) }}</td>
              <td style="width: 140px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: center;">
                <span :class="getRateTextClass(constructionTotals.completionRate)" class="text-sm font-bold">{{ constructionTotals.completionRate?.toFixed(2) }}%</span>
              </td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.carryForwardConstruction) }}</td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.completedPendingSettlement) }}</td>
              <td style="width: 160px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.carryForwardTotal) }}</td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.planConstruction) }}</td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.planCompleted) }}</td>
              <td style="width: 120px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.planNew) }}</td>
              <td style="width: 160px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.planTotal) }}</td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.actualConstruction) }}</td>
              <td style="width: 130px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.actualCompleted) }}</td>
              <td style="width: 120px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.actualNew) }}</td>
              <td style="width: 160px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.actualTotal) }}</td>
              <td style="width: 140px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.reportedRevenue) }}</td>
              <td style="width: 140px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.newContractAmount) }}</td>
              <td style="width: 140px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.remainingContract) }}</td>
              <td style="width: 120px; background: #f9fafb; font-weight: bold; padding: 12px 8px; border: 1px solid #ebeef5; text-align: right;">{{ formatNumber(constructionTotals.nextMonthPlan) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="constructionPage"
          v-model:page-size="constructionPageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredConstructionData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>

    <div v-if="activeTab === 'product'" class="overflow-x-auto">
      <el-table
        :data="productData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        show-summary
        :summary-method="getProductSummaries"
        style="width: 100%; min-width: 800px;"
      >
        <el-table-column
          label="基层单位"
          prop="name"
          width="150"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        <el-table-column
          label="营收指标"
          prop="revenueTarget"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.revenueTarget) }}
          </template>
        </el-table-column>
        <el-table-column
          label="指标完成率"
          prop="completionRate"
          width="140"
          align="center"
        >
          <template #default="scope">
            <div class="flex flex-col items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getRateClass(scope.row.completionRate)"
                  :style="{ width: Math.min(scope.row.completionRate, 100) + '%' }"
                ></div>
              </div>
              <span :class="getRateTextClass(scope.row.completionRate)" class="text-sm">
                {{ scope.row.completionRate.toFixed(2) }}%
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="当年计划"
          prop="annualPlan"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualPlan) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当月完成"
          prop="monthlyActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthlyActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当年完成"
          prop="annualActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="下月计划"
          prop="nextMonthPlan"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.nextMonthPlan) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="productPage"
          v-model:page-size="productPageSize"
          :page-sizes="[10, 20, 50]"
          :total="productData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>

    <div v-if="activeTab === 'other'" class="overflow-x-auto">
      <el-table
        :data="otherData"
        border
        :header-cell-style="{ backgroundColor: '#5B9BD5', color: '#fff' }"
        show-summary
        :summary-method="getOtherSummaries"
        style="width: 100%; min-width: 600px;"
      >
        <el-table-column
          label="业态类型"
          prop="name"
          width="150"
          :header-cell-style="{ backgroundColor: '#4A8AC4', color: '#fff' }"
        />
        <el-table-column
          label="当月完成"
          prop="monthlyActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.monthlyActual) }}
          </template>
        </el-table-column>
        <el-table-column
          label="当年完成"
          prop="annualActual"
          width="120"
          align="right"
        >
          <template #default="scope">
            {{ formatNumber(scope.row.annualActual) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-3">
        <el-pagination
          v-model:current-page="otherPage"
          v-model:page-size="otherPageSize"
          :page-sizes="[10, 20, 50]"
          :total="otherData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['navigate'])

const props = defineProps({
  initialFilter: {
    type: [String, Object],
    default: ''
  }
})

const activeTab = ref('construction')
const selectedUnits = ref([])
const constructionTotals = ref(null)

// 分页状态
const constructionPage = ref(1)
const constructionPageSize = ref(10)
const productPage = ref(1)
const productPageSize = ref(10)
const otherPage = ref(1)
const otherPageSize = ref(10)

onMounted(() => {
  if (typeof props.initialFilter === 'object') {
    if (props.initialFilter.tab) {
      activeTab.value = props.initialFilter.tab
    }
    if (props.initialFilter.unit && props.initialFilter.unit !== '全部') {
      selectedUnits.value = [props.initialFilter.unit]
    }
  } else {
    const savedFilter = props.initialFilter || sessionStorage.getItem('revenueFilter')
    if (savedFilter && savedFilter !== '全部') {
      selectedUnits.value = [savedFilter]
    }
  }
  
  const savedTab = sessionStorage.getItem('revenueTab')
  if (savedTab) {
    activeTab.value = savedTab
  }
})

const carryForwardColumns = [
  { label: '结转在建项目', prop: 'carryForwardConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'completedPendingSettlement', width: 130, align: 'right' },
  { label: '结转至当年及以后营收合计', prop: 'carryForwardTotal', width: 160, align: 'right' }
]

const planColumns = [
  { label: '结转在建项目', prop: 'planConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'planCompleted', width: 130, align: 'right' },
  { label: '新接项目', prop: 'planNew', width: 120, align: 'right', className: 'green-border' },
  { label: '本年度计划营收-合计', prop: 'planTotal', width: 160, align: 'right' }
]

const actualColumns = [
  { label: '结转在建项目', prop: 'actualConstruction', width: 130, align: 'right' },
  { label: '完工待结算项目', prop: 'actualCompleted', width: 130, align: 'right' },
  { label: '新接项目', prop: 'actualNew', width: 120, align: 'right' },
  { label: '本年度累计完成营收-合计', prop: 'actualTotal', width: 160, align: 'right' }
]

const reportColumns = [
  { label: '本年上报股份营收', prop: 'reportedRevenue', width: 140, align: 'right' },
  { label: '新接项目合同额（去税）', prop: 'newContractAmount', width: 140, align: 'right' },
  { label: '截止本月剩余合同存量', prop: 'remainingContract', width: 140, align: 'right' }
]

const rawData = [
  {
    id: 1,
    name: '管网事业部',
    revenueTarget: 25000,
    carryForwardConstruction: 5000,
    completedPendingSettlement: 2500,
    planConstruction: 6000,
    planCompleted: 3000,
    planNew: 5000,
    actualConstruction: 5500,
    actualCompleted: 2700,
    actualNew: 4600,
    reportedRevenue: 12800,
    newContractAmount: 7500,
    remainingContract: 15000,
    nextMonthPlan: 1350
  },
  {
    id: 2,
    name: '生态事业部',
    revenueTarget: 22000,
    carryForwardConstruction: 4500,
    completedPendingSettlement: 2200,
    planConstruction: 5200,
    planCompleted: 2600,
    planNew: 4400,
    actualConstruction: 4800,
    actualCompleted: 2400,
    actualNew: 4100,
    reportedRevenue: 11300,
    newContractAmount: 6600,
    remainingContract: 13200,
    nextMonthPlan: 1200
  },
  {
    id: 3,
    name: '区域事业部',
    revenueTarget: 20000,
    carryForwardConstruction: 4000,
    completedPendingSettlement: 2000,
    planConstruction: 4800,
    planCompleted: 2400,
    planNew: 4000,
    actualConstruction: 4400,
    actualCompleted: 2200,
    actualNew: 3700,
    reportedRevenue: 10300,
    newContractAmount: 6000,
    remainingContract: 12000,
    nextMonthPlan: 1100
  },
  {
    id: 4,
    name: '市政事业部',
    revenueTarget: 18000,
    carryForwardConstruction: 3600,
    completedPendingSettlement: 1800,
    planConstruction: 4200,
    planCompleted: 2100,
    planNew: 3600,
    actualConstruction: 3900,
    actualCompleted: 1900,
    actualNew: 3400,
    reportedRevenue: 9200,
    newContractAmount: 5400,
    remainingContract: 10800,
    nextMonthPlan: 980
  },
  {
    id: 5,
    name: '环境建设',
    revenueTarget: 16000,
    carryForwardConstruction: 3200,
    completedPendingSettlement: 1600,
    planConstruction: 3800,
    planCompleted: 1900,
    planNew: 3200,
    actualConstruction: 3500,
    actualCompleted: 1700,
    actualNew: 3000,
    reportedRevenue: 8200,
    newContractAmount: 4800,
    remainingContract: 9600,
    nextMonthPlan: 870
  },
  {
    id: 6,
    name: '管道工程',
    revenueTarget: 14000,
    carryForwardConstruction: 2800,
    completedPendingSettlement: 1400,
    planConstruction: 3400,
    planCompleted: 1700,
    planNew: 2800,
    actualConstruction: 3100,
    actualCompleted: 1500,
    actualNew: 2600,
    reportedRevenue: 7200,
    newContractAmount: 4200,
    remainingContract: 8400,
    nextMonthPlan: 760
  },
  {
    id: 7,
    name: '管道分公司',
    revenueTarget: 12000,
    carryForwardConstruction: 2400,
    completedPendingSettlement: 1200,
    planConstruction: 2800,
    planCompleted: 1400,
    planNew: 2400,
    actualConstruction: 2600,
    actualCompleted: 1300,
    actualNew: 2200,
    reportedRevenue: 6100,
    newContractAmount: 3600,
    remainingContract: 7200,
    nextMonthPlan: 650
  },
  {
    id: 8,
    name: '运营养护',
    revenueTarget: 10000,
    carryForwardConstruction: 2000,
    completedPendingSettlement: 1000,
    planConstruction: 2400,
    planCompleted: 1200,
    planNew: 2000,
    actualConstruction: 2200,
    actualCompleted: 1100,
    actualNew: 1800,
    reportedRevenue: 5100,
    newContractAmount: 3000,
    remainingContract: 6000,
    nextMonthPlan: 540
  },
  {
    id: 9,
    name: '二次养护',
    revenueTarget: 8000,
    carryForwardConstruction: 1600,
    completedPendingSettlement: 800,
    planConstruction: 1900,
    planCompleted: 950,
    planNew: 1600,
    actualConstruction: 1700,
    actualCompleted: 850,
    actualNew: 1500,
    reportedRevenue: 4050,
    newContractAmount: 2400,
    remainingContract: 4800,
    nextMonthPlan: 430
  },
  {
    id: 10,
    name: '浦东供排水',
    revenueTarget: 6000,
    carryForwardConstruction: 1200,
    completedPendingSettlement: 600,
    planConstruction: 1450,
    planCompleted: 720,
    planNew: 1200,
    actualConstruction: 1300,
    actualCompleted: 650,
    actualNew: 1100,
    reportedRevenue: 3050,
    newContractAmount: 1800,
    remainingContract: 3600,
    nextMonthPlan: 320
  }
]

const allUnits = [
  '管网事业部', '生态事业部', '区域事业部', '市政事业部', '环境建设',
  '管道工程', '管道分公司', '运营养护', '二次养护', '浦东供排水'
]

const productData = [
  {
    id: 1,
    name: '水表厂',
    revenueTarget: 8000,
    annualPlan: 8000,
    monthlyActual: 650,
    annualActual: 5200,
    nextMonthPlan: 700,
    completionRate: 65
  },
  {
    id: 2,
    name: '设备成套',
    revenueTarget: 5000,
    annualPlan: 5000,
    monthlyActual: 420,
    annualActual: 3360,
    nextMonthPlan: 450,
    completionRate: 67.2
  }
]

const otherData = [
  {
    id: 1,
    name: '资管类',
    monthlyActual: 150,
    annualActual: 1800
  },
  {
    id: 2,
    name: '利息等',
    monthlyActual: 80,
    annualActual: 960
  }
]

const calculateDerivedFields = (data) => {
  return data.map(item => {
    let result = { ...item }
    
    result.carryForwardTotal = item.carryForwardConstruction + item.completedPendingSettlement
    result.planTotal = item.planConstruction + item.planCompleted + item.planNew
    result.actualTotal = item.actualConstruction + item.actualCompleted + item.actualNew
    
    if (item.revenueTarget > 0) {
      result.completionRate = (result.actualTotal / item.revenueTarget) * 100
    } else {
      result.completionRate = 0
    }
    
    if (item.children) {
      result.children = calculateDerivedFields(item.children)
    }
    
    return result
  })
}

const filterDataByUnits = (data, units) => {
  if (units.length === 0) return data
  return data.filter(item => units.includes(item.name))
}

const calculateTotalsForFiltered = (data) => {
  const totals = {
    id: 999,
    name: '合计',
    revenueTarget: 0,
    carryForwardConstruction: 0,
    completedPendingSettlement: 0,
    carryForwardTotal: 0,
    planConstruction: 0,
    planCompleted: 0,
    planNew: 0,
    planTotal: 0,
    actualConstruction: 0,
    actualCompleted: 0,
    actualNew: 0,
    actualTotal: 0,
    reportedRevenue: 0,
    newContractAmount: 0,
    remainingContract: 0,
    nextMonthPlan: 0,
    completionRate: 0
  }
  
  data.forEach(item => {
    totals.revenueTarget += item.revenueTarget
    totals.carryForwardConstruction += item.carryForwardConstruction
    totals.completedPendingSettlement += item.completedPendingSettlement
    totals.carryForwardTotal += item.carryForwardTotal
    totals.planConstruction += item.planConstruction
    totals.planCompleted += item.planCompleted
    totals.planNew += item.planNew
    totals.planTotal += item.planTotal
    totals.actualConstruction += item.actualConstruction
    totals.actualCompleted += item.actualCompleted
    totals.actualNew += item.actualNew
    totals.actualTotal += item.actualTotal
    totals.reportedRevenue += item.reportedRevenue
    totals.newContractAmount += item.newContractAmount
    totals.remainingContract += item.remainingContract
    totals.nextMonthPlan += item.nextMonthPlan
  })
  
  if (totals.revenueTarget > 0) {
    totals.completionRate = (totals.actualTotal / totals.revenueTarget) * 100
  }
  
  return totals
}

const filteredConstructionData = computed(() => {
  const calculated = calculateDerivedFields(rawData)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  const totals = calculateTotalsForFiltered(filtered)
  constructionTotals.value = totals
  return [...filtered]
})

// 施工类分页数据
const paginatedConstructionData = computed(() => {
  const calculated = calculateDerivedFields(rawData)
  const filtered = filterDataByUnits(calculated, selectedUnits.value)
  const start = (constructionPage.value - 1) * constructionPageSize.value
  const end = start + constructionPageSize.value
  return filtered.slice(start, end)
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const getRateClass = (rate) => {
  if (rate >= 100) return 'bg-green-500'
  if (rate >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getRateTextClass = (rate) => {
  if (rate >= 100) return 'text-green-600 font-medium'
  if (rate >= 50) return 'text-yellow-600'
  return 'text-red-600 font-medium'
}

const rowClassName = ({ row }) => {
  return ''
}

const getProductSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    const prop = column.prop
    if (!prop) {
      sums[index] = '-'
      return
    }

    const values = data.map(item => {
      const value = parseFloat(item[prop])
      return isNaN(value) ? 0 : value
    })

    const total = values.reduce((prev, curr) => prev + curr, 0)
    sums[index] = total.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  })
  return sums
}

const getOtherSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    const prop = column.prop
    if (!prop) {
      sums[index] = '-'
      return
    }

    const values = data.map(item => {
      const value = parseFloat(item[prop])
      return isNaN(value) ? 0 : value
    })

    const total = values.reduce((prev, curr) => prev + curr, 0)
    sums[index] = total.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  })
  return sums
}

const drillDown = (unitName) => {
  emit('navigate', { view: 'revenue', report: 'revenue-detail', filter: { unit: unitName } })
}

const handleSearch = () => {
  // 搜索：filteredData computed 已自动响应 selectedUnits 变化
}

const handleReset = () => {
  selectedUnits.value = []
}

const exportExcel = () => {
  alert('导出功能：已生成 Excel 文件（Mock）')
}
</script>

<style scoped>
.green-border {
  border: 2px solid #52c41a;
}

/* 固定底部合计行 */
.total-footer-row {
  position: sticky;
  bottom: 0;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
.total-footer-row td {
  background-color: #f9fafb !important;
}

/* el-table 内置合计行统一样式（产品/其他业态） */
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