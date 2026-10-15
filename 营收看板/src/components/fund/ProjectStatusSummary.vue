<template>
  <div class="project-status-summary">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">按项目状态汇总表</h2>
        <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">单位：万元</span>
      </div>
      <div class="header-actions">
        <span class="summary-info">数据时间：{{ currentDate }}</span>
        <el-button @click="handleExport" type="warning" size="small">导出</el-button>
      </div>
    </div>

    <div class="table-container">
      <div class="table-scroll-wrapper">
        <el-table
          :data="paginatedData"
          border
          stripe
          :height="tableHeight"
          class="summary-table"
          show-summary
          :row-class-name="getRowClassName"
        >
          <el-table-column prop="projectStatus" label="项目状态" width="120" align="center" />
          <el-table-column prop="settlementStatus" label="结算状态" width="120" align="center" />
          <el-table-column prop="projectCount" label="项目数量" width="100" align="right" />
          <el-table-column prop="contractPrice" label="合同价/审定价" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.contractPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="internalNotReportedRevenue" label="已报内部未上报集团营收" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.internalNotReportedRevenue) }}
            </template>
          </el-table-column>
          <el-table-column prop="internalNotReportedGrossProfit" label="已报内部未上报集团毛利" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.internalNotReportedGrossProfit) }}
            </template>
          </el-table-column>
          <el-table-column prop="carryForwardRevenue2027" label="结转至2027年及以后内部营收" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.carryForwardRevenue2027) }}
            </template>
          </el-table-column>
          <el-table-column prop="completedRevenue2026" label="2026年完成总包营收（内部）" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.completedRevenue2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportedRevenue2026" label="2026年上报集团营收" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.reportedRevenue2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="remainingPlan2026" label="2026年剩余计划" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.remainingPlan2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="realizedProfit2026" label="2026年内部营收实现利润" width="160" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.realizedProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportedGrossProfit2026" label="2026年上报集团毛利" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.reportedGrossProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="avgProfitMargin" label="上报项目平均利润率" width="140" align="right">
            <template #default="scope">
              {{ scope.row.avgProfitMargin }}%
            </template>
          </el-table-column>
          <el-table-column prop="remainingPlanGrossProfit2026" label="2026年剩余计划毛利" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.remainingPlanGrossProfit2026) }}
            </template>
          </el-table-column>
          <el-table-column prop="bookedCost" label="项目已入账成本" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.bookedCost) }}
            </template>
          </el-table-column>
          <el-table-column prop="carriedCost" label="项目已结转成本" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.carriedCost) }}
            </template>
          </el-table-column>
          <el-table-column prop="projectInventory" label="项目存货" width="100" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.projectInventory) }}
            </template>
          </el-table-column>
          <el-table-column prop="invoicedAmount" label="项目已开票（含税）" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.invoicedAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="receivedAmount" label="项目已收款（含税）" width="140" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.receivedAmount) }}
            </template>
          </el-table-column>
          <el-table-column prop="unreceivedAmount" label="未收款（含税）" width="120" align="right">
            <template #default="scope">
              {{ formatNumber(scope.row.unreceivedAmount) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="summaryData.length"
          layout="total, sizes, prev, pager, next"
          background
          small
        />
      </div>

      <div class="unit-note">
        <span>注：金额均按会计专用格式显示</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const projectStatuses = ['待建', '在建', '停工', '完工', '竣工', '业务销项', '财务销项']
const settlementStatuses = ['结算编制中', '结算已送审', '结算已完成']

const tableHeight = ref(600)
const currentDate = new Date().toLocaleDateString('zh-CN')

const randomNumber = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

// 金额统一转换为万元
const toWan = (value) => Number((value / 10000).toFixed(2))

const generateMockData = () => {
  const data = []
  const statuses = ['待建', '在建', '停工', '完工', '竣工', '业务销项', '财务销项']

  // 随机生成区间内日期（返回 ISO 字符串）
  const randomDateBetween = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]

  for (let i = 1; i <= 150; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    // 金额按元生成（合同价 500万 ~ 5亿）
    const contractPriceTax = randomNumber(5000000, 500000000)
    // 合同签订日期：约 30% 为 3 年前以前的旧合同，其余在近 3 年内
    const signStart = Math.random() < 0.3 ? new Date(2018, 0, 1) : new Date(2023, 9, 1)
    const contractSignDate = randomDateBetween(signStart, new Date(2026, 9, 1))

    data.push({
      projectStatus: status,
      settlementStatus: status === '竣工' ? settlementStatuses[Math.floor(Math.random() * settlementStatuses.length)] : '',
      contractSignDate,
      contractPriceTax,
      internalNotReportedRevenue: randomNumber(0, 100000000),
      grossProfitNotReported: randomNumber(0, 20000000),
      carryForwardRevenue2027: status === '待建' ? randomNumber(10000000, 300000000) : randomNumber(0, 100000000),
      completedRevenue2026: status === '业务销项' || status === '财务销项' ? contractPriceTax * randomNumber(0.9, 1.0) : randomNumber(0, contractPriceTax * 0.8),
      reportedRevenue2026: randomNumber(0, 150000000),
      remainingPlan2026: status === '待建' || status === '在建' ? randomNumber(0, 100000000) : 0,
      realizedProfit2026: randomNumber(-5000000, 30000000),
      realizedProfitGroup2026: randomNumber(0, 25000000),
      bookedCost: randomNumber(0, contractPriceTax * 0.9),
      carriedCost: randomNumber(0, contractPriceTax * 0.8),
      projectInventory: randomNumber(0, 50000000),
      cumulativeInvoiced: randomNumber(0, contractPriceTax),
      cumulativeReceived: randomNumber(0, contractPriceTax * 0.9),
      profitMargin: randomNumber(2, 20)
    })
  }
  return data
}

const financeData = ref(generateMockData())

const filteredData = computed(() => {
  return financeData.value
})

const summaryData = computed(() => {
  const result = []

  projectStatuses.forEach(status => {
    const statusData = filteredData.value.filter(item => item.projectStatus === status)

    const totalContractPrice = statusData.reduce((sum, item) => sum + item.contractPriceTax, 0)
    const totalInternalNotReportedRevenue = statusData.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)
    const totalInternalNotReportedGrossProfit = statusData.reduce((sum, item) => sum + item.grossProfitNotReported, 0)
    const totalCarryForwardRevenue2027 = statusData.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)
    const totalCompletedRevenue2026 = statusData.reduce((sum, item) => sum + item.completedRevenue2026, 0)
    const totalReportedRevenue2026 = statusData.reduce((sum, item) => sum + item.reportedRevenue2026, 0)
    const totalRemainingPlan2026 = statusData.reduce((sum, item) => sum + item.remainingPlan2026, 0)
    const totalRealizedProfit2026 = statusData.reduce((sum, item) => sum + item.realizedProfit2026, 0)
    const totalReportedGrossProfit2026 = statusData.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)
    const totalBookedCost = statusData.reduce((sum, item) => sum + item.bookedCost, 0)
    const totalCarriedCost = statusData.reduce((sum, item) => sum + item.carriedCost, 0)
    const totalProjectInventory = statusData.reduce((sum, item) => sum + item.projectInventory, 0)
    const totalInvoicedAmount = statusData.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)
    const totalReceivedAmount = statusData.reduce((sum, item) => sum + item.cumulativeReceived, 0)

    const avgProfitMargin = statusData.length > 0
      ? Number((statusData.reduce((sum, item) => sum + item.profitMargin, 0) / statusData.length).toFixed(2))
      : 0

    result.push({
      projectStatus: status,
      settlementStatus: status === '竣工' ? '按结算状态细分' : '',
      projectCount: statusData.length,
      contractPrice: toWan(totalContractPrice),
      internalNotReportedRevenue: toWan(totalInternalNotReportedRevenue),
      internalNotReportedGrossProfit: toWan(totalInternalNotReportedGrossProfit),
      carryForwardRevenue2027: toWan(totalCarryForwardRevenue2027),
      completedRevenue2026: toWan(totalCompletedRevenue2026),
      reportedRevenue2026: toWan(totalReportedRevenue2026),
      remainingPlan2026: toWan(totalRemainingPlan2026),
      realizedProfit2026: toWan(totalRealizedProfit2026),
      reportedGrossProfit2026: toWan(totalReportedGrossProfit2026),
      avgProfitMargin,
      remainingPlanGrossProfit2026: toWan(totalRemainingPlan2026 * avgProfitMargin / 100),
      bookedCost: toWan(totalBookedCost),
      carriedCost: toWan(totalCarriedCost),
      projectInventory: toWan(totalProjectInventory),
      invoicedAmount: toWan(totalInvoicedAmount),
      receivedAmount: toWan(totalReceivedAmount),
      unreceivedAmount: toWan(totalInvoicedAmount - totalReceivedAmount)
    })

    // 停工后插入"合同签订超两年"子行：项目状态=停工 且 统计日-合同签订日期>=2年
    if (status === '停工') {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const over2YearsData = statusData.filter(item => item.contractSignDate && new Date(item.contractSignDate) <= twoYearsAgo)

      const oContractPrice = over2YearsData.reduce((sum, item) => sum + item.contractPriceTax, 0)
      const oInternalNotReportedRevenue = over2YearsData.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)
      const oInternalNotReportedGrossProfit = over2YearsData.reduce((sum, item) => sum + item.grossProfitNotReported, 0)
      const oCarryForwardRevenue2027 = over2YearsData.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)
      const oCompletedRevenue2026 = over2YearsData.reduce((sum, item) => sum + item.completedRevenue2026, 0)
      const oReportedRevenue2026 = over2YearsData.reduce((sum, item) => sum + item.reportedRevenue2026, 0)
      const oRemainingPlan2026 = over2YearsData.reduce((sum, item) => sum + item.remainingPlan2026, 0)
      const oRealizedProfit2026 = over2YearsData.reduce((sum, item) => sum + item.realizedProfit2026, 0)
      const oReportedGrossProfit2026 = over2YearsData.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)
      const oBookedCost = over2YearsData.reduce((sum, item) => sum + item.bookedCost, 0)
      const oCarriedCost = over2YearsData.reduce((sum, item) => sum + item.carriedCost, 0)
      const oProjectInventory = over2YearsData.reduce((sum, item) => sum + item.projectInventory, 0)
      const oInvoicedAmount = over2YearsData.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)
      const oReceivedAmount = over2YearsData.reduce((sum, item) => sum + item.cumulativeReceived, 0)

      const oAvgProfitMargin = over2YearsData.length > 0
        ? Number((over2YearsData.reduce((sum, item) => sum + item.profitMargin, 0) / over2YearsData.length).toFixed(2))
        : 0

      result.push({
        projectStatus: '其中：',
        settlementStatus: '合同签订超两年',
        isSignOver2Years: true,
        projectCount: over2YearsData.length,
        contractPrice: toWan(oContractPrice),
        internalNotReportedRevenue: toWan(oInternalNotReportedRevenue),
        internalNotReportedGrossProfit: toWan(oInternalNotReportedGrossProfit),
        carryForwardRevenue2027: toWan(oCarryForwardRevenue2027),
        completedRevenue2026: toWan(oCompletedRevenue2026),
        reportedRevenue2026: toWan(oReportedRevenue2026),
        remainingPlan2026: toWan(oRemainingPlan2026),
        realizedProfit2026: toWan(oRealizedProfit2026),
        reportedGrossProfit2026: toWan(oReportedGrossProfit2026),
        avgProfitMargin: oAvgProfitMargin,
        remainingPlanGrossProfit2026: toWan(oRemainingPlan2026 * oAvgProfitMargin / 100),
        bookedCost: toWan(oBookedCost),
        carriedCost: toWan(oCarriedCost),
        projectInventory: toWan(oProjectInventory),
        invoicedAmount: toWan(oInvoicedAmount),
        receivedAmount: toWan(oReceivedAmount),
        unreceivedAmount: toWan(oInvoicedAmount - oReceivedAmount)
      })
    }

    // 竣工后插入结算状态行（在业务销项之前）
    if (status === '竣工') {
      const completedData = filteredData.value.filter(item => item.projectStatus === '竣工')
      settlementStatuses.forEach(settlementStatus => {
        const settlementData = completedData.filter(item => item.settlementStatus === settlementStatus)

        const sContractPrice = settlementData.reduce((sum, item) => sum + item.contractPriceTax, 0)
        const sInternalNotReportedRevenue = settlementData.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)
        const sInternalNotReportedGrossProfit = settlementData.reduce((sum, item) => sum + item.grossProfitNotReported, 0)
        const sCarryForwardRevenue2027 = settlementData.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)
        const sCompletedRevenue2026 = settlementData.reduce((sum, item) => sum + item.completedRevenue2026, 0)
        const sReportedRevenue2026 = settlementData.reduce((sum, item) => sum + item.reportedRevenue2026, 0)
        const sRemainingPlan2026 = settlementData.reduce((sum, item) => sum + item.remainingPlan2026, 0)
        const sRealizedProfit2026 = settlementData.reduce((sum, item) => sum + item.realizedProfit2026, 0)
        const sReportedGrossProfit2026 = settlementData.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)
        const sBookedCost = settlementData.reduce((sum, item) => sum + item.bookedCost, 0)
        const sCarriedCost = settlementData.reduce((sum, item) => sum + item.carriedCost, 0)
        const sProjectInventory = settlementData.reduce((sum, item) => sum + item.projectInventory, 0)
        const sInvoicedAmount = settlementData.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)
        const sReceivedAmount = settlementData.reduce((sum, item) => sum + item.cumulativeReceived, 0)

        const sAvgProfitMargin = settlementData.length > 0
          ? Number((settlementData.reduce((sum, item) => sum + item.profitMargin, 0) / settlementData.length).toFixed(2))
          : 0

        result.push({
          projectStatus: '',
          settlementStatus: settlementStatus,
          projectCount: settlementData.length,
          contractPrice: toWan(sContractPrice),
          internalNotReportedRevenue: toWan(sInternalNotReportedRevenue),
          internalNotReportedGrossProfit: toWan(sInternalNotReportedGrossProfit),
          carryForwardRevenue2027: toWan(sCarryForwardRevenue2027),
          completedRevenue2026: toWan(sCompletedRevenue2026),
          reportedRevenue2026: toWan(sReportedRevenue2026),
          remainingPlan2026: toWan(sRemainingPlan2026),
          realizedProfit2026: toWan(sRealizedProfit2026),
        reportedGrossProfit2026: toWan(sReportedGrossProfit2026),
        avgProfitMargin: sAvgProfitMargin,
          remainingPlanGrossProfit2026: toWan(sRemainingPlan2026 * sAvgProfitMargin / 100),
          bookedCost: toWan(sBookedCost),
          carriedCost: toWan(sCarriedCost),
          projectInventory: toWan(sProjectInventory),
          invoicedAmount: toWan(sInvoicedAmount),
          receivedAmount: toWan(sReceivedAmount),
          unreceivedAmount: toWan(sInvoicedAmount - sReceivedAmount)
        })
      })
    }
  })

  const totals = {
    projectStatus: '总计',
    settlementStatus: '',
    projectCount: filteredData.value.length,
    contractPrice: toWan(filteredData.value.reduce((sum, item) => sum + item.contractPriceTax, 0)),
    internalNotReportedRevenue: toWan(filteredData.value.reduce((sum, item) => sum + item.internalNotReportedRevenue, 0)),
    internalNotReportedGrossProfit: toWan(filteredData.value.reduce((sum, item) => sum + item.grossProfitNotReported, 0)),
    carryForwardRevenue2027: toWan(filteredData.value.reduce((sum, item) => sum + item.carryForwardRevenue2027, 0)),
    completedRevenue2026: toWan(filteredData.value.reduce((sum, item) => sum + item.completedRevenue2026, 0)),
    reportedRevenue2026: toWan(filteredData.value.reduce((sum, item) => sum + item.reportedRevenue2026, 0)),
    remainingPlan2026: toWan(filteredData.value.reduce((sum, item) => sum + item.remainingPlan2026, 0)),
    realizedProfit2026: toWan(filteredData.value.reduce((sum, item) => sum + item.realizedProfit2026, 0)),
    reportedGrossProfit2026: toWan(filteredData.value.reduce((sum, item) => sum + item.realizedProfitGroup2026, 0)),
    avgProfitMargin: filteredData.value.length > 0
      ? Number((filteredData.value.reduce((sum, item) => sum + item.profitMargin, 0) / filteredData.value.length).toFixed(2))
      : 0,
    remainingPlanGrossProfit2026: 0,
    bookedCost: toWan(filteredData.value.reduce((sum, item) => sum + item.bookedCost, 0)),
    carriedCost: toWan(filteredData.value.reduce((sum, item) => sum + item.carriedCost, 0)),
    projectInventory: toWan(filteredData.value.reduce((sum, item) => sum + item.projectInventory, 0)),
    invoicedAmount: toWan(filteredData.value.reduce((sum, item) => sum + item.cumulativeInvoiced, 0)),
    receivedAmount: toWan(filteredData.value.reduce((sum, item) => sum + item.cumulativeReceived, 0)),
    unreceivedAmount: toWan(filteredData.value.reduce((sum, item) => sum + item.cumulativeInvoiced, 0) -
      filteredData.value.reduce((sum, item) => sum + item.cumulativeReceived, 0))
  }
  totals.remainingPlanGrossProfit2026 = toWan(totals.remainingPlan2026 * 10000 * totals.avgProfitMargin / 100)

  result.push(totals)

  return result
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return summaryData.value.slice(start, end)
})

const formatNumber = (num) => {
  if (num === 0) return '0.00'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getRowClassName = ({ row }) => {
  if (row.isSignOver2Years) return 'sign-over2-row'
  return ''
}

const handleExport = () => {
  const headers = [
    '项目状态', '结算状态', '项目数量', '合同价/审定价', '已报内部未上报集团营收',
    '已报内部未上报集团毛利', '结转至2027年及以后内部营收', '2026年完成总包营收（内部）',
    '2026年上报集团营收', '2026年剩余计划', '2026年内部营收实现利润',
    '2026年上报集团毛利', '上报项目平均利润率', '2026年剩余计划毛利',
    '项目已入账成本', '项目已结转成本', '项目存货', '项目已开票（含税）',
    '项目已收款（含税）', '未收款（含税）'
  ]

  let csv = headers.join(',') + '\n'
  summaryData.value.forEach(row => {
    const rowData = [
      row.projectStatus,
      row.settlementStatus,
      row.projectCount,
      row.contractPrice,
      row.internalNotReportedRevenue,
      row.internalNotReportedGrossProfit,
      row.carryForwardRevenue2027,
      row.completedRevenue2026,
      row.reportedRevenue2026,
      row.remainingPlan2026,
      row.realizedProfit2026,
      row.reportedGrossProfit2026,
      row.avgProfitMargin + '%',
      row.remainingPlanGrossProfit2026,
      row.bookedCost,
      row.carriedCost,
      row.projectInventory,
      row.invoicedAmount,
      row.receivedAmount,
      row.unreceivedAmount
    ]
    csv += rowData.join(',') + '\n'
  })

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '按项目状态分类汇总表.csv'
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.project-status-summary {
  padding: 20px;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-info {
  font-size: 13px;
  color: #666;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.summary-table {
  min-width: max-content;
  width: 100%;
}

:deep(.el-table th) {
  background-color: #4a6fa5;
  color: #000;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}

:deep(.el-table td) {
  font-size: 12px;
  white-space: nowrap;
}

:deep(.el-table .el-table__footer-wrapper) {
  font-weight: bold;
  background-color: #f5f7fa;
}

:deep(.el-table .el-table__footer-wrapper td) {
  background-color: #e8f4fc;
  font-weight: bold;
}

.unit-note {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e8e8e8;
  font-size: 12px;
  color: #666;
  text-align: right;
}

/* 合同签订超两年子行样式（浅黄背景） */
:deep(.el-table .sign-over2-row td) {
  background-color: #fff8e1 !important;
  font-weight: bold;
}

/* 固定列子行样式（同步背景色，避免半透明） */
:deep(.el-table .sign-over2-row .el-table-fixed-column--left) {
  background-color: #fff8e1 !important;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}
</style>
